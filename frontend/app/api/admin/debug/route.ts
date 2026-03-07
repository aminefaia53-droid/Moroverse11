import { NextResponse } from 'next/server';

export async function GET() {
    const githubToken = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH;
    const isVercel = !!process.env.VERCEL;

    return NextResponse.json({
        success: true,
        environment: {
            isVercel,
            hasToken: !!githubToken,
            tokenLength: githubToken ? githubToken.length : 0,
            owner: owner || 'not set (default: aminefaia53-droid)',
            repo: repo || 'not set (default: Moroverse11)',
            branch: branch || 'not set (default: main)'
        },
        diagnostics: {
            message: githubToken
                ? "GitHub Token detected. Persistence should be active."
                : "GitHub Token MISSING. Uploads will fail on Vercel.",
            hint: "Set GITHUB_TOKEN in Vercel 'Environment Variables' to fix persistence."
        }
    });
}
