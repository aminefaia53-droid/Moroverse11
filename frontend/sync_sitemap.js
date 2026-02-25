const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content');
const publicDir = path.join(__dirname, 'public');
const VERCEL_URL = 'https://moroverse.vercel.app';
const today = new Date().toISOString().split('T')[0];

const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.html'));
const staticPages = ['/', '/about', '/contact'];

const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map((p, i) => `  <url>
    <loc>${VERCEL_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${i === 0 ? '1.0' : '0.7'}</priority>
  </url>`).join('\n')}
${files.map(file => {
    const slug = file.replace('.html', '');
    return `  <url>
    <loc>${VERCEL_URL}/posts/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
}).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXML);
console.log(`✅ Sitemap updated with ${files.length + staticPages.length} URLs.`);
