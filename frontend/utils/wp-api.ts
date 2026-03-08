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
    dark: [
        'casablanca-merchich-region',
        'meknes-habs-qara',
        'agadir-agadir-oufella'
    ],
    cultural: [
        'fes-al-qarawiyyin-mosque',
        'marrakech-jemaa-el-fnaa',
        'meknes-volubilis'
    ],
    cinematic: [
        'ouarzazate-atlas-studios',
        'ouarzazate-ait-benhaddou'
    ],
    adventure: [
        'sahara-dakhla-bay',
        'marrakech-palmeraie'
    ],
    beach: [
        'agadir-agadir-marina',
        'sahara-dakhla-bay'
    ]
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
    const allLandmarks = generatedContent.landmarks || [];

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
