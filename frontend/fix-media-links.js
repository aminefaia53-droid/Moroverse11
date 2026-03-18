const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'generated-content.json');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

const DEFAULT_MODEL = 'https://prqbbzynmnkwhunusdbw.supabase.co/storage/v1/object/public/3d_assets/monuments/1773581538673-hassan_tower_rabat_-_morocco.glb';
const DEFAULT_VIDEO = 'https://www.youtube.com/embed/g8vHhgh6oM0'; // Morocco 4K

function getAudioForCategory(cat) {
  if (cat === 'battles') return '/audio/epic-war.mp3';
  if (cat === 'figures') return '/audio/mysterious-merchich.mp3';
  return '/audio/andalusi-city.mp3'; // defaults for cities, landmarks
}

['landmarks', 'cities', 'battles', 'figures'].forEach(cat => {
  if (!db[cat]) return;
  db[cat].forEach(item => {
    // Fill 3D model
    if (!item.modelUrl) {
      item.modelUrl = DEFAULT_MODEL;
    }
    // Fill Audio
    if (!item.audioUrl) {
      item.audioUrl = getAudioForCategory(cat);
    }
    // Fill Video
    if (!item.videoUrl) {
      item.videoUrl = DEFAULT_VIDEO;
    }
  });
});

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Successfully applied 3D, Audio, and Video URLs to all 61 entries!');
