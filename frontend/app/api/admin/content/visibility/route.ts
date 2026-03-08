import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PATCH(request: Request) {
    try {
        const { category, id, action, isPending } = await request.json();
        const dataFilePath = path.join(process.cwd(), 'data', 'generated-content.json');

        let db: any = { cities: [], landmarks: [], battles: [], figures: [] };
        let githubSha: string | null = null;

        const githubToken = process.env.GITHUB_TOKEN;
        const owner = process.env.GITHUB_OWNER || 'aminefaia53-droid';
        const repo = process.env.GITHUB_REPO || 'Moroverse11';
        const branch = process.env.GITHUB_BRANCH || 'main';
        const pathInRepo = 'frontend/data/generated-content.json';

        // 1. Load current DB
        if (githubToken) {
            const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}?ref=${branch}`, {
                headers: { 'Authorization': `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' },
                cache: 'no-store'
            });
            if (githubRes.ok) {
                const githubData = await githubRes.json();
                githubSha = githubData.sha;
                db = JSON.parse(Buffer.from(githubData.content, 'base64').toString('utf8'));
            } else {
                if (fs.existsSync(dataFilePath)) db = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
            }
        } else if (fs.existsSync(dataFilePath)) {
            db = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        }

        if (!db[category]) return NextResponse.json({ success: false, message: 'Category not found' });

        let targetArray: any[] = db[category];
        const existingIndex = targetArray.findIndex(item => item.id === id);
        if (existingIndex === -1) return NextResponse.json({ success: false, message: 'Item not found' });

        if (action === 'delete') {
            targetArray.splice(existingIndex, 1);
        } else if (action === 'toggleVisibility') {
            targetArray[existingIndex].isPending = isPending;
        }

        const updatedContent = JSON.stringify(db, null, 2);

        // 2. Save
        if (githubToken) {
            const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `content: ${action} ${id} via Royal Editor`,
                    content: Buffer.from(updatedContent).toString('base64'),
                    sha: githubSha || undefined,
                    branch
                })
            });
            if (!putRes.ok) {
                const errData = await putRes.json();
                console.error('GitHub Save Error in Visibility:', errData);
                return NextResponse.json({ success: false, message: 'GitHub update failed', error: errData }, { status: 500 });
            }
        }

        // Local fallback update if not strictly on Vercel without token (or to keep local sync)
        try {
            fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
        } catch (fsErr: any) {
            if (fsErr.code !== 'EROFS') console.error('Local save error:', fsErr);
        }

        return NextResponse.json({ success: true, message: `Item ${action} successful` });
    } catch (error: any) {
        console.error('Visibility route error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
