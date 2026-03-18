const fs = require('fs');

const db = JSON.parse(fs.readFileSync('./data/generated-content.json', 'utf8'));
const categories = ['landmarks', 'cities', 'battles', 'figures'];

console.log('--- Missing Media Report ---');
categories.forEach(cat => {
  const items = db[cat] || [];
  const missingModel = items.filter(i => !i.modelUrl).map(i => i.id);
  const missingVideo = items.filter(i => !i.videoUrl).map(i => i.id);
  const missingAudio = items.filter(i => !i.audioUrl).map(i => i.id);
  
  console.log(`\n[${cat.toUpperCase()}] Total: ${items.length}`);
  console.log(`- Missing modelUrl (${missingModel.length}):`, missingModel.length ? missingModel.slice(0, 5).join(', ') + (missingModel.length>5 ? '...' : '') : 'None');
  console.log(`- Missing videoUrl (${missingVideo.length}):`, missingVideo.length ? missingVideo.slice(0, 5).join(', ') + (missingVideo.length>5 ? '...' : '') : 'None');
  console.log(`- Missing audioUrl (${missingAudio.length}):`, missingAudio.length ? missingAudio.slice(0, 5).join(', ') + (missingAudio.length>5 ? '...' : '') : 'None');
});
