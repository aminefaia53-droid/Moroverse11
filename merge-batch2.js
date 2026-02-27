/**
 * Batch 2 Merger Script
 * 1. Replaces old tangier, chefchaouen, meknes, oujda entries with new epic versions
 * 2. Appends 6 new entities: battle-of-isly, battle-of-oued-el-makhazin,
 *    al-qarawiyyin, kasbah-oudaya, ahmad-al-mansur, zaynab-al-nafzawiyya
 */
const fs = require('fs');
const path = require('path');

// Read the main content file
const mainFile = path.join('frontend', 'data', 'moroverse-content.ts');
let content = fs.readFileSync(mainFile, 'utf8');
let lines = content.split('\n');

// Helper: extract an object from a batch file by key
function extractObjectFromFile(filename, key) {
    const src = fs.readFileSync(path.join('frontend', 'data', filename), 'utf8');
    const lines = src.split('\n');
    const pattern = new RegExp(`^\\s*'${key}':\\s*\\{`);
    let startLine = -1;
    for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
            startLine = i;
            break;
        }
    }
    if (startLine === -1) throw new Error(`Key '${key}' not found in ${filename}`);

    let depth = 0, started = false, endLine = startLine;
    for (let i = startLine; i < lines.length; i++) {
        for (const ch of lines[i]) {
            if (ch === '{') { depth++; started = true; }
            if (ch === '}') depth--;
        }
        if (started && depth <= 0) { endLine = i; break; }
    }
    return lines.slice(startLine, endLine + 1).join('\n');
}

// Helper: find start/end of a key entry in main file
function findKeyBounds(lines, key) {
    const pattern = new RegExp(`^\\s*'${key}':\\s*\\{`);
    let startLine = -1;
    for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) { startLine = i; break; }
    }
    if (startLine === -1) return null;

    let depth = 0, started = false, endLine = startLine;
    for (let i = startLine; i < lines.length; i++) {
        for (const ch of lines[i]) {
            if (ch === '{') { depth++; started = true; }
            if (ch === '}') depth--;
        }
        if (started && depth <= 0) { endLine = i; break; }
    }
    return { start: startLine, end: endLine };
}

// Step 1: Replace existing city entries with new epic versions
const citiesToReplace = [
    { key: 'tangier', file: 'batch2_cities1.ts' },
    { key: 'chefchaouen', file: 'batch2_cities1.ts' },
    { key: 'meknes', file: 'batch2_cities2.ts' },
    { key: 'oujda', file: 'batch2_cities2.ts' },
];

for (const { key, file } of citiesToReplace) {
    const newObj = extractObjectFromFile(file, key);
    const bounds = findKeyBounds(lines, key);
    if (!bounds) { console.log(`Key '${key}' not found in main file, skipping replacement`); continue; }

    console.log(`Replacing '${key}' (lines ${bounds.start + 1} to ${bounds.end + 1})`);
    lines = [
        ...lines.slice(0, bounds.start),
        newObj,
        ...lines.slice(bounds.end + 1)
    ];
}

// Step 2: Append 6 new entities before closing `};` of moroverseArticles
const newEntities = [
    { key: 'battle-of-isly', file: 'batch2_battles.ts' },
    { key: 'battle-of-oued-el-makhazin', file: 'batch2_battles.ts' },
    { key: 'al-qarawiyyin', file: 'batch2_landmarks_figures.ts' },
    { key: 'kasbah-oudaya', file: 'batch2_landmarks_figures.ts' },
    { key: 'ahmad-al-mansur', file: 'batch2_landmarks_figures.ts' },
    { key: 'zaynab-al-nafzawiyya', file: 'batch2_landmarks_figures.ts' },
];

// Find the closing `};` of moroverseArticles (the line with just `};`)
// It should be near the end, right before the `export const getArticle` function
let closingBraceLine = -1;
for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === '};') {
        closingBraceLine = i;
        break;
    }
}

if (closingBraceLine === -1) throw new Error('Could not find closing };');
console.log(`Found moroverseArticles closing at line ${closingBraceLine + 1}: ${lines[closingBraceLine]}`);

// Insert new entities before closing brace
const insertions = [];
for (const { key, file } of newEntities) {
    const obj = extractObjectFromFile(file, key);
    insertions.push(`  ,\n  ${obj}`);
}

lines = [
    ...lines.slice(0, closingBraceLine),
    ...insertions,
    ...lines.slice(closingBraceLine)
];

fs.writeFileSync(mainFile, lines.join('\n'));
console.log('\n✅ Merge complete!');
console.log(`Total lines: ${lines.length}`);

// Quick count of entities
const keyMatches = lines.join('\n').match(/^\s+id:\s+'[^']+'/gm) || [];
console.log(`Approx entity count: ${keyMatches.length}`);
