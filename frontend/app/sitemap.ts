import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://moroverse.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    // Core pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ];

    // Dynamically pull all /content/*.html files
    const contentDir = path.join(process.cwd(), 'content');
    let articleEntries: MetadataRoute.Sitemap = [];
    if (fs.existsSync(contentDir)) {
        const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.html'));
        articleEntries = files.map(file => ({
            url: `${BASE_URL}/posts/${file.replace('.html', '')}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        }));
    }

    return [...staticPages, ...articleEntries];
}
