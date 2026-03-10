const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    const originalValue = fs.readFileSync(filePath, 'utf8');
    let newValue = originalValue
        .replace(/backdrop-blur-xl/g, 'backdrop-blur-sm')
        .replace(/backdrop-blur-lg/g, 'backdrop-blur-sm')
        // Simplify overly complex shadow layers
        .replace(/shadow-\[0_30px_60px_-15px_rgba\(0,0,0,0\.8\),0_0_40px_rgba\(197,160,89,0\.15\)\]/g, 'shadow-2xl')
        .replace(/shadow-\[0_25px_50px_-12px_rgba\(0,0,0,0\.5\)\]/g, 'shadow-xl');

    if (originalValue !== newValue) {
        fs.writeFileSync(filePath, newValue, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

['./frontend/app', './frontend/components'].forEach(dir => {
    walkDir(path.join(__dirname, dir), processFile);
});

console.log('CSS Optimization complete.');
