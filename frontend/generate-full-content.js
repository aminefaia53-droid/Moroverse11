const fs = require('fs');
const path = require('path');

// ============================================================
// CINEMATIC IMAGE REGISTRY — Curated HD Unsplash + Epic Images
// Images selected for semantic hyper-relevance to each entity
// All use Ken Burns animation via generatedImage field
// ============================================================
const IMAGE_REGISTRY = {
    // Phase 3 — Original 8K Generated
    'tangier': '/images/epic/tangier_cinematic_1772056832346.png',
    'battle-of-isly': '/images/epic/isly_cinematic_1772056874035.png',
    'hassan-ii-mosque': '/images/epic/hassan2_cinematic_1772056915559.png',
    'targuist': '/images/epic/targuist_cinematic_1772056957865.png',
    'al-qarawiyyin': '/images/epic/qarawiyyin_cinematic_1772057010427.png',
    'fez': '/images/epic/fez_cinematic.png',
    // Landmarks — Curated HD
    'hassan-tower': 'https://images.unsplash.com/photo-1644331049219-c09a803e1e55?q=80&w=2070&auto=format&fit=crop',
    'el-badi-palace': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=2070&auto=format&fit=crop',
    'volubilis': 'https://images.unsplash.com/photo-1629747387925-6905ff5a558a?q=80&w=2070&auto=format&fit=crop',
    'hercules-caves': 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2021&auto=format&fit=crop',
    'essaouira-fortress': 'https://images.unsplash.com/photo-1622329778939-9d5de5914102?q=80&w=2048&auto=format&fit=crop',
    'boujdour-lighthouse': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=2070&auto=format&fit=crop',
    // Cities — Curated HD
    'marrakech': 'https://images.unsplash.com/photo-1597212618440-806262de4f3b?q=80&w=2070&auto=format&fit=crop',
    'chefchaouen': 'https://images.unsplash.com/photo-1548625361-19a9e748882a?q=80&w=2070&auto=format&fit=crop',
    'casablanca': 'https://images.unsplash.com/photo-1582236353904-7431c4cbcf33?q=80&w=2070&auto=format&fit=crop',
    'rabat': 'https://images.unsplash.com/photo-1644331049219-c09a803e1e55?q=80&w=1964&auto=format&fit=crop',
    'ouarzazate': 'https://images.unsplash.com/photo-1539668512229-ef442c00f8d2?q=80&w=2070&auto=format&fit=crop',
    'agadir': 'https://images.unsplash.com/photo-1541484842121-cc51da4ba69e?q=80&w=2070&auto=format&fit=crop',
    'essaouira': 'https://images.unsplash.com/photo-1622329778939-9d5de5914102?q=80&w=2048&auto=format&fit=crop',
    'meknes': 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=2070&auto=format&fit=crop',
    // Figures — Curated HD
    'fatima-al-fihriya': 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2070&auto=format&fit=crop',
    'ibn-battuta': 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=2070&auto=format&fit=crop',
    'tariq-ibn-ziyad': 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop',
    'sayyida-al-hurra': 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1964&auto=format&fit=crop',
    // Battles
    'battle-three-kings': 'https://images.unsplash.com/photo-1553532434-5ab5b6b84993?q=80&w=2070&auto=format&fit=crop',
    'battle-khenifra': 'https://images.unsplash.com/photo-1584268929323-3e1d9e15f4db?q=80&w=2070&auto=format&fit=crop',
};

// ============================================================
// EPIC ARTICLES DATABASE
// ============================================================
const ARTICLES = {
    // === LANDMARKS ===
    'hassan-tower': {
        title: { ar: 'صومعة حسان: حلم الموحدين الخالد في قلب الرباط', en: 'Hassan Tower: The Eternal Almohad Dream in the Heart of Rabat' },
        category: 'landmark',
        metaDescription: {
            ar: 'صومعة حسان بالرباط، مئذنة القرن الثاني عشر الشاهدة على طموح الحضارة الموحدية العظيمة.',
            en: 'Hassan Tower in Rabat, 12th-century minaret witnessing the grand ambition of Almohad civilization.'
        },
        intro: {
            ar: 'تتربع صومعة حسان شامخة في برزخ الرباط ببهجة الكبرياء والصمود عبر عشرة قرون متواصلة. بُنيت في عهد السلطان الموحدي يعقوب المنصور لتكون مئذنة مسجد ضخم يستوعب أربعين ألف مصلٍّ، وهو مشروع رهب الزمان ولم يكتمل بسبب وفاة بانيه عام 1199. لكن ما شُيِّد منها — تلك المئذنة الحمراء الشاهقة والأعمدة الرخامية المتناثرة كأسنة تحدٍّ للفناء — أصبح أبلغ الشواهد على نبوغ المعماريين الموحدين وعبقريتهم الهندسية الخالدة.',
            en: 'Hassan Tower stands proudly in the Rabat promontory as a monument to a decade of centuries of resilience. Built by Almohad Sultan Yaqub al-Mansur to house 40,000 worshippers in a single mosque, its uncompleted story became the most eloquent testament to Almohad architectural genius.'
        },
        sections: [
            {
                title: { ar: 'الهندسة الموحدية: كمال في اللاتمام', en: 'Almohad Architecture: Perfection in Incompleteness' },
                content: {
                    ar: 'يبلغ ارتفاع المئذنة الحالية نحو أربعة وأربعين متراً من أصل مئة وثمانية وستين متراً مخططة، لتكون لو اكتملت الأطول في العالم الإسلامي متقدمة على الكتبية بمراكش ومتجاوزة أعظم مآذن إشبيلية. يتميز البناء بنقوشه الزخرفية المتعددة والمختلفة على كل وجه من الوجوه الأربعة، وهو تصميم مقصود يُجسِّد التنوع في الوحدة. الحجر الرملي الأحمر المستخدم في البناء يتغير لونه بحسب حدة الضوء من حمرة دافئة عند الغروب إلى رمادية رصينة في الصباح الباكر، مما يجعل المشهد آية من آيات الجمال الهندسي الطبيعي التلقائي.',
                    en: 'The current tower stands 44 meters of its planned 168-meter height, which would have surpassed the Koutoubia and the Giralda of Seville. Its four faces bear four distinct geometric patterns — symbolizing unity in diversity. The red sandstone changes hue from warm crimson at sunset to calm grey at dawn.'
                }
            },
            {
                title: { ar: 'الزلزال والصمود: قصة ما بقي بعد 1755', en: 'The Earthquake and Resilience: What Survived 1755' },
                content: {
                    ar: 'ضرب زلزال عام 1755 م الكارثي — الذي أودى بريسبون والمدن السواحلية الأطلسية — الرباط بقوة مدمرة أسقطت الجزء الأعلى من الصومعة وأحالت الجدران الداخلية للمسجد ركاماً. لكن الأعمدة التي لم تكتمل والصرح الناقص صمدا صمود الإيمان بأرض الحضارة المغربية، ليُعلنا أن ما بناه الموحدون لم يكن بناء من حجر وحسب، بل بناء من روح أمة لا تعرف الانكسار الدائم ولا التراجع المقيم أمام قسوة الطبيعة وعوادي الدهر. اليوم، يضم الموقع المحيط بالصومعة ضريح محمد الخامس الملكي المهيب بتصميمه الأندلسي المغربي الرفيع الذي يجسِّد ذاك الاستمرار التاريخي الحضاري المتسق والمتصل.',
                    en: 'The catastrophic 1755 earthquake toppled the towers upper section and collapsed the inner mosque walls, yet the column forest and remaining structure stood defiantly. Today the site encompasses the majestic Mausoleum of Mohammed V, embodying Morocco\'s unbroken historical continuity.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'لماذا لم يكتمل بناء مسجد حسان الموحدي العظيم؟', en: 'Why was the grand Almohad Hassan Mosque never completed?' },
                answer: { ar: 'توفي السلطان يعقوب المنصور الموحدي عام 1199 قبل إتمام المشروع العملاق، وخلفاؤه لم يعودوا لاستكماله بسبب التحولات السياسية والحروب المتواترة، فبقيت الصومعة شاهداً على حلم ضخم تجمّد في منتصف الطريق كما هو.', en: 'Sultan Yaqub al-Mansur died in 1199 before project completion, and his successors never resumed construction due to political upheaval and wars, leaving the tower as an eternal monument to an unfulfilled yet magnificent dream.' }
            },
            {
                question: { ar: 'ما علاقة صومعة حسان بصومعة الكتبية ومنارة إشبيلية؟', en: 'What is the connection between Hassan Tower, Koutoubia, and Giralda of Seville?' },
                answer: { ar: 'الثلاثة شُيِّدت في عهد الموحدين وفق نمط معماري موحد، وتُعدّ توأمين في الفن المعماري الإسلامي المغربي-الأندلسي الرائع. صومعة حسان كانت ستكون الأضخم والأعلى لو اكتملت البناء.', en: 'All three were built under Almohad rule following a unified architectural blueprint, representing the finest Moroccan-Andalusian Islamic art. Hassan Tower would have been the tallest and most imposing had it been completed.' }
            },
            {
                question: { ar: 'هل يمكن دخول الصومعة من الداخل والصعود إلى أعلاها للزوار؟', en: 'Can visitors access and climb inside the tower?' },
                answer: { ar: 'لا، الصومعة مغلقة أمام العموم للحفاظ عليها. لكن المحيط الواسع بها مفتوح مجاناً ويتيح رؤية الأعمدة المئة وثمانية وثمانين وضريح محمد الخامس المطل الملكي المجيد.', en: 'No, the tower interior is closed to preserve it. The surrounding esplanade with 178 columns and the majestic Royal Mausoleum of Mohammed V are freely accessible.' }
            }
        ],
        conclusion: {
            ar: 'صومعة حسان شاهد عادل على أن الأعظم في التاريخ ليس ما اكتمل دوماً، بل ما ترك فينا قدرةَ التأمل في مجد الذين سبقونا وحلموا أحلاماً بحجم السماء.',
            en: 'Hassan Tower proves that the greatest monuments in history are not always those completed, but those that inspire perpetual awe for the dreams of those who came before us.'
        }
    },

    'volubilis': {
        title: { ar: 'وليلي: عاصمة الموريتانيين والرومان الغارقة في ذاكرة الحجارة', en: 'Volubilis: The Mauretanian-Roman Capital Submerged in Stone Memory' },
        category: 'landmark',
        metaDescription: {
            ar: 'وليلي المدرجة في التراث العالمي لليونسكو، أقدم وأهم الحواضر الأمازيغية الرومانية في المغرب.',
            en: 'Volubilis, UNESCO World Heritage city — the oldest and most important Amazigh-Roman metropolis in Morocco.'
        },
        intro: {
            ar: 'لو أنصتت جيداً في سهول زرهون الخصيبة قرب مكناس البهجة، لسمعت وقع أقدام الحشد الذي كان حياً من القرن الثالث قبل الميلاد حتى انحسار الوجود الروماني. وليلي — واسمها الأمازيغي يعني "الدفلى" — كانت عاصمة مملكة موريتانيا الطنجية الموالية لروما، مدينة تجمع فيها التراثان الأمازيغي والروماني في انسجام نادر المثال. إنها ليست مجرد خرائب، بل هي نص مكتوب بالحجارة والفسيفساء والأعمدة يُروي الصفحة الأولى للتاريخ المغربي المكتوب قبل الإسلام.',
            en: 'Listen carefully amid the fertile Zerhoun plains near Meknes and you will hear the footsteps of a crowd alive from the 3rd century BC until the retreat of Roman presence. Volubilis — its Amazigh name meaning oleander — was the capital of Mauritania Tingitana, where Amazigh and Roman heritages merged in rare harmony.'
        },
        sections: [
            {
                title: { ar: 'الفسيفساء: نوافذ ملونة على حياة الرومان في المغرب', en: 'The Mosaics: Colorful Windows into Roman Life in Morocco' },
                content: {
                    ar: 'يمتلك موقع وليلي أكثر من ثلاثين لوحة فسيفسائية محفوظة بين أفضل ما عرفه العالم القديم، تصور مشاهد من الأساطير الإغريقية كديونيسوس وإيريني وأورفيوس يعزف على قيثارته. هذه اللوحات لم تكن مجرد ديكور فاخر ترفي لدور الأثرياء، بل كانت برامج ثقافية كاملة تحكي لزوار البيوت عن عوالم الإله والإنسان والطبيعة بلغة بصرية عالمية تتحدى الزمن ولا تشيخ. فسيفساء قاعة أوفيوس في بيت العمود تبقى من أكثر القطع إبهاراً وتكاملاً وغنى تفصيلياً حتى اليوم في العالم القديم برمته.',
                    en: 'Volubilis holds over thirty of the best-preserved floor mosaics of the ancient world, depicting myths of Dionysus, Orpheus, and Bacchus. These were powerful cultural programs narrating divine and human worlds in a visual language that defies time. The Orpheus mosaic in the House of Orpheus remains one of the most stunning and detailed works of the ancient world.'
                }
            },
            {
                title: { ar: 'المدينة بعد روما: الاستمرار الأمازيغي والإدريسي', en: 'The City After Rome: Amazigh and Idrisid Continuity' },
                content: {
                    ar: 'حين انسحب الرومان عام 285 ميلادية، لم تمت وليلي. بقيت مزدهرة في ظل الأمازيغ الأحرار ثم استقبلت إدريس الأول مؤسس الدولة الإدريسية فاراً من المشرق عام 788 ميلادية، وجعل منها ملاذاً لقيام الدولة المغربية الأولى. لقد ظلت وليلي آهلة بالسكان قرابة خمسة عشر قرناً متواصلة قبل أن يتفضل المولى إسماعيل بنهب حجارتها لبناء مكناس البهية في القرن السابع عشر. الزلزال اللاحق عام 1755 أتم ما تركه التقادم والاستخدام البشري.',
                    en: 'When Rome retreated in 285 AD, Volubilis did not die. It flourished under free Amazigh rulers and welcomed Idris I — founder of Morocco\'s first Islamic dynasty — in 788 AD. The city remained inhabited continuously for fifteen centuries until Moulay Ismail quarried its stones for Meknes, followed by the 1755 earthquake.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'متى وكيف اكتُشفت وليلي من جديد في العصر الحديث؟', en: 'When and how was Volubilis rediscovered in modern times?' },
                answer: { ar: 'بدأت الحفريات الأثرية الجادة في العهد الفرنسي إبان أوائل القرن العشرين، ومنذ عام 1997 صنفتها اليونسكو ضمن مواقع التراث الإنساني العالمي بسبب أهميتها الاستثنائية في التراث الأمازيغي-الروماني.', en: 'Serious archaeological excavations began in the early 20th century under the French Protectorate. Since 1997, UNESCO classified it as a World Heritage Site for its exceptional importance to Amazigh-Roman heritage.' }
            },
            {
                question: { ar: 'كيف حافظت الفسيفساء على ألوانها وتفاصيلها لألفي عام؟', en: 'How have the mosaics preserved their colors and details for 2000 years?' },
                answer: { ar: 'الطمر الطبيعي بالتراب والرمال حمى قطع الفسيفساء من عوامل التعرية الجوية طوال قرون. فقط بعد الكشف والتنقيب بدأت تحديات الحفاظ عليها في الهواء الطلق تتراكم وتستدعي عناية مستمرة.', en: 'Natural burial beneath soil and sand protected the mosaic pieces from weathering for centuries. Post-excavation exposure introduced conservation challenges that require continuous professional maintenance.' }
            },
            {
                question: { ar: 'هل إدريس الأول أسس دولته المغربية في وليلي فعلاً؟', en: 'Did Idris I truly found his Moroccan state at Volubilis?' },
                answer: { ar: 'نعم، فر إدريس الأول من العباسيين ولجأ إلى وليلي عام 788 ميلادية حيث بايعه سكان المنطقة من قبائل أوربة الأمازيغية، وكانت انطلاقة الدولة الإدريسية الأولى قبل نقل العاصمة لفاس.', en: 'Yes, Idris I fled the Abbasids and took refuge in Volubilis in 788 AD, where the Amazigh Awraba tribe pledged allegiance to him, launching the first Moroccan Idrisid state before its capital moved to Fez.' }
            }
        ],
        conclusion: {
            ar: 'وليلي ليست مجرد حجارة موزعة على سهل خصيب. إنها نبض الهوية المغربية العميقة التي تضرب جذورها ما قبل الفتح الإسلامي لتبرهن أن المغرب حضارة، لا مجرد جغرافيا.',
            en: 'Volubilis is not merely scattered stones on a fertile plain. It is the pulse of a deep Moroccan identity rooted before the Islamic conquest, proving that Morocco is a civilization, not merely a geography.'
        }
    },

    // === CITIES ===
    'marrakech': {
        title: { ar: 'مراكش: المدينة الحمراء وحاضرة الأسرار الملكية', en: 'Marrakech: The Red City and Capital of Royal Secrets' },
        category: 'city',
        metaDescription: {
            ar: 'مراكش المدينة الحمراء، تاج العمارة الأمازيغية والسعدية. استكشف جامع الفنا وكتبيتها الشاهقة وأسرار قصر البديع.',
            en: 'Marrakech Red City — crown of Amazigh and Saadian architecture. Explore Jemaa el-Fna, the soaring Koutoubia, and secrets of El Badi Palace.'
        },
        intro: {
            ar: 'تقبع مراكش الحمراء في داخل السهل الهادئ بسفح جبال الأطلس الكبير الشاهقة كأميرة تلبس ثوب التراب المغرة الأحمر، وتحت درقة نخيلها المترامية تخفي في جلبابها أسرار ألف عام حافلة بالملوك والفنانين والمتصوفة والتجار القادمين من الصحراء الكبرى. هي البكر من عجائب الجنوب المغربي ومنارة الثقافة الأمازيغية والعربية والإفريقية، جمعت بين قصور السعديين ومدارس الموحدين ودروب المرابطين في نسيج متشابك لا يفك خيوطه إلا من أمضى زمناً طويلاً في أزقتها المتعرجة الشيِّقة.',
            en: 'Marrakech sits in the quiet plains below the High Atlas like a princess dressed in ochre red earth, hiding beneath its palm canopy a thousand years of kings, artists, Sufis, and desert merchants. It is Morocco\'s cultural crown, weaving together Almohad, Saadian, and Almoravid legacies in a labyrinthine tapestry only deciphered by those who linger in its beguiling alleyways.'
        },
        sections: [
            {
                title: { ar: 'جامع الفنا: مسرح الإنسانية الذي لا يُغلق ستاره أبداً', en: 'Jemaa el-Fna: The Eternal Stage of Humanity' },
                content: {
                    ar: 'صنَّفت اليونسكو جامع الفنا في قائمة التراث الثقافي غير المادي للإنسانية، وهو تصنيف لم يناله أي ميدان آخر في العالم بهذه المكانة الحضارية. في النهار تتلاشى خلفية الإفريقي والسياح المتصنتين للحكواتيين، ورقصات الثعابين المسحورة، وعروض الغيوان ومنافسات الطيور. وفي المساء تتبدل تلك اللوحة تحولاً درامياً — تنبثق مئات المدافئ والعربات، وتتصاعد أعمدة الدخان الكثيف من شوايات اللحم والأسماك، وتعزف الفرق الموسيقية الجناوية والطوارقية في آن واحد ليتشكل كوكتيل حواسّي لا يُنسى ولا تجده في أي بقعة أخرى على وجه الأرض.',
                    en: 'UNESCO classified Jemaa el-Fna on its Intangible Cultural Heritage list — an honor no other square holds. By day: storytellers, snake charmers, and Gnawa musicians compete for wonder. By evening: hundreds of braziers ignite, smoke ascends in columns, and Gnawa and Tuareg orchestras play simultaneously in a sensory cocktail found nowhere else on Earth.'
                }
            },
            {
                title: { ar: 'قصر البديع والمدارس السعدية: فخامة ذهبية تحت الأتربة', en: 'El Badi Palace and Saadian Tombs: Golden Grandeur Beneath the Dust' },
                content: {
                    ar: 'شيَّد السلطان السعدي أحمد المنصور الذهبي — مُخلِّف الجيش البرتغالي المنهزم في معركة وادي المخازن عام 1578 — قصر البديع الأسطوري بثروات مالي والحجر الأونيكس والمرمر الإيطالي الفارق وعمود الذهب. كان قصراً لا مثيل له في العالم الإسلامي لأكثر من قرن قبل أن يأتي عليه المولى إسماعيل بأسلحة الهدم والنهب لبناء مكناس. ما تبقى من أطلال القصر الشاسعة وحفرته المائية وأبراجه اليتيمة يكفي لأن يُشعلُ في الخيال شرارة الانبهار حين تقف في قلبه وتُحاكٍ وقفة السفراء القادمين من أقاصي أوروبا إبان العز السعدي.',
                    en: 'Sultan Ahmad al-Mansur \"the Golden\" — who crushed the Portuguese at the Battle of Wadi al-Makhazin in 1578 — built the legendary El Badi Palace with Mali\'s riches, Onyx, Italian marble and golden columns. For over a century it had no equal in the Islamic world before Moulay Ismail dismantled it for Meknes. The vast ruins and dry basin still ignite wonder when you stand at its heart imagining European ambassadors in awe of its glory.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'لماذا تسمى مراكش بالمدينة الحمراء وهل الاسم دقيق فعلاً؟', en: 'Why is Marrakech called the Red City and is the name truly accurate?' },
                answer: { ar: 'نعم، أسوار المدينة القديمة وغالبية مبانيها مبنية من الحجر الرملي المحلي المائل للحمرة المصطبغة بالمغرة، وهو لون يتغير درجته بحسب الإضاءة ليتراوح بين الزهري الرقيق صباحاً والحمر الداكن المشتعل عند الغروب بصورة آسرة للقلوب.', en: 'Absolutely. The old city walls and most buildings are constructed from local red sandstone mixed with ochre pigment, changing shade from delicate pink at dawn to deep blazing red at sunset.' }
            },
            {
                question: { ar: 'من أسس مراكش وما السبب وراء اختيار هذا الموقع الجغرافي تحديداً؟', en: 'Who founded Marrakech and why was this exact geographic location chosen?' },
                answer: { ar: 'أسسها المرابطون بقيادة يوسف بن تاشفين عام 1062 ميلادية. اختير الموقع استراتيجياً كملتقى بين طرق القوافل الصحراوية وطرق تجارة الأطلس، في سهل خصيب يُتيح الزراعة والاستقرار وفي الوقت ذاته يُتيح للجنود المراقبة السهلة للتضاريس المحيطة.', en: 'Founded by the Almoravids under Yusuf ibn Tashfin in 1062, the site was strategically chosen as a crossroads of Saharan caravan routes and High Atlas trade paths, in a fertile plain enabling both agriculture and military surveillance.' }
            },
            {
                question: { ar: 'ما أهمية مدارس جامعة ابن يوسف العلمية التاريخية في مراكش؟', en: 'What is the significance of Ben Youssef Madrasa in Marrakech historically?' },
                answer: { ar: 'تُعدُّ مدرسة ابن يوسف من أكبر وأهم مدارس العلم في شمال إفريقيا التاريخية، استقبلت آلاف الطلاب من كامل العالم الإسلامي ومزجت فيها الفروع العلمية الشرعية والأدبية والعلوم التطبيقية بزخرفة معمارية بديعة لا تضاهيها مدرسة إقليمية.', en: 'Ben Youssef Madrasa is one of the largest and most significant learning institutions in North African history, receiving thousands of students from across the Islamic world in a setting of unmatched architectural decoration.' }
            }
        ],
        conclusion: {
            ar: 'مراكش هي القبلة التي تعنها المغاربة حين يُعبِّرون عن مغربهم بلون واحد يُلخِّص التاريخ والجغرافيا والروح في آن واحد. إنها أكثر من مدينة — إنها شعور لا يُوصف لمن اكتحلت عيناه بضوء شمسها الأصيل.',
            en: 'Marrakech is the destination Moroccans mean when they express their Morocco in a single color that summarizes history, geography, and spirit simultaneously. It is more than a city — it is an indescribable feeling for those who have witnessed its authentic sunlight.'
        }
    },

    // === HISTORICAL FIGURES ===
    'ibn-battuta': {
        title: { ar: 'ابن بطوطة: أمير الرحالة وشاهد أعظم العصور الوسطى', en: 'Ibn Battuta: Prince of Travelers and Witness of the Greatest Medieval Age' },
        category: 'figure',
        metaDescription: {
            ar: 'ابن بطوطة الطنجي رحالة القرن الرابع عشر الذي قطع 120,000 كيلومتر عبر 44 دولة ووثَّق حضارات عصره في رحلته الخالدة.',
            en: 'Ibn Battuta of Tangier — 14th century traveler who covered 120,000 km across 44 countries, documenting his era\'s civilizations in his immortal Rihla.'
        },
        intro: {
            ar: 'في صيف عام 1325 ميلادية، حمل شاب من طنجة لم يبلغ الحادية والعشرين من عمره بعيراً وعُدَّته وراح يسلك دروب الحجاز قاصداً مكة المكرمة في رحلة حج بسيطة. لكن تلك الرحلة المقدسة الأولى لم تكن سوى الدربة والبروفة على ملحمة سيكتبها بأقدامه وعينيه وقلمه على امتداد سبعة وعشرين عاماً، ليُصبح أبو عبد الله محمد بن بطوطة اللواتي التنجلي الشهير بابن بطوطة الرحالةَ الإنساني الأعظم في تاريخ العصور الوسطى متقدماً بشوط بعيد على ماركو بولو في المسافة وفي عمق التوثيق وفي غنى الوصف النابض بالحياة المتماسة.',
            en: 'In the summer of 1325, a young man barely twenty-one from Tangier mounted a camel and set out toward Mecca on a simple pilgrimage. That sacred first journey proved the opening act of an epic he would write over twenty-seven years with his feet, his eyes, and his pen — making Ibn Battuta the greatest human traveler in medieval history, surpassing Marco Polo in distance, depth of documentation, and richness of living description.'
        },
        sections: [
            {
                title: { ar: 'الرحلة المستحيلة: أرقام تُعجز العقل وتُبهج القلب', en: 'The Impossible Journey: Numbers That Defy the Mind' },
                content: {
                    ar: 'سلك ابن بطوطة في رحلته الكبرى ما يزيد على مئة وعشرين ألف كيلومتر — أي ثلاثة أضعاف المسافة التي قطعها ماركو بولو — عابراً ما يُعادل اليوم أربعة وأربعين دولة. زار بلاد الشام ومصر وشبه الجزيرة العربية وبلاد الفرس والهند والصين ومالي والسودان والساحل الإفريقي ووسط آسيا وبيزنطة. كان يعمل في كل بلد يزوره قاضياً أو مستشاراً للسلاطين، مما منحه نفاذاً استثنائياً للقصور والمجالس وعامة الناس على حدٍّ سواء. حين عاد أخيراً لفاس عام 1354 ميلادية، أملى على كاتبه ابن جُزيّ الغرناطي رحلته الخالدة في كتاب "تحفة النظار في غرائب الأمصار وعجائب الأسفار".',
                    en: 'Ibn Battuta\'s grand journey covered more than 120,000 kilometers — triple Marco Polo\'s distance — crossing what equals 44 modern countries. He served as judge and royal advisor in every land visited, granting exceptional access to courts and common folk alike. Upon returning to Fez in 1354, he dictated to his secretary Ibn Juzayy the immortal Rihla: "A Gift to Those Who Contemplate the Wonders of Cities and Marvels of Traveling."'
                }
            },
            {
                title: { ar: 'إسهامات لا تُقدَّر في الجغرافيا والإثنوغرافيا والتوثيق الحضاري', en: 'Priceless Contributions to Geography, Ethnography, and Civilizational Documentation' },
                content: {
                    ar: 'رحلة ابن بطوطة ليست كتاب سفريات بالمعنى الترفيهي المعاصر، بل هي موسوعة جغرافية وأثنوغرافية وتاريخية من الدرجة الأولى. سجَّل عادات وتقاليد ولغات وقوانين وعقائد وأنواع الأغذية والملابس والعمارة في كل حضارة زارها، مُقدِّماً لأهل عصره والأجيال القادمة المصدر الأغنى عن الدول الإسلامية ودول جوارها في القرن الرابع عشر. وصفت أبحاثه الحديثة كتابه بأنه المصدر التاريخي الأوحد في التوثيق العميق لمجتمعات مالي وجامبيا ومجتمعات آسيا الوسطى في تلك الحقبة، وهي مجتمعات كادت تُمحى من ذاكرة التاريخ المكتوب دون توثيق ابن بطوطة الجريء والأمين.',
                    en: 'Ibn Battuta\'s Rihla is not a travel memoir in the modern recreational sense, but a first-rate geographic, ethnographic, and historical encyclopedia. He documented customs, languages, laws, beliefs, food, clothing, and architecture of every civilization visited, providing the richest source on 14th-century Islamic and neighboring states. Modern scholarship describes it as the sole historical source documenting societies in Mali, Gambia, and Central Asia in that era — nearly erased from written history without his bold and faithful documentation.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'ما الذي دفع ابن بطوطة لمواصلة السفر طوال سبعة وعشرين عاماً بلا توقف حقيقي؟', en: 'What drove Ibn Battuta to continue traveling for twenty-seven years without real pause?' },
                answer: { ar: 'مزيج من الفضول الفكري الحاد الذي جعل كل مدينة جديدة لغزاً يستدعي الحل، والطموح الديني في الحج ومتابعة العلم، واكتشاف أن مهارته كقاضٍ تفتح له أبواب المحاكم والقصور في كل بقعة من العالم الإسلامي.', en: 'A combination of sharp intellectual curiosity that made every new city an irresistible puzzle, religious ambition for pilgrimage and scholarship, and the discovery that his expertise as a judge opened courts and palaces everywhere in the Islamic world.' }
            },
            {
                question: { ar: 'كيف تمكَّن ابن بطوطة من التواصل مع شعوب مختلفة اللغات والثقافات؟', en: 'How did Ibn Battuta communicate with peoples of different languages and cultures?' },
                answer: { ar: 'اعتمد بصورة رئيسية على اللغة العربية كلغة دولية للعلم والتجارة في العالم الإسلامي الشاسع. وفي المناطق غير العربية استعان بمترجمين محليين وشبكة من العلماء المسلمين المنتشرين في جميع أنحاء العالم المتصل حضارياً.', en: 'He relied primarily on Arabic as the international language of scholarship and commerce across the vast Islamic world. In non-Arabic regions, he used local interpreters and a widespread network of Muslim scholars connecting the civilizational world.' }
            },
            {
                question: { ar: 'هل اعترض عليه أحد في زمنه ووصف رحلاته بالمبالغة أو الخيال؟', en: 'Did anyone in his time accuse his accounts of exaggeration or fiction?' },
                answer: { ar: 'نعم، بعض معاصريه شككوا في بعض روايات الأماكن البعيدة التي لم يعرفوها. كذلك حدَّد الباحثون المعاصرون أخطاء جغرافية وتواريخية بسيطة، لكن الجوهر الكبير لرحلته يبقى موثقاً تاريخياً صحيحاً بمقاييس عصره ومقاييس بحثنا المعاصر.', en: 'Yes, some contemporaries questioned accounts of distant lands they had never known. Modern scholars have identified minor geographical and dating errors, yet the fundamental substance of his journey remains historically verified by both medieval and contemporary research standards.' }
            }
        ],
        conclusion: {
            ar: 'ابن بطوطة لم يكتشف البلدان فقط، بل اكتشف الإنسان في كل تجلياته وعبر كل فجوة من فجوات الثقافات المتباعدة. هو الشاهد العادل الذي استطاع أن يُحوِّل فضوله الشخصي إلى مرآة للحضارة الإنسانية ومراةً لتاريخ عالم يُودِّع حقبة ويستقبل أخرى.',
            en: 'Ibn Battuta did not merely discover lands — he discovered humanity in all its manifestations across every cultural divide. He is the faithful witness who transformed personal curiosity into a mirror of human civilization, reflecting a world bidding farewell to one era and welcoming another.'
        }
    },

    'fatima-al-fihriya': {
        title: { ar: 'فاطمة الفهرية: الحرة التي بنت أعظم صرح علمي في التاريخ الإنساني', en: 'Fatima al-Fihriya: The Free Woman Who Built History\'s Greatest Academic Monument' },
        category: 'figure',
        metaDescription: {
            ar: 'فاطمة الفهرية بانية جامعة القرويين عام 859م، أقدم جامعة في العالم وفق موسوعة غينيس ويونسكو. قصة ايمان ورؤية استثنائية.',
            en: 'Fatima al-Fihriya, builder of Al-Qarawiyyin in 859 AD — oldest university in the world per Guinness and UNESCO. A story of exceptional faith and visionary leadership.'
        },
        intro: {
            ar: 'في مدينة فاس الشابة المُشيَّدة على يد إدريس الثاني في أوائل القرن التاسع الميلادي، نشأت امرأة اسمها فاطمة بنت محمد الفهري القيرواني الأصل. استوطنت عائلتها فاس قادمةً من القيروان بتونس — ذلك المهد الحضاري الذي صنع علماء الأندلس والمغرب. حين توفي والدها وأخوها وتركا لها ولأختها مريم ثروة كبيرة، قررت فاطمة قراراً يُذهل العقل ويُبهج الروح: لن تبني بيتاً فخماً ولا تشتري أراضي ولا تُنميّ استثماراً تجارياً. ستبني مدرسة للعلم والله، تجمع فيها طلاب العالم الإسلامي الباحثين عن النور في عاصمة تستحق أن تكون مركز إشعاع كوني.',
            en: 'In the young city of Fez founded by Idris II in the early 9th century, a woman named Fatima bint Muhammad al-Fihri grew up — her family having emigrated from Kairouan in Tunisia, that cultural cradle of scholars shaping Andalusia and Morocco. When her father and brother died leaving considerable wealth to her and her sister Maryam, Fatima made a decision that astonishes the mind: not a grand home, not land, not commercial investment — she would build a school for knowledge and God, gathering Islamic world scholars in a capital worthy of becoming a center of universal illumination.'
        },
        sections: [
            {
                title: { ar: 'صيام وبناء: عهد امرأة وحجرة وإصرار لا يلين', en: 'Fasting and Building: A Woman\'s Vow, a Stone, and Unyielding Determination' },
                content: {
                    ar: 'روَت الرواية التاريخية أن فاطمة الفهرية صامت طوال فترة بناء المسجد والمدرسة المتصل به — ثماني سنوات متواصلة من حفر الأساسات إلى وضع القيشاني الأخير وتلاوة الآية الأولى في رحاب صحنه. لم يكن صومها تديُّناً غيبياً فحسب، بل كان نذراً علنياً يُعلن للجميع أن هذا البناء ليس مشروعاً شخصياً، بل فريضة إنسانية مقدسة. يوم اكتملت الجامعة وأُذِّن فيها لأول مرة، قيل إنها سجدت شكراً وبكت من الفرح — ذلك الفرح الذي يُجسِّد النقطة التي يلتقي فيها الإيمان المطلق مع الإنجاز البشري الأقصى.',
                    en: 'Historical accounts relate that Fatima al-Fihriya fasted throughout the eight years of mosque and madrasa construction — from foundation excavation to final zellige placement and the first Quranic recitation in its courtyard. Her fast was not mere personal piety but a public vow declaring this project a sacred human obligation, not personal enterprise. When the university was completed and the first call to prayer echoed within it, she is said to have prostrated in thankful prayer and wept with joy — the point where absolute faith meets the pinnacle of human achievement.'
                }
            },
            {
                title: { ar: 'الإرث الكوني: من فاس إلى أوروبا عبر علوم القرويين', en: 'The Universal Legacy: From Fez to Europe Through Al-Qarawiyyin Sciences' },
                content: {
                    ar: 'القرويين ليست مؤسسة محلية ضيقة الأفق. درس فيها ابن خلدون المؤرخ العظيم، وسيلفستر الثاني الذي سيُصبح بابا روما، ونقل منها رقم الصفر والأعداد العربية والمنطق الرياضي إلى أوروبا المظلمة. ابن رشد المفكر الذي فتح عيون الفلاسفة الأوروبيين على أرسطو، وإدريس الذي رسم أول خريطة معقدة للعالم. هذه المدرسة التي بنتها امرأة بأموالها الخاصة في مدينة إفريقية في القرن التاسع أشعلت مشاعل التنوير التي نوَّرت بعض أحلك فصول الظلام في تاريخ الإنسانية الأوروبية.',
                    en: 'Al-Qarawiyyin is not a narrow local institution. Ibn Khaldun the great historian studied here, as did Sylvester II who became Pope, transmitting zero, Arabic numerals, and mathematical logic to dark-age Europe. Ibn Rushd, who opened European philosophers\' eyes to Aristotle, and al-Idrisi, who drew the first sophisticated world map — all learned within its walls. A school built by a woman with her own funds in an African city in the 9th century ignited enlightenment torches illuminating some of humanity\'s darkest European chapters.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'هل من المؤكد تاريخياً أن فاطمة الفهرية هي التي بنت القرويين وليس شقيقتها مريم؟', en: 'Is it historically certain that Fatima al-Fihriya built Al-Qarawiyyin rather than her sister Maryam?' },
                answer: { ar: 'المصادر التاريخية المعتمدة تُخصِّص بناء جامع وجامعة القرويين لفاطمة، في حين بنت أختها مريم مسجد الأندلسيين في المقابل. كلتاهما حفظتا الذاكرة الحضارية لفاس الإدريسية بأموال العائلة الفهرية الواحدة.', en: 'Authoritative historical sources attribute the Al-Qarawiyyin mosque and university specifically to Fatima, while her sister Maryam built the Andalusian Mosque across town. Both preserved the civilizational memory of Idrisid Fez with the single al-Fihri family fortune.' }
            },
            {
                question: { ar: 'هل لا تزال جامعة القرويين تعمل فعلاً كمؤسسة أكاديمية في العصر الحديث؟', en: 'Does Al-Qarawiyyin still function as an academic institution in the modern age?' },
                answer: { ar: 'نعم، لا زالت تُدرِّس العلوم الإسلامية والعربية. تحولت للاعتراف الأكاديمي الرسمي في إصلاحات الستينيات تحت إشراف الدولة المغربية، وتمنح شهادات معترفاً بها دولياً في تخصصات الفقه والأدب والبلاغة.', en: 'Yes, it continues teaching Islamic sciences and Arabic. It underwent formal academic recognition reforms in the 1960s under Moroccan state supervision and grants internationally recognized degrees in jurisprudence, literature, and rhetoric.' }
            },
            {
                question: { ar: 'كيف يُراعي العالم المعاصر إرث فاطمة الفهرية في قضايا المرأة والعلم؟', en: 'How does the contemporary world honor Fatima al-Fihriya\'s legacy in women and science discourse?' },
                answer: { ar: 'تُستشهد قصتها في كل نقاش حول إسهام المرأة المسلمة في الحضارة. ونالت تكريمات عالمية متعددة، وأُطلق اسمها على مبانٍ ومنح دراسية دولية لتشجيع المرأة على التعليم والريادة في العالم الإسلامي وخارجه.', en: 'Her story is cited in every discussion on Muslim women\'s contributions to civilization. She has received multiple global tributes, and her name graces buildings and international scholarships encouraging women in education and leadership across the Islamic world and beyond.' }
            }
        ],
        conclusion: {
            ar: 'فاطمة الفهرية لم تبنِ جدراناً وأسقفاً. بنت فضاءً للحرية الفكرية والنور العلمي امتد من فاس ليُضيء قارات. في كل عالم تخرج من القرويين، وفي كل فلسفة أوروبية استعانت بترجمات علومها — ثمة نبض قلب فاطمة يدق في صمت خلف تلك الإنجازات.',
            en: 'Fatima al-Fihriya did not build walls and ceilings. She built a space for intellectual freedom and scientific light that radiated from Fez to illuminate continents. In every scholar who graduated from Al-Qarawiyyin, in every European philosophy drawing on its translated sciences — Fatima\'s heartbeat quietly pulses behind those achievements.'
        }
    },
};

// ============================================================
// READ EXISTING, MERGE, WRITE
// ============================================================
const targetPath = path.join('data', 'moroverse-content.ts');
let existing = fs.readFileSync(targetPath, 'utf8');

// Inject new articles into moroverseArticles object
// We'll append them into the existing record before the closing }
const newArticlesCode = Object.entries(ARTICLES).map(([id, art]) => {
    const img = IMAGE_REGISTRY[id] || null;
    return `  '${id}': ${JSON.stringify({
        id,
        ...art,
        ...(img ? { generatedImage: img } : {}),
    }, null, 4).replace(/"([^"]+)":/g, '$1:')},`;
}).join('\n');

// Only add articles that don't already exist in the file
const newEntries = Object.keys(ARTICLES).filter(id => !existing.includes(`'${id}':`));
if (newEntries.length > 0) {
    const newCode = newEntries.map(id => {
        const art = ARTICLES[id];
        const img = IMAGE_REGISTRY[id] || null;
        return `  '${id}': ${JSON.stringify({ id, ...art, ...(img ? { generatedImage: img } : {}) }, null, 4)},`;
    }).join('\n');

    existing = existing.replace(
        /export const moroverseArticles: Record<string, MoroArticle> = \{/,
        `export const moroverseArticles: Record<string, MoroArticle> = {\n${newCode}`
    );
    fs.writeFileSync(targetPath, existing, 'utf8');
    console.log(`✅ Injected ${newEntries.length} new epic articles:`, newEntries.join(', '));
} else {
    console.log('ℹ️ All articles already exist in moroverse-content.ts');
}

// Update IMAGE_REGISTRY entries in existing articles (generatedImage field)
const imageUpdates = Object.entries(IMAGE_REGISTRY);
let updateCount = 0;
for (const [id, img] of imageUpdates) {
    // If the article exists but lacks generatedImage
    if (existing.includes(`'${id}':`) && !existing.includes(`generatedImage`)) {
        updateCount++;
    }
}
console.log(`🎨 IMAGE_REGISTRY has ${imageUpdates.length} cinematic image mappings ready.`);
console.log('🚀 Content injection complete!');
