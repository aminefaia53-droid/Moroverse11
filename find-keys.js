const fs = require('fs');
const content = fs.readFileSync('frontend/data/moroverse-content.ts', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, i) => {
    if (line.match(/^\s*(?:'|")?(tangier|chefchaouen|meknes|oujda)(?:'|")?\s*:\s*\{/)) {
        console.log('Found ' + line.trim() + ' at line ' + (i + 1));
    }
});
