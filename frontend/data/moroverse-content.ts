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
        conclusion: {
            ar: 'في النهاية، يقف مسجد الحسن الثاني كشاهد حي لا تخطئه العين على قدرة العقل البشري، وإبداع الأيادي المغربية الأصيلة، وعظمة الحضارة الإسلامية الممتدة عبر الأزمان والمكان. إنه ليس مجرد مبنى ديني محض يزوره السياح للالتقاط الصور المذهلة التذكارية، بل هو ملحمة مجسدة من الحجر والماء والخشب والزجاج، تروي قصة أمة عريقة استطاعت أن تحافظ على جذورها وهويتها الأصيلة بينما تعانق وتناطح السماء بمآذنها وتبحر في تحديات العصر والزمن بشجاعة وإيمان لا يلين ولا ينكسر أبداً.',
            en: 'Ultimately, the Hassan II Mosque stands as a living testament to human capability, the creativity of Moroccan hands, and the greatness of Islamic civilization. It is an epic materialized in stone, water, and wood.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5361-182312675_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/e/ee/Hassan_II_Mosque_1.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/6/69/Hassan_II_Mosque_-_interior.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/1/18/Hassan_II_Mosque_Casablanca.jpg'
        ]
    },
    'fatima-al-fihriya': {
        id: 'fatima-al-fihriya',
        title: { ar: 'فاطمة الفهرية: أم البنين ومؤسسة أقدم جامعة مستمرة في تاريخ البشرية جمعاء', en: 'Fatima al-Fihriya: Mother of the Boys and Founder of the World Oldest University' },
        category: 'figure',
        metaDescription: { ar: 'قصة السيدة فاطمة الفهرية، المرأة التي وهبت مالها وحياتها لبناء جامع وجامعة القرويين بفاس، أقدم جامعة مستمرة في العالم وموطن العلم والتنوير منذ القرن التاسع الميلادي المشرق بالمعرفة.', en: 'The epic true story of Fatima al-Fihriya, the visionary woman who donated her wealth to build the Al-Qarawiyyin University in Fez, the oldest existing educational institution.' },
        intro: {
            ar: 'في قلب مدينة فاس العريقة، النابض بالحضارة والتاريخ والثقافة الأصيلة، برزت في غابر الأزمان شخصية نسائية استثنائية خلّفت إرثاً علمياً وإنسانياً غير مسبوق بتأسيسها لأول جامعة مستمرة في تاريخ الإنسانية قاطبة: إنها السيدة الفاضلة فاطمة بنت محمد الفهرية القرشية، التي لُقبت واشتهرت بلقب أم البنين. وُلدت فاطمة في عائلة غنية وعريقة تنتسب إلى قبيلة قريش في مدينة القيروان بتونس حالياً، ثم انتقلت مع عائلتها صُنوف المغتربين والباحثين عن الاستقرار إلى العاصمة الإدريسية فاس هرباً واستقراراً في عهد الدولة الأدارسة والمولى إدريس الثاني الذي شيد مدينة كانت تفيض بالعلم والعمران. ورغم ثرائها الكبير ومكانتها الاجتماعية المرموقة، فقد امتازت بروح الوفاء والزهد والتقوى وعلو الهمة، حيث لم تدخر جهداً في تسخير طاقاتها وأموالها وقوة عزيمتها لخدمة مجتمعها ودينها الإسلامي الحنيف السمح. لقد أدركت فاطمة بوعيها العميق وبصيرتها الثاقبة أن نهضة هذه الأمة تبدأ وتنتهي مع نشر العلم وتأسيس البنيان والدين وتشييد صروح المعرفة، وهي رؤية تنويرية سابقة شدت الانتباه وسبقت عصرها بكثير جداً. تجسد قصة بناءها لمسجد وجامعة القرويين عام 859م ملحمة كبرى من الإيثار الإنساني المدهش والعظيم والفريد، ما جعلها رائدة التعليم العالي على مستوى العالم والأم الروحية والمشعل الذي ينير درب كل طالب وكل باحث عن المعرفة حتى يومنا هذا، وستظل كذلك إلى الأبد بفضل صدق نيتها.',
            en: 'In the heart of the civilized city of Fez, Fatima al-Fihriya left an unprecedented scientific legacy by founding the University of Al-Qarawiyyin in 859 AD, becoming a pioneer of higher education in history.'
        },
        sections: [
            {
                title: { ar: 'تأسيس جامعة القرويين: منارة شامخة للعلم والتسامح تشع عبر توالي العصور', en: 'Founding Al-Qarawiyyin: A Beacon of Science Through the Ages' },
                content: {
                    ar: 'لم يكن جامع القرويين في بداياته مجرد مسجد للصلاة والعبادة العابرة فحسب، بل تحول بفضل الله ثم بفضل رؤية وعطاء السيدة فاطمة الفهرية إلى مركز إشعاع فكري وحضاري وعلمي عالمي لا نظير له في الغرب الإسلامي بل في العالم بأسره. اشترت فاطمة بمال حر ورثته من أبيها وزوجها بستاناً واسعاً وسط المدينة وأشرفت بنفسها بشكل ميداني ويومي على عمليات البناء خطوة بخطوة. وقد أصرت بكل تقوى وإصرار وحزم على ألا تستخدم في البناء إلا المواد المستخرجة من تلك الأرض تحديداً، حرصاً منها على تحري الحلال التام، وأن تصوم طيلة فترة البناء التي امتدت لسنوات طويلة حتى اكتمل هذا الصرح الشامخ وتقبلته السماء. وبمجرد اكتماله للصلاة، لم يتوقف دوره أبداً عند حدود الشعائر، بل سرعان ما استقطب بقوة العلماء الكبار والجهابذة والطلبة والباحثين الوافدين من كل حدب وصوب للتبحر في الفقه، الطب، الفلك، الفلسفة، والرياضيات المتقدمة. تخرج من أروقته علماء أجلاء تركوا بصمة جلية وساطعة في تاريخ البشرية، أمثال العلامة والمؤرخ المؤسس ابن خلدون، والفيلسوف العظيم ابن رشد، والعالم والجغرافي الفذ الشريف الإدريسي، بل وحتى اللاهوتيين والبابوات المسيحيين الغربيين أمثال البابا سيلفستر الثاني الذي نقل بشغف الأرقام العربية إلى أوروبا المتخلفة آنذاك مستفيداً من علوم القرويين. هذا وتعتبر الجامعة حتى الآن، بشهادة رسمية من موسوعة غينيس للأرقام القياسية ومنظمة اليونسكو العالمية، أقدم مؤسسة تعليمية جامعية قائمة ومستمرة بلا انقطاع في وظيفتها التعليمية على مستوى الكرة الأرضية جمعاء.',
                    en: 'Al-Qarawiyyin was not just a mosque for prayer, but transformed through Fatima vision into a center of intellectual radiance where Ibn Khaldun, Averroes, and many scholars who shaped modern thought graduated. The university has operated continuously since its founding, making it the oldest existing educational institution.'
                }
            },
            {
                title: { ar: 'رمزية المرأة المغربية والإسلامية الفذة والأثر الخالد في وجدان الأمة', en: 'The Symbolism of Moroccan Women and Eternal Legacy' },
                content: {
                    ar: 'تعد السيدة الطاهرة فاطمة الفهرية رمزاً حياً، بل أيقونة ساطعة وخالدة لتكريس وتوضيح الدور المحوري والقيمة الجوهرية للمرأة في صميم الحضارة الإسلامية والمغربية الأصيلة والممتدة عبر القرون. لقد جسدت بفضل الله ومبادرتها روح القيادة النسائية الحقيقية والفاعلة التي أسهمت، ولا تزال تسهم بصمت وفعالية، في التنمية الفكرية والمادية العظيمة للمجتمعات الإنسانية. إن مساهمتها الشجاعة التي استمرت لقرون لم تكن مجرد عمل خيري عابر أو هبة مالية انقطعت بموتها أو انقضاء زمنها، بل كانت بمثابة تأسيس رائد لمؤسسة مستدامة، أطلق عليها فيما بعد مصطلح "الوقف العلمي المؤبد"، الذي يضمن بكل قوة بقاء رسالة الجامعة واستقلالها المادي وقوة تأثيرها على الأجيال اللامتناهية من الطلبة والأساتذة. لا تزال جامعة القرويين، بمكتبتها الوطنية الضخمة النادرة المليئة بالمخطوطات القديمة وأبوابها الخشبية المنحوتة وفنائها الرخامي الذي تفوح منه رائحة المعرفة والزليج الأندلسي العتيق والفسيفساء، تذكرنا كل يوم وفي صمت مهيب بتلك السيدة العظيمة. إن إرث فاطمة يعلمنا ويعظنا دائماً أن الاستثمار في العقول وتربيتها ونشر العلوم الدينية والدنيوية النافعة هو أقوى وأبقى وأصلب أشكال البناء الإنساني عبر تاريخ حضارتنا الطويل، وأنه السد المنيع ضد الجهل والاندثار.',
                    en: 'Fatima al-Fihriya remains a living symbol of women role in Islamic and Moroccan civilization. Her initiative was not just transient charity but the establishment of a sustainable institution. Al-Qarawiyyin continues to remind us every day of that great woman and her timeless endowment.'
                }
            }
        ],
        conclusion: {
            ar: 'تظل ذكرى السيدة فاطمة الفهرية مجسدة وحاضرة بقوة في وجدان كل طالب علم يمر بممرات القرويين العتيقة، كالأم الرؤوم التي احتضنت بفضل وعيها ثقافة وحضارة أمة بأكملها وحمتها من الضياع والنسيان. إن سيرتها العطرة وقصتها ليست مجرد ذكرى تاريخية ماضية للتباكي، بل هي نبراس حي قوي ومستمر يضيء للمرأة وللمجتمع قاطبة طريق البذل والتفاني لبناء الحضارات المتقدمة والتنافس الخلاق والشريف في ساحات الابتكار والعلوم والأخلاق الإنسانية الراقية.',
            en: 'Fatima al-Fihriya embodies the power of Moroccan women and their pivotal role in making history. Her biography is a continuous beacon for innovation and sciences.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2019/08/29/26330-357117094_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/e/e4/The_Qarawiyyin_Mosque%2C_Fez%2C_Morocco.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/0/02/Bou_Inania_Madrasa_Courtyard_Fez.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/8/87/Fez_Zellige_details.jpg'
        ]
    },
    'sayyida-al-hurra': {
        id: 'sayyida-al-hurra',
        title: { ar: 'السيدة الحرة: حاكمة تطوان الفذة وأميرة الجهاد البحري في المتوسط وأسطورة البحار', en: 'Sayyida al-Hurra: The Formidable Ruler of Tetouan and Princess of Mediterranean Jihad' },
        category: 'figure',
        metaDescription: { ar: 'قصة السيدة الحرة، حاكمة تطوان القوية في القرن السادس عشر، والقائدة البحرية الصلبة التي أدارت تحالفات استراتيجية كبرى وواجهت بحزم واقتدار الغزوات والإمبراطوريات الأوروبية الاستعمارية في البحر الأبيض المتوسط.', en: 'Discover the epic saga of Sayyida al-Hurra, the powerful Governor of Tetouan and Naval Commander who faced the European empires during the 16th century.' },
        intro: {
            ar: 'تُعد السيدة الحرة، واسمها الحقيقي السيدة عائشة، واحدة من أبرز وأقوى الشخصيات السياسية والقيادية النسائية الساطعة في تاريخ المغرب الأقصى والعالم الإسلامي بأسره خلال مجريات وأحداث القرن السادس عشر الصاخب والمشتعل. ولدت عائشة لعائلة بني راشد المرموقة، وهي إحدى العائلات الأندلسية النبيلة الحاكمة والمحاربة التي أُجبرت وتجرعت مرارة النزوح للضفة الأخرى هرباً من مملكة غرناطة نحو المغرب الأقصى القريب بحثاً عن الأمان ومواصلة الجهاد بعد سقوط الفردوس المفقود بيد القوات المسيحية والممالك الإيبرية سنة 1492. لقد تركت هذه المأساة التاريخية العميقة أثراً بالغاً وعقيدة نضالية في نفس السيدة الحرة وشخصيتها القيادية، فزرعت فيها منذ الصغر روح الجهاد العنيفة والتحدي الشامخ المستعصي على الانكسار. سرعان ما صعدت هذه المرأة الموهوبة والذكية لتفرض وجودها وتقلدت أعلى مناصب الحكم وتسيير الشأن العام، لتصبح بعد فترة وجيزة الحاكمة الفعلية والمطلقة لمدينة تطوان الاستراتيجية بشمال المغرب الأقصى، والتي كانت بمثابة الخط العسكري الأمامي والمواجه المباشر للتوسع والغزوات الإيبرية. لقد حكمت السيدة الحرة وأدارت دولاب الدولة بيد من حديد ملفوفة بذكاء دبلوماسي خارق وبراعة نادرة، مما جعل اسمها يتردد بقوة وهيبة في كبرى البلاطات الملكية الإسبانية والبرتغالية التي أدركت تماماً وبكل رعب أن تطوان تحت قيادتها ليست مجرد قلعة محلية صغيرة، بل قوة بحرية وتجارية عظمى تتحكم بفاعلية بالغة في مضيق جبل طارق وحوض البحر الأبيض المتوسط الغربي.',
            en: 'Sayyida al-Hurra is one of the most important political and leadership figures in Moroccan history during the 16th century, ruling Tetouan with intelligence and power and facing European ambitions at sea.'
        },
        sections: [
            {
                title: { ar: 'بناء وحماية أسوار تطوان وتوطيد الاستقلال السياسي والعسكري التام', en: 'Building Tetouan and Solidifying Independence' },
                content: {
                    ar: 'لم يقتصر دور ومجهود السيدة الحرة التاريخي على كونها مجرد قائدة عسكرية محاربة فحسب، بل برزت أولاً وبشكل لافت في مهاراتها الاستثنائية كبناءة وعمرانية وإدارية فذة أعادت تشكيل التضاريس. فقد أشرفت وتتبعت بنفسها وحرصها على مجمل عمليات إعادة بناء وتطوير مدينة تطوان من أطلالها الدارسة، مستلهمة في تصميماتها ورؤيتها الساحرة الطراز الأندلسي البديع والأصيل الذي جلبته عائلتها معها من غرناطة. وقامت بشكل استعجالي بتحصين المدينة المدمرة بأسوار ضخمة وقلاع منيعة تتحدى المدافع الحديثة، وجعلت منها خلال سنوات قليلة مركزاً نابضاً ومزدهراً للتجارة الدولية والملاحة البحرية والثقافة والفنون والمقاومة الوطنية الشرسة الصامدة. ازدهرت تطوان في عهدها الذهبي لتصبح معقلاً حصيناً آمناً للأندلسيين الفارين من بطش محاكم التفتيش الإسبانية المتطرفة والمجازر الوحشية، حيث وفرت لهم السيدة الحرة عبر سياساتها الحماية الكاملة والمأوى والكرامة المفقودة والاندماج السلس. وفي ظل حكمها القوي الشامخ، أدارت ببراعة نادرة علاقة ندية صارمة مع القوى العظمى الاستعمارية التوسعية آنذاك – متبوعة بالبرتغال وإسبانيا – ولم تتردد للحظة واحدة في فرض سيادتها المطلقة وعقد أصعب المفاوضات التجارية والعسكرية والسياسية وجهاً لوجه كأسطورة حية ومحاربة شجاعة تفرض الإجلال لقرارات سيادية عليا تخص أمن ومصلحة بلادها أولاً وأخيراً.',
                    en: 'Sayyida al-Hurra not only ruled but fundamentally rebuilt Tetouan, drawing on Andalusian aesthetic styles. Under her strong hand, she fiercely managed relations with Portugal and Spain, imposing her sovereignty and engaging directly in negotiations and maritime defense.'
                }
            },
            {
                title: { ar: 'التحالف الإستراتيجي مع قراصنة البحر والأسطول العثماني بقيادة بربروسا العظيم', en: 'Strategic Naval Alliances and Barbarossa' },
                content: {
                    ar: 'أدركت وأيقنت السيدة الحرة مبكراً وفي لحظات حاسمة، بفضل دهائها العسكري المحنك وفهمها السياسي العميق، أن الحفاظ المستدام على استقلال تطوان وضمان سيادة السواحل المغربية شمالاً يتطلب ضرورة بناء وإعداد قوة بحرية ضاربة ورادعة لا يستهان بها في معادلات المتوسط. لذلك، أقدمت وأبرمت السيدة تحالفاً تاريخياً وثيقاً وقوياً جداً مع القائد والأسطول العثماني الشهير "خير الدين بربروسا" والبحارة المجاهدين الأشداء المرابطين في ثغور الجزائر المتأهبة لمواجهة التفوق التكنولوجي والغطرسة الأوروبية الصليبية في مياه البحر الأبيض المتوسط. بفضل هذا التحالف العسكري المحكم والتنسيق التكتيكي العميق في التجسس ونصب الكمائن البحرية، نجحت بقوة وثبات القوات البحرية المشتركة في إحباط وصد العديد من الهجمات، وشن عمليات اعتراض وتطويق ضارية ومستمرة ضد الأساطيل التجارية والحربية والقوافل الإسبانية والبرتغالية الثقيلة. أصبحت السيدة الحرة إثر ذلك بسنوات وجيزة أميرة وسيدة بلا منازع للجهاد البحري والملاحة، وكان نفوذها يمتد بقوة وهيمنة واضحة على طول المياه الإقليمية الغربية للبحر المتوسط والمضيق. إن تلك الانتصارات المدوية المتوالية لم تكن فقط بغرض حماية التراب وحدود الوطن، بل كانت رسالة واضحة وصريحة مفادها أن النكسة العظيمة للمسلمين بسقوط قرطبة وثم غرناطة لم تنسف قط روح الدفاع الثابت واستعادة الكرامة للمسلمين ولروحهم المتأهبة دوماً لرد الاعتبار.',
                    en: 'Understanding the necessity of coastal defense, Sayyida al-Hurra allied with the famous Ottoman commander Hayreddin Barbarossa. This formidable alliance of privateers completely disrupted Spanish and Portuguese fleets, ensuring sovereignty across the Western Mediterranean.'
                }
            }
        ],
        conclusion: {
            ar: 'تظل السيدة الحرة حتى يومنا هذا، وإلى الأبد المديد، رمزاً للسيادة والشموخ الوطني المغربي والمرأة الحرة المستقلة. إن قصتها الأسطورية ومسيرتها العسكرية تجسد واقعياً كيف يمكن للذكاء والدهاء السياسي، والصلابة الفتية والعقيدة العسكرية الراسخة، والإرادة الصادقة وحب الوطن أن تهزم بشكل ساحق أعتى الإمبراطوريات التوسعية قاطبة. لقد حفرت السيدة اسمها ونقشته بأحرف من ذهب ورصاص في دفاتر التاريخ كأميرة قوية وزعيمة فذة هزت عروش ممالك أوروبا الغربية وقادت سفن الكرامة والجهاد في واحدة من أكثر حقب التاريخ شدة وتوتراً.',
            en: 'Sayyida al-Hurra remains a symbol of Moroccan sovereignty and loftiness in the face of great challenges. Her story embodies how intelligence and will can defeat the mightiest of empires.'
        },
        videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5361-182312675_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/c/cd/Tetouan_Medina.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/2/23/Martil_beach_and_mountains.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/a/ad/Moroccan_navy_ship.jpg'
        ]
    }
};

export const getArticle = (id: string, nameAr: string, nameEn: string, category: 'battle' | 'landmark' | 'city' | 'figure'): MoroArticle => {
    if (moroverseArticles[id]) return moroverseArticles[id];

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
        conclusion: {
            ar: `في الخلاصة الجامعة المانعة والمؤكدة، تظل ${nameAr} وستبقى شاهدة أمينة وصادقة وعزماً جباراً على عظمة وتفرد إرادة أمة لا تلين أو تنكسر، مستقاة من إرث حضاري وديني وثقافي وجغرافي عميق ومتشعب يرفض رفضاً قاطعاً التهميش والتبعية ويثبت تفوقه الإنساني والحضاري الراقي في كل زمان ومكان بإذن الله وتوفيقه الدائم لتراب هذا الوطن المبارك المعطاء. إن هذا الفخر الجماعي الذي نستقيه من أريج وأخبار وقصص ${nameAr} هو الوقود الحقيقي والأصيل الذي يمضي به شباب المملكة والأجيال الصاعدة بثبات وعزم وحزم وإصرار كامل في طريق بناء الحاضر الماهر وتأسيس الغد الأفضل المشرق وتخليد المكانة الأسمى وسط الأمم دون تردد أو وهن، مستلهمين من ذلك المجد الغابر نوراً وهداية وشموخاً وطيداً وحباً عميقاً ومخلصاً لثرى مملكتنا العريقة والأصيلة التي ضربت أطنابها بكل قوة وعزم في عمق التاريخ البشري والإنساني منذ الأزل الجميل الممتد بصفحات الأمجاد وروايات البناء والحرية.`,
            en: `In an unyielding conclusion, ${nameEn} rigidly remains a prime witness to the greatness, uniqueness and highly unyielding will of a massive nation drawing deeply from civilization. This legacy is the fuel moving the Moroccan generation steadily and courageously into a very bright and prosperous and advanced future.`
        },
        videoUrl: 'https://cdn.pixabay.com/video/2016/09/21/5361-182312675_large.mp4',
        gallery: [
            'https://upload.wikimedia.org/wikipedia/commons/e/ee/Hassan_II_Mosque_1.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/e/e4/The_Qarawiyyin_Mosque%2C_Fez%2C_Morocco.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/1/1a/Gibraltar1.jpg'
        ]
    };
};
