import { createAdminClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * API Route: /api/admin/assets/upload
 *
 * STRATEGY: Signed URL Generation
 * - Auth is validated via the `admin_session` cookie (same as the dashboard middleware)
 * - The file does NOT pass through this route (avoids Vercel 4.5MB limit)
 * - This route ONLY generates a pre-signed upload URL using the service_role key
 * - The browser then uploads directly to Supabase using that signed URL via XHR
 *
 * Flow: Browser -> POST /api/admin/assets/upload (tiny JSON, instant)
 *              -> XHR PUT to Supabase signed URL (direct, no size limit)
 *
 * ROOT CAUSE FIX: Previously used supabase.auth.getUser() which always fails
 * because the dashboard uses cookie-based auth (admin_session), NOT Supabase JWT sessions.
 */
export async function POST(request: Request) {
    try {
        // 1. Validate admin access via the admin_session cookie
        //    This mirrors the exact same check performed in middleware.ts
        const cookieStore = await cookies();
        const adminCookie = cookieStore.get('admin_session');

        if (!adminCookie || adminCookie.value !== 'authenticated') {
            console.error('[3D SIGN URL] Auth failed: admin_session cookie missing or invalid.\n' +
                'Cookie value:', adminCookie?.value ?? 'NOT SET');
            return NextResponse.json({
                success: false,
                message: 'Authentication required',
                hint: 'The admin_session cookie is missing. Please log in again via /login.'
            }, { status: 401 });
        }

        // 2. Parse filename from request body (NOT the file itself)
        const { fileName } = await request.json();
        if (!fileName || !fileName.toLowerCase().endsWith('.glb')) {
            return NextResponse.json({
                success: false,
                message: 'Invalid filename. Only .glb files are supported.'
            }, { status: 400 });
        }

        const timestamp = Date.now();
        const sanitized = fileName.replace(/\s+/g, '-').toLowerCase();
        const filePath = `monuments/${timestamp}-${sanitized}`;
        const bucketName = '3d_assets';

        // 3. Generate a signed upload URL using the ADMIN client (service_role)
        //    This uses SUPABASE_SERVICE_ROLE_KEY and bypasses RLS entirely.
        const supabaseAdmin = await createAdminClient();
        const { data, error: signError } = await supabaseAdmin.storage
            .from(bucketName)
            .createSignedUploadUrl(filePath);

        if (signError || !data) {
            console.error('[3D SIGN URL] Sign error:', signError);
            return NextResponse.json({
                success: false,
                message: `Failed to create signed URL: ${signError?.message || 'Unknown error'}`,
                hint: 'Ensure the "3d_assets" bucket exists in Supabase Storage with public access enabled.'
            }, { status: 500 });
        }

        // 4. Get the public URL using the admin client
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        if (!publicUrl || publicUrl.includes('placeholder-project')) {
            console.error('[3D SIGN URL] Invalid public URL generated:', publicUrl);
            return NextResponse.json({
                success: false,
                message: 'Supabase configuration error: Public URL could not be generated correctly.',
                hint: 'Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables on Vercel.'
            }, { status: 500 });
        }

        console.log('[3D SIGN URL] ✅ Success: signed URL generated for', filePath);
        return NextResponse.json({
            success: true,
            signedUrl: data.signedUrl,  // Browser uploads to this URL via XHR PUT
            token: data.token,
            filePath,
            publicUrl,                   // The final URL to store in modelUrl
        });

    } catch (error: any) {
        console.error('[3D SIGN URL] Critical error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
