const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/posts');
const outputFile = path.join(__dirname, '../data/generated-content.json');

/**
 * Safely extracts frontmatter and body from markdown content.
 * Ignores any garbage text before the first '---' block (common with n8n).
 */
function parseMarkdown(fileContent, filename) {
    // Find first '---' delimiter
    const firstDelim = fileContent.indexOf('---');
    if (firstDelim === -1) {
        console.warn(`[WARN] No frontmatter delimiter found in ${filename}`);
        return null;
    }

    // The frontmatter starts after the first ---
    const afterFirst = fileContent.indexOf('\n', firstDelim) + 1;
    const secondDelim = fileContent.indexOf('\n---', afterFirst);

    if (secondDelim === -1) {
        console.warn(`[WARN] No closing frontmatter delimiter in ${filename}`);
        return null;
    }

    const frontmatterBlock = fileContent.substring(afterFirst, secondDelim).trim();
    const body = fileContent.substring(secondDelim + 4).trim(); // skip '\n---'

    // Parse key: value pairs
    const meta = {};
    frontmatterBlock.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            // Remove surrounding quotes
            const value = line.substring(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
            meta[key] = value;
        }
    });

    return { meta, body };
}

/**
 * Convert markdown body into MoroArticle sections.
 * Each ## heading becomes a new section.
 */
function bodyToSections(body) {
    if (!body) return [];

    const sections = [];
    // Split by ## headings
    const parts = body.split(/\n(?=##\s)/);

    parts.forEach(part => {
        const lines = part.split('\n');
        const titleLine = lines[0];

        if (titleLine.startsWith('## ')) {
            const sectionTitle = titleLine.replace(/^##\s+/, '').trim();
            const sectionContent = lines.slice(1).join('\n').trim()
                .replace(/^\*\*(.+?)\*\*/g, '$1') // remove bold markers
                .replace(/^#+\s/gm, ''); // remove any sub-headings markers

            if (sectionContent) {
                sections.push({
                    title: { ar: sectionTitle, en: sectionTitle },
                    content: { ar: sectionContent, en: sectionContent }
                });
            }
        } else {
            // Content before any ## heading — becomes the intro or first section
            const text = part.replace(/^#\s.+\n?/, '').trim(); // Remove # title line
            if (text && sections.length === 0) {
                // We'll use this as the "intro" of the article (handled separately)
                sections.__intro = text;
            }
        }
    });

    return sections;
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
        figures: [],
        articles: {} // Full article content keyed by slug/id
    };

    files.forEach(file => {
        const filePath = path.join(contentDir, file);
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const id = file.replace('.md', '');

        const parsed = parseMarkdown(rawContent, file);
        if (!parsed) return;

        const { meta, body } = parsed;

        // Build sections from markdown body
        const sections = bodyToSections(body);
        const intro = sections.__intro || meta.description || '';
        delete sections.__intro;

        // Base entry for grid cards
        const entry = {
            id,
            name: { ar: meta.title || id, en: meta.titleEn || id.replace(/-/g, ' ') },
            desc: { ar: meta.description || '', en: meta.descriptionEn || '' },
            imageUrl: meta.image || null,
        };

        // Build full article object for ArticleReader
        const article = {
            id,
            title: { ar: meta.title || id, en: meta.titleEn || id.replace(/-/g, ' ') },
            category: (meta.category || 'landmark').toLowerCase(),
            metaDescription: { ar: meta.description || '', en: meta.descriptionEn || '' },
            intro: { ar: intro, en: intro },
            sections: sections.length > 0 ? sections : [
                {
                    title: { ar: 'نبذة تاريخية', en: 'Historical Overview' },
                    content: { ar: meta.description || '', en: meta.descriptionEn || meta.description || '' }
                }
            ],
            faqs: [],
            conclusion: { ar: meta.description || '', en: meta.descriptionEn || '' },
            generatedImage: meta.image || null,
        };

        generatedData.articles[id] = article;

        // Categorize for grid display
        switch (meta.category?.toLowerCase()) {
            case 'landmark':
            case 'landmarks':
                generatedData.landmarks.push({
                    ...entry,
                    city: { ar: meta.city || 'المغرب', en: meta.cityEn || 'Morocco' },
                    foundation: { ar: meta.foundation || 'تاريخي', en: meta.foundationEn || 'Historical' },
                    history: entry.desc,
                    visualSoul: meta.visualSoul || 'Ruin'
                });
                break;

            case 'city':
            case 'cities':
                generatedData.cities.push({
                    ...entry,
                    regionName: { ar: meta.region || 'غير محدد', en: meta.regionEn || 'Morocco' },
                    history: entry.desc,
                    type: meta.type || 'Major City',
                    climate: meta.climate || 'Mediterranean',
                    visualSoul: meta.visualSoul || 'Medina',
                    landmarks: { ar: [meta.landmarks || 'معالم متنوعة'], en: [meta.landmarksEn || 'Various Landmarks'] }
                });
                break;

            case 'battle':
            case 'battles':
                generatedData.battles.push({
                    ...entry,
                    year: meta.year || 'غير مسجل',
                    era: meta.era || 'Historical',
                    dynasty: meta.dynasty || 'Unknown',
                    location: { ar: meta.location || 'المغرب', en: meta.locationEn || 'Morocco' },
                    combatants: { ar: meta.combatants || 'أطراف متنازعة', en: meta.combatantsEn || 'Opposing Forces' },
                    leaders: { ar: meta.leaders || 'غير معروف', en: meta.leadersEn || 'Unknown' },
                    tactics: { ar: meta.tactics || 'تكتيكات متنوعة', en: meta.tacticsEn || 'Various tactics' },
                    outcome: { ar: meta.outcome || 'غير معروف', en: meta.outcomeEn || 'Unknown' },
                    impact: entry.desc
                });
                break;

            case 'figure':
            case 'figures':
                generatedData.figures.push({
                    ...entry,
                    era: { ar: meta.era || 'عصر تاريخي', en: meta.eraEn || 'Historical Era' },
                    category: meta.figureCategory || 'Science',
                    shortBio: entry.desc,
                    specialty: { ar: meta.specialty || 'تخصص عام', en: meta.specialtyEn || 'General' },
                });
                break;

            default:
                // Default unknown items to landmarks
                generatedData.landmarks.push({
                    ...entry,
                    city: { ar: meta.city || 'المغرب', en: meta.cityEn || 'Morocco' },
                    foundation: { ar: meta.foundation || 'تاريخي', en: meta.foundationEn || 'Historical' },
                    history: entry.desc,
                    visualSoul: meta.visualSoul || 'Ruin'
                });
                generatedData.articles[id].category = 'landmark';
                break;
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(generatedData, null, 2), 'utf8');
    console.log(`[INFO] Generated ${Object.keys(generatedData.articles).length} articles`);
    console.log(`[INFO] Landmarks: ${generatedData.landmarks.length}, Cities: ${generatedData.cities.length}, Battles: ${generatedData.battles.length}, Figures: ${generatedData.figures.length}`);
}

generateData();
