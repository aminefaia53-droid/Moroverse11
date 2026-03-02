const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'frontend', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.ts'));

const entities = {
    city: [],
    figure: [],
    landmark: [],
    battle: []
};

// 1. Extract from TS files
files.forEach(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');

    const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?name:\s*\{\s*en:\s*['"]([^'"]+)['"]/g;
    let match;

    let category = 'city';
    if (file.includes('figures')) category = 'figure';
    else if (file.includes('landmarks')) category = 'landmark';
    else if (file.includes('battles')) category = 'battle';
    else if (file.includes('geography') || file.includes('cities')) category = 'city';

    while ((match = regex.exec(content)) !== null) {
        entities[category].push(`- **${match[2]}**: \`${match[1]}\``);
    }
});

// 2. Extract from JSON
const jsonPath = path.join(dataDir, 'generated-content.json');
if (fs.existsSync(jsonPath)) {
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    if (jsonContent.landmarks) {
        jsonContent.landmarks.forEach(l => {
            // Avoid duplicates if it's already in the other list (though IDs might differ)
            entities.landmark.push(`- **${l.name.en}**: \`${l.id}\``);
        });
    }
    // Check if JSON has cities or figures too just in case
    if (jsonContent.cities) {
        jsonContent.cities.forEach(c => entities.city.push(`- **${c.name.en}**: \`${c.id}\``));
    }
    if (jsonContent.figures) {
        jsonContent.figures.forEach(f => entities.figure.push(`- **${f.name.en}**: \`${f.id}\``));
    }
}

console.log("### 🏙️ CITIES (المدن)");
[...new Set(entities.city)].sort().forEach(e => console.log(e));

console.log("\n### 👤 HISTORICAL FIGURES (الشخصيات التاريخية)");
[...new Set(entities.figure)].sort().forEach(e => console.log(e));

console.log("\n### 🏰 LANDMARKS (المعالم التاريخية)");
[...new Set(entities.landmark)].sort().forEach(e => console.log(e));

console.log("\n### ⚔️ BATTLES (المعارك)");
[...new Set(entities.battle)].sort().forEach(e => console.log(e));
