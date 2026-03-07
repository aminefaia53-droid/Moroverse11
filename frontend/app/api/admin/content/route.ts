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
        const { category, id, title, city, description, imageUrl, dateAdded } = data;

        const dataFilePath = path.join(process.cwd(), 'data', 'generated-content.json');
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({ success: false, message: 'Data file not found' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        const db = JSON.parse(fileContent);

        // Map category to the exact keys in generated-content.json
        // e.g., 'cities', 'landmarks', 'battles', 'figures'
        if (!db[category]) {
            db[category] = [];
        }

        const targetArray: any[] = db[category];
        const existingIndex = targetArray.findIndex(item => item.id === id);

        // Create a new entry mapping form fields to the structure expected by the frontend
        const newEntry = {
            id,
            name: title,
            desc: description,
            history: description, // Many components use history as the main text
            imageUrl: imageUrl || null,
            isPending: false, // Mark as fully ready since it was explicitly saved
            visualSoul: category === 'cities' ? 'Medina' : category === 'landmarks' ? 'Monument' : category === 'battles' ? 'Sword' : 'Crown'
        };

        // Add specific fields based on category
        if (category === 'landmarks') {
            (newEntry as any).city = city;
            (newEntry as any).foundation = { en: 'Historical', ar: 'تاريخي' };
        } else if (category === 'cities') {
            (newEntry as any).regionName = city;
            (newEntry as any).regionId = 'all';
            (newEntry as any).type = 'Major City';
        }

        if (existingIndex >= 0) {
            // Merge with existing to preserve other attributes
            targetArray[existingIndex] = { ...targetArray[existingIndex], ...newEntry };
        } else {
            targetArray.unshift(newEntry);
        }

        fs.writeFileSync(dataFilePath, JSON.stringify(db, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Content saved successfully' });
    } catch (error: any) {
        console.error('Error saving content:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
