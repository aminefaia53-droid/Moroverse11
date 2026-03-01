const { execSync } = require('child_process');
try {
    execSync('git checkout HEAD~1 -- frontend/data/moroverse-content.ts', { cwd: process.cwd(), stdio: 'inherit' });
    console.log('Restored moroverse-content.ts from previous commit');
} catch (e) {
    console.error('Error:', e.message);
}
