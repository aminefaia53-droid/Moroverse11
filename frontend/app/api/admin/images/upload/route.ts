import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;

        // 1. GitHub Persistence (Al-Jisr Strategy)
        const githubToken = process.env.GITHUB_TOKEN;
        const owner = process.env.GITHUB_OWNER || 'aminefaia53-droid';
        const repo = process.env.GITHUB_REPO || 'Moroverse11';
        const branch = process.env.GITHUB_BRANCH || 'main';

        if (!githubToken) {
            console.error('[IMAGE UPLOAD] WARNING: GITHUB_TOKEN is not set. Cannot persist image to GitHub.');
        }

        if (githubToken) {
            const pathInRepo = `frontend/public/images/uploads/${filename}`;
            const content = buffer.toString('base64');

            try {
                const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${githubToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: `upload: ${filename} via Royal Editor`,
                        content,
                        branch
                    })
                });

                const githubData = await githubRes.json();

                if (githubRes.ok) {
                    console.log(`[IMAGE UPLOAD] SUCCESS: Image uploaded to GitHub repository at ${pathInRepo}`);
                    return NextResponse.json({
                        success: true,
                        message: 'Image uploaded to GitHub',
                        url: `/images/uploads/${filename}`,
                        persistence: 'github'
                    });
                } else {
                    console.error('[IMAGE UPLOAD] GITHUB ERROR DETAILED:', JSON.stringify(githubData, null, 2));
                    return NextResponse.json({
                        success: false,
                        message: `GitHub Upload Failed: ${githubData.message || 'Unknown GitHub error'}`,
                        error: githubData.message,
                        persistence: 'failed_github'
                    }, { status: githubRes.status });
                }
            } catch (err: any) {
                console.error('[IMAGE UPLOAD] GITHUB FETCH EXCEPTION:', err);
                return NextResponse.json({
                    success: false,
                    message: 'GitHub API Connection Error',
                    error: err.message
                }, { status: 500 });
            }
        }

        // 2. Local Fallback
        console.warn('[IMAGE UPLOAD] FALLING BACK TO LOCAL FILESYSTEM. This image will NOT be pushed to GitHub automatically.');
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
        try { await fs.access(uploadDir); } catch { await fs.mkdir(uploadDir, { recursive: true }); }

        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        console.log(`[IMAGE UPLOAD] SUCCESS (LOCAL): Image saved to ${filePath}`);
        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully (Local)',
            url: `/images/uploads/${filename}`,
            persistence: 'local'
        });
    } catch (error: any) {
        console.error('[IMAGE UPLOAD] CRITICAL UPLOAD ERROR:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to upload image.',
            error: error.message,
            code: error.code,
            hint: 'On Vercel, GITHUB_TOKEN is required for persistent uploads.'
        }, { status: 500 });
    }
}
