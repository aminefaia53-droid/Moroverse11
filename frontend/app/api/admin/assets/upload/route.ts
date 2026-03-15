import { NextResponse } from 'next/server';

/**
 * API Route: /api/admin/assets/upload
 *
 * ⚠️ DEPRECATED for large 3D files (> 4.5MB) ⚠️
 *
 * Vercel enforces a 4.5MB body limit on all API routes.
 * Large .glb models now upload DIRECTLY from the browser to Supabase Storage
 * using XHR (XMLHttpRequest) in /app/dashboard/landmarks/page.tsx.
 *
 * See: uploadAssetToSupabase() in landmarks/page.tsx
 */
export async function POST() {
    return NextResponse.json({
        success: false,
        message: '3D uploads now use direct browser-to-Supabase upload to bypass Vercel\'s 4.5MB limit.',
        hint: 'Use the client-side uploadAssetToSupabase() function in landmarks/page.tsx instead.',
    }, { status: 410 }); // 410 Gone — intentionally retired
}
