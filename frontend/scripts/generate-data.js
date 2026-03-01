const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/posts');
const outputFile = path.join(__dirname, '../data/generated-content.json');

// Interface to loosely match what we're parsing
// title, category, description, image

function parseFrontmatter(fileContent, filename) {
    // n8n often corrupts the start of the file.
    // We look for the FIRST occurrence of ---\n and the NEXT occurrence of \n---
    const match = fileContent.match(/---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) {
        console.warn(`[WARN] No valid frontmatter found in ${filename}`);
        return null;
    }

    const frontmatterBlock = match[1];
    const lines = frontmatterBlock.split(/\r?\n/);
    const data = {};

    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
            data[key] = value;
        }
    });

    return data;
}

function generateData() {
    console.log('[INFO] Starting dynamic content generation...');
    if (!fs.existsSync(contentDir)) {
        console.error('[ERROR] Content directory not found:', contentDir);
        process.exit(1);
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    const generatedData = {
        landmarks: [],
        cities: [],
        battles: [],
        figures: []
    };

    files.forEach(file => {
        const filePath = path.join(contentDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const id = file.replace('.md', '');

        const meta = parseFrontmatter(content, file);
        if (!meta) return;

        // Base structure mapping based on category
        const entry = {
            id,
            name: { ar: meta.title, en: meta.titleEn || id.replace(/-/g, ' ') },
            desc: { ar: meta.description, en: meta.descriptionEn || 'Historical entry.' },
            imageUrl: meta.image || null,
        };

        switch (meta.category?.toLowerCase()) {
            case 'landmark':
            case 'landmarks':
                generatedData.landmarks.push({
                    ...entry,
                    city: { ar: meta.city || 'غير محدد', en: 'Unknown' },
                    foundation: { ar: meta.foundation || 'غير محدد', en: 'Unknown' },
                    history: entry.desc,
                    visualSoul: meta.visualSoul || 'Ruin'
                });
                break;
            case 'city':
            case 'cities':
                generatedData.cities.push({
                    ...entry,
                    regionName: { ar: meta.region || 'غير محدد', en: 'Unknown' },
                    history: entry.desc,
                    type: meta.type || 'City',
                    climate: meta.climate || 'Unknown',
                    visualSoul: meta.visualSoul || 'Medina',
                    landmarks: { ar: [meta.landmarks || 'معالم متنوعة'], en: ['Various Landmarks'] }
                });
                break;
            case 'battle':
            case 'battles':
                generatedData.battles.push({
                    ...entry,
                    year: meta.year || 'غير مسجل',
                    era: meta.era || 'Historical',
                    dynasty: meta.dynasty || 'Unknown',
                    location: { ar: meta.location || 'غير محدد', en: 'Unknown' },
                    combatants: { ar: meta.combatants || 'أطراف متنازعة', en: 'Opposing Forces' },
                    leaders: { ar: meta.leaders || 'غير معروف', en: 'Unknown' },
                    tactics: { ar: meta.tactics || 'تكتيكات متنوعة', en: 'Various tactics' },
                    outcome: { ar: meta.outcome || 'غير معروف', en: 'Unknown' },
                    impact: entry.desc
                });
                break;
            case 'figure':
            case 'figures':
                generatedData.figures.push({
                    ...entry,
                    era: { ar: meta.era || 'عصر تاريخي', en: 'Historical Era' },
                    category: meta.figureCategory || 'Science',
                    shortBio: entry.desc,
                    specialty: { ar: meta.specialty || 'تخصص عام', en: 'General' },
                });
                break;
            default:
                // Treat unknown as landmark by default
                generatedData.landmarks.push({
                    ...entry,
                    city: { ar: meta.city || 'غير محدد', en: 'Unknown' },
                    foundation: { ar: meta.foundation || 'غير محدد', en: 'Unknown' },
                    history: entry.desc,
                    visualSoul: meta.visualSoul || 'Ruin'
                });
                break;
        }
    });

    // Write to JSON
    fs.writeFileSync(outputFile, JSON.stringify(generatedData, null, 2));
    console.log('[INFO] Written dynamically strictly parsed items to generated-content.json');
    console.log(`[INFO] Processed: ${generatedData.landmarks.length} Landmarks, ${generatedData.cities.length} Cities, ${generatedData.battles.length} Battles, ${generatedData.figures.length} Figures.`);
}

generateData();
