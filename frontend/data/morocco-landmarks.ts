export interface Landmark {
    id: string;
    name: { en: string; ar: string };
    city: { en: string; ar: string };
    foundation: { en: string; ar: string };
    history: { en: string; ar: string };
    visualSoul: 'Mosque' | 'Tower' | 'Palace' | 'Ruin' | 'Cave' | 'Lighthouse' | 'Fortress';
    imageUrl?: string;
}

export const moroccoLandmarks: Landmark[] = [
    {
        id: 'hassan-ii-mosque',
        name: { en: 'Hassan II Mosque', ar: 'مسجد الحسن الثاني' },
        city: { en: 'Casablanca', ar: 'الدار البيضاء' },
        foundation: { en: '20th Century', ar: 'القرن العشرين' },
        history: {
            en: 'One of the largest mosques in the world, featuring the tallest minaret and stunning Atlantic views.',
            ar: 'واحد من أكبر المساجد في العالم، يتميز بأعلى مئذنة وإطلالة ساحرة على المحيط الأطلسي.'
        },
        visualSoul: 'Mosque'
    },
    {
        id: 'hassan-tower',
        name: { en: 'Hassan Tower', ar: 'صومعة حسان' },
        city: { en: 'Rabat', ar: 'الرباط' },
        foundation: { en: '12th Century (Almohad Era)', ar: 'القرن الثاني عشر (العصر الموحدي)' },
        history: {
            en: 'The minaret of an incomplete mosque intended to be the largest in the Islamic world.',
            ar: 'مئذنة مسجد غير مكتمل كان يراد له أن يكون الأكبر في العالم الإسلامي.'
        },
        visualSoul: 'Tower'
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
        visualSoul: 'Palace'
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
        visualSoul: 'Ruin'
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
        visualSoul: 'Cave'
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
        visualSoul: 'Lighthouse'
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
        visualSoul: 'Fortress'
    }
];
