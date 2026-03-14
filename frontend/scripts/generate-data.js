const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content/posts');
const outputFile = path.join(process.cwd(), 'data/generated-content.json');
const manifestPath = path.join(process.cwd(), 'data/encyclopedia-manifest.json');

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06FF-]/g, '')
        .replace(/--+/g, '-')
        .trim();
}

/**
 * Detects city from slug prefix or explicit meta field
 */
function detectCity(slug, meta = {}) {
    if (meta.city) return { ar: meta.city, en: meta.city };
    return { ar: 'المغرب', en: 'Morocco' };
}

function parseMarkdown(fileContent, filename) {
    const id = filename.replace('.md', '');
    if (id.length < 2 || id === 'index' || id === '-') return null;

    const firstDelim = fileContent.indexOf('---');
    if (firstDelim === -1) return null;

    const afterFirst = fileContent.indexOf('\n', firstDelim) + 1;
    const secondDelim = fileContent.indexOf('\n---', afterFirst);
    if (secondDelim === -1) return null;

    const frontmatterBlock = fileContent.substring(afterFirst, secondDelim).trim();
    const body = fileContent.substring(secondDelim + 4).trim();

    const meta = { title: '', category: 'landmark', image: '', description: '' };
    frontmatterBlock.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/^['"]|['"]$/g, '');
            if (key) meta[key] = value;
        }
    });

    if (!meta.title) meta.title = id.replace(/-/g, ' ');
    return { meta, body };
}

function bodyToArticle(body, description) {
    const intro = description || '';
    return {
        intro: { ar: intro, en: intro },
        sections: [{ title: { ar: 'نبذة', en: 'Overview' }, content: { ar: body || '', en: body || '' } }],
        conclusion: { ar: intro, en: intro }
    };
}

function generateData() {
    console.log('[INFO] Starting dynamic content generation...');
    if (!fs.existsSync(manifestPath)) {
        console.error('[ERROR] Manifest not found at:', manifestPath);
        return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

    // ─── CRITICAL: Load existing data to preserve manual edits ───────────────
    // This prevents Vercel builds from wiping out Dashboard edits (images, SEO, etc.)
    let existingData = { landmarks: [], cities: [], battles: [], figures: [], articles: {} };
    if (fs.existsSync(outputFile)) {
        try {
            existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
            console.log('[INFO] Loaded existing data — manual edits (images, SEO, videos) will be preserved.');
        } catch (e) {
            console.warn('[WARN] Could not parse existing data file. Starting fresh.');
        }
    }

    // Build lookup maps for fast merging
    const existingLandmarks = {};
    (existingData.landmarks || []).forEach(l => { existingLandmarks[l.id] = l; });
    const existingCities = {};
    (existingData.cities || []).forEach(c => { existingCities[c.id] = c; });
    const existingBattles = {};
    (existingData.battles || []).forEach(b => { existingBattles[b.id] = b; });
    const existingFigures = {};
    (existingData.figures || []).forEach(f => { existingFigures[f.id] = f; });

    // Helper: merge new scaffold with existing manual edits
    function mergeEntry(newEntry, existing) {
        if (!existing) return newEntry;
        return {
            ...newEntry,
            // Preserve manual edits from Dashboard — never overwrite these with scaffold defaults
            imageUrl: existing.imageUrl !== undefined ? existing.imageUrl : newEntry.imageUrl,
            videoUrl: existing.videoUrl !== undefined ? existing.videoUrl : newEntry.videoUrl,
            history: existing.history !== undefined ? existing.history : newEntry.history,
            foundation: existing.foundation !== undefined ? existing.foundation : newEntry.foundation,
            seo: existing.seo !== undefined ? existing.seo : newEntry.seo,
            modelUrl: existing.modelUrl !== undefined ? existing.modelUrl : newEntry.modelUrl,
            location_type: existing.location_type !== undefined ? existing.location_type : newEntry.location_type,
            // If manually unlocked, keep it unlocked
            isPending: existing.isPending === false ? false : newEntry.isPending,
            // desc: keep existing if set (not just awaiting documentation default)
            desc: (existing.desc && existing.desc.ar && !existing.desc.ar.includes('بانتظار'))
                ? existing.desc
                : newEntry.desc,
            // history: keep richer version
            ...(existing.history && (existing.history.ar || existing.history.en) ? { history: existing.history } : {}),
        };
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
    const fileMap = {};
    files.forEach(file => {
        const rawContent = fs.readFileSync(path.join(contentDir, file), 'utf8');
        const parsed = parseMarkdown(rawContent, file);
        if (parsed) fileMap[file.replace('.md', '')] = { ...parsed, id: file.replace('.md', '') };
    });

    const generatedData = { landmarks: [], cities: [], battles: [], figures: [], tourism: [], articles: {} };
    let preStagedCount = 0;

    // 1. Process Cities & Landmarks
    (manifest.cities || []).forEach(cityNode => {
        const cityNameAr = cityNode.name.ar;
        const cityNameEn = cityNode.name.en;
        const cityId = slugify(cityNameEn);

        const newCity = {
            id: cityId,
            name: { ar: cityNameAr, en: cityNameEn },
            desc: { ar: `مدينة مغربية عريقة.`, en: `A historic Moroccan city.` },
            imageUrl: null,
            regionName: { ar: 'المغرب', en: 'Morocco' },
            isPending: true
        };
        generatedData.cities.push(mergeEntry(newCity, existingCities[cityId]));
        preStagedCount++;

        // Add Landmarks
        (cityNode.landmarks || []).forEach(node => {
            const nameAr = node.ar;
            const nameEn = node.en;
            const itemSlug = slugify(nameEn);
            const expectedId = `${cityId}-${itemSlug}`;

            const fileData = fileMap[expectedId] || Object.values(fileMap).find(f =>
                (f.meta.title === nameAr || f.meta.title === nameEn) || f.id.includes(itemSlug)
            );

            if (fileData) {
                const { meta, body, id } = fileData;
                const { intro, sections, conclusion } = bodyToArticle(body, meta.description);
                generatedData.articles[id] = {
                    id, title: { ar: meta.title, en: meta.titleEn || nameEn },
                    category: 'landmark', metaDescription: { ar: meta.description, en: meta.descriptionEn || '' },
                    intro, sections, conclusion, generatedImage: meta.image || null, isPending: false
                };
                const newLandmark = {
                    id, name: { ar: meta.title, en: meta.titleEn || nameEn },
                    desc: { ar: meta.description, en: meta.descriptionEn || '' },
                    imageUrl: meta.image || null, city: { ar: cityNameAr, en: cityNameEn }, isPending: false
                };
                generatedData.landmarks.push(mergeEntry(newLandmark, existingLandmarks[id]));
                delete fileMap[id];
            } else {
                const newLandmark = {
                    id: expectedId, name: { ar: nameAr, en: nameEn },
                    desc: { ar: `معلمة في ${cityNameAr} بانتظار التوثيق.`, en: `Landmark in ${cityNameEn} awaiting documentation.` },
                    imageUrl: null, city: { ar: cityNameAr, en: cityNameEn }, isPending: true
                };
                generatedData.landmarks.push(mergeEntry(newLandmark, existingLandmarks[expectedId]));
                preStagedCount++;
            }
        });
    });

    // 2. Process Figures, Battles & Tourism
    ['figures', 'battles', 'tourism'].forEach(cat => {
        const existingMap = {};
        if (cat === 'battles') (existingData.battles || []).forEach(b => { existingMap[b.id] = b; });
        else if (cat === 'figures') (existingData.figures || []).forEach(f => { existingMap[f.id] = f; });
        else if (cat === 'tourism') (existingData.tourism || []).forEach(t => { existingMap[t.id] = t; });

        (manifest[cat] || []).forEach(node => {
            const nameAr = node.ar;
            const nameEn = node.en;
            const id = slugify(nameEn);
            const fileData = fileMap[id] || Object.values(fileMap).find(f => (f.meta.title === nameAr || f.meta.title === nameEn));

            if (fileData) {
                const { meta, body, id: fileId } = fileData;
                const { intro, sections, conclusion } = bodyToArticle(body, meta.description);
                generatedData.articles[fileId] = { id: fileId, title: { ar: meta.title, en: meta.titleEn || nameEn }, category: cat === 'tourism' ? 'tourism' : cat.slice(0, -1), isPending: false, intro, sections, conclusion };
                const newEntry = { id: fileId, name: { ar: meta.title, en: meta.titleEn || nameEn }, desc: { ar: meta.description, en: '' }, imageUrl: meta.image || null, isPending: false };
                generatedData[cat].push(mergeEntry(newEntry, existingMap[fileId]));
                delete fileMap[fileId];
            } else {
                const newEntry = {
                    id, name: { ar: nameAr, en: nameEn },
                    desc: { ar: 'بانتظار السجلات الملكية.', en: 'Awaiting Royal Chronicles.' },
                    imageUrl: null, isPending: true
                };
                generatedData[cat].push(mergeEntry(newEntry, existingMap[id]));
                preStagedCount++;
            }
        });
    });

    // Also preserve articles from existing data that aren't regenerated
    Object.keys(existingData.articles || {}).forEach(key => {
        if (!generatedData.articles[key]) {
            generatedData.articles[key] = existingData.articles[key];
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(generatedData, null, 2), 'utf8');
    console.log(`[DONE] Sync complete. Total pre-staged: ${preStagedCount}`);
}

generateData();

