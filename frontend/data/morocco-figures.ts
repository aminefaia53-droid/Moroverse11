export interface HistoricalFigure {
    id: string;
    name: { en: string; ar: string };
    category: 'Science' | 'Politics' | 'Resistance' | 'Arts' | 'Exploration';
    specialty: { en: string; ar: string };
    shortBio: { en: string; ar: string };
    era: { en: string; ar: string };
    imageUrl?: string;
}

export const moroccoFigures: HistoricalFigure[] = [
    {
        id: 'fatima-al-fihriya',
        name: { en: 'Fatima al-Fihriya', ar: 'فاطمة الفهرية' },
        category: 'Science',
        specialty: { en: 'Education & Philanthropy', ar: 'التعليم والعمل الخيري' },
        era: { en: '9th Century (Idrisid Era)', ar: 'القرن التاسع (العصر الإدريسي)' },
        shortBio: {
            en: 'Founder of the University of Al Quaraouiyine in Fez, recognized by Guinness World Records as the oldest existing, continually operating higher educational institution in the world.',
            ar: 'مؤسسة جامعة القرويين في فاس، والتي تعتبرها موسوعة جينيس أقدم مؤسسة تعليم عالٍ لا تزال تعمل في العالم.'
        },
        imageUrl: '/images/gallery/fatima-al-fihriya.png'
    },
    {
        id: 'sayyida-al-hurra',
        name: { en: 'Sayyida al-Hurra', ar: 'السيدة الحرة' },
        category: 'Politics',
        specialty: { en: 'Governance & Naval Command', ar: 'الحكم والقيادة البحرية' },
        era: { en: '16th Century', ar: 'القرن السادس عشر' },
        shortBio: {
            en: 'Queen of Tétouan and a prominent naval leader who controlled the western Mediterranean Sea during her reign.',
            ar: 'حاكمة تطوان وقائدة بحرية بارزة سيطرت على غرب البحر الأبيض المتوسط خلال فترة حكمها.'
        },
        imageUrl: '/images/gallery/sayyida-al-hurra.png'
    },
    {
        id: 'tariq-ibn-ziyad',
        name: { en: 'Tariq ibn Ziyad', ar: 'طارق بن زياد' },
        category: 'Resistance',
        specialty: { en: 'Military Strategy', ar: 'الاستراتيجية العسكرية' },
        era: { en: '8th Century', ar: 'القرن الثامن' },
        shortBio: {
            en: 'A renowned commander who led the Islamic conquest of Visigothic Hispania, famously associated with the Rock of Gibraltar (Jabal Tariq).',
            ar: 'قائد عسكري شهير قاد الفتح الإسلامي لشبه الجزيرة الأيبيرية، ويرتبط اسمه تاريخياً بجبل طارق.'
        },
        imageUrl: '/images/gallery/tariq-ibn-ziyad.png'
    },
    {
        id: 'ibn-battuta',
        name: { en: 'Ibn Battuta', ar: 'ابن بطوطة' },
        category: 'Exploration',
        specialty: { en: 'Geography & Travel Writing', ar: 'الجغرافيا وأدب الرحلات' },
        era: { en: '14th Century (Marinid Era)', ar: 'القرن الرابع عشر (العصر المريني)' },
        shortBio: {
            en: 'One of the greatest travelers in history, journeying across the Islamic world, Africa, Europe, and Asia over nearly three decades.',
            ar: 'من أعظم الرحالة في التاريخ، جاب العالم الإسلامي، إفريقيا، أوروبا، وآسيا على مدى قرابة ثلاثة عقود.'
        },
        imageUrl: '/images/gallery/ibn-battuta.png'
    }
];
