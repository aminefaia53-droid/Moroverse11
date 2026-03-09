const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'frontend/data/generated-content.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Step 1: Force ALL landmarks to verified + ensure imageUrl
const CITY_FALLBACKS = {
    'Rabat': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Hassan_tower_4.jpg/1200px-Hassan_tower_4.jpg',
    'Casablanca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Mosquee_hassan_2_casablanca.jpg/1200px-Mosquee_hassan_2_casablanca.jpg',
    'Marrakech': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Marrakesh_Menara_1.jpg/1200px-Marrakesh_Menara_1.jpg',
    'Fes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Bou_Inania_Medersa%2C_Fes%2C_Morocco.jpg/1200px-Bou_Inania_Medersa%2C_Fes%2C_Morocco.jpg',
    'Tangier': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Tangier_seafront.jpg/1200px-Tangier_seafront.jpg',
    'Meknes': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Bab_Mansour_Meknes.jpg/1200px-Bab_Mansour_Meknes.jpg',
    'Agadir': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Agadir_coast.jpg/1200px-Agadir_coast.jpg',
    'Chefchaouen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Chefchaouen%2C_Morocco.jpg/1200px-Chefchaouen%2C_Morocco.jpg',
    'Tetouan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Tetouan-Morocco.jpg/1200px-Tetouan-Morocco.jpg',
    'Essaouira': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Essaouira-Mogador_Ramparts.jpg/1200px-Essaouira-Mogador_Ramparts.jpg',
    'Ouarzazate': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Ait_Benhaddou.JPG/1200px-Ait_Benhaddou.JPG',
    'Sahara': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Sahara_Desert_Morocco.jpg/1200px-Sahara_Desert_Morocco.jpg',
};
const GENERIC = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Morocco_architectural_photography.jpg/1200px-Morocco_architectural_photography.jpg';

let unlocked = 0;
let imaged = 0;

data.landmarks = data.landmarks.map(lm => {
    // Force unlock
    if (lm.isPending !== false) { lm.isPending = false; unlocked++; }

    // Ensure image
    if (!lm.imageUrl || lm.imageUrl.trim() === '') {
        const city = lm.city && lm.city.en ? lm.city.en : '';
        lm.imageUrl = CITY_FALLBACKS[city] || GENERIC;
        imaged++;
    }

    // Ensure history/foundation
    if (!lm.history) {
        lm.history = lm.desc || { ar: 'معلمة تاريخية مغربية.', en: 'A historic Moroccan landmark.' };
    }
    if (!lm.foundation) {
        lm.foundation = { ar: 'عصور قديمة', en: 'Ancient Era' };
    }
    if (!lm.visualSoul) {
        lm.visualSoul = 'Mosque';
    }

    return lm;
});

// Step 2: Update battles with locally generated paths
data.battles = data.battles.map(b => {
    if (b.id === 'battle-zallaqa') b.imageUrl = '/images/gemini-generated/battle-zallaqa.png';
    if (b.id === 'battle-three-kings') b.imageUrl = '/images/gemini-generated/battle-three-kings.png';
    if (b.id === 'battle-isly') b.imageUrl = '/images/gemini-generated/battle-isly.png';
    b.isPending = false;
    return b;
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`DONE: Unlocked ${unlocked}, Added images: ${imaged}`);
