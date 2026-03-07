import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PATCH(request: Request) {
    try {
        const dataFilePath = path.join(process.cwd(), 'data', 'generated-content.json');
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({ success: false, message: 'Data file not found' }, { status: 404 });
        }

        const { category, id, action, isPending } = await request.json();
        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        const db = JSON.parse(fileContent);

        if (!db[category]) return NextResponse.json({ success: false, message: 'Invalid category' }, { status: 400 });

        const targetArray: any[] = db[category];
        const existingIndex = targetArray.findIndex(item => item.id === id);

        if (existingIndex === -1) {
            return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
        }

        if (action === 'delete') {
            targetArray.splice(existingIndex, 1);
        } else if (action === 'toggleVisibility') {
            targetArray[existingIndex].isPending = isPending;
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(db, null, 2), 'utf8');
        return NextResponse.json({ success: true, message: 'Updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
