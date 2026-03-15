import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * API Route: /api/admin/assets/upload
 *
 * STRATEGY: Signed URL Generation
 * - The file does NOT pass through this route (avoids Vercel 4.5MB limit)
 * - This route ONLY generates a pre-signed upload URL using the service_role key
 * - The browser then uploads directly to Supabase using that signed URL via XHR
 * - This is the secure way to handle large file uploads without exposing secret keys
 *
 * Flow: Browser -> GET signed URL (tiny, instant) -> XHR PUT to Supabase (direct, no size limit)
 */
export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Verify admin session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile?.is_admin) {
            return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
        }

        // 2. Parse filename from request body (NOT the file itself)
        const { fileName } = await request.json();
        if (!fileName || !fileName.toLowerCase().endsWith('.glb')) {
            return NextResponse.json({ success: false, message: 'Invalid filename. Only .glb files are supported.' }, { status: 400 });
        }

        const timestamp = Date.now();
        const sanitized = fileName.replace(/\s+/g, '-').toLowerCase();
        const filePath = `monuments/${timestamp}-${sanitized}`;
        const bucketName = '3d_assets';

        // 3. Generate a signed upload URL (server-side with service_role via Supabase server client)
        const { data, error: signError } = await supabase.storage
            .from(bucketName)
            .createSignedUploadUrl(filePath);

        if (signError || !data) {
            console.error('[3D SIGN URL] Error:', signError);
            return NextResponse.json({
                success: false,
                message: `Failed to create signed URL: ${signError?.message || 'Unknown error'}`,
                hint: 'Ensure the "3d_assets" bucket exists in Supabase Storage with public access enabled.'
            }, { status: 500 });
        }

        // 4. Get the public URL using the SDK (safer than string concatenation)
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        if (!publicUrl || publicUrl.includes('placeholder-project')) {
            console.error('[3D SIGN URL] Invalid public URL generated:', publicUrl);
            return NextResponse.json({
                success: false,
                message: 'Supabase configuration error: Public URL could not be generated correctly.',
                hint: 'Check your NEXT_PUBLIC_SUPABASE_URL and SUPABASE_URL environment variables on Vercel.'
            }, { status: 500 });
        }

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
