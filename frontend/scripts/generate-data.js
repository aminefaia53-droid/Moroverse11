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
    tetouan: { ar: 'تطوان', en: 'Tetouan' },
    laayoune: { ar: 'العيون', en: 'Laayoune' },
    dakhla: { ar: 'الداخلة', en: 'Dakhla' },
    ifrane: { ar: 'إفران', en: 'Ifrane' },
    ait: { ar: 'أيت بن حدو', en: 'Aït Benhaddou' },
    volubilis: { ar: 'وليلي', en: 'Volubilis' },
    boujdour: { ar: 'بوجدور', en: 'Boujdour' },
    ouzoud: { ar: 'أوزود', en: 'Ouzoud' },
    merzouga: { ar: 'مرزوقة', en: 'Merzouga' },
    safi: { ar: 'آسفي', en: 'Safi' },
};

/**
 * Detects city from slug prefix or explicit meta field
 */
function detectCity(slug, meta = {}) {
    // 1. Check for explicit city in frontmatter
    if (meta.city) {
        // Try to find in map for translations
        const mapped = Object.values(CITY_MAP).find(c =>
            c.ar === meta.city || c.en.toLowerCase() === meta.city.toLowerCase()
        );
        if (mapped) return mapped;
        return { ar: meta.city, en: meta.city };
    }

    // 2. Fallback to slug prefix
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

const manifestPath = path.join(__dirname, '../data/encyclopedia-manifest.json');

/**
 * Normalizes Arabic/English text for slug generation
 */
function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\u0600-\u06FF-]/g, '') // Keep alphanumeric, Arabic, and -
        .replace(/--+/g, '-')           // Replace multiple - with single -
        .trim();
}

function generateData() {
    console.log('[INFO] Starting dynamic content generation...');

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    const fileMap = {};

    // 1. Index all existing markdown files
    files.forEach(file => {
        const rawContent = fs.readFileSync(path.join(contentDir, file), 'utf8');
        const id = file.replace('.md', '');
        const parsed = parseMarkdown(rawContent, file);
        if (parsed) fileMap[id] = { ...parsed, id };
    });

    const generatedData = {
        landmarks: [],
        cities: [],
        battles: [],
        figures: [],
        articles: {}
    };

    // 2. Process Manifest (Preparation of Spaces)
    manifest.cities.forEach(cityNode => {
        cityNode.landmarks.forEach(landmarkNode => {
            const landmarkName = landmarkNode.ar;
            const landmarkNameEn = landmarkNode.en;

            // Priority: Try to find file by city_en-landmark_en slug
            const landmarkSlug = slugify(landmarkNameEn);
            const citySlug = cityNode.name.en.toLowerCase();
            const expectedId = `${citySlug}-${landmarkSlug}`;

            // Try to find if any file exists for this landmark
            // Match order: 
            // 1. Exact ID match (rabat-hassan-tower)
            // 2. Frontmatter title contains the Arabic name
            // 3. Slug contains the landmark name (English or Arabic)
            const fileData = fileMap[expectedId] || Object.values(fileMap).find(f =>
                (f.meta && f.meta.title && f.meta.title.includes(landmarkName)) ||
                f.id === expectedId ||
                f.id.includes(landmarkSlug) ||
                f.id.includes(slugify(landmarkName))
            );

            if (fileData) {
                const { meta, body, id } = fileData;
                const city = detectCity(id, meta);
                const { intro, sections, conclusion } = bodyToArticle(body, meta.description);
                const cleanIntro = intro.replace(/[#*`]/g, '').slice(0, 160) + '...';

                const article = {
                    id,
                    title: { ar: meta.title || landmarkName, en: meta.titleEn || landmarkNameEn || id.replace(/-/g, ' ') },
                    category: 'landmark',
                    metaDescription: {
                        ar: meta.description || cleanIntro,
                        en: meta.descriptionEn || cleanIntro
                    },
                    intro: { ar: intro, en: intro },
                    sections,
                    conclusion: { ar: conclusion, en: conclusion },
                    generatedImage: meta.image || null,
                    isPending: false
                };
                generatedData.articles[id] = article;

                generatedData.landmarks.push({
                    id,
                    name: article.title,
                    desc: article.metaDescription,
                    imageUrl: meta.image || null,
                    city,
                    foundation: { ar: meta.foundation || 'تاريخي', en: meta.foundationEn || 'Historical' },
                    history: article.metaDescription,
                    visualSoul: meta.visualSoul || 'Ruin',
                    isPending: false
                });

                delete fileMap[fileData.id]; // Mark as processed
            } else {
                // 3. Create Pending Card (The "Space")
                const id = expectedId;
                generatedData.landmarks.push({
                    id,
                    name: { ar: landmarkName, en: landmarkNameEn },
                    desc: {
                        ar: `هذه المعلمة ضمن قائمة الموسوعة الكبرى. بانتظار توثيق السجلات الملكية...`,
                        en: `This landmark is part of the Great Encyclopedia. Awaiting Royal Chronicles...`
                    },
                    imageUrl: null,
                    city: { ar: cityNode.name.ar, en: cityNode.name.en },
                    foundation: { ar: 'قيد التوثيق', en: 'Pending' },
                    history: { ar: 'قيد التوثيق', en: 'Pending' },
                    visualSoul: 'Ruin',
                    isPending: true
                });
            }
        });
    });

    // 4. Handle remaining files not in manifest (e.g. Figures, Battles, or custom posts)
    Object.values(fileMap).forEach(({ meta, body, id }) => {
        const city = detectCity(id, meta);
        const { intro, sections, conclusion } = bodyToArticle(body, meta.description);

        const article = {
            id,
            title: { ar: meta.title || id, en: meta.titleEn || id.replace(/-/g, ' ') },
            category: (meta.category || 'landmark').toLowerCase(),
            metaDescription: { ar: meta.description || '', en: meta.descriptionEn || '' },
            intro: { ar: intro, en: intro },
            sections,
            conclusion: { ar: conclusion, en: conclusion },
            generatedImage: meta.image || null,
            isPending: false
        };
        generatedData.articles[id] = article;

        const entry = {
            id,
            name: article.title,
            desc: article.metaDescription,
            imageUrl: meta.image || null,
        };

        const cat = article.category;
        if (cat === 'landmark') {
            generatedData.landmarks.push({ ...entry, city, foundation: { ar: meta.foundation || 'تاريخي', en: 'Historical' }, visualSoul: meta.visualSoul || 'Ruin', isPending: false });
        } else if (cat === 'city') {
            generatedData.cities.push({ ...entry, regionName: { ar: meta.region || city.ar, en: 'Region' }, isPending: false });
        } else if (cat === 'battle') {
            generatedData.battles.push({ ...entry, year: meta.year || 'Unknown', location: { ar: meta.location || city.ar, en: 'Location' }, isPending: false });
        } else if (cat === 'figure') {
            generatedData.figures.push({ ...entry, era: { ar: meta.era || 'Era', en: 'Era' }, isPending: false });
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(generatedData, null, 2), 'utf8');
    console.log(`[DONE] Pre-staged ${generatedData.landmarks.length} landmark spaces.`);
}

generateData();

