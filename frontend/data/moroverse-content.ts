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
    videoUrl?: string;
    gallery?: string[];
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
        },
        videoUrl: 'https://cdn.pixabay.com/video/2020/07/04/43896-437525287_large.mp4',
        gallery: [
            'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1563825828551-fb18e47aa571?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549429440-660c608fba63?q=80&w=2070&auto=format&fit=crop'
        ]
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
        },
        videoUrl: 'https://cdn.pixabay.com/video/2021/08/18/85449-590059343_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/e/e4/The_Qarawiyyin_Mosque%2C_Fez%2C_Morocco.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/0/02/Bou_Inania_Madrasa_Courtyard_Fez.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/8/87/Fez_Zellige_details.jpg'
        ]
    },
    'sayyida-al-hurra': {
        id: 'sayyida-al-hurra',
        title: { ar: 'السيدة الحرة: ملكة تطوان وأديرة البحر', en: 'Sayyida al-Hurra: Queen of Tetouan and Mediterranean Commander' },
        category: 'figure',
        metaDescription: {
            ar: 'اكتشف قصة حاكمة تطوان والقائدة البحرية القوية.',
            en: 'Discover the story of the powerful Governor of Tetouan and Naval Commander.'
        },
        intro: {
            ar: 'تُعد السيدة الحرة واحدة من أهم الشخصيات السياسية والقيادية في تاريخ المغرب خلال القرن السادس عشر، حيث حكمت تطوان بذكاء وقوة وواجهت الأطماع الأوروبية في البحر.',
            en: 'Sayyida al-Hurra is one of the most important political and leadership figures in Morocco\'s history during the 16th century, ruling Tetouan with intelligence and power and facing European ambitions at sea.'
        },
        sections: [
            {
                title: { ar: 'حكم تطوان والتحالفات الإستراتيجية', en: 'Ruling Tetouan and Strategic Alliances' },
                content: {
                    ar: 'أعادت بناء مدينة تطوان وجعلتها مركزاً للمقاومة والجهاد البحري، وتحالفت مع الإخوة بربروسا لتأمين السواحل المغربية من الغزوات البرتغالية والإسبانية.',
                    en: 'She rebuilt the city of Tetouan and made it a center for maritime resistance and jihad, allying with the Barbarossa brothers to secure the Moroccan coasts from Portuguese and Spanish invasions.'
                }
            }
        ],
        conclusion: {
            ar: 'تظل السيدة الحرة رمزاً للسيادة والشموخ المغربي في مواجهة التحديات الكبرى.',
            en: 'Sayyida al-Hurra remains a symbol of Moroccan sovereignty and loftiness in the face of great challenges.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5361-182312675_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Tetouan_Medina.jpg/1200px-Tetouan_Medina.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/2/23/Martil_beach_and_mountains.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/a/ad/Moroccan_navy_ship.jpg'
        ]
    },
    'tariq-ibn-ziyad': {
        id: 'tariq-ibn-ziyad',
        title: { ar: 'طارق بن زياد: فاتح الأندلس وقائد الملحمة', en: 'Tariq ibn Ziyad: The Conqueror of Andalusia and Epic Leader' },
        category: 'figure',
        metaDescription: {
            ar: 'سيرة القائد الأمازيغي طارق بن زياد وفتحه للأندلس.',
            en: 'Biography of the Berber commander Tariq ibn Ziyad and his conquest of Andalusia.'
        },
        intro: {
            ar: 'طارق بن زياد، ابن جبال الريف المغربية، هو القائد الذي عبر مضيق جبل طارق ليغير وجه أوروبا والعالم الإسلامي إلى الأبد بفتحه للأندلس.',
            en: 'Tariq ibn Ziyad, son of the Moroccan Rif mountains, is the commander who crossed the Strait of Gibraltar to forever change the face of Europe and the Islamic world with his conquest of Andalusia.'
        },
        sections: [
            {
                title: { ar: 'جبل طارق: الصخرة التي تحمل اسمه', en: 'Gibraltar: The Rock that Bears His Name' },
                content: {
                    ar: 'يُعتبر جبل طارق (جبل طارق بن زياد) شاهداً أبدياً على ملحمته العسكرية، حيث ألقى خطبته الشهيرة وأحرق السفن ليخيّر جنده بين الصمود أو الاستشهاد.',
                    en: 'The Rock of Gibraltar (Jabal Tariq ibn Ziyad) is considered an eternal witness to his military epic, where he delivered his famous speech and burned the ships to give his soldiers the choice between resilience or martyrdom.'
                }
            }
        ],
        conclusion: {
            ar: 'طارق بن زياد يمثل روح العزيمة والذكاء العسكري المغربي الأصيل.',
            en: 'Tariq ibn Ziyad represents the spirit of Moroccan military determination and intelligence.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2021/02/09/64516-511244199_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Gibraltar1.jpg/1200px-Gibraltar1.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/La_mezquita-catedral_de_C%C3%B3rdoba_-_panoramio_%283%29.jpg/1200px-La_mezquita-catedral_de_C%C3%B3rdoba_-_panoramio_%283%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/4/41/Strait_of_Gibraltar_from_space.jpg'
        ]
    },
    'ibn-battuta': {
        id: 'ibn-battuta',
        title: { ar: 'ابن بطوطة: رحالة الزمن وسفير الحضارة المغربية', en: 'Ibn Battuta: The Time Traveler and Ambassador of Moroccan Civilization' },
        category: 'figure',
        metaDescription: {
            ar: 'أعظم رحالة في التاريخ، محمد بن عبد الله الطنجي المعروف بابن بطوطة.',
            en: 'The greatest traveler in history, Muhammad ibn Abdullah al-Tanji, known as Ibn Battuta.'
        },
        intro: {
            ar: 'خرج ابن بطوطة من طنجة شاباً ليطوف العالم، قاطعاً آلاف الأميال ليوثق بذكائه وفضوله حياة الشعوب وحضاراتها في العصور الوسطى.',
            en: 'Ibn Battuta left Tangier as a young man to travel the world, crossing thousands of miles to document the lives and civilizations of peoples in the Middle Ages with his intelligence and curiosity.'
        },
        sections: [
            {
                title: { ar: 'تحفة النظار: الأرشيف العالمي للرحلة', en: 'Tuhfat al-Nuzzar: The Global Travel Archive' },
                content: {
                    ar: 'وثّق ابن بطوطة رحلته في كتابه الشهير، مقدماً وصفاً دقيقاً للهند والصين وإفريقيا، مما جعله مرجعاً أساسياً للمؤرخين والجغرافيين عبر العصور.',
                    en: 'Ibn Battuta documented his journey in his famous book, providing a detailed description of India, China, and Africa, making him an essential reference for historians and geographers through the ages.'
                }
            }
        ],
        conclusion: {
            ar: 'ابن بطوطة هو رمز الانفتاح المغربي على العالم والبحث المستمر عن المعرفة.',
            en: 'Ibn Battuta is a symbol of Moroccan openness to the world and the continuous search for knowledge.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2016/08/22/4740-180126297_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/4/4c/Map_of_Ibn_Battuta%27s_travels.png',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Tangier_Medina.jpg/1200px-Tangier_Medina.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/a/af/Sahara_Desert_Morocco.jpg'
        ]
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
        },
        videoUrl: 'https://cdn.pixabay.com/video/2019/08/08/25854-351855662_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Alhambra_Generalife_Garden_02.jpg/1200px-Alhambra_Generalife_Garden_02.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/2/27/Cavalry_charge_historical_reenactment.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/d/df/Almoravid_dinar_of_Yusuf_ibn_Tashfin.jpg'
        ]
    },
    'marrakech': {
        id: 'marrakech',
        title: { ar: 'مراكش: عاصمة الإمبراطورية والمدينة الحمراء', en: 'Marrakech: The Empire Capital and the Red City' },
        category: 'city',
        metaDescription: {
            ar: 'تاريخ مراكش العريق من عهد المرابطين إلى اليوم.',
            en: 'The rich history of Marrakech from the Almoravid era to the present day.'
        },
        intro: {
            ar: 'تعد مراكش، المدينة التي أسسها يوسف بن تاشفين عام 1062م، القلب النابض للمغرب ومركزاً لإشعاع حضاري امتد من الأندلس إلى ما وراء الصحراء.',
            en: 'Marrakech, founded by Yusuf ibn Tashfin in 1062 AD, is the beating heart of Morocco and a center of a civilization that spanned from Andalusia to beyond the Sahara.'
        },
        sections: [
            {
                title: { ar: 'ساحة جامع الفنا: مسرح الذاكرة الشعبية', en: 'Jemaa el-Fnaa: The Theater of Folk Memory' },
                content: {
                    ar: 'ليست مجرد ساحة، بل هي فضاء مفتوح للحكواتيين والموسيقيين والحرفيين، تعكس التنوع الثقافي المغربي العميق وقد صُنفت كتحفة للتراث الشفهي للإنسانية.',
                    en: 'It is not just a square, but an open space for storytellers, musicians, and craftsmen, reflecting deep Moroccan cultural diversity and classified as a masterpiece of the oral heritage of humanity.'
                }
            }
        ],
        conclusion: {
            ar: 'مراكش تظل قبلة للعالم، تجمع بين سحر التاريخ وحيوية المستقبل.',
            en: 'Marrakech remains a destination for the world, combining the charm of history with the vitality of the future.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2021/08/02/83489-583196964_large.mp4',
        gallery: [
            'https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=2074&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop'
        ]
    },
    'casablanca': {
        id: 'casablanca',
        title: { ar: 'الدار البيضاء: ملتقى الحداثة والتاريخ', en: 'Casablanca: The Confluence of Modernity and History' },
        category: 'city',
        metaDescription: {
            ar: 'استكشف روح الدار البيضاء، عاصمة المغرب الاقتصادية.',
            en: 'Explore the soul of Casablanca, Morocco\'s economic capital.'
        },
        intro: {
            ar: 'الدار البيضاء (أنفا قديماً) هي المدينة التي تجسد المغرب الحديث، بروحها الاقتصادية القوية ومعمارها الذي يمزج بين "الآرت ديكو" والأصالة المغربية.',
            en: 'Casablanca (formerly Anfa) is the city that embodies modern Morocco, with its strong economic spirit and architecture that blends Art Deco with Moroccan authenticity.'
        },
        sections: [
            {
                title: { ar: 'أنفا: من مرفأ القرون الوسطى إلى مدينة المستقبل', en: 'Anfa: From Medieval Harbor to City of the Future' },
                content: {
                    ar: 'يعود تاريخ المدينة إلى العصر البربري حيث عُرفت بأنفا، وشهدت تحولات كبرى جعلتها اليوم مركزاً عالمياً للمال والأعمال مع الحفاظ على بصمتها الروحية بمسجد الحسن الثاني.',
                    en: 'The city\'s history dates back to the Berber era when it was known as Anfa, and it witnessed major transformations that made it today a global financial and business hub while maintaining its spiritual imprint through the Hassan II Mosque.'
                }
            }
        ],
        conclusion: {
            ar: 'الدار البيضاء هي واجهة المغرب على العالم ومحرك مستقبله.',
            en: 'Casablanca is Morocco\'s gateway to the world and the engine of its future.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2020/07/04/43896-437525287_large.mp4',
        gallery: [
            'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1563825828551-fb18e47aa571?q=80&w=2070&auto=format&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/b/ba/Casablanca_Twin_Center.jpg'
        ]
    },
    'chefchaouen': {
        id: 'chefchaouen',
        title: { ar: 'شفشاون: الجوهرة الزرقاء في قلب الريف', en: 'Chefchaouen: The Blue Pearl in the Heart of the Rif' },
        category: 'city',
        metaDescription: {
            ar: 'استكشف سحر شفشاون، المدينة الزرقاء المغربية.',
            en: 'Explore the charm of Chefchaouen, the Moroccan Blue City.'
        },
        intro: {
            ar: 'شفشاون، المدينة التي تأسر القلوب بلونها الأزرق السماوي وهدوئها الجبلي، تأسست عام 1471م كحصن للمجاهدين ضد الأطماع الأوروبية.',
            en: 'Chefchaouen, the city that captures hearts with its sky-blue color and mountain serenity, was founded in 1471 AD as a fortress for mujahideen against European ambitions.'
        },
        sections: [
            {
                title: { ar: 'اللون الأزرق: رمز الصفاء والحماية', en: 'The Blue Color: Symbol of Purity and Protection' },
                content: {
                    ar: 'يشتهر سكان شفشاون بطلاء منازلهم وشوارعهم بظلال اللون الأزرق، وهو تقليد يعكس روح الصفا والسكينة، ويجعل من المشي في أزقتها تجربة بصرية فريدة لا تُنسى.',
                    en: 'The residents of Chefchaouen are famous for painting their homes and streets with shades of blue, a tradition that reflects the spirit of purity and tranquility, making walking through its alleys a unique and unforgettable visual experience.'
                }
            }
        ],
        conclusion: {
            ar: 'شفشاون تظل ملاذاً للهدوء وجمال الطبيعة المغربية.',
            en: 'Chefchaouen remains a sanctuary of calm and the beauty of Moroccan nature.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2019/12/03/30018-379101662_large.mp4',
        gallery: [
            'https://images.unsplash.com/photo-1549429440-660c608fba63?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1552044807-ad1343ad8f5e?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1545638706-5384bcbe2c3f?q=80&w=2070&auto=format&fit=crop'
        ]
    },
    'tangier': {
        id: 'tangier',
        title: { ar: 'طنجة: بوابة البحرين وملتقى الثقافات', en: 'Tangier: The Gateway of Two Seas and Crossroads of Cultures' },
        category: 'city',
        metaDescription: {
            ar: 'اكتشف تاريخ طنجة الدولي وموقعها الاستراتيجي.',
            en: 'Discover Tangier\'s international history and strategic location.'
        },
        intro: {
            ar: 'طنجة، المدينة التي يتقابل فيها الأطلسي والمتوسط، هي نافذة المغرب على العالم وتاريخ من التعايش الدولي والتبادل الثقافي عبر العصور.',
            en: 'Tangier, the city where the Atlantic and Mediterranean meet, is Morocco\'s window to the world and a history of international coexistence and cultural exchange through the ages.'
        },
        sections: [
            {
                title: { ar: 'مغارة هرقل: الأسطورة والواقع', en: 'Hercules Caves: Myth and Reality' },
                content: {
                    ar: 'تعد مغارة هرقل من أبرز معالم طنجة، حيث تمتزج الأساطير اليونانية بجمال الطبيعة، وتوفر إطلالة ساحرة على المحيط تشبه خريطة إفريقيا.',
                    en: 'Hercules Caves are among Tangier\'s most prominent landmarks, where Greek myths blend with natural beauty, providing an enchanting view of the ocean resembling the map of Africa.'
                }
            }
        ],
        conclusion: {
            ar: 'طنجة هي مدينة الإبداع والانفتاح الدائم.',
            en: 'Tangier is a city of creativity and continuous openness.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2021/08/18/85449-590059343_large.mp4',
        gallery: [
            'https://images.unsplash.com/photo-1542456637-cd58ae01c5ef?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1563825828551-fb18e47aa571?q=80&w=2070&auto=format&fit=crop',
            'https://upload.wikimedia.org/wikipedia/commons/e/ec/Tangier_Coast.jpg'
        ]
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
        },
        videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5361-182312675_large.mp4',
        gallery: [
            'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549429440-660c608fba63?q=80&w=2070&auto=format&fit=crop'
        ]
    };
};
