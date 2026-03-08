import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            return NextResponse.json({
                success: false,
                message: 'GITHUB_TOKEN is missing. Al-Jisr bridge is OFF.',
                status: 'offline'
            });
        }

        const owner = process.env.GITHUB_OWNER || 'aminefaia53-droid';
        const repo = process.env.GITHUB_REPO || 'Moroverse11';

        // Check standard repo access
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: { 'Authorization': `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' },
            cache: 'no-store'
        });

        if (res.ok) {
            const data = await res.json();
            const hasPush = data.permissions && data.permissions.push;
            return NextResponse.json({
                success: true,
                message: hasPush ? 'Al-Jisr is connected with W/R access.' : 'Al-Jisr connected, but missing Push/Write access.',
                status: hasPush ? 'online' : 'readonly',
                repo: data.full_name
            });
        } else {
            const errData = await res.json();
            return NextResponse.json({
                success: false,
                message: `GitHub API Error: ${errData.message}`,
                status: 'error'
            });
        }

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message, status: 'error' }, { status: 500 });
    }
}
