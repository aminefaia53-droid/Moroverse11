/**
 * MoroVerse — Master Content Apply Script
 * Reads patch files and writes enriched generated-content.json
 * Run: node apply-content.js
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'generated-content.json');
const PATCHES_DIR = path.join(__dirname, 'content-patches');

// Load current DB
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

// Ensure all categories exist
['landmarks','cities','battles','figures'].forEach(c => { if(!db[c]) db[c] = []; });

function applyPatch(category, patches) {
  patches.forEach(patch => {
    const idx = db[category].findIndex(e => e.id === patch.id);
    if (idx >= 0) {
      db[category][idx] = { ...db[category][idx], ...patch, isPending: false };
    } else {
      db[category].push({ ...patch, isPending: false });
    }
    process.stdout.write(`  ✓ [${category}] ${patch.id}\n`);
  });
}

// Load and apply each patch file
const patchFiles = fs.readdirSync(PATCHES_DIR).filter(f => f.endsWith('.js')).sort();
console.log(`\n📦 Found ${patchFiles.length} patch file(s)...`);

patchFiles.forEach(file => {
  console.log(`\n▶ Applying: ${file}`);
  const { category, patches } = require(path.join(PATCHES_DIR, file));
  applyPatch(category, patches);
});

// Write result
fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log(`\n✅ Done! generated-content.json updated with full SEO content.`);
console.log(`   Counts: landmarks=${db.landmarks.length}, cities=${db.cities.length}, battles=${db.battles.length}, figures=${db.figures.length}`);
