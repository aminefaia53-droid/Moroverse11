const fs = require('fs');
const content = fs.readFileSync('frontend/data/moroverse-content.ts', 'utf8');
const regex = /^\s*(?:'|")?([a-zA-Z0-9_-]+)(?:'|")?\s*:\s*\{/gm;
const matches = [...content.matchAll(regex)];
const keys = matches.map(m => m[1]);
const duplicates = keys.filter((item, index) => keys.indexOf(item) !== index);
console.log('Duplicates:', [...new Set(duplicates)]);
