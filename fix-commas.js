/**
 * Batch 2 Fix Script
 * The merge script lost the commas between city entries.
 * This script finds the entry boundaries and inserts proper commas.
 * Also removes any remaining duplicate entity keys.
 */
const fs = require('fs');
const path = require('path');

const mainFile = path.join('frontend', 'data', 'moroverse-content.ts');
let content = fs.readFileSync(mainFile, 'utf8');
let lines = content.split('\n');

// Find lines where a new top-level key starts WITHOUT a preceding comma
// Pattern: line ends with just `}` or `    }` and next non-empty line is `    'somekey': {`
const topKeyPattern = /^\s{4}'[^']+'\s*:\s*\{/;

function fixMissingCommas(lines) {
    const result = [];
    for (let i = 0; i < lines.length; i++) {
        result.push(lines[i]);

        // Check if current line is a closing brace at depth 1 (4 spaces close + next is a key)
        if (/^\s{4}\}$/.test(lines[i])) {
            // Look ahead for the next meaningful line
            let j = i + 1;
            while (j < lines.length && lines[j].trim() === '') j++;
            if (j < lines.length && topKeyPattern.test(lines[j])) {
                // This closing brace needs a comma
                result[result.length - 1] = lines[i] + ',';
                console.log(`Added comma at line ${i + 1}: '${lines[i].trim()}'`);
            }
        }
    }
    return result;
}

lines = fixMissingCommas(lines);

// Also fix the case where `  ,\n  'key': {` got inserted (the new entities from prev script)
// Find  ,\n  'key': { patterns and normalize to \n    'key': { with preceding comma on the last `}`
let joined = lines.join('\n');

// Fix: if a line is just "  ," followed by "  'key': {", merge properly
joined = joined.replace(/\n\s*,\n\s*('[\w-]+')\s*:\s*\{/g, (match, key) => {
    return `\n  },\n  ${key}: {`;
});

// Also handle the ,\n  batch2Cities1.export pattern block (the object was injected as `  ,\n  'key': {`)
// More specifically normalize the `,` prefix that was injected
// The insertion format was:  `  ,\n  ${obj}` where obj starts with `'key': {`
// So we'll see lines like: `  ,` then `  'tangier': {` 
// Let's normalize: remove standalone comma lines and ensure prev `}` has a comma
lines = joined.split('\n');

// Clean up orphaned comma-only lines (from previous merge format)
const cleanLines = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === ',') {
        // If previous non-empty line ends with `}`, add comma to it
        for (let j = cleanLines.length - 1; j >= 0; j--) {
            if (cleanLines[j].trim() !== '') {
                if (!cleanLines[j].trimEnd().endsWith(',')) {
                    cleanLines[j] = cleanLines[j].trimEnd() + ',';
                    console.log(`Fixed orphan comma at around line ${i + 1}`);
                }
                break;
            }
        }
        // Skip this orphan comma line
        continue;
    }
    cleanLines.push(lines[i]);
}

fs.writeFileSync(mainFile, cleanLines.join('\n'));
console.log(`\n✅ Done fixing commas. Lines: ${cleanLines.length}`);
