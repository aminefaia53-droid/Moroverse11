const { execSync } = require('child_process');

try {
    execSync('git add -A', { cwd: process.cwd(), stdio: 'inherit' });
    execSync('git commit -m "fix: remove duplicate keys (tangier, chefchaouen, meknes, oujda) - clean build 29 entities"', { cwd: process.cwd(), stdio: 'inherit' });
    execSync('git push', { cwd: process.cwd(), stdio: 'inherit' });
    console.log('Push successful!');
} catch (e) {
    console.error('Error:', e.message);
}
