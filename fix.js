const fs = require('fs');
let content = fs.readFileSync('./frontend/data/moroverse-content.ts', 'utf8');
['oujda', 'chefchaouen', 'meknes', 'tangier'].forEach(key => {
    const regex = new RegExp(`^\\s*'${key}': \\{[\\s\\S]*?^\\s*\\},?$`, 'm');
    content = content.replace(regex, '');
});
fs.writeFileSync('./frontend/data/moroverse-content.ts', content);
