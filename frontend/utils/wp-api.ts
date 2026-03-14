// Service to fetch Tourism destinations from Headless WP (or return rich fallback data)

export type TourismType = 'cultural' | 'adventure' | 'beach' | 'cinematic' | 'dark';

export interface Destination {
    id: string;
    name: {
        en: string;
        ar: string;
    };
    description: {
        en: string;
        ar: string;
    };
    imageUrl?: string;
}

import generatedContent from '../data/generated-content.json';

const TOURISM_MAPPING: Record<TourismType, string[]> = {
    dark: [],
    cultural: [],
    cinematic: [],
    adventure: [],
    beach: []
};

export async function fetchTourismDestinations(type: TourismType): Promise<Destination[]> {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL;

    // If we have a real headless WP connected, try fetching from the custom post type endpoint
    if (wpUrl && wpUrl !== '') {
        try {
            const res = await fetch(`${wpUrl}/wp-json/wp/v2/destinations?tourism_type=${type}`, {
                next: { revalidate: 3600 } // Cache for 1 hour
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    return data.map((item: any) => ({
                        id: item.id.toString(),
                        name: {
                            en: item.acf?.title_en || item.title?.rendered,
                            ar: item.acf?.title_ar || ''
                        },
                        description: {
                            en: item.acf?.description_en || '',
                            ar: item.acf?.description_ar || ''
                        },
                        imageUrl: item.acf?.image_url || undefined
                    }));
                }
            }
        } catch (error) {
            console.error(`Error fetching WP destinations for ${type}:`, error);
        }
    }

    // Fallback: Read REAL data directly from generated-content.json based on mappings
    const targetIds = TOURISM_MAPPING[type] || [];
    const allLandmarks = (generatedContent.landmarks as any[]) || [];

    const results: Destination[] = [];

    for (const tid of targetIds) {
        const landmark = allLandmarks.find(l => l.id === tid);
        if (landmark) {
            results.push({
                id: landmark.id,
                name: landmark.name,
                description: landmark.desc, // mapping desc to description
                imageUrl: landmark.imageUrl || undefined
            });
        }
    }

    // Simulate network delay for realism while using the static JSON
    await new Promise(resolve => setTimeout(resolve, 400));
    return results;
}

// Function to push new Elite Tours to Headless WP
export async function pushTourismDestination(data: {
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
    imageUrl?: string;
    cityEn: string;
    cityAr: string;
}) {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL;
    const token = process.env.WP_CONTENT_TOKEN;

    if (!wpUrl) {
        console.warn('WP Push Skipped: NEXT_PUBLIC_WP_URL is not defined in env variables.');
        return { success: false, message: 'WP URL not configured' };
    }

    try {
        const response = await fetch(`${wpUrl}/wp-json/wp/v2/destinations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token || ''}`
            },
            body: JSON.stringify({
                title: data.titleEn || data.titleAr,
                status: 'publish', // Or 'draft' depending on workflow
                acf: {
                    title_ar: data.titleAr,
                    description_en: data.descEn,
                    description_ar: data.descAr,
                    image_url: data.imageUrl || '',
                    city_en: data.cityEn,
                    city_ar: data.cityAr
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.message || 'Failed to push to WordPress');
        }

        const responseData = await response.json();
        return { success: true, data: responseData };
    } catch (error: any) {
        console.error('WP Push Error:', error);
        return { success: false, message: error.message };
    }
}
