export interface ArticleSection {
    title: { en: string; ar: string };
    content: { en: string; ar: string };
}

export interface MoroArticle {
    id: string;
    title: { en: string; ar: string };
    category: 'battle' | 'landmark' | 'city' | 'figure';
    metaDescription: { en: string; ar: string };
    intro: { en: string; ar: string };
    sections: ArticleSection[];
    conclusion: { en: string; ar: string };
}

// ============================================================
// UNIQUE HISTORICAL DATA FOR LANDMARKS & FIGURES
// ============================================================
export const moroverseArticles: Record<string, MoroArticle> = {
    'hassan-ii-mosque': {
        id: 'hassan-ii-mosque',
        title: { ar: 'مسجد الحسن الثاني: منارة الإسلام على المحيط', en: 'Hassan II Mosque: Islamic Beacon on the Atlantic' },
        category: 'landmark',
        metaDescription: {
            ar: 'تحفة المعمار المغربي الأصيل، مسجد الحسن الثاني بالدار البيضاء.',
            en: 'A masterpiece of authentic Moroccan architecture, the Hassan II Mosque in Casablanca.'
        },
        intro: {
            ar: 'يعد مسجد الحسن الثاني أعجوبة معمارية حديثة تجمع بين التراث الأندلسي العريق والتقنيات المعاصرة، مشيداً فوق مياه المحيط الأطلسي ليجسد الآية الكريمة "وكَانَ عَرْشُهُ عَلَى الْمَاءِ".',
            en: 'The Hassan II Mosque is a modern architectural marvel that blends ancient Andalusian heritage with contemporary techniques, built over the waters of the Atlantic to embody the Quranic verse "And His Throne was upon the water".'
        },
        sections: [
            {
                title: { ar: 'العبقرية الحرفية والمواد الأصيلة', en: 'Craftsmanship Genius and Authentic Materials' },
                content: {
                    ar: 'شارك في بناء المسجد آلاف المعلمين الزلايجيين والنحاتين والمبدعين المغاربة الذين أحيوا فنون "الزليج" و"الجبص" و"المنجور". كما استخدم الرخام والجرانيت المحلي ليؤكد الهوية الوطنية لهذا الصرح الديني والوطني.',
                    en: 'Thousands of master Zellige craftsmen, carvers, and Moroccan creators participated in building the mosque, reviving the arts of Zellige, plaster, and woodcarving. Local marble and granite were used to emphasize the national identity of this religious and national landmark.'
                }
            }
        ],
        conclusion: {
            ar: 'يظل المسجد رمزاً لانفتاح المغرب واعتزازه بجذوره الروحية.',
            en: 'The mosque remains a symbol of Morocco\'s openness and pride in its spiritual roots.'
        }
    },
    'fatima-al-fihriya': {
        id: 'fatima-al-fihriya',
        title: { ar: 'فاطمة الفهرية: أم البنين ومؤسسة أقدم جامعة في العالم', en: 'Fatima al-Fihriya: Mother of the Boys and Founder of the World\'s Oldest University' },
        category: 'figure',
        metaDescription: {
            ar: 'قصة السيدة التي وهبت مالها لبناء جامع وجامعة القرويين بفاس.',
            en: 'The story of the woman who donated her wealth to build the Al-Qarawiyyin Mosque and University in Fez.'
        },
        intro: {
            ar: 'في قلب مدينة فاس النابض بالحضارة، خلفت فاطمة الفهرية إرثاً علمياً غير مسبوق بتأسيسها لجامعة القرويين عام 859م، لتكون بذلك رائدة التعليم العالي في العالم التاريخي.',
            en: 'In the heart of the civilized city of Fez, Fatima al-Fihriya left an unprecedented scientific legacy by founding the University of Al-Qarawiyyin in 859 AD, becoming a pioneer of higher education in history.'
        },
        sections: [
            {
                title: { ar: 'جامعة القرويين: منارة العلم عبر العصور', en: 'Al-Qarawiyyin University: Beacon of Science Through the Ages' },
                content: {
                    ar: 'لم يكن القرويين مجرد مسجد للصلاة، بل تحول بفضل رؤية فاطمة الفهرية إلى مركز إشعاع فكري تخرج منه ابن خلدون وابن رشد والعديد من العلماء الذين شكلوا الفكر المعاصر. ظلت الجامعة تعمل باستمرار منذ تأسيسها، مما يجعلها أقدم مؤسسة تعليمية قائمة.',
                    en: 'Al-Qarawiyyin was not just a mosque for prayer, but transformed through Fatima al-Fihriya\'s vision into a center of intellectual radiance where Ibn Khaldun, Averroes, and many scholars who shaped modern thought graduated. The university has operated continuously since its founding, making it the oldest existing educational institution.'
                }
            }
        ],
        conclusion: {
            ar: 'تجسد فاطمة الفهرية قوة المرأة المغربية ودورها المحوري في صنع التاريخ.',
            en: 'Fatima al-Fihriya embodies the power of Moroccan women and their pivotal role in making history.'
        }
    },
    'zallaqa': {
        id: 'zallaqa',
        title: {
            ar: 'معركة الزلاقة: يوم اهتزت شبه الجزيرة الإيبيرية (1086م)',
            en: 'Battle of Zallaqa: The Day the Iberian Peninsula Shook (1086 AD)'
        },
        category: 'battle',
        metaDescription: {
            ar: 'اكتشف عبقرية يوسف بن تاشفين في معركة الزلاقة التي أنقذت الأندلس.',
            en: 'Discover the genius of Yusuf ibn Tashfin in the Battle of Zallaqa that saved Andalusia.'
        },
        intro: {
            ar: 'في سهل الزلاقة، التقى المرابطون بقيادة يوسف بن تاشفين بقوات قشتالة في مواجهة غيرت مجرى التاريخ الأندلسي والإنساني.',
            en: 'In the plains of Zallaqa, the Almoravids led by Yusuf ibn Tashfin met the forces of Castile in a confrontation that changed the course of Andalusian and human history.'
        },
        sections: [
            {
                title: { ar: 'التكتيك المرابطي وعبقرية الصمود', en: 'Almoravid Tactics and Genius of Resilience' },
                content: {
                    ar: 'تميزت المعركة باستخدام الطبول والحرب النفسية والتطويق المحكم، مما أدى لكسر شوكة القوات المعادية وحماية الوجود الإسلامي في الأندلس لأربعة قرون أخرى.',
                    en: 'The battle featured the use of drums, psychological warfare, and tight encirclement, leading to the breaking of the enemy forces and protecting the Islamic presence in Andalusia for four more centuries.'
                }
            }
        ],
        conclusion: {
            ar: 'تظل الزلاقة رمزاً للوحدة بين ضفتي المتوسط تحت راية المغرب.',
            en: 'Zallaqa remains a symbol of unity between the two shores of the Mediterranean under Morocco\'s flag.'
        }
    }
};

export const getArticle = (id: string, nameAr: string, nameEn: string, category: 'battle' | 'landmark' | 'city' | 'figure'): MoroArticle => {
    if (moroverseArticles[id]) return moroverseArticles[id];

    return {
        id,
        title: {
            ar: `${nameAr}: سجل الخلود المغربي`,
            en: `${nameEn}: Moroccan Eternal Record`
        },
        category,
        metaDescription: {
            ar: `تحليل تاريخي معمق حول ${nameAr} من خلال الأرشيف الرقمي لـ MoroVerse.`,
            en: `Deep historical analysis about ${nameEn} through MoroVerse Digital Archives.`
        },
        intro: {
            ar: `تمثل ${nameAr} صفحة مشرقة في تراث المملكة، تجسد من خلالها تلاحم التاريخ بالجغرافيا والقيم الوطنية الخالدة.`,
            en: `${nameEn} represents a bright page in the Kingdom's heritage, embodying the fusion of history, geography, and eternal national values.`
        },
        sections: [
            {
                title: {
                    ar: 'الأبعاد التاريخية والرمزية',
                    en: 'Historical and Symbolic Dimensions'
                },
                content: {
                    ar: `إن البحث في تاريخ ${nameAr} يكشف لنا عن عمق الهوية المغربية وتعدد روافدها الثقافية والدينية والسياسية، مما يجعلها مادة خصبة للدراسة والاعتزاز للأجيال القادمة.`,
                    en: `Research into the history of ${nameEn} reveals the depth of the Moroccan identity and the multiplicity of its cultural, religious, and political tributaries, making it a fertile subject for study and pride for future generations.`
                }
            }
        ],
        conclusion: {
            ar: `تظل ${nameAr} شاهدة على عظمة وإرادة أمة لا تلين.`,
            en: `${nameEn} remains a witness to the greatness and unyielding will of a nation.`
        }
    };
};
