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

// Fallback seed data required by user
const FALLBACK_DATA: Record<TourismType, Destination[]> = {
    dark: [
        {
            id: 'd1',
            name: { en: 'Merchich Region (Mediouna)', ar: 'منطقة مرشيش (مديونة)' },
            description: { en: 'A region of secrets and mystery on the outskirts of Casablanca.', ar: 'منطقة الأسرار والغموض بضواحي الدار البيضاء.' }
        },
        {
            id: 'd2',
            name: { en: 'Kara Prison (Meknes)', ar: 'سجن قارة (مكناس)' },
            description: { en: 'A massive underground prison built in the 18th century, wrapped in myths and dark history.', ar: 'سجن ضخم تحت الأرض بني في القرن الثامن عشر، يحيط به الغموض والتاريخ المظلم.' }
        },
        {
            id: 'd3',
            name: { en: 'Agadir Earthquake Ruins', ar: 'أطلال زلزال أكادير' },
            description: { en: 'The somber remains of the old Kasbah, preserving the memory of the devastating 1960 earthquake.', ar: 'البقايا الحزينة للقصبة القديمة التي تحفظ ذاكرة زلزال عام 1960 المدمر.' }
        }
    ],
    cultural: [
        {
            id: 'c1',
            name: { en: 'Fez el-Bali', ar: 'فاس البالي' },
            description: { en: 'The oldest walled part of Fez, a labyrinth of history and traditional craftsmanship.', ar: 'المدينة العتيقة لفاس، متاهة من التاريخ والحرف التقليدية الأصيلة.' }
        },
        {
            id: 'c2',
            name: { en: 'Marrakech Medina', ar: 'مدينة مراكش العتيقة' },
            description: { en: 'A vibrant hub of palaces, souks, and the legendary Jemaa el-Fnaa square.', ar: 'مركز نابض بالقصور والأسواق وساحة جامع الفنا الأسطورية.' }
        },
        {
            id: 'c3',
            name: { en: 'Volubilis Ruins', ar: 'أطلال وليلي' },
            description: { en: 'Exceptionally well-preserved Roman ruins showcasing ancient civilization in Morocco.', ar: 'أطلال رومانية محفوظة بعناية فائقة تبرز الحضارة القديمة في المغرب.' }
        }
    ],
    cinematic: [
        {
            id: 'ci1',
            name: { en: 'Ouarzazate Studios', ar: 'استوديوهات ورزازات' },
            description: { en: 'The "Ouallywood" of Africa, where epic blockbusters are brought to life.', ar: 'بوابة هوليوود في إفريقيا، حيث تُصنع أضخم الأفلام الملحمية.' }
        },
        {
            id: 'ci2',
            name: { en: 'Ait Ben Haddou Kasbah', ar: 'قصبة آيت بن حدو' },
            description: { en: 'A striking mud-brick fortress featured in Gladiator and Game of Thrones.', ar: 'قصر طيني مذهل ظهر في أفلام شهيرة مثل غلاديايتر وصراع العروش.' }
        }
    ],
    adventure: [
        {
            id: 'a1',
            name: { en: 'Mount Toubkal', ar: 'جبل توبقال' },
            description: { en: 'The highest peak in the Atlas Mountains and North Africa, a true trekker’s paradise.', ar: 'أعلى قمة في جبال الأطلس وشمال إفريقيا، جنة لعشاق التسلق والمغامرة.' }
        },
        {
            id: 'a2',
            name: { en: 'Erg Chebbi Dunes', ar: 'كثبان عرق الشبي' },
            description: { en: 'Vast, wind-blown sand dunes reaching heights of 150 meters in the Sahara desert.', ar: 'كثبان رملية شاسعة تصل لارتفاع 150 متراً في قلب الصحراء الكبرى.' }
        }
    ],
    beach: [
        {
            id: 'b1',
            name: { en: 'Taghazout Bay', ar: 'خليج تغازوت' },
            description: { en: 'A premier surfing destination with pristine beaches and a laid-back vibe.', ar: 'وجهة رائدة لركوب الأمواج بشواطئ خلابة وأجواء هادئة.' }
        },
        {
            id: 'b2',
            name: { en: 'Dakhla Peninsula', ar: 'شبه جزيرة الداخلة' },
            description: { en: 'Where the Atlantic meets the Sahara, famous for kitesurfing and crystal waters.', ar: 'حيث يلتقي المحيط الأطلسي بالصحراء، تشتهر بركوب الأمواج الشراعي والمياه النقية.' }
        }
    ]
};

export async function fetchTourismDestinations(type: TourismType): Promise<Destination[]> {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL;

    // If we have a real headless WP connected, try fetching from the custom post type endpoint
    if (wpUrl) {
        try {
            const res = await fetch(`${wpUrl}/wp-json/wp/v2/destinations?tourism_type=${type}`, {
                next: { revalidate: 3600 } // Cache for 1 hour
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    // Map WP data to our expected structure based on how ACF fields are set up
                    // This is a placeholder standard mapping
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
            // Fallthrough to seeded data intentionally
        }
    }

    // Simulate API delay for realism since we are using local memory fallback right now
    await new Promise(resolve => setTimeout(resolve, 600));
    return FALLBACK_DATA[type] || [];
}
