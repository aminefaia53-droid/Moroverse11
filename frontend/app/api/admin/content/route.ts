import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const dataFilePath = path.join(process.cwd(), 'data', 'generated-content.json');
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({ success: true, data: { cities: [], landmarks: [], battles: [], figures: [] } });
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        const db = JSON.parse(fileContent);
        return NextResponse.json({ success: true, data: db });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { category, id, title, city, description, imageUrl } = data;

        const dataFilePath = path.join(process.cwd(), 'data', 'generated-content.json');

        // 1. Load current DB (Try local first, then GitHub if on Vercel)
        let db: any = { cities: [], landmarks: [], battles: [], figures: [] };
        let githubSha: string | null = null;

        const githubToken = process.env.GITHUB_TOKEN;
        const owner = process.env.GITHUB_OWNER || 'aminefaia53-droid';
        const repo = process.env.GITHUB_REPO || 'Moroverse11';
        const branch = process.env.GITHUB_BRANCH || 'main';
        const pathInRepo = 'frontend/data/generated-content.json';

        if (githubToken) {
            try {
                const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}?ref=${branch}`, {
                    headers: { 'Authorization': `token ${githubToken}`, 'Accept': 'application/vnd.github.v3+json' }
                });
                if (githubRes.ok) {
                    const githubData = await githubRes.json();
                    githubSha = githubData.sha;
                    db = JSON.parse(Buffer.from(githubData.content, 'base64').toString('utf8'));
                }
            } catch (err) { console.error('Failed to fetch from GitHub:', err); }
        } else if (fs.existsSync(dataFilePath)) {
            db = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        }

        if (!db[category]) db[category] = [];
        const targetArray: any[] = db[category];
        const existingIndex = targetArray.findIndex(item => item.id === id);

        const newEntry = {
            id, name: title, desc: description, history: description,
            imageUrl: imageUrl || null, isPending: false,
            visualSoul: category === 'cities' ? 'Medina' : category === 'landmarks' ? 'Monument' : category === 'battles' ? 'Sword' : 'Crown'
        };

        if (category === 'landmarks') {
            (newEntry as any).city = city;
            (newEntry as any).foundation = { en: 'Historical', ar: 'تاريخي' };
        } else if (category === 'cities') {
            (newEntry as any).regionName = city;
            (newEntry as any).regionId = 'all';
            (newEntry as any).type = 'Major City';
        }

        if (existingIndex >= 0) targetArray[existingIndex] = { ...targetArray[existingIndex], ...newEntry };
        else targetArray.unshift(newEntry);

        const updatedContent = JSON.stringify(db, null, 2);

        // 2. Save (GitHub first if available, then local)
        if (githubToken) {
            const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${pathInRepo}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `content: update ${id} via Royal Editor`,
                    content: Buffer.from(updatedContent).toString('base64'),
                    sha: githubSha || undefined, // undefined for new file
                    branch
                })
            });
            if (putRes.ok) {
                return NextResponse.json({ success: true, message: 'Content saved to GitHub', persistence: 'github' });
            } else {
                const errData = await putRes.json();
                console.error('GitHub Save Error:', errData);
                // Fallback to local if GitHub put fails (e.g. branch mismatch)
            }
        }

        try {
            fs.writeFileSync(dataFilePath, updatedContent, 'utf8');
            return NextResponse.json({ success: true, message: 'Content saved' });
        } catch (fsErr: any) {
            if (fsErr.code === 'EROFS') throw new Error('Vercel read-only filesystem. Set GITHUB_TOKEN for Al-Jisr persistence.');
            throw fsErr;
        }
    } catch (error: any) {
        console.error('Error saving content:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
