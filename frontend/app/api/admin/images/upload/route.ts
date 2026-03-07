import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;

        // Determine the save path (public/images/uploads)
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads');

        // Ensure directory exists
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);

        // Write the file
        await fs.writeFile(filePath, buffer);

        // The URL path accessible from the browser
        const urlToReturn = `/images/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            message: 'Image uploaded successfully',
            url: urlToReturn
        });
    } catch (error: any) {
        console.error('Upload Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to upload image.', error: error.message }, { status: 500 });
    }
}
