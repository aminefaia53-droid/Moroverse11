const fs = require('fs');

// Load file
let content = fs.readFileSync('frontend/data/moroverse-content.ts', 'utf8');
let lines = content.split('\n');

// Keys to keep only the LATEST occurrence 
// (means remove the first occurrence at lower line number)
// First occurrences at: oujda=251, chefchaouen=476, meknes=551, tangier=1076 (0-indexed: 250, 475, 550, 1075)
const keysToFix = ['oujda', 'chefchaouen', 'meknes', 'tangier'];

function removeFirstOccurrence(lines, key) {
    // Find first occurrence
    const pattern = new RegExp(`^\\s*'${key}'\\s*:\\s*\\{`);
    let startLine = -1;
    for (let i = 0; i < lines.length; i++) {
        if (pattern.test(lines[i])) {
            startLine = i;
            break;
        }
    }

    if (startLine === -1) {
        console.log(`Key '${key}' not found!`);
        return lines;
    }

    console.log(`Removing first '${key}' starting at line ${startLine + 1}: ${lines[startLine].trim()}`);

    // Count braces to find the matching closing brace
    let depth = 0;
    let endLine = startLine;
    let started = false;

    for (let i = startLine; i < lines.length; i++) {
        const line = lines[i];
        for (const ch of line) {
            if (ch === '{') { depth++; started = true; }
            if (ch === '}') depth--;
        }
        if (started && depth <= 0) {
            endLine = i;
            break;
        }
    }

    console.log(`  -> removing lines ${startLine + 1} to ${endLine + 1}`);

    // Remove those lines and the trailing comma if needed
    let newLines = [...lines.slice(0, startLine), ...lines.slice(endLine + 1)];

    // If the next line (now at startLine) starts with a comma, clean it up
    // (This handles the case where the entry ended with },)

    return newLines;
}

// Remove first occurrences (do them in reverse order of line number to avoid shifting issues)
// Order: tangier (1076), meknes (551), chefchaouen (476), oujda (251)
lines = removeFirstOccurrence(lines, 'tangier');
lines = removeFirstOccurrence(lines, 'meknes');
lines = removeFirstOccurrence(lines, 'chefchaouen');
lines = removeFirstOccurrence(lines, 'oujda');

// Write back
const newContent = lines.join('\n');
fs.writeFileSync('frontend/data/moroverse-content.ts', newContent);
console.log('Done! Result has', lines.length, 'lines');
