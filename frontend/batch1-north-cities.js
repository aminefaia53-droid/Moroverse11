const fs = require('fs'), path = require('path');

const ARTICLES = {
    'casablanca': {
        id: 'casablanca', category: 'city',
        title: { ar: 'الدار البيضاء: قاطرة المغرب الاقتصادية وأيقونة العصر الحديث', en: 'Casablanca: Morocco\'s Economic Locomotive and Icon of Modernity' },
        metaDescription: { ar: 'الدار البيضاء أكبر مدن المغرب وعاصمته الاقتصادية، موطن مسجد الحسن الثاني وأكبر ميناء في إفريقيا.', en: 'Casablanca, Morocco\'s largest city and economic capital, home of Hassan II Mosque and Africa\'s largest port.' },
        intro: { ar: 'على ضفاف الأطلسي الشاسع، تقوم الدار البيضاء مدينةً لا هوادة فيها ولا توقف — قاطرة تشقّ درب المغرب نحو المستقبل بخطى لا تتوقف. اسمها بالعربية يعني "البيت الأبيض"، وهو اسم يختزل جوهرها: مدينة تؤمن بالنظام والنظافة ومعيارية العصر في قلب أفريقيا. هي ليست مدينة توارث شهرتها من الفتوحات أو من ملوك قدماء، بل صنعت مجدها بأيدي العمال والبنّائين والمهندسين والتجار الذين تدفّقوا إليها من كل أرجاء المغرب خلال القرن العشرين. الدار البيضاء هي نبض المغرب الحقيقي الحديث، وحين تقف على كورنيشها وتتأمل مسجد الحسن الثاني الشاهق على الماء، تدرك أن المغرب يجمع قرونه في لحظة واحدة.', en: 'On the vast Atlantic shores, Casablanca stands as a relentless, unstoppable city — the locomotive driving Morocco toward the future. Its Arabic name means "White House," encapsulating its essence: a city believing in modernity and order in the heart of Africa.' },
        sections: [
            {
                title: { ar: 'ميناء الدار البيضاء: بوابة إفريقيا على العالم', en: 'Port of Casablanca: Africa\'s Gateway to the World' },
                content: { ar: 'يُعدّ ميناء الدار البيضاء من أكبر وأحدث الموانئ في إفريقيا والعالم العربي، يمرّ عبره أكثر من سبعين بالمئة من صادرات المغرب وواردته السنوية. شُيِّد في أوائل القرن العشرين بأيدٍ مغربية بإشراف المهندس الفرنسي ليوتي، وتطوّر ليصبح منظومة لوجستية متكاملة تضم أحواضاً للناقلات والحاويات وناقلات النفط والسفن السياحية الضخمة. لم يكن الميناء مجرد منشأة اقتصادية، بل كان المحرّك الأول لنمو المدينة وتضخمها السكاني المتسارع الذي حوّلها من قرية صيد صغيرة عام 1900 إلى حاضرة تجاوز عدد سكانها خمسة ملايين نسمة في نهاية القرن ذاته.', en: 'The Port of Casablanca is among the largest and most modern in Africa and the Arab world, handling over 70% of Morocco\'s annual exports and imports.' }
            },
            {
                title: { ar: 'مسجد الحسن الثاني: حين تلتقي السماء بالمحيط', en: 'Hassan II Mosque: Where Heaven Meets the Ocean' },
                content: { ar: 'يقبع مسجد الحسن الثاني على منصة صخرية بنيت فوق مياه المحيط الأطلسي مباشرة، في مشهد يُصوّر تلاقي الأرض والماء في حضرة الله. صمّمه المعماري الفرنسي ميشيل بينسو في احترام عميق للهوية المغربية التقليدية، بمئذنة يبلغ ارتفاعها مئتي متر وخمسة وثمانين تُسيطر على افق المدينة كلها. يتسع لمئة وخمسة وعشرين ألف مصلٍّ في قاعته الرئيسية وساحاته، وسقفه المتحرك يُفتح على السماء ليجمع المصلين بالكون. أُنجز عام 1993 بعمل آلاف الحرفيين المغاربة الذين أبدعوا نقوشاً من الصخر والخشب والجبس لا تراها في أي مسجد آخر بهذا الحجم والتفصيل الدقيق.', en: 'Hassan II Mosque sits on a rocky platform built directly over Atlantic waters, where earth and ocean meet in divine presence. Its 285-meter minaret dominates Casablanca\'s entire skyline.' }
            }
        ],
        faqs: [
            { question: { ar: 'لماذا سُمِّيت الدار البيضاء بهذا الاسم الغريب؟', en: 'Why is Casablanca named the "White House"?' }, answer: { ar: 'الاسم مستمد من البيوت البيضاء التقليدية التي كانت تميّز المدينة القديمة قبل التوسع الحديث، وقد حافظت على هذا الاسم رغم تحوّلها لحاضرة عصرية كبرى.', en: 'The name derives from the white traditional houses that characterized the old city before modern expansion.' } },
            { question: { ar: 'ما أهم الأحياء التاريخية التي يجب زيارتها في الدار البيضاء؟', en: 'What are the most important historic neighborhoods to visit in Casablanca?' }, answer: { ar: 'حي الحبوس هو التحفة المعمارية الأندلسية-المغربية الأهم، بُني في الثلاثينيات ويحتوي على ممرات وأروقة تحاكي مدن الأندلس. كذلك المدينة القديمة والكورنيش والميدان الكبير.', en: 'The Habous quarter is the most important Andalusian-Moroccan architectural gem, built in the 1930s with arcades evoking Andalusian cities.' } },
            { question: { ar: 'ما الدور الذي لعبته الدار البيضاء في استقلال المغرب؟', en: 'What role did Casablanca play in Moroccan independence?' }, answer: { ar: 'كانت الدار البيضاء مركزاً للحركة الوطنية وموطن الطبقة العاملة التي قادت إضرابات 1952 التي أشعلت فتيل الكفاح المسلح نحو الاستقلال عام 1956.', en: 'Casablanca was the center of the nationalist movement and home of the working class that led the 1952 strikes igniting armed resistance toward 1956 independence.' } }
        ],
        conclusion: { ar: 'الدار البيضاء ليست مجرد مدينة كبيرة — إنها التحوّل المغربي نحو الحداثة مُجسَّداً في أسمنت وصلب وبشر طموح لا يهدأ.', en: 'Casablanca is not just a large city — it is Morocco\'s transformation toward modernity embodied in concrete, steel, and restless ambitious people.' },
        generatedImage: 'https://images.unsplash.com/photo-1582236353904-7431c4cbcf33?q=80&w=2070&auto=format&fit=crop'
    },

    'rabat': {
        id: 'rabat', category: 'city',
        title: { ar: 'الرباط: عاصمة الأنوار وحارسة التاريخ الصامد', en: 'Rabat: Capital of Lights and Guardian of Enduring History' },
        metaDescription: { ar: 'الرباط عاصمة المملكة المغربية، مدينة تجمع بين التراث الموحدي والعمارة الإسلامية الكلاسيكية والحداثة المعاصرة على ضفاف بوورقراق.', en: 'Rabat, capital of Morocco, where Almohad heritage, Islamic classical architecture and modern life converge on the Bou Regreg riverbanks.' },
        intro: { ar: 'الرباط ليست عاصمة عادية. إنها مدينة تحكي بكل حجر فيها عن القرارات الكبرى التي صنعت مغرباً ممتداً من البحر إلى الصحراء. كانت مرابطاً عسكرياً في القرن الثاني عشر قبل أن تنتخبها الأقدار عاصمةً أدارية في القرن العشرين دون أن تُفقد طابعها الإنساني الهادئ الرزين. هي المدينة التي تحمل صومعة حسان الموحدية ذات الحجر الرملي الأحمر في قلبها، وقبالتها ضريح محمد الخامس المهيب بمرماره الأبيض كأنهما يمثّلان محادثة صامتة بين القرن الثاني عشر والقرن العشرين عبر بضعة أمتار من الهواء المفتوح.', en: 'Rabat is no ordinary capital. Every stone speaks of great decisions that shaped a Morocco stretching from sea to desert. It was a military ribat in the 12th century before fate chose it as administrative capital in the 20th, never losing its calm, dignified human character.' },
        sections: [
            {
                title: { ar: 'قصبة الوداية: القلعة التي تحرس فم النهر', en: 'Kasbah of the Udayas: The Fortress Guarding the River\'s Mouth' },
                content: { ar: 'قصبة الوداية هي الكتلة الصخرية المنيعة التي تقعد على رأس النهر حيث يصبّ وادي أبي رقراق في الأطلسي. بناها الموحدون في القرن الثاني عشر حصناً عسكرياً، وأسكنها المولى إسماعيل جنوداً من أصول عربية أندلسية عُرفوا بالوداية. ما يُذهل في القصبة ليس فقط جدارها الرهيب المطلّ على المحيط، بل حارتها الداخلية الزرقاء البيضاء التي تشبه قطعة من الأندلس الضائعة نُقلت بأكملها وزُرعت في قلب الرباط. الحديقة الأندلسية في قلبها تُعدّ من أجمل التجارب البصرية التي يمنحها تراث الأندلس المنفوي لمن يتأمّلها بقلب مفتوح.', en: 'The Kasbah of the Udayas sits on the rocky promontory where the Bou Regreg river meets the Atlantic. Built by the Almohads in the 12th century as a military fortress, its inner blue-white quarter resembles a piece of lost Andalusia transplanted to Rabat\'s heart.' }
            },
            {
                title: { ar: 'الرباط عاصمةً إدارية: قصة الاختيار الدقيق', en: 'Rabat as Administrative Capital: The Story of a Deliberate Choice' },
                content: { ar: 'حين أنشأ الفرنسيون الحماية عام 1912، اختار المقيم العام ليوتي الرباط عاصمة إدارية بذكاء استراتيجي واضح: فاس كانت مُثقلة بثقل التاريخ وسهلة الاشتعال قومياً، ومراكش أبعد جغرافياً وأصعب إدارياً، أما الرباط فكانت صغيرة قابلة للتشكيل وساحلية قابلة للربط و"محايدة" نسبياً. حين جاء الاستقلال عام 1956، استبقاها محمد الخامس عاصمة بقرار سياسي حكيم؛ لأنها مدينة الدولة لا مدينة التجار أو رجال الدين أو الجنود — وفي ذلك مكمن قوّتها الفريدة البالغة.', en: 'When France established the Protectorate in 1912, Resident-General Lyautey chose Rabat as administrative capital with clear strategic intelligence. At independence in 1956, Mohammed V retained it as capital — a city of state rather than merchants, clergy, or soldiers.' }
            }
        ],
        faqs: [
            { question: { ar: 'لماذا الرباط وليست فاس أو مراكش عاصمةً للمغرب؟', en: 'Why is Rabat and not Fez or Marrakech the capital of Morocco?' }, answer: { ar: 'الرباط اختيرت لموقعها الساحلي الاستراتيجي وطابعها الهادئ القابل للتطوير الإداري في عهد الحماية، واحتفظت بهذه الوضعية في الاستقلال.', en: 'Rabat was chosen for its strategic coastal location and quiet, administratively malleable character under the Protectorate, retaining that status at independence.' } },
            { question: { ar: 'ما المواقع التراثية المدرجة في قائمة اليونسكو بالرباط؟', en: 'What UNESCO heritage sites does Rabat hold?' }, answer: { ar: 'أُدرجت مدينة الرباط ككلٍّ — تشمل قصبة الوداية، صومعة حسان، المدينة القديمة، والمخلفات الأثرية — على قائمة اليونسكو للتراث الإنساني عام 2012.', en: 'The entire city of Rabat — including Kasbah, Hassan Tower, old medina, and archaeological remains — was inscribed on the UNESCO World Heritage List in 2012.' } },
            { question: { ar: 'ما طبيعة العلاقة الثقافية بين الرباط وسلا المدينتين المتجاورتين؟', en: 'What is the cultural relationship between neighboring Rabat and Salé?' }, answer: { ar: 'الرباط وسلا مدينتان متقابلتان على ضفتي وادي أبي رقراق، متمايزتان في الشخصية: الرباط أدارية رسمية بطابع حديث، وسلا أعمق في تراثها الصوفي والتجاري المتجذّر في القرون الوسطى.', en: 'Rabat and Salé face each other across the Bou Regreg river, distinct in character: Rabat official and modern, Salé deeper in its Sufi and medieval commercial heritage.' } }
        ],
        conclusion: { ar: 'الرباط مدينة تحترم الزمن دون أن تتحجّر فيه، وتنفتح على الحداثة دون أن تنسى من أين أتت.', en: 'Rabat is a city that respects time without being fossilized by it, embracing modernity without forgetting its origins.' },
        generatedImage: 'https://images.unsplash.com/photo-1644331049219-c09a803e1e55?q=80&w=1964&auto=format&fit=crop'
    },

    'chefchaouen': {
        id: 'chefchaouen', category: 'city',
        title: { ar: 'شفشاون: المدينة الزرقاء التي تسكن في أعماق الريف المتأمّل', en: 'Chefchaouen: The Blue City Dwelling in the Contemplative Rif\'s Heart' },
        metaDescription: { ar: 'شفشاون المدينة الزرقاء في جبال الريف، أسّسها الموريسكيون واليهود الأندلسيون. رحلة في الزرقة والسكينة والهوية الأمازيغية العريقة.', en: 'Chefchaouen Blue City in the Rif mountains, founded by Andalusian Moors and Jews. A journey through blue, tranquility and ancient Amazigh identity.' },
        intro: { ar: 'ثمة مدن تُحاصرك بضجيجها، وثمة مدن تُعانقك بصمتها. شفشاون من النوع الثاني. حين تصعد دروبها الحجرية الضيقة المطلية باللون السماوي والنيلي المتشابك، تشعر وكأنك تُلطَّف بعمق الزمن وبرودة الجبل وسكينة الإيمان في آنٍ متزامن. أسّسها الأمير سيدي علي بن راشد عام 1471 ملجأً للمجاهدين ضد البرتغاليين، فتدفّقت إليها موجات من الموريسكيين المُطرَدين من الأندلس ثم من اليهود الهاربين من جحيم الاضطهاد الأوروبي، فأضفوا عليها تلك الروح الأندلسية-الأمازيغية الفريدة التي يشمّها الزائر في كل ناصية من نواصيها الزرقاء الهادئة.', en: 'Some cities surround you with noise; others embrace you with silence. Chefchaouen belongs to the second kind. Founded in 1471 as a refuge for fighters against Portuguese expansion, waves of Moors expelled from Andalusia and Jews fleeing European persecution gave it that unique Andalusian-Amazigh spirit felt at every blue corner.' },
        sections: [
            {
                title: { ar: 'أسطورة الأزرق: من أين جاء هذا اللون الذي سحر العالم؟', en: 'The Blue Legend: Where Did This World-Enchanting Color Come From?' },
                content: { ar: 'الرواية الأكثر شيوعاً والأعمق توثيقاً تُرجع صبغ المباني باللون الأزرق إلى اليهود الذين استقروا في شفشاون في موجات الهجرة الأندلسية والأوروبية، إذ يرمز الأزرق في التراث اليهودي إلى السماء والروح الإلهية والحماية الميتافيزيقية. تبنّى المسلمون وسكان المدينة اللاحقون هذه العادة الجمالية لأسباب متداخلة: البرودة البصرية في حرارة الصيف الجبلي، وطرد الحشرات، والتمييز الهوياتي للمدينة عن سواها.', en: 'The most documented account attributes the blue buildings to Jewish settlers who brought the color\'s association with heaven, divine spirit, and metaphysical protection from their traditions. Muslim residents adopted and expanded this aesthetic for multiple reasons: visual cooling in summer heat, insect repulsion, and distinctive city identity.' }
            },
            {
                title: { ar: 'جبال الريف: الحضن الجغرافي الذي منح المدينة طابعها الخاص', en: 'The Rif Mountains: The Geographic Cradle Shaping the City\'s Character' },
                content: { ar: 'شفشاون مدينة جبلية بامتياز تتربع على ارتفاع ستمئة متر في قلب جبال الريف، وهذا الموقع الجبلي لم يكن صدفة بل اختياراً دفاعياً متعمداً. حماها الجبل تاريخياً من الغزوات البرتغالية والإسبانية قروناً طويلة، وجعلها محاطة بهواء نقي وينابيع جبلية وطبيعة متوسطية مورقة تجعل زيارتها في كل فصل تجربة حسية مختلفة الألوان ومتجددة الروح. من قمة جبل العلم المشرف عليها يمكن رؤية المدينة كلوحة فسيفساء زرقاء-بيضاء مُصوَّبة نحو السماء من قلب الجبال الخضراء.', en: 'Chefchaouen sits at 600 meters elevation consciously chosen for its defensive advantages. The Rif mountains protected it from Portuguese and Spanish incursions for centuries while surrounding it with pure air, mountain springs, and Mediterranean vegetation that makes each seasonal visit a distinct sensory experience.' }
            }
        ],
        faqs: [
            { question: { ar: 'هل صحيح أن الأجانب مُنعوا من دخول شفشاون حتى القرن العشرين؟', en: 'Is it true that foreigners were banned from entering Chefchaouen until the 20th century?' }, answer: { ar: 'نعم، ظلت شفشاون محرَّمة على غير المسلمين قروناً طويلة، وكان الأوروبيون الأوائل الذين دخلوها متنكرين في ثياب إسلامية. أول أوروبي دخلها علناً كان الرحّالة الإسباني أميليو بلانكو إيسبرت عام 1883.', en: 'Yes, Chefchaouen was forbidden to non-Muslims for centuries. The first European to enter openly was Spanish explorer Emilio Blanco Izaga in 1883.' } },
            { question: { ar: 'ما أفضل الأوقات لزيارة شفشاون للاستمتاع بأجمل ألوانها؟', en: 'When is the best time to visit Chefchaouen for its most beautiful colors?' }, answer: { ar: 'الربيع (مارس-مايو) والخريف (سبتمبر-نوفمبر) هما الموسمان المثاليان، حيث تزهر الطبيعة حول المدينة وتتلطّف درجات الحرارة لتجعل التجول في الأزقة تجربة لا مثيل لها.', en: 'Spring (March-May) and autumn (September-November) are ideal, when nature blooms around the city and temperatures moderate for unmatched strolling through its lanes.' } },
            { question: { ar: 'هل الأزرق في شفشاون متشابه أم تتعدد درجاته عمداً؟', en: 'Is Chefchaouen\'s blue uniform or deliberately varied in shade?' }, answer: { ar: 'تتعدد درجاته بصورة مقصودة بين النيلي الداكن والسماوي الفاتح والأزرق الكحلي والرمادي-الأزرق، مما يخلق لوحة بصرية حية متغيرة بحسب الضوء والظل والزاوية.', en: 'The blue is deliberately varied between deep indigo, light sky blue, navy, and grey-blue, creating a living visual canvas that changes with light, shadow, and viewing angle.' } }
        ],
        conclusion: { ar: 'شفشاون ليست وجهة سياحية — إنها حالة ذهنية. من يدخلها يخرج منها مختلفاً، كأن للأزرق قدرة على غسل ما تراكم من ضجيج الحياة.', en: 'Chefchaouen is not a tourist destination — it is a state of mind. Those who enter leave changed, as if the blue possesses power to wash away life\'s accumulated noise.' },
        generatedImage: 'https://images.unsplash.com/photo-1548625361-19a9e748882a?q=80&w=2070&auto=format&fit=crop'
    },

    'meknes': {
        id: 'meknes', category: 'city',
        title: { ar: 'مكناس: عاصمة إسماعيل وفردوس الجنوب الموحدي المفقود', en: 'Meknes: Ismail\'s Capital and the Lost Almohad Southern Paradise' },
        metaDescription: { ar: 'مكناس المدينة الإسماعيلية والإمبراطورية الرابعة للمغرب، موطن باب المنصور أجمل أبواب إفريقيا وشاهد على مجد سلطاني لا يُنسى.', en: 'Meknes, the Ismaili imperial city, fourth royal city of Morocco, home to Bab Mansour — Africa\'s most magnificent gate.' },
        intro: { ar: 'حين قرر السلطان مولاي إسماعيل عام 1672 أن يجعل من مكناس عاصمته الإمبراطورية، لم يكن يبني مدينة — كان يبني أُسطورة. امتدّ البناء خمسة وخمسين عاماً متواصلة بعمل مئة وخمسة وعشرين ألف عامل وأسير وآلاف المعماريين المهرة. ما وُلد من هذا الجهد الإنساني الهائل كان إمبراطورية معمارية تمتد على مساحة تتجاوز الكيلومتر التربيع الواحد: أسوار يبلغ محيطها الإجمالي خمسةً وأربعين كيلومتراً تتخللها عشرون بوابة، وإسطبلات ملكية لاثني عشر ألف حصان، وحدائق النصر الشهيرة. مكناس هي شخصية المغرب حين قرر أن يُبهر العالم.', en: 'When Sultan Moulay Ismail decided in 1672 to make Meknes his imperial capital, he was not building a city — he was building a legend. Fifty-five years of continuous construction by 125,000 workers and prisoners created an architectural empire: walls spanning 45 kilometers, 20 gates, and royal stables for 12,000 horses.' },
        sections: [
            {
                title: { ar: 'باب المنصور: أعظم بوابة في إفريقيا والعالم الإسلامي', en: 'Bab Mansour: The Greatest Gate in Africa and the Islamic World' },
                content: { ar: 'باب المنصور العلج اسم يحمل قصة في كل كلمة منه: "المنصور" لقب يعني الذي نصره الله، و"العلج" إشارة لمعماره ذي الأصول الأوروبية الذي اعتنق الإسلام. شُيِّد بين عامَي 1672 و1732 ليكون خاتمة بناء مكناس الإمبراطورية وملحمتها الأخيرة. يبلغ ارتفاعه ثمانية عشر متراً وعرضه ستة عشر، مُكسو بزليج أندلسي متعدد الألوان وعقود بوليصة ملتوية وأعمدة مأخوذة من وليلي الرومانية تُضفي عليه نكهة حضارية متراكبة عبر القرون.', en: 'Bab Mansour al-Aleuj — every word carries a story. Built between 1672-1732 as the imperial finale, its 18-meter height is covered in Andalusian zellige, twisted horseshoe arches, and columns taken from Roman Volubilis, embodying layered civilizational flavors across centuries.' }
            },
            {
                title: { ar: 'متبّر مولاي إسماعيل: الرجل الذي وحّد مغرباً يتهدده كل شيء', en: 'Moulay Ismail\'s Reign: The Man Who United a Morocco Threatened from All Sides' },
                content: { ar: 'تولّى مولاي إسماعيل الحكم في أعسر الطروف: المغرب يتمزق قبائل متناحرة، والإسبان والبرتغاليون يحتلون مدناً ساحلية، والعثمانيون يهددون من الشرق. في خمسة وخمسين عاماً من الحكم الحديدي (1672-1727) وحّد البلاد، استرد سبتة وتطوان والعرائش من الإسبان، وطرد الإنجليز من طنجة، وبنى جيشاً نظامياً من العبيد السود الذي سُمِّي بجيش "عبيد البخاري". كان طاغية بمقاييس الرحمة، عبقرياً بمقاييس الدولة ومنقذاً بمقاييس الوجود المغربي المستقل.', en: 'Moulay Ismail seized power in Morocco\'s most dire circumstances: fractured tribes, Spanish-Portuguese occupation of coastal cities, Ottoman threats from the east. In 55 years of iron rule (1672-1727) he unified the country, recovered Ceuta, Tetouan, and Larache, expelled the English from Tangier, and built a professional army.' }
            }
        ],
        faqs: [
            { question: { ar: 'لماذا تُعدّ مكناس "المدينة الإسماعيلية" رغم أنها أقدم من مولاي إسماعيل؟', en: 'Why is Meknes called "Ismaili city" when it predates Moulay Ismail?' }, answer: { ar: 'مكناس أُسِّست في القرن العاشر الميلادي على يد قبيلة مكناسة الأمازيغية، لكن مولاي إسماعيل حوّلها جذرياً لعاصمة إمبراطورية ضخمة، فأصبح اسمه مرادفاً لهويتها الحضرية الحالية.', en: 'Meknes was founded in the 10th century by the Amazigh Meknasat tribe, but Moulay Ismail fundamentally transformed it into a massive imperial capital, making his name synonymous with its current urban identity.' } },
            { question: { ar: 'هل زيارة مكناس ووليلي الرومانية تتمّ في نفس اليوم؟', en: 'Can Meknes and Roman Volubilis be visited on the same day?' }, answer: { ar: 'نعم، تبعد وليلي نحو ثلاثين كيلومتراً من مكناس وهي متاحة بسهولة بالسيارة. الزيارة المثلى تجمع المدينتين في يوم تاريخي واحد يمتد من الرومان إلى العصر الإسماعيلي.', en: 'Yes, Volubilis lies about 30 km from Meknes and is easily accessible by car. The ideal visit combines both cities in one historical day spanning Roman to Ismaili eras.' } },
            { question: { ar: 'ما المنتجات الحرفية الأشهر التي اشتهرت بها مكناس تاريخياً؟', en: 'What crafts is Meknes historically most famous for?' }, answer: { ar: 'مكناس اشتهرت تاريخياً بنسيج البروكار والدمقس (الديباج) والفضيات المُطرَّزة وصناعة الأسلحة التقليدية والسلال المنسوجة. اليوم يبقى سوق النجارين والحرفيين في المدينة القديمة شاهداً على هذا الإرث.', en: 'Meknes was historically famous for brocade and damask weaving, embossed silverwork, traditional weapons manufacturing, and woven baskets. The old city\'s craftsmen market still testifies to this heritage.' } }
        ],
        conclusion: { ar: 'مكناس قرار معماري أكثر من كونها نمواً عفوياً — ودائماً ما تكون المدن المبنية بقرار مِن حيّاة عظيمة أطول عمراً من تلك التي نشأت بالصدفة.', en: 'Meknes is an architectural decision more than spontaneous growth — and cities built by deliberate will always outlive those born by chance.' },
        generatedImage: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=2070&auto=format&fit=crop'
    },

    'tetouan': {
        id: 'tetouan', category: 'city',
        title: { ar: 'تطوان: الحمامة البيضاء وذاكرة الأندلس الحيّة', en: 'Tetouan: The White Dove and Living Memory of Andalusia' },
        metaDescription: { ar: 'تطوان الحمامة البيضاء المدرجة في تراث اليونسكو، وريثة الأندلس الأصيلة وموطن الفن الأندلسي-المغربي العريق في شمال المغرب.', en: 'Tetouan the White Dove, UNESCO-listed city, authentic heir of Andalusia and home of Andalusian-Moroccan art in northern Morocco.' },
        intro: { ar: 'لو أردت أن تبحث عن الأندلس المفقودة، لا تذهب إلى إسبانيا — اذهب إلى تطوان. المدينة التي أعاد بناءها الغرناطيون المُهجَّرون بعد سقوط الأندلس في آواخر القرن الخامس عشر تحتفظ اليوم بأُتون الحضارة الأندلسية متّقداً في عمارتها ولحنها وطبخها وشخصية أهلها. مدينتها القديمة المُدرجة في قوائم اليونيسكو للتراث الإنساني منذ عام 1997 هي الأكثر كمالاً وسلامة بين جميع المدن العتيقة المغربية — جدران بيضاء، أبواب خضراء، زليج ملوّن، وصوت الأغنية الأندلسية المسمّاة "الآلة" يتسرّب من نوافذ البيوت القديمة في حفلات لم تنقطع منذ أجيال.', en: 'To search for lost Andalusia, don\'t go to Spain — go to Tetouan. The city rebuilt by expelled Granadans after Andalusia\'s fall in the late 15th century retains an Andalusian cultural furnace still burning in its architecture, music, cuisine, and people\'s character. Its old medina, UNESCO-listed since 1997, is the most complete and intact among all Moroccan medinas.' },
        sections: [
            {
                title: { ar: 'الآلة الأندلسية: موسيقى طنجة-تطوان التي أبت أن تموت', en: 'Andalusian Muwashshah Music: Tetouan\'s Music That Refused to Die' },
                content: { ar: 'في القرن الثامن الميلادي وُلدت موسيقى الآلة الأندلسية من رحم الحضارة الأموية بالأندلس، وتطوّرت عبر قرون لتكون اللغة الموسيقية للطبقات الراقية من مسلمي إسبانيا. حين أُجبر الأندلسيون على الرحيل حملوا معهم نوتاتهم وآلاتهم الموسيقية وذاكرتهم اللحنية، ففي تطوان تحديداً تجذّرت الآلة بعمق استثنائي لأن المهاجرين كانوا في معظمهم من النخبة الغرناطية الموسيقية المتعلمة. هيئات تطوان الموسيقية التاريخية لا تزال تحرص حتى اليوم على أداء النوبات الاثنتي عشرة التقليدية وفق الروايات التي انتقلت شفهياً وكتابياً على مدى ستة قرون دون انقطاع.', en: 'Andalusian muwashshah music was born in 8th-century Umayyad Andalusia and carried by expelled elites to Tetouan, where it took especially deep roots because migrants were predominantly educated Granadan musical nobility. Tetouan\'s historic musical societies still perform all twelve traditional modes transmitted orally and textually for six unbroken centuries.' }
            },
            {
                title: { ar: 'تطوان في عهد الحماية الإسبانية: مركز المنطقة الخليفية', en: 'Tetouan Under Spanish Protectorate: Center of the Khalifian Zone' },
                content: { ar: 'في اتفاقية الحماية عام 1912، خُصِّص الشمال المغربي لإسبانيا التي جعلت من تطوان عاصمة لمنطقتها "الخليفية"، وأقامت فيها خليفة السلطان ممثلاً للعرش الشريف. هذا الوضع الخاص أعطى تطوان مؤسسات حكومية ومدارس وصحافة رائدة جعلتها مركزاً ثقافياً بارزاً في شمال المغرب. في هذا السياق ازدهرت الصحافة العربية الناطقة في المنطقة الإسبانية بمستوى حرية أعلى أحياناً من بقية مناطق الحماية، وأنتجت أسماء أدبية وفكرية بارزة في تاريخ الثقافة العربية الحديثة.', en: 'The 1912 Protectorate agreement assigned northern Morocco to Spain, which made Tetouan capital of its "Khalifian zone" housing the Sultan\'s representative. This special status gave Tetouan leading institutions, schools, and press, making Arabic journalism in the Spanish zone often freer than elsewhere in the Protectorate.' }
            }
        ],
        faqs: [
            { question: { ar: 'ماذا يعني اسم تطوان وما أصله اللغوي والتاريخي؟', en: 'What does the name Tetouan mean and what is its linguistic and historical origin?' }, answer: { ar: 'الاسم أمازيغي الأصل ومعناه "العيون" أو "الينابيع" في إشارة للعيون المائية الطبيعية الوفيرة التي كانت تُميِّز موقع المدينة في وادي مرتيل المشجّر الخصيب.', en: 'The name is Amazigh in origin meaning "the springs" or "the eyes," referring to the abundant natural water springs that distinguished the city\'s site in the fertile, forested Martil valley.' } },
            { question: { ar: 'لماذا تُعدّ مدينة تطوان القديمة الأكثر أصالة بين المدن العتيقة المغربية؟', en: 'Why is Tetouan\'s old medina considered the most authentic among Moroccan medinas?' }, answer: { ar: 'لأن التوسع العمراني الحديث دار حولها لا داخلها، فظلّ نسيجها المعماري الأندلسي سليماً دون هدم أو تعديل جوهري. الأسواق والدروب والبيوت الداخلية تعكس تخطيطاً أندلسياً أصيلاً نادر المثال على صعيد المتوسط الغربي.', en: 'Because modern urban expansion occurred around rather than within it, leaving its Andalusian architectural fabric intact without demolition or fundamental modification. Its markets, alleys, and courtyard houses reflect authentic Andalusian planning rare in the western Mediterranean.' } },
            { question: { ar: 'هل المطبخ التطواني يختلف عن بقية المطابخ المغربية؟', en: 'Does Tetouan\'s cuisine differ from other Moroccan cuisines?' }, answer: { ar: 'نعم، للمطبخ التطواني نكهة أندلسية مميزة تتجلّى في استخدام خلطات التوابل الرقيقة والزيتون والخلطات المعقدة من الفواكه والأعشاب التي تعكس الحضارة الغذائية الأندلسية الراقية التي خُبِّئت في تطوان من النسيان.', en: 'Yes, Tetouan\'s cuisine has a distinctive Andalusian flavor revealed in delicate spice blends, olive preparations, and complex fruit-herb mixtures reflecting refined Andalusian food culture preserved in Tetouan from oblivion.' } }
        ],
        conclusion: { ar: 'تطوان ليست مجرد مدينة مغربية شمالية — إنها وصيّة الأندلس وحارسة ذاكرتها الجمالية والموسيقية على شاطئ المتوسط النظيف.', en: 'Tetouan is not merely a northern Moroccan city — it is the custodian of Andalusia, guardian of its aesthetic and musical memory on the clean Mediterranean shore.' },
        generatedImage: 'https://images.unsplash.com/photo-1591802070002-bfc90093b5ef?q=80&w=2070&auto=format&fit=crop'
    }
};

// ── Inject into moroverse-content.ts ──────────────────────
const targetPath = path.join('data', 'moroverse-content.ts');
let src = fs.readFileSync(targetPath, 'utf8');
const newIds = Object.keys(ARTICLES).filter(id => !src.includes(`'${id}':`));
if (newIds.length > 0) {
    const code = newIds.map(id => `  '${id}': ${JSON.stringify(ARTICLES[id], null, 4)},`).join('\n');
    src = src.replace(
        `export const moroverseArticles: Record<string, MoroArticle> = {`,
        `export const moroverseArticles: Record<string, MoroArticle> = {\n${code}`
    );
    fs.writeFileSync(targetPath, src, 'utf8');
    console.log(`✅ Batch 1 injected: ${newIds.join(', ')}`);
} else {
    console.log('ℹ️  All batch-1 articles already present.');
}
