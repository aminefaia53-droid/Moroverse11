import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');
        let files: string[] = [];

        try {
            // Read directory contents
            const directoryItems = await fs.readdir(uploadDir, { withFileTypes: true });

            // Filter out non-files and sort by modified date (newest first)
            const fileStats = await Promise.all(
                directoryItems
                    .filter(dirent => dirent.isFile() && dirent.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                    .map(async (dirent) => {
                        const filePath = path.join(uploadDir, dirent.name);
                        const stats = await fs.stat(filePath);
                        return {
                            name: dirent.name,
                            url: `/images/uploads/${dirent.name}`,
                            mtime: stats.mtime
                        };
                    })
            );

            // Sort descending by date
            files = fileStats
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
                .map(f => f.url);

        } catch (err: any) {
            // Ignore if directory doesn't exist yet
            if (err.code !== 'ENOENT') throw err;
        }

        return NextResponse.json({ success: true, files });
    } catch (error: any) {
        console.error('Fetch Images Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch images.', error: error.message }, { status: 500 });
    }
}
