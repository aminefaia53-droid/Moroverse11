const fs = require('fs');
let c = fs.readFileSync('data/moroverse-content.ts', 'utf8');
c = c.replace(/`\\n\s*\}\s*,\s*\\n\s*\{/g, '`\n            },\n            {');
c = c.replace(/`\\[n]\s*\}\s*,\s*\\[n]\s*\{/g, '`\n            },\n            {');

// Let's just use string literal replacements to be totally safe
// Because now the file has literal \n printed out!
c = c.replace(/`\\n            },\n            {/g, '`\n            },\n            {');
c = c.replace(/`\\n\s*\}\s*,\s*\\n\s*\{/g, '`\n            },\n            {');
c = c.replace(/`\\\\n            },\\\\n            {/g, '`\n            },\n            {');
c = c.replace(/`\\n\s*\}\s*,\s*\\n\s*\{/g, '`\n            },\n            {');

// Then correct the main issue.
c = c.replace(/`\s*\}\s*},\s*\{/g, '`\n            },\n            {');
fs.writeFileSync('data/moroverse-content.ts', c);
console.log('Fixed');
