import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
    try {
        // Navigate up from the frontend directory to the root to run git commands
        const cwd = process.cwd(); // This is typically `/frontend` when running Next.js

        // We add all, commit, and push.
        // Ensure we are in a safe mode.
        const gitCommand = `git add . && git commit -m "Dashboard Bridge: Content Published" && git push`;

        const { stdout, stderr } = await execPromise(gitCommand, { cwd });

        return NextResponse.json({
            success: true,
            message: 'Publish triggered successfully via GitHub Push.',
            logs: stdout
        });
    } catch (error: any) {
        // If there is nothing to commit, git returns an error code, handle it gracefully
        if (error.message.includes('nothing to commit')) {
            return NextResponse.json({ success: true, message: 'Site is already up to date (nothing to commit).' });
        }
        console.error('Bridge Publish Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to publish via Git.', error: error.message }, { status: 500 });
    }
}
