const fs = require('fs');
const path = 'data/moroverse-content.ts';
let c = fs.readFileSync(path, 'utf8');

c = c.replace(/`\r?\n\s*\}\r?\n\s*\},\r?\n\s*\{\r?\n\s*title: 'الأسئلة الشائعة/g, "`\n            },\n            {\n                title: 'الأسئلة الشائعة");
c = c.replace(/لتوسيع آفاق معرفتك\.'\r?\n\r?\n\s*\],/g, "لتوسيع آفاق معرفتك.'\n            }\n        ],");

fs.writeFileSync(path, c);
console.log('Fixed syntax errors.');
