export interface Landmark {
    id: string;
    name: { en: string; ar: string };
    city: { en: string; ar: string };
    foundation: { en: string; ar: string };
    history: { en: string; ar: string };
    visualSoul: string;
    imageUrl?: string | null;
    isPending?: boolean;
}

export const moroccoLandmarks: Landmark[] = [
    {
        id: 'hassan-ii-mosque',
        name: { en: 'Hassan II Mosque', ar: 'مسجد الحسن الثاني' },
        city: { en: 'Casablanca', ar: 'الدار البيضاء' },
        foundation: { en: '20th Century', ar: 'القرن العشرين' },
        history: {
            en: 'A colossal sentinel on the Atlantic shore, blending modern engineering with the soul of traditional Moroccan craftsmanship including hand-carved stone and wood.',
            ar: 'حارس جليل على ضفاف الأطلسي، يمزج بين الهندسة الحديثة وروح الحرفة المغربية الأصيلة من نقش على الحجر والخشب.'
        },
        visualSoul: 'Mosque',
        imageUrl: 'https://images.unsplash.com/photo-1577147443647-81867e3ed31f?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'hassan-tower',
        name: { en: 'Hassan Tower', ar: 'صومعة حسان' },
        city: { en: 'Rabat', ar: 'الرباط' },
        foundation: { en: '12th Century (Almohad Era)', ar: 'القرن الثاني عشر (العصر الموحدي)' },
        history: {
            en: 'The majestic red sandstone minaret of an unfinished 12th-century mosque, standing as a silent witness to Almohad architectural ambition.',
            ar: 'مئذنة مهيبة من الحجر الرملي الأحمر لمسجد لم يكتمل في القرن الثاني عشر، تقف شاهداً صامتاً على طموح العمارة الموحدية.'
        },
        visualSoul: 'Tower',
        imageUrl: 'https://images.unsplash.com/photo-1644331049219-c09a803e1e55?q=80&w=1964&auto=format&fit=crop'
    },
    {
        id: 'el-badi-palace',
        name: { en: 'El Badi Palace', ar: 'قصر البديع' },
        city: { en: 'Marrakech', ar: 'مراكش' },
        foundation: { en: '16th Century (Saadi Era)', ar: 'القرن السادس عشر (العصر السعدي)' },
        history: {
            en: 'A ruined palace commissioned by the sultan Ahmad al-Mansur, once known as the "Incomparable".',
            ar: 'قصر مدمر أمر ببنائه السلطان أحمد المنصور السعدي، وكان يعرف بـ "البديع" لعظمته.'
        },
        visualSoul: 'Palace',
        imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1974&auto=format&fit=crop'
    },
    {
        id: 'volubilis',
        name: { en: 'Volubilis', ar: 'وليلي' },
        city: { en: 'Meknes', ar: 'مكناس' },
        foundation: { en: '3rd Century BC (Roman/Mauritanian)', ar: 'القرن الثالث قبل الميلاد (روماني/موريتاني)' },
        history: {
            en: 'A partly excavated Berber and Roman city in Morocco, a UNESCO World Heritage site.',
            ar: 'مدينة أمازيغية ورومانية محفورة جزئياً، مصنفة كإرث عالمي من طرف اليونسكو.'
        },
        visualSoul: 'Ruin',
        imageUrl: 'https://images.unsplash.com/photo-1629747387925-6905ff5a558a?q=80&w=2070&auto=format&fit=crop'
    },
    {
        id: 'hercules-caves',
        name: { en: 'Hercules Caves', ar: 'مغارة هرقل' },
        city: { en: 'Tangier', ar: 'طنجة' },
        foundation: { en: 'Ancient (Natural/Mythological)', ar: 'قديم (طبيعي/أسطوري)' },
        history: {
            en: 'A natural limestone cave complex near Tangier, famous for its entrance resembling the map of Africa.',
            ar: 'مجمع مغارات طبيعية قرب طنجة، يشتهر بمدخله الذي يشبه خريطة إفريقيا.'
        },
        visualSoul: 'Cave',
        imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2021&auto=format&fit=crop'
    },
    {
        id: 'boujdour-lighthouse',
        name: { en: 'Boujdour Lighthouse', ar: 'منارة بوجدور' },
        city: { en: 'Boujdour', ar: 'بوجدور' },
        foundation: { en: '20th Century', ar: 'القرن العشرين' },
        history: {
            en: 'A historic lighthouse serving as a vital navigation milestone on the Saharan coast.',
            ar: 'منارة تاريخية تشكل علامة جغرافية حيوية للملاحة على الساحل الصحراوي.'
        },
        visualSoul: 'Lighthouse',
        imageUrl: 'https://images.unsplash.com/photo-1621531604538-9e557604b11f?q=80&w=1964&auto=format&fit=crop'
    },
    {
        id: 'essaouira-fortress',
        name: { en: 'Skala du Port', ar: 'صقالة الميناء' },
        city: { en: 'Essaouira', ar: 'الصويرة' },
        foundation: { en: '18th Century', ar: 'القرن الثامن عشر' },
        history: {
            en: 'A historic bastion guarding the port, showcasing a blend of European and Moroccan military architecture.',
            ar: 'حصن تاريخي يحرس الميناء، يمزج بين العمارة العسكرية الأوروبية والمغربية.'
        },
        visualSoul: 'Fortress',
        imageUrl: 'https://images.unsplash.com/photo-1622329778939-9d5de5914102?q=80&w=2048&auto=format&fit=crop'
    }
];
