const fs = require('fs');
const path = require('path');

const content = `export interface ArticleSection {
    title: { en: string; ar: string };
    content: { en: string; ar: string };
}

export interface ArticleFAQ {
    question: { en: string; ar: string };
    answer: { en: string; ar: string };
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
    generatedImage?: string; // Phase 3 Original Content
}

export const moroverseArticles: Record<string, MoroArticle> = {
    'tangier': {
        id: 'tangier',
        title: {
            ar: 'طنجة: عروس الشمال وبوابة إفريقيا الشامخة عبر العصور',
            en: 'Tangier: The Bride of the North and the Majestic Gateway of Africa'
        },
        category: 'city',
        metaDescription: {
            ar: 'استكشف طنجة، المدينة المغربية الأسطورية التي شكلت ملتقى الحضارات الإنسانية. من أسوار القصبة العتيقة إلى مغارة هرقل، رحلة في عمق التاريخ والأمجاد.',
            en: 'Explore Tangier, the mythical Moroccan city combining epic history, coastal fortresses, and a rich melting pot of human civilizations.'
        },
        intro: {
            ar: 'تتربع مدينة طنجة بفيحاء وشموخ على الطرف الشمالي للمملكة المغربية، لتعانق بشغف مضيق جبل طارق العظيم، حيث تمتزج أمواج البحر الأبيض المتوسط الهادئة بهدير المحيط الأطلسي المتمرد. إنها ليست مجرد حاضرة نابضة بالحياة وحسب، بل هي كتاب مفتوح وموثق وشاهد حي على تواتر وتمازج أعظم الحضارات الإنسانية التي مرت عبر البوابة الإفريقية. لقد استلهمت طنجة من موقعها العبقري قوة فريدة مكنتها من أن تكون مهد الأساطير الإغريقية، ومدينة دولية ألهبت خيال المبدعين، وقلعة من قلاع المجد المغربي العصية على الانكسار أو الغياب.',
            en: 'Tangier perches majestically at the northern tip of the Moroccan Kingdom, embracing the Strait of Gibraltar where the Mediterranean meets the Atlantic. It is an open book of humanitys greatest civilizations.'
        },
        generatedImage: '/images/epic/tangier_cinematic_1772056832346.png',
        sections: [
            {
                title: { ar: 'مغارة هرقل وأسطورة الانتماء الأزلي', en: 'Caves of Hercules and Mythological Roots' },
                content: {
                    ar: 'تمتد أصول مدينة طنجة إلى أبعد حدود الزمن والأسطورة، فجذورها تضرب في عمق التاريخ المكتوب وغير المكتوب، متجاوزة أكثر من ألفي ونصف قرن. وتشير الروايات الأسطورية الإغريقية إلى أن اسم طنجة مستمد من "تنجيس"، وهي زوجة البطل الأسطوري أنتايوس، الذي يزعم التراث القديم أن هرقل العظيم صرعه في معركة درامية هائلة. وحسب هذه الأساطير الخالدة، فإن هرقل ضرب الجبل الجبار ليشق مضيق جبل طارق ويفصل القارتين العظيمتين إفريقيا وأوروبا، ثم قرر أن يتخذ من المغارة القريبة ملاذًا ومثوى للراحة. لا تزال "مغارة هرقل" القابعة في أحضان المحيط الأطلسي اليوم تقف كشاهد أطلال حي بفتحتها العجيبة المطلة على البحر والتي رُسمت بشكل طبيعي مدهش على هيئة خريطة قارة إفريقيا المقلوبة. هذه المغارة ليست مجرد تشكيل صخري جيولوجي مبهر، بل هي بوابتنا الحقيقية لقراءة السيرة الأولى للمخيال الإنساني الذي ألهمته الطبيعة المغربية البكر، وظل يحيك حولها حكايات من المجد والقوة والسحر لا تنضب ولا تُمحى أبدًا.',
                    en: 'Tangier’s origins extend deep into myth, linked to Tingis and Hercules himself, who supposedly rested in the iconic Caves of Hercules. This natural wonder overlooks the Atlantic and remarkably forms the shape of Africa.'
                }
            },
            {
                title: { ar: 'العهد الذهبي والمنطقة الدولية: قبلة الأدباء والجواسيس', en: 'International Zone: A Haven for Writers and Spies' },
                content: {
                    ar: 'خلال منتصف القرن العشرين، وتحديداً من عام 1923 إلى استقلال المملكة، عاشت طنجة واحدة من أشد فتراتها زخماً وبريقاً وأكثرها تعقيداً على الإطلاق، حيث كانت تحظى بوضع دولي خاص واستثنائي أدارته عدة قوى أجنبية مشتركة. هذا الوضع الجيوسياسي العجيب حوّل المدينة إلى فسيفساء كونية مصغرة وملاذًا مذهلاً للعلماء، الدبلوماسيين، الفنانين البوهيميين، والتجار، وحتى أخطر شبكات التجسس العالمية المترامية في أزقتها الضيقة ومقاهيها المشهورة مثل مقهى الحافة. لقد جذب سحر هذه الحاضرة الفريدة عمالقة الأدب والفن العالميين، في هذه المرحلة الغنية، ازدهر الاقتصاد الحر وتبودلت الأفكار والعملات بشتى أشكالها، ولكن رغم هذا الذوبان الدولي الهائل، ظلت الروح المغربية الأصيلة، المتمثلة في مساجد طنجة العتيقة وأسوار قصباتها وأسواقها في المدينة القديمة، تقاوم الذوبان بكل ضراوة؛ لتؤكد دوماً أن الأرض مهما اكتست بثوب دولي، فهي تنبض بهوية مغربية صرفة في قلبها وروحها وعزيمتها لا يمحوها تقادم الأزمان وتكالب المستعمر.',
                    en: 'During its time as an International Zone (1923-1956), Tangier became an intoxicating hub for diplomats, artists like Paul Bowles, and even spies. Yet, amidst this global melting pot, the authentic Moroccan spirit fiercely preserved its identity.'
                }
            },
            {
                title: { ar: 'خطاب طنجة التاريخي: وثيقة التحدي والاستقلال', en: 'The Historic Speech of Tangier: Defiance and Independence' },
                content: {
                    ar: 'لا يمكن أبداً كتابة تاريخ استقلال المملكة المغربية دون الوقوف بإجلال أمام المحطة الحاسمة، والتاريخية الفاصلة في قلب مدينة طنجة. في التاسع من أبريل عام 1947، أقدم جلالة المغفور له الملك محمد الخامس على خطوة في غاية الجرأة والشجاعة بزيارته التاريخية للمدينة الدولية متجاوزاً بذلك كل العقبات والموانع التي فرضتها سلطات الحماية الفرنسية آنذاك. ومن حدائق المندوبية بوسط طنجة، ألقى جلالته خطابه الشهير المدوي الذي زعزع أركان الاستعمار وأسس لبداية النهاية للتواجد الأجنبي. لقد كان الخطاب إعلاناً واضحاً وجريئاً، ورسالة قوية للعالم بأسره لا لبس فيها: المغرب أمة واحدة موحدة، لا تتجزأ، ومتمسكة بثبات لا يلين بانتمائها لمحيطها العربي والإسلامي. تجاوبت حشود الملايين من المغاربة مع هذا النداء الملكي السامي بوفاء منقطع النظير، مما أشعل شرارة الحركات الوطنية والمقاوِمة في كافة ربوع البلاد، لتصبح طنجة منذ ذلك اليوم المجيد بمثابة المهد الحقيقي للشرعية الوطنية والوحدة الترابية المقدسة.',
                    en: 'On April 9, 1947, King Mohammed V made a historic and daring visit to Tangier, delivering a monumental speech that officially demanded Morocco’s independence and galvanized the national resistance against French and Spanish colonizers.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'ما هو سر تسمية طنجة بعروس الشمال؟', en: 'Why is Tangier called the Bride of the North?' },
                answer: { ar: 'يُطلق عليها هذا اللقب بسبب موقعها الجغرافي الخلاب المطل المزدوج على المحيط الأطلسي والبحر المتوسط، وبياض مبانيها الزاهي الناصع الذي يضفي عليها طابعاً رومانسياً كعروس متلألئة تحت أشعة الشمس.', en: 'It is named so due to its stunning dual coastal location on the Atlantic and Mediterranean, combined with its pristine white buildings that glisten majestically brightly under the sun.' }
            },
            {
                question: { ar: 'ما أهمية مقهى الحافة تاريخياً؟', en: 'What is the historical significance of Cafe Hafa?' },
                answer: { ar: 'هو مقهى أسطوري تأسس عام 1921 على واجهة صخرية تطل على إسبانيا، وكان مقصداً لأبرز أدباء العالم والساسة العالميين، ولا يزال يحتفظ بطابعه التقليدي الأصيل وأكواب الشاي بالنعناع المميزة.', en: 'Established in 1921 on a cliff overlooking Spain, it was an legendary haven for world-renowned writers and politicians, preserving its authentic traditional charm today.' }
            },
            {
                question: { ar: 'متى انتهى العهد الدولي في طنجة؟', en: 'When did the international era end in Tangier?' },
                answer: { ar: 'انتهى النظام الدولي تماماً بمجرد نيل المملكة المغربية استقلالها التام سنة 1956، حيث عادت طنجة لحضن الوطن الأم لتصبح درة التاج في خريطة الشمال المغربي المزدهر.', en: 'The international regime ended completely with Moroccos highly celebrated absolute independence in 1956, returning Tangier securely to the sovereignty of the motherland.' }
            }
        ],
        conclusion: {
            ar: 'وختاماً، تظل طنجة وستبقى منارة الحضارات وحارسة للمضيق الأعظم. إنها المدينة التي لم تتنازل أبداً عن كبريائها الإفريقي وجوهرها المغربي وأصيلها الإسلامي برغم توارد الأعراق واللغات عليها، لتكتب بمياه محيطها وبحرها أعظم القصص التي لا تعرف النهاية.',
            en: 'Tangier deeply remains the beacon of civilizations and the guardian of the great strait, writing stories embedded in its ocean waters forever.'
        }
    },
    'battle-of-isly': {
        id: 'battle-of-isly',
        title: {
            ar: 'معركة إسلي: ملحمة الشرف والفداء على ضفاف وجدة الخالدة',
            en: 'Battle of Isly: The Epic of Honor and Sacrifice by the Banks of Oujda'
        },
        category: 'battle',
        metaDescription: {
            ar: 'تحليل دقيق وعميق لمعركة إسلي العظمى عام 1844، حيث جسد فيها الجيش المغربي أسمى أشكال التضامن الإسلامي والصمود العسكري في وجه الاستعمار الفرنسي لحماية الأشقاء.',
            en: 'A profound strict historical analysis of the Battle of Isly (1844), exploring Moroccan military sacrifice, cavalry courage, and Islamic solidarity against colonial expansion.'
        },
        intro: {
            ar: 'لقد سجل تاريخ مملكتنا المغربية صفحات مشرقة بمداد من الفخر والعنفوان، ولعل أسطع وأمجد هذه الصفحات هي "معركة إسلي" التي دارت رحاها الطاحنة في 14 أغسطس عام 1844. لم تكن هذه المعركة الحاسمة مجرد اشتباك حدودي عابر أو صدام عسكري تقليدي بين جيشين، بل كانت تجسيداً عظيماً وعميقاً لمبدأ الأخوة الإسلامية والوفاء الاستراتيجي القاطع والراسخ للمملكة المغربية تجاه أشقائها في الجزائر إبان المحنة الاستعمارية. لقد اندلعت هذه الحرب الطاحنة نتيجة للموقف المبدئي والشجاع للمغرب بقيادة السلطان المولى عبد الرحمن بن هشام، الذي رفض بشكل قاطع الاستجابة للتهديدات والمطالب الفرنسية المتكررة بالتخلي عن دعم المقاومة الجزائرية الباسلة بقيادة الأمير عبد القادر الجزائري وثواره الشجعان. إن أرض إسلي، الواقعة بالقرب من وجدة الباسلة، رويت بدماء الشهداء المغاربة الذين امتطوا جيادهم الأصيلة وحملوا سيوفهم واندفعوا بشجاعة أسطورية غير مسبوقة لمواجهة أحدث آلة عسكرية وتكنولوجية أوروبية في ذلك العصر المعقد، مخلدين بذلك ملحمة من التضحية ستطبع بذاكرتها وجدان الأجيال مدى الحياة.',
            en: 'The Battle of Isly is one of the most brilliant and proud pages in Moroccan history. Fought on August 14, 1844, it was fundamentally driven by Moroccos unwavering Islamic solidarity with the Algerian resistance against fierce French colonial forces.'
        },
        generatedImage: '/images/epic/isly_cinematic_1772056874035.png',
        sections: [
            {
                title: { ar: 'مقدمات المعركة والموقف السلطاني الثابت الذي لا يلين', en: 'Prelude and the Unyielding Sultanate Stance' },
                content: {
                    ar: 'إن جذور الصراع والتصعيد الدرامي الذي قاد إلى معركة إسلي يعود أساساً إلى الانتصارات المبهرة والمتتالية التي حصدتها المقاومة الجزائرية بدعم وغطاء مغربي سخي ومفتوح. عندما اشتد الخناق العسكري على القوات الفرنسية الغازية وتكبدت خسائر، أدركت السلطات الاستعمارية العسكرية أن هزيمة الأمير عبد القادر مستحيلة تماماً ما دام المغرب موفراً للعمق الاستراتيجي، المؤن، السلاح، والدعم المعنوي غير المحدود والثابت. وعلى إثر ذلك، وجهت فرنسا الإنذارات شديدة اللهجة للسلطان المولى عبد الرحمن للحد من هذا الدعم الحيوي واشترطت تسليم المجاهدين، لكن الرد الملكي المغربي جاء حازماً وقاطعاً ومستمداً من القيم ومكارم الأخلاق الإسلامية الخالصة برفض كل وسائل الخيانة لأخوة المصير المشترك والدين الواحد. أمام هذا الثبات العظيم والصمود الأخلاقي النبيل والسياسي الشديد، قررت فرنسا حسم الأمر واللجوء للقوة العسكرية المفرطة والقصف العشوائي للمدن الساحلية المغربية كطنجة والصويرة لترهيب المملكة وإركاعها تمهيداً للتوغل البري والصدام والاجتياح.',
                    en: 'French forces realized defeating the Algerian resistance was completely impossible as long as Morocco provided strategic depth and unlimited support. Sultan Moulay Abd al-Rahman categorically refused French demands to surrender the resistance fighters.'
                }
            },
            {
                title: { ar: 'بطولات الفرسان المغاربة والتفوق التكنولوجي الغاشم', en: 'Moroccan Cavalry Heroism and Asymmetric Technology' },
                content: {
                    ar: 'عندما انطلقت شرارة المعركة فجر يوم 14 غشت، كان المشهد العسكري غير متكافئ تماماً وصعباً من الناحية التكتيكية والعتاد الثقيل. حشدت القوات الفرنسية جيشاً نظامياً مدججاً بالمدفعية الثقيلة وسلاح المشاة المنظم والمحمي بتشكيلات تكتيكية محكمة، في المقابل اعتمد الجيش المغربي، تحت قيادة سيدي محمد نجل السلطان، وبشكل شبه كلي على عشرات الآلاف من فرسان القبائل المغربية الأصيلة، والمقاومين المتطوعين من متطوعي الزوايا الذين جاؤوا من مختلف مناطق البلاد تلبية لنداء الجهاد والدفاع الوطني المقدس. ورغم الفارق المهول في التسليح والخبرة التكتيكية الحديثة، اندفع الفرسان المغاربة بروح استشهادية فذة كالسيول الجارفة وبشجاعة أرعبت جنرالات العدو نفسهم ووثقوها في مذكراتهم ورسائلهم بانبهار تام. لقد استخدموا تكتيكات الكر والفر والهجوم الشامل العنيف الموحد وسط غبار المعركة الكثيف الذي حجب ضوء الشمس الساطعة، وكادوا في عدة لحظات وحاسمة أن يخترقوا صفوف المشاة الفرنسيين وخططهم لولا الكثافة النارية الساحقة والقاتلة لمدفعية العدو الحديثة والميدانية المتطورة التي قلبت موازين المواجهة حتماً وبشكل جذري.',
                    en: 'The battle featured highly asymmetric warfare. Despite facing heavily armed French infantry and modern devastating artillery, the Moroccan fierce cavalry charged with legendary courage, executing unified sweeping strikes that shocked the enemy command.'
                }
            },
            {
                title: { ar: 'النتائج التاريخية والمعاهدات: ثمن التمسك بالمبادئ والشرف', en: 'Historical Repercussions: The Massive Price of Principles' },
                content: {
                    ar: 'أسفرت المعركة الدامية والصعبة عن خسائر فادحة في أرواح الشهداء من الفرسان المغاربة النبلاء، لكنها لم تكسر من عزيمتهم ولا ولائهم للمملكة وللعرش المجيد وإلى يومنا هذا. لقد حتمت الظروف الجيوسياسية والعسكرية الميدانية إجبار الجانب المغربي على إبرام وتقبل اتفاقية طنجة المجحفة ثم معاهدة لالة مغنية الصعبة لترسيم الحدود تحت ضغط المدافع الثقيلة. رغم هذه الهزيمة العسكرية المؤلمة والاستراتيجية والمرحلية الموثقة، إلا أن معركة إسلي تعتبر في طيات التاريخ الإسلامي والتحليل الأكاديمي انتصاراً أخلاقياً كبيراً وسامقة للمغرب وتاجاً فوق الرؤوس، لأنها برهنت بما لا يدع مجالاً لأي أدنى شك في أن المغرب مستعد دوماً وقادر فعلياً وحرفياً للتضحية الكلية وجعل أرواحه رهناً في سبيل استقلال وكرامة وبقاء وحرية الأمة الإسلامية والإفريقية العظيمة وجيرانه مهما كان الثمن المهول والتحدي البشع والضخم للغاية.',
                    en: 'Although resulting in severe loss of life and imposing the harsh Treaty of Lalla Maghnia, the battle stands firmly as a massive moral victory, proving Moroccos total willingness to fiercely sacrifice its soul for African and Islamic unity and honor.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'أين تقع ساحة معركة إسلي بالتحديد؟', en: 'Where precisely is the battlefield of Isly located?' },
                answer: { ar: 'وقعت المعركة على ضفاف نهر إسلي العظيم التاريخي المتواجد والمحاذي لمدينة وجدة المتجذرة في أقصى جهة الشرق للمملكة المغربية قرب الحدود المشتركة الحالية.', en: 'The battle aggressively occurred on the historical banks of the Isly River, located near the fiercely grounded city of Oujda in the far east of the Kingdom.' }
            },
            {
                question: { ar: 'من كان يقود الجيش المغربي خلال الملحمة الضخمة؟', en: 'Who led the Moroccan army during this massive epic?' },
                answer: { ar: 'كان الجيش الهائل والفرسان الأبطال تحت قيادة الفذ سيدي محمد، الذي أصبح لاحقاً السلطان محمد الرابع، وقد أظهر شجاعة وصموداً استحق التنويه والتخليد العميق.', en: 'The immense army and noble cavalry were bravely led by Sidi Mohammed (later Sultan Mohammed IV), showing incredible unyielding bravery against the odds.' }
            },
            {
                question: { ar: 'ما هو التأثير الحقيقي لمعركة إسلي على مستقبل المغرب السياسي؟', en: 'What was the true impact of the Battle of Isly on Moroccos geopolitical future?' },
                answer: { ar: 'لقد كشفت الهزيمة المؤلمة عن تأخر كبير في المنظومة التكنولوجية مقارنة بأوروبا، وسرّعت بشكل عاجل وحاسم وصارم خطط وإصلاحات الجيش والاقتصاد في عهد السلاطين اللاحقين بقوة.', en: 'The painful loss exposed technological gaps and urgently massively accelerated crucial military and structural reforms initiated by subsequent progressive Sultans.' }
            }
        ],
        conclusion: {
            ar: 'لتظل وتستمر معركة إسلي درساً تاريخياً استثنائياً عظيماً وباباً مشرعاً ونافذة مبهرة على روح الفداء والتلاحم الإسلامي الراسخ الأصيل. لم ينهزم الشرفاء في ميدان الحقائق العليا يوماً، بل كتبوا وأسسوا بدماء أرواحهم قصائد كرامة ومجد وعز لن تُنسى أبداً من ذاكرة المملكة الشريفة الأبدية والخالدة عبر عصور وأجيال متعاقبة بإذن الله وفضله ونوره.',
            en: 'The Battle of Isly permanently remains an exceptionally profound historical lesson on absolute sacrifice, confirming that honorable noblemen write their magnificent epics of dignity permanently with their noble steadfast blood for the Kingdom forever.'
        }
    },
    'hassan-ii-mosque': {
        id: 'hassan-ii-mosque',
        title: {
            ar: 'مسجد الحسن الثاني: منارة الإسلام الخالدة على أمواج المحيط',
            en: 'Hassan II Mosque: The Eternal Beacon on the Ocean Waves'
        },
        category: 'landmark',
        metaDescription: {
            ar: 'مسجد الحسن الثاني بالدار البيضاء، تحفة معمارية إسلامية فريدة. اكتشف هندستها المهيبة الممتدة فوق البحر الأطلسي وجمالية الصناعة التقليدية المغربية الأصيلة بدقة 8K الثورية.',
            en: 'Hassan II Mosque in Casablanca, explore its epic architecture extending completely over the vast Atlantic ocean showcasing authentic Moroccan traditional craftsmanship.'
        },
        intro: {
            ar: 'يعد مسجد الحسن الثاني، المنتصب بشموخ وكبرياء على شواطئ مدينة الدار البيضاء، واحداً من أعظم الإنجازات المعمارية في أواخر القرن العشرين، حيث يمثل تزاوجاً مثالياً بين الأصالة المغربية العريقة والحداثة الهندسية المبتكرة. لم يُصمم هذا الصرح الديني ليكون مجرد مكان للعبادة وإقامة الشعائر الدينية، بل ليقف كرمز خالد للهوية الإسلامية والمغربية، جامعاً بين التقاليد الموروثة عبر قرون من الزمن وأحدث التقنيات الهندسية المعاصرة في مجالات البناء والعمارة. بُني المسجد بتوجيه ومتابعة شخصية من جلالة المغفور له الملك الحسن الثاني، الذي استلهم موقع البناء الاستثنائي من الآية القرآنية الكريمة: "وَكَانَ عَرْشُهُ عَلَى الْمَاءِ"، ليجعل من هذا الصرح العظيم منارة روحية تطل على المحيط الأطلسي العظيم وتربط بين قارات العالم. إن الوقوف أمام هذا المسجد يبعث في النفس رهبة وإجلالاً لامثيل لهما، حيث ترتفع مئذنته الشاهقة إلى عنان السماء كأصبع يتشهد بوحدانية الخالق عز وجل، مبحرًا في عباب الأطلسي ليربط حاضر الأمة الإسلامية وماضيها التليد بابتكار وإبهار مستمر.',
            en: 'The Hassan II Mosque is truly one of the greatest global architectural and religious achievements of the twentieth century. Standing towering and massively proudly, it acts as an eternal symbol of flawless Islamic and Moroccan absolute rich traditional identity.'
        },
        generatedImage: '/images/epic/hassan2_cinematic_1772056915559.png',
        sections: [
            {
                title: { ar: 'تزاوج الفن التقليدي والهندسة الفائقة الحديثة الشامخة', en: 'The Flawless Marriage of Traditional Art and Supreme Engineering' },
                content: {
                    ar: 'لقد كان تشييد المعلمة إنجازاً بشرياً هائلًا يتحدى كل قوانين وإمكانيات الطبيعة، فقد أبدع أكثر من اثني عشر ألفاً من المعلمين (الصناع التقليديين) القادمين بمهاراتهم التاريخية من العواصم العلمية للمغرب كفاس ومراكش. استخدموا بحرفية لا تخطئ خشب الأرز النادر والمقدس من غابات الأطلس، والرخام الأبيض الملكي الأصيل، والجبس الزخرفي المنحوت بدقة تدهش أمهر الجراحين والفنانين ليخلقوا لوحات فسيفسائية لا بداية لنهايتها. من جهة المهندسين، تم ابتكار سقف يزن مئات الأطنان ويفتح آلياً في أقل من ثلاث دقائق للاستمتاع بالسماء الصافية وأشعة الشمس الساطعة ونسمات الأطلسي. إن صب الخرسانات الضخمة في عمق البحر لمحاربة أمواج المحيط العاتية والملوثات البحرية الكيميائية كان تحدياً دولياً تغلبت عليه الخبرات المغربية والأجنبية بصبر وكفاءة ليوثق هذا المنجز بحروف النور والذهب الخالص المدهش لكل زائر، معماري كان أو مجرد سائح عادي عابر للقارات بقلبه وشغفه.',
                    en: 'Constructing this monumental marvel was an absolute massive human feat challenging the laws of untamed nature. Over twelve thousand traditional Moroccan craftsmen collaborated with supreme engineers to sculpt rare cedar, pristine marble, and deploy an automated ceiling against the oceans.'
                }
            },
            {
                title: { ar: 'الإشعاع الروحي والثقافي العميق وتجاوز حدود المكان والزمان', en: 'Deep Spiritual Radiance Transcending Total Limits' },
                content: {
                    ar: 'لا تقتصر عظمة مسجد الحسن الثاني على المأذنة الشاهقة والمساحة المذهلة، بل تمتد لتغذي الأرواح وتجمع الأفئدة خلال صلوات التراويح وليلة القدر في شهر رمضان المعظم. تتسع الساحات الخارجية والداخلية لمئات الآلاف من المؤمنين لتتحول الدار البيضاء برمتها إلى محج إسلامي نابض بالسكينة والتضرع والذكر. إضافة إلى ذلك، يحتوي المبنى والمجمع الضخم على مكتبة متطورة وحديثة ومدارس دينية عتيقة ومتحف يوثق بكل ثقة وتفصيل روعة وجمال البناء ومراحله العسيرة الطويلة. في كل زاوية ونقش وباب نحاسي عظيم، هنالك قصة إخلاص وعمل دؤوب تعكس وتشرح وبكل دقة التزام هذا البلد الآمن بحماية الهوية الإسلامية ونشر قيم التسامح والاعتدال والتفكر والعبادة والوسطية المتزنة والمستقيمة للعالم قاطبة ليل نهار ولعصور قادمة من الأجيال الباحثة في كينونة وجمال الدين الحنيف الشامخ العظيم الذي يُرسخ العقيدة المشرقة النيرة.',
                    en: 'The absolute greatness of the mosque transcends its breathtaking dimensions explicitly to continuously nourish global souls. During Ramadan, specifically Laylat al-Qadr, hundreds of thousands of worshippers actively gather harmoniously transforming Casablanca completely into a massive pulsing spiritual sanctuary of pure peace.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'ما هو ارتفاع مئذنة المسجد الشاهقة وكيف تم تصميم بنيانها الصلب القوي؟', en: 'What is the incredible height of the majestic minaret and how was its foundation built?' },
                answer: { ar: 'ارتفاع المئذنة 210 أمتار مذهلة ومبهرة، تم تجهيزها خصيصاً بشعاع ليزر متطور ودقيق يتجه بثبات نحو مكة المكرمة بأكثر من 30 كيلومتر، ليضيء بحق دروب المحيط والظلام لجميع السفن والبواخر المبحرة المتوجهة والغادية.', en: 'The minaret is an astonishing 210 meters flawlessly tall. It is aggressively and beautifully equipped with a massive laser securely pointing continuously directly firmly towards Mecca.' }
            },
            {
                question: { ar: 'هل يسمح للسياح الوافدين من الديانات الأخرى باستكشاف ودخول أرجاء المعلمة؟', en: 'Are tourists from other diverse global religions allowed to enter and explore?' },
                answer: { ar: 'نعم ومن المؤكد بكل ترحاب وتسامح مغربي، المسجد هو من المواقع الندرة والرائدة في المملكة التي تشرع أبوابها بالكامل للزوار ضمن جولات إرشادية منظمة تعكس الانفتاح الفكري الحضاري الأصيل والضيافة الراقية والفخمة للمملكة.', en: 'Yes with welcoming absolute Moroccan tolerance. The mosque opens its massive regal highly decorated doors securely warmly to global visitors via comprehensively respectful and flawlessly guided architectural grand tours.' }
            },
            {
                question: { ar: 'ما هو الهدف الرئيسي من السطح الآلي الضخم والمتحرك للمسجد العريق الممتد والمتطور؟', en: 'What is the grand purpose of the automated retractable massive roof?' },
                answer: { ar: 'السطح يزن طناً من الحديد المكسي بأخشاب الزخرفة، غايته إدخال البهجة والضوء الطبيعي النقي ونسمات هواء المحيط المنعش المنظف للمصلين خلال الاحتفالات والأعياد لتجسيد التواضع بين يدي الخالق في الطبيعة والكون.', en: 'The colossal roof weighs tons composed of flawless decorated woods, its noble goal is simply warmly introducing pure natural sunlight and fresh highly revitalizing ocean breezes completely continuously for massive crowds.' }
            }
        ],
        conclusion: {
            ar: 'مسجد الحسن الثاني لم ولن يكون يوماً بنية جامدة خالية من النبض، بل هو جسد حي يتنفس بإيقاع الصلاة والأمواج وإبداعات الصانع المغربي الماهر. سيبقى أبد الدهر رمزاً للمغرب الحاضن الممتد والعظيم، الشديد التمسك بجذوره والمنفتح والمحلق بطموحاته وبنائه نحو غد مشرق يعانق السماء بلا خوف أو وجل ويحفظ تاريخ هذه البقعة الشامخة من الأرض الطاهرة.',
            en: 'The Hassan II Mosque will permanently vividly remain a monumental living pulsing body breathing strictly seamlessly heavily with the rhythm of prayer, unyielding waves, and completely unparalleled artisan creations indefinitely soaring fearlessly onwards to history.'
        }
    },
    'targuist': {
        id: 'targuist',
        title: {
            ar: 'تارجيست: قلعة الريف المهيبة ومهد البطولات التي لا تُقهر',
            en: 'Targuist: The Majestic Fortress of the Rif and Cradle of Unconquerable Epics'
        },
        category: 'city',
        metaDescription: {
            ar: 'تارجيست المنيعة في قلب جبال الريف الأشم، تعرف على تاريخها المقاوم وطبيعتها العذراء وخصائصها المجتمعية النبيلة في واحدة من أرقى التوثيقات الدقيقة بوضوح تام.',
            en: 'Discover the incredibly resilient Targuist, strictly fiercely nesting completely in the breathtaking heart of the ancient historical Rif Mountains. A story of unconquered honor.'
        },
        intro: {
            ar: 'تتوسط جوهرة الريف تارجيست وتتربع بكبرياء في قلب جبال الريف المنيعة والوعرة للمملكة، وهي تمثل الشاهد الحي الناطق على بسالة وصمود وعنفوان قبائل صنهاجة السراير العظيمة التي لا تهاب الصعاب. تاريخها القوي المشرف يشهد على الملاحم والمعارك الكبرى الشرسة ضد التوسع الاستعماري الشرس الغاشم في القرن العشرين. طبيعتها الساحرة الخلابة بغاباتها البكر الكثيفة والأودية الجارية تمنحها حصناً منيعاً استعصى دوماً، وجعل من أهاليها رجالاً أشداء ذوي بأس وثبات راسخ. في تارجيست، يندمج ويعانق وينصهر جمال وسحر الأرض وقسوتها البالغة مع كرامة الإنسان المغربي وشموخه بشكل عضوي متين يخلق هوية فريدة يضرب بها الأمثال في التاريخ العسكري والمجتمعي العريق بكل صرامة وجدية وفخر حقيقي ومستحق تماماً للكلمة ولمعانيها النبيلة الصريحة الحقيقية.',
            en: 'Targuist sits proudly and exceptionally fiercely precisely in the vast rugged heart of the majestic Rif ancient Mountains. It deeply thoroughly overwhelmingly acts as a living testament to the completely absolute unbelievable endurance.'
        },
        generatedImage: '/images/epic/targuist_cinematic_1772056957865.png',
        sections: [
            {
                title: { ar: 'معقل الثورة والمقاومة الباسلة المدوية الشرسة', en: 'Bastion of Heroic and Relentless Resistance' },
                content: {
                    ar: 'ارتبط اسم تارجيست بشكل عضوي ووثيق مع الملاحم والبطولات الخالدة في تاريخ حرب الريف المبهرة الفذة. لقد كانت تارجيست بمثابة القلب الميداني النابض ومقر القيادة الاستراتيجي العسكري المنيع للأبطال الميامين. التضاريس الجبلية الوعرة والمعقدة المتقاطعة للغاية والأحراش الكثيفة المتشابكة وفرت للمقاومين الغطاء المثالي لتنفيذ تكتيكات وخطط حرب العصابات الفتاكة والموجعة التي أرعبت المارشالات والجنرالات الإسبان والفرنسيين وكبدتهم ولأول مرة خسائر لم تشهدها جيوشهم النظامية مطلقاً وفي تاريخهم الحديث كله. إن الصمود الجبار في تارجيست لم يكن فقط مجرد تفوق وخبرة ميدانية في استعمال التضاريس والجبال، بل كان نابعاً من عقيدة إسلامية وطنية بحتة وجهاد لا يقبل المساومة ولا التنازل في وجه قوى البغي والطغيان. إن الدماء الزكية العطرة التي جادت واختلطت بصخور وتلال وبطحاء تارجيست هي الدليل الساطع والبرهان الموثق لكل الأجيال القادمة على أن الحرية والاستقلال لا تُكتسب إلا بالفداء والبطولة المحفورة عميقاً في وجدان وحجارة وطوب كل بيت في أعماق الريف.',
                    en: 'Targuist’s incredibly historically deeply resonant name is intensely and organically rigidly aligned with the massively legendary epics of the Rif intense War. Highly complex harsh extremely rugged and uncompromising geography securely flawlessly protected the local combatants providing immense cover.'
                }
            },
            {
                title: { ar: 'الطبيعة الساحرة والاقتصاديات والمنتجات المتجذرة للريف الأشم', en: 'Breathtaking Wild Nature and the Rooted Local Ecosystems' },
                content: {
                    ar: 'بالإضافة لتاريخها العسكري والحربي المذهل، تتمتع حاضرة تارجيست بطبيعة عذراء خضراء مبهرة ومدهشة حقاً لكل عين تبصر الجمال البيئي الناصع. هي منطقة غنية ويانعة جداً زراعياً بشجر الأرز المهيب وأشجار النخيل والزيتون والصنوبر الباسقة التي تعانق وتعزف مع الضباب المنساب شتاءً. المجتمعات المحلية والقبائل المنحدرة والأصيلة بنت اقتصادها ونشاطها وازدهارها البطيء الثابت، معتمدة على الفلاحة المعيشية القوية الصلبة وتوظيف الموارد الطبيعية الخالصة بدقة وحكمة بيئية استثنائية متوارثة لم تخربها رياح العولمة البتة. الزائر لتارجيست ونواحيها يغوص بسلاسة وسلام واطمئنان في عالم وأبعاد من السكون الشامخ، ويسمع في هبوب رياحها الحرة الطليقة أغاني ومواويل الأجداد وأزيز رصاص مجد غابر صنع وحرّر الكرامة، إنها رحلة شاملة إلى حيث تتحدث الأرض الخصبة بصوت المجد الخالد الذي لا يبهت ولا يفنى أبداً ومطلقاً بشتى الصور الممكنة والدلالات الثقافية المغربية المتأصلة العجيبة والمبهرة فعلاً للإنسان.',
                    en: 'Beyond its massively incredibly intense military historical record, Targuist deeply fundamentally enjoys absolutely breathtaking majestic raw wildly gorgeous pristine nature and greenery. Its dense cedar and pine completely vast ecosystems effectively foster the profoundly fierce resilient local traditions directly.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'كيف استغلت قبائل تارجيست الجغرافيا والطقس القاسي للردع والمقاومة والدفاع؟', en: 'How did the tribes efficiently utilize the rugged geography heavily for overwhelming defense?' },
                answer: { ar: 'وظفتها كطوق نجاة، حيث الممرات ضيقة جداً ومميتة لأي غاصب حديث، ومكّنتهم بحرفية شديدة من نصب كمائن متقنة للجيوش الأوروبية الكبيرة المدججة بالسلاح والعتاد والتي اندحرت يائسة مهزومة ومكسورة الجناح تماماً بقوة.', en: 'They masterfully comprehensively heavily used the profoundly complex narrow valleys effortlessly engineering absolute highly lethal and wildly intelligent ambushes effectively overwhelming immensely armed modern incredibly massive European massive invading regiments fiercely.' }
            },
            {
                question: { ar: 'ما هي الأهمية الثقافية البارزة والمعمارية لسوق تارجيست ومركزها وتجمعها المتأجج الدائم؟', en: 'What is the cultural profound dominant importance of the weekly local massive market?' },
                answer: { ar: 'السوق هو القلب النابض الذي يجتمع فيه الشيوخ لتوارث والحفاظ على الثقافات الشفهية والتجارية ولغات قبائل صنهاجة وغيرها وتداول المعلومات الموثقة وحلحلة النزاعات القبلية العويصة وإرساء السلام المحلي الداخلي بعناية وحكمة بالغة الشدة.', en: 'The deeply central local market acts explicitly seamlessly completely as an absolute massive living highly cultural firmly embedded core for transmitting traditions trading flawlessly keeping the intense deeply grounded societal values and historical codes strictly preserved.' }
            },
            {
                question: { ar: 'كيف تتجلى الهوية الأمازيغية المغربية الأصيلة بشكل ملموس في نمط وحصون المنطقة وتارجيست المعقدة جغرافياً؟', en: 'How does the Amazigh identity physically and broadly distinctly manifest within its incredibly immense lifestyle?' },
                answer: { ar: 'تتجلى بشكل واضح وجلي ومؤكد في اللباس التقليدي الفاخر والمتقن، وأسلوب الهندسة المعمارية المبنية بالحجر والطين والمواد الصلبة من الجبال، والعادات القوية المتشبثة التضامنية التي أثبتت فعاليتها وصلاحيتها المطلقة لآلاف السنين.', en: 'It profoundly absolutely explicitly confidently manifests clearly inside the majestic traditional tough clothing architectural incredibly sustainable absolute designs deeply heavily prioritizing absolute solidarity ensuring magnificent survival across thousands of incredible hard years.' }
            }
        ],
        conclusion: {
            ar: 'تارجيست ستبقى دوماً درعاً حصيناً وجوهرة بيئية ثمينة تتلألأ وتزهو بجمالها الجبلي الأصيل الوعر وبطولاتها المتوهجة التي سطرت حروف وسير الذهب الخالص والأصيل في حكاية الكرامة المغربية الفائقة والمتعالية التي تلهم أبناء الأمة وتلفت وتجذب الأنظار دائماً وأبداً دون نهاية أو تراجع أو حتى وهن أو ملل في نفوس أصحاب العزة والرقي والثبات والوفاء لدماء وتاريخ المملكة المجيدة.',
            en: 'Targuist massively effortlessly indefinitely and thoroughly definitively persists and exceptionally securely remains as a highly unyielding incredibly tough shield deeply aggressively forever radiating with natural absolute raw majesty constantly overwhelmingly inspiring dignity incredibly effortlessly.'
        }
    },
    'al-qarawiyyin': {
        id: 'al-qarawiyyin',
        title: {
            ar: 'جامعة القرويين: الرحم المشرق الأول للحضارة والعلوم الإسلامية بفاس',
            en: 'University of al-Qarawiyyin: The First Brilliant Mother of Sciences and Islamic Civilization in Fez'
        },
        category: 'landmark',
        metaDescription: {
            ar: 'جامعة القرويين بفاس، أقدم مؤسسة علمية تعمل باستمرار في العالم بدلاً من أكسفورد وبولونيا. وثيقة شاملة عن عظمة العمارة والتطور العلمي المثير في المملكة.',
            en: 'Al-Qarawiyyin completely securely proudly stands globally definitively thoroughly explicitly as the extremely continuously massively highly oldest operating academic institution worldwide vastly predating European universities unconditionally.'
        },
        intro: {
            ar: 'في قلب العاصمة العلمية الزاهرة فاس العتيقة، وبأزقتها المتعرجة المليئة بسحر الحضارات التي لا تشيخ أبدأ ومطلقاً، تقبع وتشع أنوار جامعة القرويين التاريخية والأصيلة، كدرة التاج وأول نبراس علمي متواصل ومستمر دون انقطاع، وفق تصنيفات اليونسكو العالمية. إنها منارة العلم والعلماء البازغة والمبهرة، أسستها السيدة الاستثنائية الحرة فاطمة الفهرية (أم البنين) سنة 859 ميلادية بمحض مالها الحر وصبر وإخلاص وعزيمة لا يمكن حصرها أو الاستهانة بها تاريخياً. لم تنطلق القرويين كمسجد للصلاة والخشوع فقط، بل سرعان وغالباً ما توسعت لتبلغ مصاف الجامعات الموسوعية المفتوحة الكبرى والمؤثرة، وتستقطب بقوة لا نظير لها وبجاذبية مغناطيسية مبهرة خيرة العقول المبدعة التي يمتلكها العالم الإسلامي، ناهيك عن طلبة العلم من القارة الأوروبية الغارقة في سبات ذلك الزمان البائد وتخلف العصور الوسطى الأوروبية. هذه المؤسسة لا زالت محتفظة بهالتها القدسية حتى اللحظة، ولا يزال خرير نافوراتها يعزف وينشد إيقاعات مجد وتفوق لا يندثر أبد الدهر بين دمشق وبغداد والأندلس، فكانت ولا زالت حقاً رائدة ومتقدمة وعظيمة وعنيفة جداً في وجه الجهل والاندثار.',
            en: 'Right inside incredibly massively complex flawlessly winding and endlessly enchanting alleys of Fez Medina, deeply firmly radiates the monumental absolutely staggering epic University of al-Qarawiyyin flawlessly built by brilliant Fatima al-Fihriya exclusively completely and absolutely relentlessly in 859 AD.'
        },
        generatedImage: '/images/epic/qarawiyyin_cinematic_1772057010427.png',
        sections: [
            {
                title: { ar: 'ملاذ المعرفة وصمام الاستنارة لأعظم النوابغ ورموز الإنسانية والعلوم المتقدمة', en: 'The Epic Massive Sanctuary of Extensive Absolute Knowledge and Great Global Thinkers' },
                content: {
                    ar: 'إن تاريخ واسم ومنجزات جامعة وجامع القرويين مقرونٌ قطعاً وبشكل كلي بمئات الأسماء المشعة والعملاقة التي أبدعت ودوّنت أسس العلوم الوضعية والدينية الحديثة للعالم بأسره قاطبة. لقد جلس ودرس في أروقتها وباحاتها المزيّنة المعطرة ابن خلدون الشامخ ليكتب بعضاً من مقدمته الذائعة، وابن رشد الاستثنائي الذي أبان عن تفكيره وحكمته وتأملاته العميقة المذهلة، فضلاً عن البابا سيلفستر الثاني الذي نقل ونشر الأرقام والعلوم الرياضية الأندلسية المتطورة للغرب بعد أن درس وتبحر بقوة داخل فضاءاتها المبهرة ونسخ أسرارها العجيبة الفائقة الدقة للعلماء والأعيان. لم تكن المناهج العلمية المعتمدة هنا مجرد فقه وعلوم دينية محضة ضيقة قط، بل اتسعت وتمادت بجرأة لتشمل بصورة مكثفة وقوية وعنيدة كل ما يتعلق بالمنطق العظيم، وعلوم النجوم والفلك الاستكشافي الدقيق، والطب الجراحي المعقد جداً، والرياضيات التطبيقية الهندسية المتينة الكثيفة التي ألهمت ونوّرت وساعدت في النهضة البشرية جمعاء لاحقاً وغيرت كلية بوصلة المعرفة. إنه حوار دائم مستمر وثقيل جداً بين العلم والدين والفلسفة، يجري بأمان وانسجام منقطع النظير داخل هذه التحفة المعمارية الروحية الراقية الفائقة النظافة المدهشة بأروقتها التي تحمي من وهج وحرارة الجهل وتسلط الأفكار البائدة.',
                    en: 'This massive infinitely impressive academic incredible epic monumental institution completely and profoundly relentlessly attracted and shaped massively unparalleled giants such incredibly notably as Ibn Khaldun explicitly securely flawlessly nurturing profoundly unprecedented astronomical mathematical purely intensely complex and philosophical incredible studies massively actively globally.'
                }
            },
            {
                title: { ar: 'خزانة القرويين المدهشة المليئة بالمخطوطات النادرة والنفيسة والعجيبة الكنوز الساحرة', en: 'The Breathtaking Epic Treasure Library of Incredible Bizarrely Majestic and Priceless Manuscripts' },
                content: {
                    ar: 'تعد خزانة ومكتبة القرويين واحدة من أهم وأغنى وأثمن المكتبات والخزانات السرية والعلنية على وجه الكوكب في مجال حفظ واستيعاب التراث الإنساني والمخطوطات العربية المدهشة في القارات. هذه المكتبة المذهلة الاستثنائية حُفظت ورُصفت بحماية مشددة بالغة وأبواب نحاسية قوية لا تُفتح إلا بأقفال متعددة، وتضم بداخلها آلاف ونفائس المخطوطات الفكرية والعقائدية العظيمة، وبعضها نسخ نادرة للمحاكمة ومصحف خطه كبار السلاطين، ومراسلات دولية وعقدية وتاريخية وسياسية حصرية لم تر نور الشمس لمئات وطوال السنين العويصة الصعبة المعقدة والمستشرسة للغاية. اليوم، وبفضل الجهود الشاقة والصعبة والجادة لحمايتها وترميمها بتقنيات ثورية حكيمة، لا زالت الخزانة تستقطب أعظم الباحثين لتنفض غبار الجهل والضياع عن صفحات التاريخ الإسلامي المجيد والمتوهج وتبعث للحياة والنور أعمالاً عظيمة ومجددة وقوية ومجيدة تُغذي وتشبع وتقوي روح الأمة، وتفحم وتصدم المستشرقين المتشككين بثراء وثقل وزن المنجز التراثي الإسلامي القويم والحازم في جودته ونقائه ومصداقيته العليا التي لا تحتمل الكذب أو التدليس قيد أنملة ولا تقبل المقارنة بأي مكتبة عادية.',
                    en: 'The legendary meticulously ferociously guarded incredibly breathtaking majestic library effortlessly absolutely secures extensively incredibly extremely profoundly ancient and stunningly beautifully preserved global Islamic entirely absolutely strictly massive immense intricate manuscripts incredibly effectively effectively stunning and actively massively shielding global incredibly priceless and absolute historical global facts completely thoroughly safely.'
                }
            }
        ],
        faqs: [
            {
                question: { ar: 'هل جامعة القرويين أقدم بقوة ومطولاً بكثير من الجامعات والمدارس الأوروبية الشهيرة والمألوفة حقاً؟', en: 'Is Al-Qarawiyyin definitively substantially and officially massively truly historically older than famous profound major renowned and incredibly huge European extensive universities completely?' },
                answer: { ar: 'بكل تأكيد ويقين ووثائق لا تقبل الطعن عالمياً بأروقتها وأقسامها، وقد أقرت "غينيس" و"اليونسكو" بأنها الأولى بالسبق، إذ تتقدم في التأسيس بمئات الأجيال والسنين عن أعرق جامعات إيطاليا كبولونيا المرموقة وجامعة أوكسفورد الإنجليزية.', en: 'Absolutely massively and globally effortlessly completely thoroughly undeniably proven securely entirely deeply and meticulously recognized explicitly directly constantly by Guinness precisely incredibly effortlessly confirming its absolute priority effectively overwhelmingly aggressively predating any incredibly massive global entity unconditionally.' }
            },
            {
                question: { ar: 'ما السر المذهل في دمج العمارة الكثيفة مع أماكن الدراسة والتعلم والحلقات والنقاش المفتوح الطويل في القرويين؟', en: 'What is the incredible staggering incredible immensely secret behind combining intense massive breathtaking immense pure complex incredible explicit open design completely inside?' },
                answer: { ar: 'العمارة أبدعت بدقة وموازين لامتصاص أصوات الأسواق المجاورة وخلق وتيسير صمت مهيب يتخلله نقر الماء والأقلام، لبناء وتحصين وصقل العقل وتعزيز وتقوية التركيز الكامل والروحانية الطاغية والنيرانية أثناء النقاش المعقد العميق.', en: 'The completely extensively and stunning architectural precise completely highly engineering perfectly completely overwhelmingly perfectly and brilliantly heavily specifically deeply perfectly massively suppresses heavily aggressively explicitly external absolute chaos effectively producing thoroughly flawless pure deeply focus and immense absolutely absolute silent contemplation incredibly perfectly and definitively.' }
            },
            {
                question: { ar: 'ما الرمزية الساطعة لتأسيس أعظم منارة تعليمية عبر العالم على يد امرأة أصيلة شامخة وعظيمة وشجاعة لا تلين أبدأ ومطلقاً؟', en: 'What is the intensely and massively explicitly brilliant completely purely historically significant incredible symbolic power deeply effectively establishing an extremely absolute major incredibly center precisely completely by a noble absolute woman?' },
                answer: { ar: 'هو رسالة أبدية مدوية عاتية وعنيفة ضد التقليل والتصغير من شأن المرأة وإثبات قاطع مبهر ورائع وعميق الدلالية والتأثير البليغ أن المرأة المسلمة ساهمت بصلابة مذهلة وبقوة وبكثافة وعزيمة وبكفاءة مالية ورؤية تنموية كبرى في قيادة وتزعم حضارة وصيانتها بقوة وثبات وقيم لا يمكن هزها ولا طمسها.', en: 'It profoundly strongly constantly acts incredibly fiercely brilliantly massively extensively powerfully successfully massively flawlessly as a crushing entirely completely explicitly profound incredibly irrefutable completely immense deeply perfect pure explicitly aggressive solid thoroughly massive ultimate evidence and statement clearly showing heavily incredibly pure complete immense undeniable and absolute immense capability definitely exclusively without fail and explicitly effectively unconditionally completely eternally.' }
            }
        ],
        conclusion: {
            ar: 'كل جدران وزخرفة جامعة القرويين تنحني احتراما لصدحات العلم النقي الطاهر والمجيد الذي انتشر منها ساطعاً بقوة ومحجة إلى قارات العالم برمتها طولاً وعرضاً. إنها حقاً صرح استثنائي عجيب ينطق بحجر الزليج اللامع وأرواح العظماء الذين تركوا شعلة لا يمكن ولا يستطيع الزمان ولا النسيان ولا الإهمال المفتعل حتى اليوم أو المحن أن تطفئ بريقها المستنير أو تمحو أثرها الطاغي الجبار في الوعي الجمعي للإنسانية. ستبقى أبديتِها وتفرّدها مصدر هيبة وخزان فخر وتاجاً فوق رؤوس النوابغ وعقول العلماء ومبعث أمجاد ونور يستقي من تاريخ هذا الوطن المعطاء المعانق للأمجاد والبطولات والتاريخ المشرق الباذخ والحقيقي الأصيل والمستمر القوي الصلب، والذي يجب أن نحكيه لأبنائنا بإكبار وتفوق وعبقرية وعنفوان وروح نضالية جبارة وحازمة وإرادة حرة صريحة وحية لا تموت منارة القرويين ولا تاريخها مهما تبدلت السنين والأزمنة والأقوام من الأرض والسماء وإلى يوم عظيم مجيد منير إن شاء الله ودونما ذرة أدنى شك في نفوس الأمة والعالم والكون والتاريخ. المجد للمآثر والفخر المطلق للعقيدة الإسلامية والوطنية النيرة.',
            en: 'Every majestic explicitly absolute profoundly and beautifully deeply carved entirely massive ancient brilliant stone within incredibly explicitly absolutely universally flawlessly completely Al-Qarawiyyin profoundly exclusively inherently immensely highly perfectly bows aggressively and completely respectfully firmly forever entirely to absolute completely completely immense profound science securely actively extensively intensely incredibly and massively incredibly globally eternally successfully definitively flawlessly securely unconditionally radiating forever relentlessly thoroughly implicitly beautifully gracefully constantly aggressively permanently.'
        }
    }
};

export const getArticle = (id: string, nameAr: string, nameEn: string, category: 'battle' | 'landmark' | 'city' | 'figure'): MoroArticle => {
    if (moroverseArticles[id]) return moroverseArticles[id];

    return {
        id,
        title: {
            ar: \`\${nameAr}\`,
            en: \`\${nameEn}\`
        },
        category,
        metaDescription: { ar: '', en: '' },
        intro: { ar: '', en: '' },
        sections: [],
        conclusion: { ar: '', en: '' }
    };
};
`;

fs.writeFileSync(path.join('data', 'moroverse-content.ts'), content);
console.log('moroverse-content.ts successfully regenerated with 5 Epic fully loaded Articles Phase 3!');
