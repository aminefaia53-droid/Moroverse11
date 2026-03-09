const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'frontend/data/generated-content.json');
let data;

try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
    console.error("Error reading data:", e);
    process.exit(1);
}

let modifiedCount = 0;
let fallbackCount = 0;

if (data.landmarks && Array.isArray(data.landmarks)) {
    data.landmarks = data.landmarks.map(landmark => {
        // 1. Force Unlock
        if (landmark.isPending === true) {
            landmark.isPending = false;
            modifiedCount++;
        }

        // 2. Ensure image URL exists or fallback
        if (!landmark.imageUrl || landmark.imageUrl.trim() === '') {
            // Fallback to Moroccan aesthetic images
            if (landmark.city && landmark.city.en === 'Rabat') {
                landmark.imageUrl = 'https://images.unsplash.com/photo-1549733059-d81615d862e?q=80&w=1080&auto=format&fit=crop';
            } else if (landmark.city && landmark.city.en === 'Casablanca') {
                landmark.imageUrl = 'https://images.unsplash.com/photo-1559586111-94eb09bf2bb5?q=80&w=1080&auto=format&fit=crop';
            } else if (landmark.city && landmark.city.en === 'Marrakech') {
                landmark.imageUrl = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop';
            } else {
                landmark.imageUrl = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1080&auto=format&fit=crop';
            }
            fallbackCount++;
        }
        return landmark;
    });
}

try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Unlocked ${modifiedCount} landmarks. Applied fallback images to ${fallbackCount}.`);
} catch (e) {
    console.error("Error writing data:", e);
    process.exit(1);
}
