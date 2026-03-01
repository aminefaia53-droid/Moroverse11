const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/posts');
const outputFile = path.join(__dirname, '../data/generated-content.json');

// Map of slug prefixes to Arabic/English city names
const CITY_MAP = {
    marrakech: { ar: 'مراكش', en: 'Marrakech' },
    fes: { ar: 'فاس', en: 'Fes' },
    meknes: { ar: 'مكناس', en: 'Meknes' },
    rabat: { ar: 'الرباط', en: 'Rabat' },
    casablanca: { ar: 'الدار البيضاء', en: 'Casablanca' },
    tangier: { ar: 'طنجة', en: 'Tangier' },
    essaouira: { ar: 'الصويرة', en: 'Essaouira' },
    agadir: { ar: 'أكادير', en: 'Agadir' },
    ouarzazate: { ar: 'ورزازات', en: 'Ouarzazate' },
    chefchaouen: { ar: 'شفشاون', en: 'Chefchaouen' },
    merzouga: { ar: 'مرزوقة', en: 'Merzouga' },
    ait: { ar: 'أيت بن حدو', en: 'Aït Benhaddou' },
    volubilis: { ar: 'وليلي', en: 'Volubilis' },
    dakhla: { ar: 'الداخلة', en: 'Dakhla' },
    boujdour: { ar: 'بوجدور', en: 'Boujdour' },
    ifrane: { ar: 'إفران', en: 'Ifrane' },
    ouzoud: { ar: 'أوزود', en: 'Ouzoud' },
    erg: { ar: 'إرق شيبي', en: 'Erg Chebbi' },
    atlas: { ar: 'أطلس', en: 'Atlas' },
    safi: { ar: 'آسفي', en: 'Safi' },
};

/**
 * Detects city from slug prefix (e.g., "marrakech-jemaa-el-fnaa" → Marrakech)
 */
function detectCity(slug) {
    const prefix = slug.split('-')[0].toLowerCase();
    return CITY_MAP[prefix] || { ar: 'المغرب', en: 'Morocco' };
}

/**
 * Safely extracts frontmatter and body from a markdown file.
 * Ignores garbage text before the first '---' (common with n8n automation).
 */
function parseMarkdown(fileContent, filename) {
    const firstDelim = fileContent.indexOf('---');
    if (firstDelim === -1) {
        console.warn(`[WARN] No frontmatter found in ${filename}`);
        return null;
    }

    const afterFirst = fileContent.indexOf('\n', firstDelim) + 1;
    const secondDelim = fileContent.indexOf('\n---', afterFirst);

    if (secondDelim === -1) {
        console.warn(`[WARN] Unclosed frontmatter in ${filename}`);
        return null;
    }

    const frontmatterBlock = fileContent.substring(afterFirst, secondDelim).trim();
    // Body is everything after the closing ---
    const body = fileContent.substring(secondDelim + 4).trim();

    // Parse key: "value" pairs
    const meta = {};
    frontmatterBlock.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
            meta[key] = value;
        }
    });

    return { meta, body };
}

/**
 * Splits markdown body into article sections by ## headings.
 * Content before any ## heading becomes the article intro.
 */
function bodyToArticle(body, description) {
    if (!body) {
        return {
            intro: description || '',
            sections: [{
                title: { ar: 'نبذة تاريخية', en: 'Historical Overview' },
                content: { ar: description || '', en: description || '' }
            }],
            conclusion: description || ''
        };
    }

    // Remove the first # title line (duplicate of frontmatter title)
    const cleaned = body.replace(/^#\s+.+\n?/, '').trim();

    // Split by ## subheadings
    const parts = cleaned.split(/\n(?=##\s)/);

    let intro = '';
    const sections = [];

    parts.forEach((part, i) => {
        const lines = part.split('\n');
        const first = lines[0].trim();

        if (first.startsWith('## ')) {
            const sectionTitle = first.replace(/^##\s+/, '').trim();
            const sectionContent = lines.slice(1).join('\n').trim();
            if (sectionContent) {
                sections.push({
                    title: { ar: sectionTitle, en: sectionTitle },
                    content: { ar: sectionContent, en: sectionContent }
                });
            }
        } else if (i === 0) {
            // First block before any ## heading becomes the intro
            intro = part.trim();
        }
    });

    // Fallback intro from description if body is just the title
    if (!intro) intro = description || '';

    // If no sections were found, create one from the body text
    if (sections.length === 0 && cleaned) {
        sections.push({
            title: { ar: 'نبذة تاريخية', en: 'Historical Overview' },
            content: { ar: intro || cleaned, en: intro || cleaned }
        });
    }

    return {
        intro: intro || description || '',
        sections,
        conclusion: description || intro || ''
    };
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
        articles: {}
    };

    files.forEach(file => {
        const filePath = path.join(contentDir, file);
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const id = file.replace('.md', '');

        const parsed = parseMarkdown(rawContent, file);
        if (!parsed) return;

        const { meta, body } = parsed;
        const city = detectCity(id);
        const { intro, sections, conclusion } = bodyToArticle(body, meta.description);

        // Full article object for ArticleReader
        const article = {
            id,
            title: { ar: meta.title || id, en: meta.titleEn || id.replace(/-/g, ' ') },
            category: (meta.category || 'landmark').toLowerCase(),
            metaDescription: {
                ar: meta.description || '',
                en: meta.descriptionEn || meta.description || ''
            },
            intro: { ar: intro, en: intro },
            sections,
            faqs: [],
            conclusion: { ar: conclusion, en: conclusion },
            generatedImage: meta.image || null,
        };

        generatedData.articles[id] = article;

        // Base card data
        const entry = {
            id,
            name: { ar: meta.title || id, en: meta.titleEn || id.replace(/-/g, ' ') },
            desc: { ar: meta.description || '', en: meta.descriptionEn || '' },
            imageUrl: meta.image || null,
        };

        const cat = (meta.category || 'landmark').toLowerCase();

        switch (cat) {
            case 'landmark':
            case 'landmarks':
                generatedData.landmarks.push({
                    ...entry,
                    city,
                    foundation: { ar: meta.foundation || 'تاريخي', en: meta.foundationEn || 'Historical' },
                    history: entry.desc,
                    visualSoul: meta.visualSoul || 'Ruin'
                });
                break;
            case 'city':
            case 'cities':
                generatedData.cities.push({
                    ...entry,
                    regionName: { ar: meta.region || city.ar, en: meta.regionEn || city.en },
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
                    location: { ar: meta.location || city.ar, en: meta.locationEn || city.en },
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
                    era: { ar: meta.era || 'عصر تاريخي', en: meta.eraEn || 'Historical Era' },
                    category: meta.figureCategory || 'Scholar',
                    shortBio: entry.desc,
                    specialty: { ar: meta.specialty || 'علم وفكر', en: meta.specialtyEn || 'Knowledge' },
                });
                break;
            default:
                // Default unknown → landmark
                generatedData.landmarks.push({
                    ...entry,
                    city,
                    foundation: { ar: 'تاريخي', en: 'Historical' },
                    history: entry.desc,
                    visualSoul: meta.visualSoul || 'Ruin'
                });
                generatedData.articles[id].category = 'landmark';
                break;
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(generatedData, null, 2), 'utf8');
    console.log(`[DONE] ${Object.keys(generatedData.articles).length} articles | Landmarks: ${generatedData.landmarks.length} | Cities: ${generatedData.cities.length} | Battles: ${generatedData.battles.length} | Figures: ${generatedData.figures.length}`);
}

generateData();
