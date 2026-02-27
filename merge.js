const fs = require('fs');
const contentPath = './frontend/data/moroverse-content.ts';
const batchPath = './frontend/data/batch2_part1.ts';

try {
    let content = fs.readFileSync(contentPath, 'utf8');
    let batch = fs.readFileSync(batchPath, 'utf8');

    let batchObjStr = batch.replace('export const batch2_part1 = ', '').trim();
    if (batchObjStr.endsWith(';')) batchObjStr = batchObjStr.slice(0, -1);

    // remove outer { and }
    batchObjStr = batchObjStr.substring(1, batchObjStr.length - 1).trim();

    if (!content.includes('export const getArticle')) {
        throw new Error("Could not find export const getArticle in moroverse-content.ts");
    }

    content = content.replace(/\n};\n*\s*export const getArticle\b/, `,\n${batchObjStr}\n};\n\nexport const getArticle`);

    fs.writeFileSync(contentPath, content, 'utf8');
    console.log("Successfully merged batch 1 part 1 into moroverse-content.ts");
} catch (err) {
    console.error(err);
}
