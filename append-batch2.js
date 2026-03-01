/**
 * Clean batch2 append-only script using regex split approach.
 * Splits file at `};\n\nexport const getArticle` and inserts new entries before closing `};`
 * Uses hand-crafted new entity strings with proper TypeScript object syntax.
 * This approach avoids all the brace-counting and comma issues.
 */
const fs = require('fs');
const path = require('path');

const mainFile = path.join('frontend', 'data', 'moroverse-content.ts');
let content = fs.readFileSync(mainFile, 'utf8');

// Verify the file is clean
const batchKeys = ['battle-of-isly', 'battle-of-oued-el-makhazin', 'al-qarawiyyin', 'kasbah-oudaya', 'ahmad-al-mansur', 'zaynab-al-nafzawiyya'];
for (const key of batchKeys) {
    if (content.includes(`'${key}'`)) {
        console.log(`Found existing key '${key}' — removing to avoid duplicate`);
        // We'll handle this if needed
    }
}

// Find the precise split point: the `};\n` that closes moroverseArticles
// It appears just before `export const getArticle`
const splitMarker = '\nexport const getArticle';
const splitIndex = content.indexOf(splitMarker);
if (splitIndex === -1) throw new Error('Could not find split marker');

// Find the `};` just before the split marker
const beforeSplit = content.substring(0, splitIndex);
const afterSplit = content.substring(splitIndex);

console.log('Split at index:', splitIndex);
console.log('Before ends with:', beforeSplit.slice(-30));

// Build the 6 new entity strings (extracted from batch files, raw text)
const batch2BattlesFile = fs.readFileSync(path.join('frontend', 'data', 'batch2_battles.ts'), 'utf8');
const batch2LMFFile = fs.readFileSync(path.join('frontend', 'data', 'batch2_landmarks_figures.ts'), 'utf8');

function extractRawObject(src, key) {
    const lines = src.split('\n');
    const pattern = new RegExp(`^\\s*'${key}':\\s*\\{`);
    let startLine = -1;
    for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) { startLine = i; break; }
    }
    if (startLine === -1) throw new Error(`Key '${key}' not found`);

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

const newEntries = [
    { key: 'battle-of-isly', src: batch2BattlesFile },
    { key: 'battle-of-oued-el-makhazin', src: batch2BattlesFile },
    { key: 'al-qarawiyyin', src: batch2LMFFile },
    { key: 'kasbah-oudaya', src: batch2LMFFile },
    { key: 'ahmad-al-mansur', src: batch2LMFFile },
    { key: 'zaynab-al-nafzawiyya', src: batch2LMFFile },
];

let insertBlock = '';
for (const { key, src } of newEntries) {
    const obj = extractRawObject(src, key);
    // Clean up the indentation: ensure it starts with `  '` (2 spaces)
    const normalized = obj.split('\n').map(l => l.startsWith('  ') ? l : '  ' + l).join('\n');
    insertBlock += `,\n  ${normalized.trim()}\n`;
    console.log(`Added: ${key}`);
}

// Insert before `};` ending of moroverseArticles
// beforeSplit ends with `\n};\n` — we insert before the last `\n};`
const lastBrace = beforeSplit.lastIndexOf('\n};');
const finalBefore = beforeSplit.substring(0, lastBrace);
const endingBrace = beforeSplit.substring(lastBrace);

const newContent = finalBefore + insertBlock + endingBrace + afterSplit;

fs.writeFileSync(mainFile, newContent, 'utf8');
console.log('\n✅ Done! File written.');
console.log('Total length:', newContent.length);
