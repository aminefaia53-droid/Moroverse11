import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

/**
 * API Route: /api/admin/assets/upload
 * Purpose: Securely upload 3D assets (.glb) to Supabase Storage.
 * Security: Enforces Admin Role check.
 */
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ success: false, message: 'Authentication required / يلزم تسجيل الدخول' }, { status: 401 });
        }

        // 1. Fortress Gate: Verify Administrator Privileges
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (profileError || !profile?.is_admin) {
            return NextResponse.json({ success: false, message: 'Administrative access denied / الوصول للمشرفين فقط' }, { status: 403 });
        }

        // 2. Extract and Validate File
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file detected / لم يتم العثور على ملف' }, { status: 400 });
        }

        // File Type Validation (GLB only for 3D Viewer)
        if (!file.name.toLowerCase().endsWith('.glb')) {
            return NextResponse.json({ success: false, message: 'Invalid file type. Only .glb assets are supported / يدعم فقط صيغة .glb' }, { status: 400 });
        }

        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/\s+/g, '-').toLowerCase();
        const fileName = `${timestamp}-${sanitizedName}`;
        const filePath = `monuments/${fileName}`;

        // 3. Supabase Storage Sync (The "Vault" Strategy)
        // Note: Ensure the '3d_assets' bucket exists in Supabase with public access for publicUrl to work.
        const { data, error: uploadError } = await supabase.storage
            .from('3d_assets')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('[3D UPLOAD] STORAGE ERROR:', uploadError);
            return NextResponse.json({ 
                success: false, 
                message: `Storage Error: ${uploadError.message}`,
                hint: 'Check if bucket "3d_assets" exists in Supabase Storage.'
            }, { status: 500 });
        }

        // 4. Generate Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('3d_assets')
            .getPublicUrl(filePath);

        console.log(`[3D UPLOAD] SUCCESS: Asset uploaded to Supabase Storage at ${filePath}`);

        return NextResponse.json({
            success: true,
            message: '3D Asset uploaded and synced to Supabase ✓',
            url: publicUrl,
            fileName: fileName,
            size: file.size
        });

    } catch (error: any) {
        console.error('[3D UPLOAD] CRITICAL ERROR:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal sync failure / فشل المزامنة الداخلي',
            error: error.message
        }, { status: 500 });
    }
}
