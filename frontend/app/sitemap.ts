import { MetadataRoute } from 'next';
import { moroverseArticles } from '../data/moroverse-content';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://moroverse.ma';

    const articleEntries = Object.keys(moroverseArticles).map((id) => ({
        url: `${baseUrl}/archive/${id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...articleEntries,
    ];
}
