const fs = require('fs');

let content = fs.readFileSync('./frontend/data/moroverse-content.ts', 'utf8');

const keysToRemove = ['tangier', 'chefchaouen', 'meknes', 'oujda'];

function removeKey(content, key) {
    const keyStr = `    '${key}': {\n`;
    const startIndex = content.indexOf(keyStr);
    if (startIndex === -1) {
        console.log(`Key ${key} not found.`);
        return content;
    }

    let braceCount = 0;
    let endIndex = -1;
    let started = false;

    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '{') {
            braceCount++;
            started = true;
        } else if (content[i] === '}') {
            braceCount--;
        }

        if (started && braceCount === 0) {
            endIndex = i;
            break;
        }
    }

    if (endIndex !== -1) {
        // Find if there's a following comma and newline to remove
        let finalIndex = endIndex + 1;
        while (finalIndex < content.length && (content[finalIndex] === ',' || content[finalIndex] === ' ' || content[finalIndex] === '\r' || content[finalIndex] === '\n')) {
            if (content[finalIndex] === '\n') {
                finalIndex++;
                break;
            }
            finalIndex++;
        }

        console.log(`Removing ${key} from index ${startIndex} to ${finalIndex}`);
        return content.substring(0, startIndex) + content.substring(finalIndex);
    }

    return content;
}

keysToRemove.forEach(key => {
    content = removeKey(content, key);
});

// Now read batch2_part1.ts and batch2_part2.ts
function extractObjects(filePath) {
    if (!fs.existsSync(filePath)) return '';
    let batchContent = fs.readFileSync(filePath, 'utf8');
    // Remove export const ... = { and trailing };
    batchContent = batchContent.replace(/export const .* = \{\s*/, '');
    batchContent = batchContent.replace(/\s*};\s*$/, '');
    return batchContent;
}

const p1 = extractObjects('./frontend/data/batch2_part1.ts');
const p2 = extractObjects('./frontend/data/batch2_part2.ts');

const lastBraceIndex = content.lastIndexOf('};');
if (lastBraceIndex !== -1 && (p1 || p2)) {
    // Add a trailing comma if missing before appending
    const beforeLastBrace = content.substring(0, lastBraceIndex).trimEnd();
    let comma = beforeLastBrace.endsWith(',') ? '' : ',';

    let toAppend = '';
    if (p1) toAppend += p1.trim() + ',\n';
    if (p2) toAppend += p2.trim() + '\n';

    content = content.substring(0, lastBraceIndex) + comma + '\n' + toAppend + '};\n';
}

fs.writeFileSync('./frontend/data/moroverse-content.ts', content);
console.log('Merge complete!');
