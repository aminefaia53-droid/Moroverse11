export interface ArticleSection {
    title: { en: string; ar: string };
    content: { en: string; ar: string };
}

export interface ArticleFAQ {
    q: { en: string; ar: string };
    a: { en: string; ar: string };
}

export interface MoroArticle {
    id: string;
    title: { en: string; ar: string };
    category: 'battle' | 'landmark' | 'city' | 'figure';
    metaDescription: { en: string; ar: string };
    intro: { en: string; ar: string };
    sections: ArticleSection[];
    faqs?: ArticleFAQ[];
    conclusion: { en: string; ar: string };
    videoUrl?: string;
    gallery?: string[];
}

export const moroverseArticles: Record<string, MoroArticle> = {
    'hassan-ii-mosque': {
        id: 'hassan-ii-mosque',
        title: { ar: 'مسجد الحسن الثاني: منارة الإسلام الخالدة على أمواج المحيط الأطلسي', en: 'Hassan II Mosque: The Eternal Islamic Beacon on the Waves of the Atlantic Ocean' },
        category: 'landmark',
        metaDescription: { ar: 'مسجد الحسن الثاني بالدار البيضاء، تحفة معمارية إسلامية ومغربية فريدة من نوعها. استكشف تاريخ بنائه وتفاصيله الدقيقة وأهميته الروحية التي تتحدى أمواج المحيط بقوة وإيمان.', en: 'Hassan II Mosque in Casablanca, a unique Islamic and Moroccan architectural masterpiece. Explore its history, intricate architecture, and spiritual significance.' },
        intro: {
            ar: 'يعد مسجد الحسن الثاني، المنتصب بشموخ وكبرياء على شواطئ مدينة الدار البيضاء، واحداً من أعظم الإنجازات المعمارية في أواخر القرن العشرين، حيث يمثل تزاوجاً مثالياً بين الأصالة المغربية العريقة والحداثة الهندسية المبتكرة. لم يُصمم هذا الصرح الديني ليكون مجرد مكان للعبادة وإقامة الشعائر الدينية، بل ليقف كرمز خالد للهوية الإسلامية والمغربية، جامعاً بين التقاليد الموروثة عبر قرون من الزمن وأحدث التقنيات الهندسية المعاصرة في مجالات البناء والعمارة. بُني المسجد بتوجيه ومتابعة شخصية من جلالة المغفور له الملك الحسن الثاني، الذي استلهم موقع البناء الاستثنائي من الآية القرآنية الكريمة: "وَكَانَ عَرْشُهُ عَلَى الْمَاءِ"، ليجعل من هذا الصرح العظيم منارة روحية تطل على المحيط الأطلسي العظيم وتربط بين قارات العالم. إن الوقوف أمام هذا المسجد يبعث في النفس رهبة وإجلالاً لامثيل لهما، حيث ترتفع مئذنته الشاهقة إلى عنان السماء كأصبع يتشهد بوحدانية الخالق عز وجل، مبحرًا في عباب الأطلسي ليربط حاضر الأمة الإسلامية وماضيها التليد بكل شموخ واعتزاز يدهش الأبصار والعقول معاً.',
            en: 'The Hassan II Mosque, standing proudly on the shores of Casablanca, is one of the greatest architectural achievements of the late twentieth century. It was designed to be not just a place of worship, but an eternal symbol of Islamic and Moroccan identity, combining centuries-old traditions with the latest contemporary engineering techniques. The mosque was built under the guidance of His Majesty the late King Hassan II, who was inspired by the Quranic verse: And His Throne was upon the water.'
        },
        sections: [
            {
                title: { ar: 'العبقرية الهندسية والزخارف المغربية الأصيلة التي تزين أرجاء المعلمة', en: 'Engineering Genius and Authentic Moroccan Decorations' },
                content: {
                    ar: 'إن بناء مسجد الحسن الثاني لم يكن تحدياً دينياً أو معمارياً فحسب، بل كان إنجازاً هندسياً وإنسانياً هائلاً وغير مسبوق شارك فيه أكثر من عشرة آلاف من أمهر الصنّاع التقليديين المغاربة (المعلمين) الذين واصلوا العمل ليل نهار لإتمام هذه التحفة. لقد تضافرت جهود وحرفية هؤلاء المبدعين الذين جاؤوا من مختلف أنحاء المملكة الشريفة، خاصة من مدن عريقة كفاس ومراكش وتطوان وسلا، ليحولوا المواد الخام الصخرية والخشبية والمعدنية إلى تحف فنية تنبض بالحياة والروحانية المطلقة التي لا يمكن وصفها. استخدم في البناء الرخام الناصع المستخرج من مقالع أغادير، وخشب الأرز العطري المتين القادم من غابات جبال الأطلس المتوسط، والجرانيت الصلب من مدينة تافراوت الأمازيغية العريقة. وتجلت هندستهم وفنهم في تفاصيل "الزليج" الفسيفسائي الذي غطى الجدران بألوانه الزاهية المتداخلة، والنقوش الجصية الدقيقة التي شكلت آيات قرآنية وأشكالاً هندسية معقدة ومبهرة تنساب على الجدران. إن سقف المسجد، الذي يمكن فتحه وإغلاقه آلياً بفضل تقنيات حديثة، يجسد تزاوجاً فريداً بين التكنولوجيا المتقدمة والفن التقليدي، مما يسمح للمصلين بالاستمتاع بنسيم المحيط ورؤية السماء الصافية أثناء أدائهم للصلاة في مشهد خشوع لا مثيل له يعزز التقرب من الخالق جلت قدرته.',
                    en: 'Building the Hassan II Mosque was an immense engineering and human achievement involving over ten thousand of the most skilled Moroccan traditional artisans. They used marble from Agadir, cedar wood from the Middle Atlas, and granite from Tafraout. Their genius was evident in the bright Zellige mosaics, intricate plaster carvings of Quranic verses, and geometric patterns. The automated retractable roof perfectly exemplifies the union between advanced technology and traditional art.'
                }
            },
            {
                title: { ar: 'المكانة الروحية والثقافية والإشعاع العالمي للمسجد كمرجع للحضارة', en: 'Spiritual, Cultural Standing and Global Radiance' },
                content: {
                    ar: 'يمتد تأثير وقيمة مسجد الحسن الثاني ليتجاوز أبعاده المادية والمعمارية الصرفة، ليصبح مؤسسة ثقافية ودينية متكاملة تسهم في إشعاع الحواضر المغربية والإسلامية عبر كافة القارات والأجيال. يضم المجمع الضخم قاعات شاسعة للوضوء تشبه في تصميمها وجماليتها حمامات القصور الأندلسية التاريخية، بفضل أعمدتها الرخامية اللامعة وأحواضها المائية المصممة بعناية فائقة على شكل زهرات اللوتس النحاسية الأنيقة. كما يحتوي المجمع على مدرسة قرآنية (مدرسة للعلوم الإسلامية والتراثية)، ومكتبة عامة غنية بمختلف المخطوطات والمراجع القيمة التي تخدم الباحثين والطلاب من جميع أنحاء العالم، بالإضافة إلى متحف فني يسلط الضوء على مراحل البناء المعقدة وتاريخ الحرف اليدوية والفنية في المغرب. وفي شهر رمضان المبارك، يتحول المسجد وباحاته الشاسعة إلى قلب نابض بالروحانية والإيمان، حيث يتوافد مئات الآلاف من المصلين من جميع أنحاء البلاد للاستمتاع بالقراءات القرآنية الخاشعة تحت سقفه العرمرم المزين بأجمل الثريات. وتمتد صفوف المصلين في نظام بديع لتشمل الباحات الخارجية والشوارع المحيطة به، مما يشكل لوحة إيمانية مهيبة تعكس وحدة المجتمع المغربي وتماسكه الثقافي وتشبثه بقيمه الدينية الراسخة التي لم تنل منها عاديات الزمان مهما اشتدت الظروف وتغيرت الأجيال المتعاقبة.',
                    en: 'The influence of the Hassan II Mosque extends beyond its physical dimensions, functioning as a comprehensive cultural and religious institution. The complex includes massive ablution halls resembling Andalusian palace baths, a Quranic school, a well-stocked public library, and a museum detailing its construction. During Ramadan, it becomes a pulsing heart of spirituality, gathering hundreds of thousands of worshippers.'
                }
            }
        ],
        faqs: [
            {
                q: { ar: "متى تم بناء مسجد الحسن الثاني؟", en: "When was the Hassan II Mosque built?" },
                a: { ar: "تم الانتهاء من بنائه عام 1993 بعد سنوات من العمل المتواصل بمشاركة آلاف الحرفيين.", en: "Its construction was completed in 1993 after years of continuous work involving thousands of artisans." }
            },
            {
                q: { ar: "ما هو ارتفاع مئذنة المسجد؟", en: "What is the height of the mosque's minaret?" },
                a: { ar: "يبلغ ارتفاع المئذنة 210 أمتار، مما يجعلها من أعلى المآذن في العالم.", en: "The minaret is 210 meters high, making it one of the tallest minarets in the world." }
            },
            {
                q: { ar: "هل يمكن لغير المسلمين زيارة المسجد؟", en: "Can non-Muslims visit the mosque?" },
                a: { ar: "نعم، يعتبر مسجد الحسن الثاني من المساجد القليلة في المغرب التي تفتح أبوابها للزوار غير المسلمين عبر جولات سياحية منظمة ومؤطرة.", en: "Yes, the Hassan II Mosque is one of the few mosques in Morocco open to non-Muslim visitors through guided tours." }
            }
        ],
        conclusion: {
            ar: 'في النهاية، يقف مسجد الحسن الثاني كشاهد حي لا تخطئه العين على قدرة العقل البشري، وإبداع الأيادي المغربية الأصيلة، وعظمة الحضارة الإسلامية الممتدة عبر الأزمان والمكان. إنه ليس مجرد مبنى ديني محض يزوره السياح للالتقاط الصور المذهلة التذكارية، بل هو ملحمة مجسدة من الحجر والماء والخشب والزجاج، تروي قصة أمة عريقة استطاعت أن تحافظ على جذورها وهويتها الأصيلة بينما تعانق وتناطح السماء بمآذنها وتبحر في تحديات العصر والزمن بشجاعة وإيمان لا يلين ولا ينكسر أبداً.',
            en: 'Ultimately, the Hassan II Mosque stands as a living testament to human capability, the creativity of Moroccan hands, and the greatness of Islamic civilization. It is an epic materialized in stone, water, and wood.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5361-182312675_large.mp4',
        gallery: [
            'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1563825828551-fb18e47aa571?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop'
        ]
    }
};

export const getArticle = (id: string, nameAr: string, nameEn: string, category: 'battle' | 'landmark' | 'city' | 'figure'): MoroArticle => {
    if (moroverseArticles[id]) return moroverseArticles[id];

    // Image Routing Logic based on ID / Category for extreme precision UI matching
    let calculatedImages: string[] = [];
    const safeId = id || "";

    if (safeId.toLowerCase().includes('tangier') || safeId.toLowerCase().includes('tanger')) {
        calculatedImages = [
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop', // Tangier/Medina vibe
            'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1563825828551-fb18e47aa571?q=80&w=2070&auto=format&fit=crop'
        ];
    } else if (category === 'battle' || safeId.toLowerCase().includes('zallaqa') || safeId.toLowerCase().includes('marrakech')) {
        calculatedImages = [
            'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2070&auto=format&fit=crop', // Cavalry/Horses/Swords 
            'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2070&auto=format&fit=crop', // Desert riders
            'https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop'  // Fortifications/Battlements
        ];
    } else {
        // Fallback robust images
        calculatedImages = [
            'https://images.unsplash.com/photo-1549429440-660c608fba63?q=80&w=2070&auto=format&fit=crop', // Moroccan Sahara
            'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop', // Medina overview
            'https://images.unsplash.com/photo-1563825828551-fb18e47aa571?q=80&w=2070&auto=format&fit=crop'  // Zellige details
        ];
    }

    // Direct MP4 mapping for global fallback coverage
    let videoOverlay = 'https://cdn.pixabay.com/video/2019/08/08/25854-351855662_large.mp4';
    if (category === 'battle') {
        videoOverlay = 'https://cdn.pixabay.com/video/2016/09/21/5361-182312675_large.mp4';
    }

    return {
        id,
        title: {
            ar: `${nameAr}: سجل الخلود المغربي الأبدي العظيم`,
            en: `${nameEn}: The Grand Authentic Moroccan Eternal Record`
        },
        category,
        metaDescription: {
            ar: `تحليل شامل ومعمق للغاية حول السجل التاريخي والحضاري لمنطقة وشخصية ${nameAr}. اكتشف كيف ساهمت في صياغة التأريخ وتشكيل الهوية الثقافية الشاملة من خلال أرشيف رقمي ضخم موثق ومؤصل يعتمد منهجيات حديثة في السرد عبر منصة مورو فيرس الحضارية بامتياز.`,
            en: `Deep comprehensive historical analysis about ${nameEn} detailing its cultural and architectural impact through MoroVerse Interactive Digital Archives.`
        },
        intro: {
            ar: `تمثل ${nameAr} صفحة مشرقة لا تُنسى في تراث وصفحات المملكة المغربية العريقة التي امتدت جذورها عبر قرون من المجد والشموخ. من خلال استعراض تاريخها الحافل بالأمجاد والبطولات المتعاقبة، نستشعر ذلك التلاحم الفريد والعبقري بين صرامة مجريات التاريخ وعمق تضاريس الجغرافيا العصية، وما أفرزه ذلك من منظومة واسعة من القيم الوطنية الراسخة والإنسانية الخالدة والمجيدة. إن دراسة وتقصي مسيرة ${nameAr} تفتح أمامنا بكل تأكيد أبواباً واسعة وهامة لفهم واستيعاب طبيعة التحولات الاجتماعية والسياسية العميقة التي رافقت واكبت تطور الحضارة الإسلامية والمغربية الأصيلة عبر توالي وتداخل العديد من العصور. ولم تكن هذه الكيانات والمفاصل الأساسية يوماً ما مجرد محطات تاريخية بمعزل أو منفصلة عن المتغيرات الداخلية والخارجية والمرحلة الحضارية الحساسة المحيطة والمحدقة بها، بل إنها بالفعل ساهمت بكل قوة وصلابة وتأثير في توجيه وتحريك دفة الأحداث الكبرى الإقليمية وصنع القرارات المصيرية التي غيرت بشكل أو بآخر وجه المنطقة الجغرافية وحوض المتوسط برمتها ونهائياً وبشكل جذري وعميق جداً.`,
            en: `${nameEn} represents a bright page in the Kingdom heritage, embodying the fusion of history, geography, and eternal national values. Studying its saga allows us to deeply comprehend the sweeping socio-political shifts spanning centuries.`
        },
        sections: [
            {
                title: {
                    ar: 'الأبعاد التاريخية والرمزية الثرية الاستراتيجية والمؤثرة في وجدان ومسار تطور الأمة',
                    en: 'Historical and Symbolic Dimensions Shaping Output'
                },
                content: {
                    ar: `إن البحث الدقيق والموضوعي المتأني في جذور وتاريخ ${nameAr} العريق يكشف لنا دائماً بكل وضوح وتجرد ومنهجية عن عمق وغزارة وصلابة الهوية المغربية الأصيلة والمشتركة، وتعدد وتشابك روافدها الثقافية والدينية والسياسية والحربية ذات الأبعاد والخصائص المشتركة والمتلاحمة بقوة لا تلين. هذا العمق المذهل والشامل يجعل منها بطبيعة الحال مادة بالغة الخصوبة للدراسة الأكاديمية العميقة ويجعلها محط اعتزاز مفعم وافتخار بالغ وثابت للأجيال القادمة التي تتوق لفهم أصولها وأسس حضارتها بعيداً عن التشويه. لقد انصهرت وشكلت في أتون هذا المشهد الشاق والملهم مختلف المكونات والقبائل والشرائح والفئات المجتمعية بصورة منقطعة النظير، لتعزف وتنشئ جميعها في نهاية المطاف سمفونية وطنية رائعة ومتجانسة تجلى فيها أسمى صور التضحية والفداء وبذل الغالي والنفيس للحفاظ على أمن وكرامة واستقلال هذا البلد الأمين في وجه جميع التدخلات. علاوة على ذلك وعلى وجه الخصوص، احتفظت الذاكرة الشعبية والنصوص التأريخية المكتوبة بكثير من الأشعار والملاحم والبطولات الاستثنائية العظيمة التي بدورها وثقت بدقة وتواتر هذه الأمجاد العريقة ورسختها في وجدان وتكوين ووعي الأمة كحكايات وأساطير واقعية تُروى بفخر وإجلال وتتجدد بقوة مع كل تحد ضخم وأزمة عويصة لتلهم معاني الصمود والثبات والصبر الطويل على المكاره والأخطار في كل بقاع الأمة.`,
                    en: `Research into the history of ${nameEn} meticulously strips back layers to reveal the deep-rooted Moroccan identity and the multiplicity of its cultural, religious, and political tributaries, making it a very fertile subject for study and great pride for absolute future generations to come.`
                }
            },
            {
                title: {
                    ar: 'الأثر التنويري والثقافي الباقي الذي يسري في شرايين الوطن كمرجع ومحجة حضارية',
                    en: 'Remaining Illuminating Cultural and Geopolitical Legacies'
                },
                content: {
                    ar: `لعبت هذه البقعة الجغرافية والتاريخية العظمى المتمثلة في ${nameAr} دوراً أساسياً وحاسماً ومفصلياً في قلب المعادلات الجيوسياسية الإقليمية التي أعادت صياغة وتشكيل التحالفات والتوازنات على مدى عصور كبرى ممتدة ومستمرة وحساسة. لقد شكلت قطب رحى ومثلت بحق نقطة ارتكاز قوية للمقاومة الصامدة وللتواصل الاقتصادي الحثيث والتبادل الثقافي التجاري الشامل والمستمر مع إفريقيا جنوب الصحراء والقارة الأوروبية الشمالية والغربية، فاتحة واسعة الأبواب وشاسعة الآفاق لأسواق التجارة والرحلات والطرق العلمية الموثقة والفقهية والمحطات الكبرى للمسافرين والرحالة الذين جابوا الآفاق مسجلين مآثرها وعجائب أمورها. كما خلدت الأدبيات والدواوين والمخطوطات القديمة القيّمة، التي كُتب بعضها بماء الذهب، أسماء العديد من الحكام الدهاة والعلماء النابغين والفقهاء المجتهدين الذين استقوا بشغف إلهامهم الإيماني والإبداعي من سحرها المكنون الذي لا يُنسى، وتعلموا بين جدرانها وفي جامعاتها ومدارسها العتيقة أسمى معاني العزة والصمود ومكارم الأخلاق النبيلة الصريحة. وهكذا بكل بساطة ووضوح، أصبحت هذه المعلمة العريقة والكيان الشامخ لا مجرد حجر مرصوف خاوٍ أو ذكرى منسية على عتبات الزمان والنسيان، بل مركزاً كونياً حياً يتلألأ بثبات وتطور وسط الأمم والحضارات القديمة منها والحديثة ويفرض بكل هدوء واقتدار وجوده وبقوة على الخارطة الإنسانية العالمية ككل. إنها ملحمة تدرس وإشراقة لن تغيب شمسها عن كبد أفق التاريخ الإنساني الكبير ما حيينا.`,
                    en: `This entity played a huge role in regional shifting, serving as an intersection of resistance, trade, and profound cultural exchanges stretching between sub-Saharan Africa and Europe. It continues to cast a very large and influential shadow across modern times.`
                }
            }
        ],
        faqs: [
            {
                q: { ar: `لماذا تحظى ${nameAr} بأهمية كبرى في التاريخ المغربي؟`, en: `Why is ${nameEn} so important in Moroccan history?` },
                a: { ar: `بسبب دورها المحوري القوي في توجيه الأحداث السياسية والثقافية، ومساهمتها العميقة في ترسيخ القيم الوطنية والإسلامية العريقة التي شكلت وجدان الأمة عبر العصور الغابرة.`, en: `Due to its pivotal role in directing political and cultural events, and its contribution to consolidating the ancient national and Islamic values that shaped the conscience of the nation.` }
            },
            {
                q: { ar: `ما هي أبرز المعالم المعمارية المتبقية لـ ${nameAr} اليوم؟`, en: `What are the most prominent monuments remaining of ${nameEn} today?` },
                a: { ar: `تتجسد بقوة في المآثر العمرانية، الأسوار العتيقة، النياشين التاريخية والقصص الشعبية المتواترة التي لا تزال تُدرس في المناهج كشاهد ناطق على تلك الحقبة المضيئة.`, en: `It is strongly embodied in the urban monuments, ancient walls, historical medals and recurring folk tales that are still taught in the curricula.` }
            },
            {
                q: { ar: `كيف يمكن للباحثين والزوار التفاعل مع إرث ${nameAr}؟`, en: `How can researchers interact with the legacy of ${nameEn}?` },
                a: { ar: `عبر الانغماس في أرشيف مورو فيرس الرقمي الشامل، واستكشاف المراجع الأكاديمية والمكتبات الوطنية، والوقوف المباشر في عين المكان لاستشعار عظمة الماضي الممتد إلى الحاضر.`, en: `By diving into the comprehensive MoroVerse digital archive, exploring academic references, and standing directly on site.` }
            }
        ],
        conclusion: {
            ar: `في الخلاصة الجامعة المانعة والمؤكدة، تظل ${nameAr} وستبقى شاهدة أمينة وصادقة وعزماً جباراً على عظمة وتفرد إرادة أمة لا تلين أو تنكسر، مستقاة من إرث حضاري وديني وثقافي وجغرافي عميق ومتشعب يرفض رفضاً قاطعاً التهميش والتبعية ويثبت تفوقه الإنساني والحضاري الراقي في كل زمان ومكان بإذن الله وتوفيقه الدائم لتراب هذا الوطن المبارك المعطاء. إن هذا الفخر الجماعي الذي نستقيه من أريج وأخبار وقصص ${nameAr} هو الوقود الحقيقي والأصيل الذي يمضي به شباب المملكة والأجيال الصاعدة بثبات وعزم وحزم وإصرار كامل في طريق بناء الحاضر الماهر وتأسيس الغد الأفضل المشرق وتخليد المكانة الأسمى وسط الأمم دون تردد أو وهن، مستلهمين من ذلك المجد الغابر نوراً وهداية وشموخاً وطيداً وحباً عميقاً ومخلصاً لثرى مملكتنا العريقة والأصيلة التي ضربت أطنابها بكل قوة وعزم في عمق التاريخ البشري والإنساني منذ الأزل الجميل الممتد بصفحات الأمجاد وروايات البناء والحرية.`,
            en: `In an unyielding conclusion, ${nameEn} rigidly remains a prime witness to the greatness, uniqueness and highly unyielding will of a massive nation drawing deeply from civilization. This legacy is the fuel moving the Moroccan generation steadily and courageously into a very bright and prosperous and advanced future.`
        },
        videoUrl: videoOverlay,
        gallery: calculatedImages
    };
};
