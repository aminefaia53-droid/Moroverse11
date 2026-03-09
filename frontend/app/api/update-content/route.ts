import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ─── GitHub Config ────────────────────────────────────────────────────────────
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'aminefaia53-droid';
const GITHUB_REPO = process.env.GITHUB_REPO || 'Moroverse11';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILE_PATH_IN_REPO = 'frontend/data/generated-content.json';
const LOCAL_FILE_PATH = path.join(process.cwd(), 'data', 'generated-content.json');

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function fetchFileFromGitHub(): Promise<{ db: any; sha: string | null }> {
    if (!GITHUB_TOKEN) return { db: null, sha: null };
    try {
        const res = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH_IN_REPO}?ref=${GITHUB_BRANCH}`,
            { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
        );
        if (!res.ok) return { db: null, sha: null };
        const data = await res.json();
        return {
            db: JSON.parse(Buffer.from(data.content, 'base64').toString('utf8')),
            sha: data.sha,
        };
    } catch {
        return { db: null, sha: null };
    }
}

async function pushToGitHub(content: string, sha: string | null, commitMessage: string): Promise<boolean> {
    if (!GITHUB_TOKEN) return false;
    const res = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH_IN_REPO}`,
        {
            method: 'PUT',
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: commitMessage,
                content: Buffer.from(content).toString('base64'),
                ...(sha ? { sha } : {}),
                branch: GITHUB_BRANCH,
            }),
        }
    );
    return res.ok;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, category = 'landmarks', landmark } = body;

        if (!id || !landmark) {
            return NextResponse.json({ success: false, message: 'Missing id or landmark data' }, { status: 400 });
        }

        // 1. Load the current JSON
        let db: any = { landmarks: [], battles: [], cities: [], figures: [] };
        let sha: string | null = null;

        if (GITHUB_TOKEN) {
            const result = await fetchFileFromGitHub();
            if (result.db) { db = result.db; sha = result.sha; }
        } else if (fs.existsSync(LOCAL_FILE_PATH)) {
            db = JSON.parse(fs.readFileSync(LOCAL_FILE_PATH, 'utf8'));
        }

        if (!db[category]) db[category] = [];

        // 2. Build the updated entity entry preserving all existing fields
        const existing = db[category].find((l: any) => l.id === id) || {};
        const updatedEntry = {
            ...existing,
            ...landmark,
            id,
            isPending: false, // Always unlock
            seo: {
                ...(existing.seo || {}),
                ...(landmark.seo || {}),
            },
        };

        const idx = db[category].findIndex((l: any) => l.id === id);
        if (idx >= 0) db[category][idx] = updatedEntry;
        else db[category].unshift(updatedEntry);

        const updatedJson = JSON.stringify(db, null, 2);
        const commitMsg = `content: update ${category} "${updatedEntry.name?.en || id}" via Dashboard`;

        // 3. Save: try GitHub first (triggers Vercel rebuild), fallback to local
        let persistence = 'local';
        if (GITHUB_TOKEN) {
            const pushed = await pushToGitHub(updatedJson, sha, commitMsg);
            if (pushed) {
                persistence = 'github';
            } else {
                console.error('[update-content] GitHub push failed, falling back to local.');
            }
        }

        if (persistence !== 'github') {
            try {
                fs.writeFileSync(LOCAL_FILE_PATH, updatedJson, 'utf8');
            } catch (fsErr: any) {
                if (fsErr.code === 'EROFS') {
                    return NextResponse.json(
                        { success: false, message: 'Vercel read-only filesystem. Please set GITHUB_TOKEN in Vercel environment variables to enable live saving.' },
                        { status: 500 }
                    );
                }
                throw fsErr;
            }
        }

        return NextResponse.json({
            success: true,
            persistence,
            message:
                persistence === 'github'
                    ? 'تم تحديث الموقع بنجاح وجاري إعادة البناء على Vercel ✓'
                    : 'تم الحفظ محلياً. الرجاء ضبط GITHUB_TOKEN في Vercel لتفعيل الرفع التلقائي.',
        });

    } catch (error: any) {
        console.error('[update-content] Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
