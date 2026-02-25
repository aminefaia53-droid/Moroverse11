export type ZoneType = 'Major City' | 'Medium City' | 'Rural Center' | 'Douar';
export type ClimateType = 'Coastal' | 'Mountain' | 'Saharan' | 'Continental' | 'Mediterranean';

export interface Location {
    id: string;
    name: { en: string; ar: string };
    type: ZoneType;
    climate: ClimateType;
    province?: string;
    commune?: string;
    landmarks: { en: string[]; ar: string[] };
    coords: { top: string; left: string };
    history: { en: string; ar: string };
    visualSoul: 'Medina' | 'Kasbah' | 'Modern' | 'Modern-Coastal' | 'Oasis' | 'Mountain-Village' | 'Tent';
    details?: { en: string; ar: string };
}

export interface Region {
    id: string;
    name: { en: string; ar: string };
    capital: string;
    zoomLevel: { scale: number; x: string; y: string };
    provinces: Location[];
}

export const moroccoRegions: Region[] = [
    {
        id: 'tangier-tetouan-alhoceima',
        name: { en: 'Tangier-Tetouan-Al Hoceima', ar: 'طنجة-تطوان-الحسيمة' },
        capital: 'Tangier',
        zoomLevel: { scale: 3.5, x: "30%", y: "45%" },
        provinces: [
            { id: 'tangier', name: { en: 'Tangier', ar: 'طنجة' }, type: 'Major City', climate: 'Mediterranean', landmarks: { en: ['Hercules Caves'], ar: ['مغارة هرقل'] }, coords: { top: '3%', left: '55%' }, history: { en: 'International gateway.', ar: 'البوابة الدولية.' }, visualSoul: 'Modern-Coastal' },
            { id: 'tetouan', name: { en: 'Tetouan', ar: 'تطوان' }, type: 'Major City', climate: 'Mediterranean', landmarks: { en: ['Ancient Medina'], ar: ['المدينة العتيقة'] }, coords: { top: '5%', left: '62%' }, history: { en: 'The White Dove.', ar: 'الحمامة البيضاء.' }, visualSoul: 'Medina' },
            { id: 'alhoceima', name: { en: 'Al Hoceima', ar: 'الحسيمة' }, type: 'Major City', climate: 'Mediterranean', landmarks: { en: ['Quemado Beach'], ar: ['شاطئ كيمادو'] }, coords: { top: '5%', left: '68%' }, history: { en: 'Mediterranean pearl.', ar: 'لؤلؤة المتوسط.' }, visualSoul: 'Modern-Coastal' },
            { id: 'chefchaouen', name: { en: 'Chefchaouen', ar: 'شفشاون' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Blue Medina'], ar: ['المدينة الزرقاء'] }, coords: { top: '8%', left: '60%' }, history: { en: 'The Blue City.', ar: 'المدينة الزرقاء.' }, visualSoul: 'Medina' },
            { id: 'larache', name: { en: 'Larache', ar: 'العرائش' }, type: 'Medium City', climate: 'Coastal', landmarks: { en: ['Lixus'], ar: ['ليكسوس'] }, coords: { top: '10%', left: '52%' }, history: { en: 'Ancient port.', ar: 'ميناء قديم.' }, visualSoul: 'Modern-Coastal' },
            { id: 'ksar-el-kebir', name: { en: 'Ksar el-Kebir', ar: 'القصر الكبير' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Wadi Al-Makhazin Site'], ar: ['موقع وادي المخازن'] }, coords: { top: '12%', left: '53%' }, history: { en: 'Historic victory site.', ar: 'موقع النصر التاريخي.' }, visualSoul: 'Medina' },
            { id: 'ouazzane', name: { en: 'Ouazzane', ar: 'وزان' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Green City'], ar: ['المدينة الخضراء'] }, coords: { top: '15%', left: '58%' }, history: { en: 'Spiritual center.', ar: 'مركز روحي.' }, visualSoul: 'Medina' },
            { id: 'm-diq', name: { en: 'M\'diq', ar: 'المضيق' }, type: 'Medium City', climate: 'Coastal', landmarks: { en: ['The Marina'], ar: ['المارينا'] }, coords: { top: '4%', left: '63%' }, history: { en: 'The Corner city.', ar: 'الرينكون.' }, visualSoul: 'Modern-Coastal' },
            { id: 'fnideq', name: { en: 'Fnideq', ar: 'الفنيدق' }, type: 'Medium City', climate: 'Coastal', landmarks: { en: ['Bab Sebta'], ar: ['باب سبتة'] }, coords: { top: '3.5%', left: '64%' }, history: { en: 'Castillejos.', ar: 'كاستييخوس.' }, visualSoul: 'Modern-Coastal' },
            { id: 'assilah', name: { en: 'Assilah', ar: 'أصيلة' }, type: 'Medium City', climate: 'Coastal', landmarks: { en: ['The Ramparts'], ar: ['الأسوار'] }, coords: { top: '7%', left: '53%' }, history: { en: 'City of arts.', ar: 'مدينة الفنون.' }, visualSoul: 'Modern-Coastal' },
            { id: 'aknoul', name: { en: 'Aknoul', ar: 'أكنول' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Rif Mountains'], ar: ['جبال الريف'] }, coords: { top: '12%', left: '70%' }, history: { en: 'Resistance center.', ar: 'مركز المقاومة.' }, visualSoul: 'Mountain-Village' },
            { id: 'bab-berred', name: { en: 'Bab Berred', ar: 'باب برد' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Peak Views'], ar: ['إطلالات القمة'] }, coords: { top: '10%', left: '63%' }, history: { en: 'High Rif pass.', ar: 'ممر الريف العالي.' }, visualSoul: 'Mountain-Village' },
            { id: 'tarjiest', name: { en: 'Targist', ar: 'تارجيست' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Senhaja Heritage'], ar: ['تراث صنهاجة'] }, coords: { top: '8%', left: '65%' }, history: { en: 'Heart of the Rif.', ar: 'قلب الريف.' }, visualSoul: 'Mountain-Village' },
            { id: 'ksar-sghir', name: { en: 'Ksar Sghir', ar: 'القصر الصغير' }, type: 'Rural Center', climate: 'Coastal', landmarks: { en: ['Ancient Port'], ar: ['الميناء القديم'] }, coords: { top: '2.5%', left: '58%' }, history: { en: 'Almohad naval base.', ar: 'قاعدة بحرية موحدية.' }, visualSoul: 'Modern-Coastal' },
            { id: 'melloussa', name: { en: 'Melloussa', ar: 'ملوسة' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Industrial Hub'], ar: ['القطب الصناعي'] }, coords: { top: '4%', left: '57%' }, history: { en: 'Economic transformation.', ar: 'التحول الاقتصادي.' }, visualSoul: 'Modern' },
            { id: 'el-jebha', name: { en: 'El Jebha', ar: 'الجبهة' }, type: 'Rural Center', climate: 'Coastal', landmarks: { en: ['Hidden Beaches'], ar: ['شواطئ مختبئة'] }, coords: { top: '7%', left: '67%' }, history: { en: 'The Front city.', ar: 'الجبهة.' }, visualSoul: 'Modern-Coastal' }
        ]
    },
    {
        id: 'oriental',
        name: { en: 'Oriental', ar: 'الشرق' },
        capital: 'Oujda',
        zoomLevel: { scale: 3.5, x: "60%", y: "40%" },
        provinces: [
            { id: 'oujda', name: { en: 'Oujda', ar: 'وجدة' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Bab Sidi Abdelwahab'], ar: ['باب سيدي عبد الوهاب'] }, coords: { top: '15%', left: '85%' }, history: { en: 'Thousand-year city.', ar: 'مدينة الألف عام.' }, visualSoul: 'Medina' },
            { id: 'nador', name: { en: 'Nador', ar: 'الناظور' }, type: 'Major City', climate: 'Mediterranean', landmarks: { en: ['Marchica'], ar: ['مارتشيكا'] }, coords: { top: '8%', left: '75%' }, history: { en: 'Economic gateway.', ar: 'البوابة الاقتصادية.' }, visualSoul: 'Modern-Coastal' },
            { id: 'berkane', name: { en: 'Berkane', ar: 'بركان' }, type: 'Major City', climate: 'Mediterranean', landmarks: { en: ['Citrus Groves'], ar: ['حقول البرتقال'] }, coords: { top: '12%', left: '80%' }, history: { en: 'Citrus capital.', ar: 'عاصمة الحمضيات.' }, visualSoul: 'Modern' },
            { id: 'driouch', name: { en: 'Driouch', ar: 'الدريوش' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Historic Center'], ar: ['المركز التاريخي'] }, coords: { top: '10%', left: '72%' }, history: { en: 'Rif plateau city.', ar: 'مدينة هضبة الريف.' }, visualSoul: 'Modern' },
            { id: 'taourirt', name: { en: 'Taourirt', ar: 'تاوريرت' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Kasbah'], ar: ['القصبة'] }, coords: { top: '18%', left: '78%' }, history: { en: 'Strategic junction.', ar: 'ملتقى استراتيجي.' }, visualSoul: 'Kasbah' },
            { id: 'guercif', name: { en: 'Guercif', ar: 'جرسيف' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Agriculture'], ar: ['الفلاحة'] }, coords: { top: '22%', left: '75%' }, history: { en: 'Meeting of roads.', ar: 'لقاء الطرق.' }, visualSoul: 'Modern' },
            { id: 'jerada', name: { en: 'Jerada', ar: 'جرادة' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Mining Remains'], ar: ['بقايا المناجم'] }, coords: { top: '22%', left: '82%' }, history: { en: 'Mining heritage.', ar: 'تراث التعدين.' }, visualSoul: 'Modern' },
            { id: 'figuig', name: { en: 'Figuig', ar: 'فكيك' }, type: 'Medium City', climate: 'Saharan', landmarks: { en: ['Ancient Ksar'], ar: ['القصر القديم'] }, coords: { top: '35%', left: '95%' }, history: { en: 'Oasis of heritage.', ar: 'واحة التراث.' }, visualSoul: 'Oasis' },
            { id: 'bouarfa', name: { en: 'Bouarfa', ar: 'بوعرفة' }, type: 'Medium City', climate: 'Saharan', landmarks: { en: ['High Plateaus'], ar: ['الهضاب العليا'] }, coords: { top: '32%', left: '90%' }, history: { en: 'Desert outpost.', ar: 'نقطة صحراوية.' }, visualSoul: 'Modern' },
            { id: 'ain-bni-mathar', name: { en: 'Ain Bni Mathar', ar: 'عين بني مطهر' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Springs'], ar: ['العيون'] }, coords: { top: '28%', left: '88%' }, history: { en: 'Historic stop.', ar: 'توقف تاريخي.' }, visualSoul: 'Modern' },
            { id: 'zaio', name: { en: 'Zaio', ar: 'زايو' }, type: 'Rural Center', climate: 'Mediterranean', landmarks: { en: ['Agriculture'], ar: ['الفلاحة'] }, coords: { top: '11%', left: '78%' }, history: { en: 'Farm hub.', ar: 'مركز فلاحي.' }, visualSoul: 'Modern' },
            { id: 'selouane', name: { en: 'Selouane', ar: 'سلوان' }, type: 'Rural Center', climate: 'Mediterranean', landmarks: { en: ['The Kasbah'], ar: ['القصبة'] }, coords: { top: '9%', left: '76%' }, history: { en: 'Ancient fortress.', ar: 'حصن قديم.' }, visualSoul: 'Kasbah' },
            { id: 'ras-el-ma', name: { en: 'Ras El Ma', ar: 'راس الماء' }, type: 'Rural Center', climate: 'Coastal', landmarks: { en: ['Moulouya Estuary'], ar: ['مصب ملوية'] }, coords: { top: '10%', left: '82%' }, history: { en: 'Cape Water.', ar: 'رأس الماء.' }, visualSoul: 'Modern-Coastal' },
            { id: 'saidia', name: { en: 'Saidia', ar: 'السعيدية' }, type: 'Medium City', climate: 'Coastal', landmarks: { en: ['Blue Pearl Beach'], ar: ['شاطئ اللؤلؤة الزرقاء'] }, coords: { top: '10.5%', left: '83%' }, history: { en: 'Tourism capital of the East.', ar: 'عاصمة السياحة بالشرق.' }, visualSoul: 'Modern-Coastal' },
            { id: 'ahfir', name: { en: 'Ahfir', ar: 'أحفير' }, type: 'Rural Center', climate: 'Mediterranean', landmarks: { en: ['Border Market'], ar: ['سوق الحدود'] }, coords: { top: '12%', left: '82%' }, history: { en: 'Strategic gate.', ar: 'بوابة استراتيجية.' }, visualSoul: 'Modern' }
        ]
    },
    {
        id: 'fez-meknes',
        name: { en: 'Fès-Meknès', ar: 'فاس-مكناس' },
        capital: 'Fez',
        zoomLevel: { scale: 3.5, x: "25%", y: "30%" },
        provinces: [
            { id: 'fez', name: { en: 'Fez', ar: 'فاس' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Al-Qarawiyyin'], ar: ['جامعة القرويين'] }, coords: { top: '30%', left: '65%' }, history: { en: 'Eternal Medina.', ar: 'المدينة الأزلية.' }, visualSoul: 'Medina' },
            { id: 'meknes', name: { en: 'Meknes', ar: 'مكناس' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Bab Mansour'], ar: ['باب المنصور'] }, coords: { top: '33%', left: '58%' }, history: { en: 'Ismailite capital.', ar: 'العاصمة الإسماعيلية.' }, visualSoul: 'Medina' },
            { id: 'taza', name: { en: 'Taza', ar: 'تازة' }, type: 'Major City', climate: 'Mountain', landmarks: { en: ['Friouato Cave'], ar: ['مغارة فريواطو'] }, coords: { top: '28%', left: '72%' }, history: { en: 'Mountain corridor.', ar: 'الممر الجبلي.' }, visualSoul: 'Medina' },
            { id: 'sefrou', name: { en: 'Sefrou', ar: 'صفرو' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Cherry Festival'], ar: ['مهرجان الحب الملوك'] }, coords: { top: '35%', left: '66%' }, history: { en: 'The Cherry city.', ar: 'مدينة الحب الملوك.' }, visualSoul: 'Medina' },
            { id: 'ifrane', name: { en: 'Ifrane', ar: 'إفران' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Stone Lion'], ar: ['أسد إفران'] }, coords: { top: '38%', left: '62%' }, history: { en: 'Little Switzerland.', ar: 'سويسرا الصغيرة.' }, visualSoul: 'Modern' },
            { id: 'boulemane', name: { en: 'Boulemane', ar: 'بولمان' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Atlas Peaks'], ar: ['قمم الأطلس'] }, coords: { top: '42%', left: '70%' }, history: { en: 'High altitude city.', ar: 'مدينة المرتفعات.' }, visualSoul: 'Mountain-Village' },
            { id: 'el-hajeb', name: { en: 'El Hajeb', ar: 'الحاجب' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['The Gate'], ar: ['بوابة الأطلس'] }, coords: { top: '36%', left: '59%' }, history: { en: 'Atlas gate.', ar: 'بوابة الأطلس.' }, visualSoul: 'Modern' },
            { id: 'moulay-yaacoub', name: { en: 'Moulay Yaacoub', ar: 'مولاي يعقوب' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Thermal Springs'], ar: ['الحامات المعدنية'] }, coords: { top: '31%', left: '62%' }, history: { en: 'Healing waters.', ar: 'مياه شافية.' }, visualSoul: 'Medina' },
            { id: 'taounate', name: { en: 'Taounate', ar: 'تاونات' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Olive Groves'], ar: ['حقول الزيتون'] }, coords: { top: '25%', left: '62%' }, history: { en: 'Rif foothills.', ar: 'سفوح الريف.' }, visualSoul: 'Mountain-Village' },
            { id: 'azrou', name: { en: 'Azrou', ar: 'أزرو' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Cedars and Barbary Macaques'], ar: ['الأرز والقردة'] }, coords: { top: '40%', left: '61%' }, history: { en: 'The great rock.', ar: 'الصخرة الكبيرة.' }, visualSoul: 'Mountain-Village' },
            { id: 'missour', name: { en: 'Missour', ar: 'ميسور' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Moulouya'], ar: ['ملوية'] }, coords: { top: '40%', left: '75%' }, history: { en: 'Continental link.', ar: 'صلة وصل قارية.' }, visualSoul: 'Modern' },
            { id: 'outat-el-haj', name: { en: 'Outat El Haj', ar: 'أوطاط الحاج' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Date Palms'], ar: ['النخيل'] }, coords: { top: '35%', left: '78%' }, history: { en: 'Agricultural stop.', ar: 'محطة فلاحية.' }, visualSoul: 'Modern' },
            { id: 'tahla', name: { en: 'Tahla', ar: 'تاهلة' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Mountain Market'], ar: ['سوق الجبل'] }, coords: { top: '29%', left: '70%' }, history: { en: 'Ghiata heritage.', ar: 'تراث غياثة.' }, visualSoul: 'Mountain-Village' },
            { id: 'imouzzer-kandar', name: { en: 'Imouzzer Kandar', ar: 'إيموزار كندر' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Water Springs'], ar: ['العيون'] }, coords: { top: '37%', left: '64%' }, history: { en: 'Cool retreat.', ar: 'مصيف بارد.' }, visualSoul: 'Mountain-Village' },
            { id: 'ain-cheggag', name: { en: 'Ain Cheggag', ar: 'عين الشكاك' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Plains'], ar: ['السهول'] }, coords: { top: '34%', left: '63%' }, history: { en: 'Saiss hub.', ar: 'مركز سايس.' }, visualSoul: 'Modern' },
            { id: 'karia-ba-mohamed', name: { en: 'Karia Ba Mohamed', ar: 'قرية با محمد' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Agriculture'], ar: ['الفلاحة'] }, coords: { top: '26%', left: '60%' }, history: { en: 'Northern hub.', ar: 'مركز الشمال.' }, visualSoul: 'Modern' }
        ]
    },
    {
        id: 'rabat-sale-kenitra',
        name: { en: 'Rabat-Salé-Kénitra', ar: 'الرباط-سلا-القنيطرة' },
        capital: 'Rabat',
        zoomLevel: { scale: 4.5, x: "15%", y: "25%" },
        provinces: [
            { id: 'rabat', name: { en: 'Rabat', ar: 'الرباط' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Hassan Tower'], ar: ['صومعة حسان'] }, coords: { top: '26%', left: '46%' }, history: { en: 'The Imperial Capital.', ar: 'العاصمة الإمبراطورية.' }, visualSoul: 'Modern' },
            { id: 'sale', name: { en: 'Salé', ar: 'سلا' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Bab Lamrisa'], ar: ['باب المريسة'] }, coords: { top: '25%', left: '47%' }, history: { en: 'Pirates and Scholars.', ar: 'القراصنة والعلماء.' }, visualSoul: 'Medina' },
            { id: 'kenitra', name: { en: 'Kénitra', ar: 'القنيطرة' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Mehdia Beach'], ar: ['شاطئ المهدية'] }, coords: { top: '22%', left: '48%' }, history: { en: 'Sebou River port.', ar: 'ميناء نهر سبو.' }, visualSoul: 'Modern' },
            { id: 'khemisset', name: { en: 'Khemisset', ar: 'الخميسات' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Dayet Roumi'], ar: ['ضاية رومي'] }, coords: { top: '30%', left: '52%' }, history: { en: 'Zemmour capital.', ar: 'عاصمة زمور.' }, visualSoul: 'Modern' },
            { id: 'temara', name: { en: 'Temara', ar: 'تمارة' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Beaches'], ar: ['الشواطئ'] }, coords: { top: '28%', left: '45%' }, history: { en: 'Atlantic link.', ar: 'صلة الأطلسي.' }, visualSoul: 'Modern' },
            { id: 'sidi-kacem', name: { en: 'Sidi Kacem', ar: 'سيدي قاسم' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Agricultural Hub'], ar: ['القطب الفلاحي'] }, coords: { top: '26%', left: '54%' }, history: { en: 'Sais gateway.', ar: 'بوابة سايس.' }, visualSoul: 'Modern' },
            { id: 'sidi-slimane', name: { en: 'Sidi Slimane', ar: 'سيدي سليمان' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Citrus'], ar: ['الحمضيات'] }, coords: { top: '25%', left: '53%' }, history: { en: 'Citrus heart.', ar: 'قلب الحمضيات.' }, visualSoul: 'Modern' },
            { id: 'skhirat', name: { en: 'Skhirat', ar: 'الصخيرات' }, type: 'Medium City', climate: 'Coastal', landmarks: { en: ['Royal Beach'], ar: ['الشاطئ الملكي'] }, coords: { top: '29%', left: '44%' }, history: { en: 'Peace meeting site.', ar: 'موقع لقاءات السلام.' }, visualSoul: 'Modern-Coastal' },
            { id: 'ain-el-aouda', name: { en: 'Ain El Aouda', ar: 'عين العودة' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Green Belt'], ar: ['الحزام الأخضر'] }, coords: { top: '30%', left: '47%' }, history: { en: 'Zemmour link.', ar: 'صلة وصل زمور.' }, visualSoul: 'Modern' },
            { id: 'tiflet', name: { en: 'Tiflet', ar: 'تيفلت' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Historic Center'], ar: ['المركز التاريخي'] }, coords: { top: '31%', left: '51%' }, history: { en: 'Zemmour city.', ar: 'مدينة زمور.' }, visualSoul: 'Modern' },
            { id: 'rommani', name: { en: 'Rommani', ar: 'الرماني' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Plateaus'], ar: ['الهضاب'] }, coords: { top: '35%', left: '50%' }, history: { en: 'Agriculture hub.', ar: 'مركز فلاحي.' }, visualSoul: 'Modern' },
            { id: 'mechra-bel-ksiri', name: { en: 'Mechra Bel Ksiri', ar: 'مشرع بلقصيري' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Sebou River'], ar: ['نهر سبو'] }, coords: { top: '22%', left: '53%' }, history: { en: 'River crossing.', ar: 'معبر النهر.' }, visualSoul: 'Modern' },
            { id: 'souk-el-arbaa', name: { en: 'Souk El Arbaa', ar: 'سوق الأربعاء' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Market'], ar: ['السوق'] }, coords: { top: '20%', left: '52%' }, history: { en: 'Trade center.', ar: 'مركز تجاري.' }, visualSoul: 'Modern' }
        ]
    },
    {
        id: 'beni-mellal-khenifra',
        name: { en: 'Béni Mellal-Khénifra', ar: 'بني ملال-خنيفرة' },
        capital: 'Beni Mellal',
        zoomLevel: { scale: 3.5, x: "15%", y: "10%" },
        provinces: [
            { id: 'beni-mellal', name: { en: 'Beni Mellal', ar: 'بني ملال' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Ain Asserdoun'], ar: ['عين أسردون'] }, coords: { top: '48%', left: '55%' }, history: { en: 'Agricultural heart.', ar: 'القلب الفلاحي.' }, visualSoul: 'Modern' },
            { id: 'khenifra', name: { en: 'Khénifra', ar: 'خنيفرة' }, type: 'Major City', climate: 'Mountain', landmarks: { en: ['Zayane Heritage'], ar: ['تراث زيان'] }, coords: { top: '45%', left: '60%' }, history: { en: 'Resistance capital.', ar: 'عاصمة المقاومة.' }, visualSoul: 'Mountain-Village' },
            { id: 'azilal', name: { en: 'Azilal', ar: 'أزيلال' }, type: 'Major City', climate: 'Mountain', landmarks: { en: ['Ouzoud Waterfalls'], ar: ['شلالات أوزود'] }, coords: { top: '51%', left: '52%' }, history: { en: 'High Atlas center.', ar: 'مركز الأطلس الكبير.' }, visualSoul: 'Mountain-Village' },
            { id: 'fquih-ben-salah', name: { en: 'Fquih Ben Salah', ar: 'الفقيه بن صالح' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Agricultural Center'], ar: ['مركز فلاحي'] }, coords: { top: '47%', left: '50%' }, history: { en: 'Tadla hub.', ar: 'مركز تادلة.' }, visualSoul: 'Modern' },
            { id: 'khouribga', name: { en: 'Khouribga', ar: 'خريبكة' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Phosphate Plateau'], ar: ['هضبة الفوسفاط'] }, coords: { top: '38%', left: '48%' }, history: { en: 'Phosphate capital.', ar: 'عاصمة الفوسفاط.' }, visualSoul: 'Modern' },
            { id: 'kasba-tadla', name: { en: 'Kasba Tadla', ar: 'قصبة تادلة' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Historic Kasbah'], ar: ['القصبة التاريخية'] }, coords: { top: '46%', left: '52%' }, history: { en: 'Ancient garrison.', ar: 'حامية قديمة.' }, visualSoul: 'Kasbah' },
            { id: 'demnate', name: { en: 'Demnate', ar: 'دمنات' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Imi n Ifri'], ar: ['إيمين إيفري'] }, coords: { top: '56%', left: '48%' }, history: { en: 'Oldest Atlas city.', ar: 'أقدم مدن الأطلس.' }, visualSoul: 'Mountain-Village' },
            { id: 'oued-zem', name: { en: 'Oued Zem', ar: 'وادي زم' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['War Memorials'], ar: ['نصب الشهداء'] }, coords: { top: '40%', left: '53%' }, history: { en: 'Martyr city.', ar: 'مدينة الشهداء.' }, visualSoul: 'Modern' },
            { id: 'bejaad', name: { en: 'Bejaad', ar: 'أبي الجعد' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Sufi Zawiyas'], ar: ['الزوايا الصوفية'] }, coords: { top: '42%', left: '52%' }, history: { en: 'Spiritual town.', ar: 'بلدة روحية.' }, visualSoul: 'Medina' },
            { id: 'mrirt', name: { en: 'Mrirt', ar: 'مريرت' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Mineral Mines'], ar: ['مناجم المعادن'] }, coords: { top: '43%', left: '60%' }, history: { en: 'Middle Atlas hub.', ar: 'مركز الأطلس المتوسط.' }, visualSoul: 'Mountain-Village' },
            { id: 'ouaouizeght', name: { en: 'Waouizeght', ar: 'واويزغت' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Lake Views'], ar: ['إطلالات البحيرة'] }, coords: { top: '53%', left: '54%' }, history: { en: 'Strategic pass.', ar: 'ممر استراتيجي.' }, visualSoul: 'Mountain-Village' },
            { id: 'imilchil', name: { en: 'Imilchil', ar: 'إيميلشيل' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Marriage Festival Lakes'], ar: ['بحيرات موسم الخطوبة'] }, coords: { top: '58%', left: '65%' }, history: { en: 'High Atlas legend.', ar: 'أسطورة الأطلس الكبير.' }, visualSoul: 'Mountain-Village' },
            { id: 'zaouiat-cheikh', name: { en: 'Zaouia Cheikh', ar: 'زاوية الشيخ' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Waterfalls'], ar: ['الشلالات'] }, coords: { top: '48%', left: '58%' }, history: { en: 'Historic zawiya.', ar: 'زاوية تاريخية.' }, visualSoul: 'Mountain-Village' }
        ]
    },
    {
        id: 'casablanca-settat',
        name: { en: 'Casablanca-Settat', ar: 'الدار البيضاء-سطات' },
        capital: 'Casablanca',
        zoomLevel: { scale: 4, x: "10%", y: "15%" },
        provinces: [
            { id: 'casablanca', name: { en: 'Casablanca', ar: 'الدار البيضاء' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Hassan II Mosque'], ar: ['مسجد الحسن الثاني'] }, coords: { top: '30%', left: '42%' }, history: { en: 'The White House.', ar: 'الدار البيضاء.' }, visualSoul: 'Modern' },
            { id: 'settat', name: { en: 'Settat', ar: 'سطات' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Agriculture'], ar: ['الفلاحة'] }, coords: { top: '42%', left: '44%' }, history: { en: 'Agriculture heart.', ar: 'القلب الفلاحي.' }, visualSoul: 'Modern' },
            { id: 'el-jadida', name: { en: 'El Jadida', ar: 'الجديدة' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Portuguese Cistern'], ar: ['المسقاة البرتغالية'] }, coords: { top: '38%', left: '38%' }, history: { en: 'Mazagan.', ar: 'مازاغان.' }, visualSoul: 'Modern-Coastal' },
            { id: 'mohammedia', name: { en: 'Mohammedia', ar: 'المحمدية' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['The Port'], ar: ['الميناء'] }, coords: { top: '28%', left: '43.5%' }, history: { en: 'Fedala.', ar: 'فضالة.' }, visualSoul: 'Modern-Coastal' },
            { id: 'berrechid', name: { en: 'Berrechid', ar: 'برشيد' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Industrial Zone'], ar: ['المنطقة الصناعية'] }, coords: { top: '35%', left: '43%' }, history: { en: 'Economic hub.', ar: 'مركز اقتصادي.' }, visualSoul: 'Modern' },
            { id: 'benslimane', name: { en: 'Benslimane', ar: 'بنسليمان' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Oak Forests'], ar: ['غابات البلوط'] }, coords: { top: '32%', left: '48%' }, history: { en: 'Green city.', ar: 'المدينة الخضراء.' }, visualSoul: 'Modern' },
            { id: 'sidi-bennour', name: { en: 'Sidi Bennour', ar: 'سيدي بنور' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Weekly Market'], ar: ['السوق الأسبوعي'] }, coords: { top: '45%', left: '36%' }, history: { en: 'Doukkala heart.', ar: 'قلب دكالة.' }, visualSoul: 'Modern' },
            { id: 'nouaceur', name: { en: 'Nouaceur', ar: 'النواصر' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Airport Hub'], ar: ['قطب المطار'] }, coords: { top: '34%', left: '42%' }, history: { en: 'Logistics center.', ar: 'مركز لوجستي.' }, visualSoul: 'Modern' },
            { id: 'mediouna', name: { en: 'Mediouna', ar: 'مديونة' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Local Souks'], ar: ['الأسواق المحلية'] }, coords: { top: '32%', left: '43%' }, history: { en: 'Historic plateau.', ar: 'هضبة تاريخية.' }, visualSoul: 'Modern' },
            { id: 'had-soualem', name: { en: 'Had Soualem', ar: 'حد السوالم' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Industrial expansion'], ar: ['التوسع الصناعي'] }, coords: { top: '33%', left: '41%' }, history: { en: 'New hub.', ar: 'مركز جديد.' }, visualSoul: 'Modern' },
            { id: 'bouznika', name: { en: 'Bouznika', ar: 'بوزنيقة' }, type: 'Medium City', climate: 'Coastal', landmarks: { en: ['Beaches'], ar: ['الشواطئ'] }, coords: { top: '26%', left: '45%' }, history: { en: 'Atlantic resort.', ar: 'منتجع أطلسي.' }, visualSoul: 'Modern-Coastal' },
            { id: 'oualidie', name: { en: 'Oualidia', ar: 'الواليدية' }, type: 'Rural Center', climate: 'Coastal', landmarks: { en: ['The Lagoon'], ar: ['اللاغون'] }, coords: { top: '50%', left: '28%' }, history: { en: 'Oyster capital.', ar: 'عاصمة المحار.' }, visualSoul: 'Modern-Coastal' },
            { id: 'ouled-abbou', name: { en: 'Ouled Abbou', ar: 'أولاد عبو' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Farms'], ar: ['المزارع'] }, coords: { top: '40%', left: '43%' }, history: { en: 'Agricultural town.', ar: 'بلدة فلاحية.' }, visualSoul: 'Modern' }
        ]
    },
    {
        id: 'marrakech-safi',
        name: { en: 'Marrakech-Safi', ar: 'مراكش-أسفي' },
        capital: 'Marrakech',
        zoomLevel: { scale: 3.5, x: "20%", y: "0%" },
        provinces: [
            { id: 'marrakech', name: { en: 'Marrakech', ar: 'مراكش' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Koutoubia'], ar: ['الكتبية'] }, coords: { top: '55%', left: '45%' }, history: { en: 'The Ochre city.', ar: 'المدينة الحمراء.' }, visualSoul: 'Medina' },
            { id: 'safi', name: { en: 'Safi', ar: 'أسفي' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Pottery'], ar: ['الخزف'] }, coords: { top: '42%', left: '32%' }, history: { en: 'Pottery capital.', ar: 'عاصمة الخزف.' }, visualSoul: 'Modern-Coastal' },
            { id: 'essaouira', name: { en: 'Essaouira', ar: 'الصويرة' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Skala'], ar: ['الصقالة'] }, coords: { top: '58%', left: '28%' }, history: { en: 'Mogador.', ar: 'موغادور.' }, visualSoul: 'Medina' },
            { id: 'kelat-sraghna', name: { en: 'Kelaat Sraghna', ar: 'قلعة السراغنة' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Agriculture'], ar: ['الفلاحة'] }, coords: { top: '50%', left: '50%' }, history: { en: 'Agricultural hub.', ar: 'مركز فلاحي.' }, visualSoul: 'Modern' },
            { id: 'al-haouz', name: { en: 'Al Haouz', ar: 'الحوز' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Atlas Valleys'], ar: ['وديان الأطلس'] }, coords: { top: '65%', left: '45%' }, history: { en: 'High Atlas heart.', ar: 'قلب الأطلس الكبير.' }, visualSoul: 'Mountain-Village' },
            { id: 'chichaoua', name: { en: 'Chichaoua', ar: 'شيشاوة' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Carpets'], ar: ['الزربية'] }, coords: { top: '60%', left: '38%' }, history: { en: 'Gateway to South.', ar: 'بوابة الجنوب.' }, visualSoul: 'Modern' },
            { id: 'rehamna', name: { en: 'Rehamna', ar: 'الرحامنة' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Mining'], ar: ['المناجم'] }, coords: { top: '48%', left: '45%' }, history: { en: 'Strategic plateau.', ar: 'هضبة استراتيجية.' }, visualSoul: 'Modern' },
            { id: 'youssoufia', name: { en: 'Youssoufia', ar: 'اليوسفية' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Phosphate'], ar: ['الفوسفاط'] }, coords: { top: '45%', left: '38%' }, history: { en: 'Mining hub.', ar: 'مركز منجمي.' }, visualSoul: 'Modern' },
            { id: 'tamansourt', name: { en: 'Tamansourt', ar: 'تامنصورت' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['New City Hub'], ar: ['المدينة الجديدة'] }, coords: { top: '53%', left: '44%' }, history: { en: 'Satellite city.', ar: 'مدينة تابعة.' }, visualSoul: 'Modern' },
            { id: 'tahnaout', name: { en: 'Tahnaout', ar: 'تحناوت' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Zellig Bridge'], ar: ['قنطرة الزليج'] }, coords: { top: '62%', left: '44%' }, history: { en: 'Atlas gate.', ar: 'بوابة الأطلس.' }, visualSoul: 'Mountain-Village' },
            { id: 'imlil', name: { en: 'Imlil', ar: 'إمليل' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Toubkal Base'], ar: ['قاعدة توبقال'] }, coords: { top: '68%', left: '43%' }, history: { en: 'Mountaineering hub.', ar: 'مركز تسلق الجبال.' }, visualSoul: 'Mountain-Village' },
            { id: 'ourika', name: { en: 'Ourika', ar: 'أوريكا' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Waterfalls'], ar: ['الشلالات'] }, coords: { top: '64%', left: '47%' }, history: { en: 'Lush valley.', ar: 'وادي خصب.' }, visualSoul: 'Mountain-Village' },
            { id: 'lalla-takerkoust', name: { en: 'Lalla Takerkoust', ar: 'لالة تكركوست' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['The Dam'], ar: ['السد'] }, coords: { top: '63%', left: '41%' }, history: { en: 'Lake retreat.', ar: 'منتجع البحيرة.' }, visualSoul: 'Modern' },
            { id: 'benguerir', name: { en: 'Benguerir', ar: 'ابن جرير' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Green City'], ar: ['المدينة الخضراء'] }, coords: { top: '48%', left: '46%' }, history: { en: 'Smart city.', ar: 'مدينة ذكية.' }, visualSoul: 'Modern' },
            { id: 'sidi-zouine', name: { en: 'Sidi Zouine', ar: 'سيدي زوين' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Academic Zawiya'], ar: ['الزاوية العلمية'] }, coords: { top: '58%', left: '42%' }, history: { en: 'Traditional learning.', ar: 'التعليم العتيق.' }, visualSoul: 'Medina' }
        ]
    },
    {
        id: 'draa-tafilalet',
        name: { en: 'Drâa-Tafilalet', ar: 'درعة-تافيلالت' },
        capital: 'Errachidia',
        zoomLevel: { scale: 3, x: "40%", y: "-10%" },
        provinces: [
            { id: 'errachidia', name: { en: 'Errachidia', ar: 'الرشيدية' }, type: 'Major City', climate: 'Saharan', landmarks: { en: ['Tafilalet Palms'], ar: ['نخيل تافيلالت'] }, coords: { top: '48%', left: '72%' }, history: { en: 'Ksar Es-Souk.', ar: 'قصر السوق.' }, visualSoul: 'Oasis' },
            { id: 'ouarzazate', name: { en: 'Ouarzazate', ar: 'ورزازات' }, type: 'Major City', climate: 'Saharan', landmarks: { en: ['Taourirt Kasbah'], ar: ['قصبة تاوريرت'] }, coords: { top: '62%', left: '55%' }, history: { en: 'Desert Hollywood.', ar: 'هوليود الصحراء.' }, visualSoul: 'Kasbah' },
            { id: 'tinghir', name: { en: 'Tinghir', ar: 'تنغير' }, type: 'Major City', climate: 'Mountain', landmarks: { en: ['Todra Gorges'], ar: ['مضايق تودغى'] }, coords: { top: '55%', left: '62%' }, history: { en: 'Palace of the Oasis.', ar: 'قصر الواحة.' }, visualSoul: 'Oasis' },
            { id: 'zagora', name: { en: 'Zagora', ar: 'زاكورة' }, type: 'Major City', climate: 'Saharan', landmarks: { en: ['Timbuktu 52 Days'], ar: ['تمبوكتو 52 يوماً'] }, coords: { top: '75%', left: '62%' }, history: { en: 'Caravan halt.', ar: 'محطة القوافل.' }, visualSoul: 'Oasis' },
            { id: 'midelt', name: { en: 'Midelt', ar: 'ميدلت' }, type: 'Major City', climate: 'Mountain', landmarks: { en: ['Apples'], ar: ['التفاح'] }, coords: { top: '45%', left: '68%' }, history: { en: 'Lead mines.', ar: 'مناجم الرصاص.' }, visualSoul: 'Mountain-Village' },
            { id: 'erfoud', name: { en: 'Erfoud', ar: 'أرفود' }, type: 'Medium City', climate: 'Saharan', landmarks: { en: ['Fossils'], ar: ['المستحثات'] }, coords: { top: '58%', left: '78%' }, history: { en: 'Date capital.', ar: 'عاصمة التمور.' }, visualSoul: 'Oasis' },
            { id: 'rissani', name: { en: 'Rissani', ar: 'الريصاني' }, type: 'Medium City', climate: 'Saharan', landmarks: { en: ['Sijilmasa Remains'], ar: ['بقايا سجلماسة'] }, coords: { top: '62%', left: '76%' }, history: { en: 'Alaouite cradle.', ar: 'مهد العلويين.' }, visualSoul: 'Medina' },
            { id: 'moulay-ali-cherif', name: { en: 'Moulay Ali Cherif', ar: 'مولاي علي الشريف' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['The Mausoleum'], ar: ['الضريح'] }, coords: { top: '63%', left: '77%' }, history: { en: 'Founder tomb.', ar: 'ضريح المؤسس.' }, visualSoul: 'Medina' },
            { id: 'boumalne-dades', name: { en: 'Boumalne Dades', ar: 'بومالن دادس' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Dades Valley'], ar: ['وادي دادس'] }, coords: { top: '58%', left: '60%' }, history: { en: 'Valley of Roses.', ar: 'وادي الورود.' }, visualSoul: 'Kasbah' },
            { id: 'kelat-m-gouna', name: { en: 'Kelat M\'Gouna', ar: 'قلعة مكونة' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Rose Festival'], ar: ['عيد الورد'] }, coords: { top: '60%', left: '58%' }, history: { en: 'Rose distillation.', ar: 'تقطير الورود.' }, visualSoul: 'Kasbah' },
            { id: 'tazarine', name: { en: 'Tazarine', ar: 'تازارين' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Ancient Ksar'], ar: ['القصر القديم'] }, coords: { top: '68%', left: '65%' }, history: { en: 'Henna oasis.', ar: 'واحة الحناء.' }, visualSoul: 'Oasis' },
            { id: 'agdz', name: { en: 'Agdz', ar: 'أكدز' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Jbel Kissane'], ar: ['جبل كيسان'] }, coords: { top: '68%', left: '58%' }, history: { en: 'Resting place.', ar: 'مكان الراحة.' }, visualSoul: 'Kasbah' },
            { id: 'tazenakht-forgotten-village', name: { en: 'Tazenakht', ar: 'تازناخت' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Carpet Cooperatives'], ar: ['تعاونيات الزرابي'] }, coords: { top: '65%', left: '50%' }, history: { en: 'Capital of the forgotten carpet.', ar: 'عاصمة الزربية المنسية.' }, visualSoul: 'Mountain-Village' },
            { id: 'agbalou-nkardous-resistence', name: { en: 'Agbalou Nkardous', ar: 'أغبالو نكردوس' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['The High Atlas Base'], ar: ['قاعدة الأطلس الكبير'] }, coords: { top: '50%', left: '70%' }, history: { en: 'Fortress of the Atlas resistance.', ar: 'قلعة مقاومة الأطلس.' }, visualSoul: 'Mountain-Village' }
        ]
    },
    {
        id: 'souss-massa',
        name: { en: 'Souss-Massa', ar: 'سوس-ماسة' },
        capital: 'Agadir',
        zoomLevel: { scale: 4, x: "15%", y: "-15%" },
        provinces: [
            { id: 'agadir', name: { en: 'Agadir', ar: 'أكادير' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Agadir Oufella'], ar: ['أكادير أوفلا'] }, coords: { top: '65%', left: '35%' }, history: { en: 'Coastal resilience.', ar: 'الصمود الساحلي.' }, visualSoul: 'Modern-Coastal' },
            { id: 'inezgane', name: { en: 'Inezgane', ar: 'إنزكان' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Grand Souk'], ar: ['السوق الكبي'] }, coords: { top: '66%', left: '34%' }, history: { en: 'Trade hub of the South.', ar: 'مركز التجارة بالجنوب.' }, visualSoul: 'Modern' },
            { id: 'ait-melloul', name: { en: 'Aït Melloul', ar: 'أيت ملول' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Industrial Zone'], ar: ['المنطقة الصناعية'] }, coords: { top: '67%', left: '34%' }, history: { en: 'Industrial gateway.', ar: 'البوابة الصناعية.' }, visualSoul: 'Modern' },
            { id: 'tiznit', name: { en: 'Tiznit', ar: 'تيزنيت' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Silver Jewelry'], ar: ['الحلي الفضية'] }, coords: { top: '75%', left: '30%' }, history: { en: 'The Silver city.', ar: 'مدينة الفضة.' }, visualSoul: 'Medina' },
            { id: 'taroudant', name: { en: 'Taroudant', ar: 'تارودانت' }, type: 'Major City', climate: 'Continental', landmarks: { en: ['Ancient Walls'], ar: ['الأسوار القديمة'] }, coords: { top: '68%', left: '38%' }, history: { en: 'The little Marrakech.', ar: 'مراكش الصغيرة.' }, visualSoul: 'Medina' },
            { id: 'tata', name: { en: 'Tata', ar: 'طاطا' }, type: 'Major City', climate: 'Saharan', landmarks: { en: ['Oases'], ar: ['الواحات'] }, coords: { top: '80%', left: '42%' }, history: { en: 'Desert pearl.', ar: 'لؤلؤة الصحراء.' }, visualSoul: 'Oasis' },
            { id: 'chtouka-ait-baha', name: { en: 'Chtouka Aït Baha', ar: 'اشتوكة أيت باها' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Agriculture'], ar: ['الفلاحة'] }, coords: { top: '70%', left: '32%' }, history: { en: 'Souss garden.', ar: 'بستان سوس.' }, visualSoul: 'Modern' },
            { id: 'tafraout', name: { en: 'Tafraout', ar: 'تافراوت' }, type: 'Medium City', climate: 'Mountain', landmarks: { en: ['Painted Rocks'], ar: ['الصخور الملونة'] }, coords: { top: '72%', left: '34%' }, history: { en: 'Anti-Atlas heart.', ar: 'قلب الأطلس الصغير.' }, visualSoul: 'Mountain-Village' },
            { id: 'ighrem', name: { en: 'Ighrem', ar: 'إيغرم' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Kasbahs'], ar: ['القصبات'] }, coords: { top: '75%', left: '38%' }, history: { en: 'Atlas outpost.', ar: 'نقطة الأطلس.' }, visualSoul: 'Kasbah' },
            { id: 'oulad-teima', name: { en: 'Oulad Teïma', ar: 'أولاد تايمة' }, type: 'Medium City', climate: 'Continental', landmarks: { en: ['Farms'], ar: ['المزارع'] }, coords: { top: '67%', left: '36%' }, history: { en: '44 City.', ar: 'مدينة 44.' }, visualSoul: 'Modern' },
            { id: 'massa', name: { en: 'Massa', ar: 'ماسة' }, type: 'Rural Center', climate: 'Coastal', landmarks: { en: ['Souss-Massa Park'], ar: ['منتزه سوس ماسة'] }, coords: { top: '72%', left: '30%' }, history: { en: 'Nature reserve.', ar: 'محمية طبيعية.' }, visualSoul: 'Modern' },
            { id: 'foum-zguid', name: { en: 'Foum Zguid', ar: 'فم زكيد' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Gates of Desert'], ar: ['أبواب الصحراء'] }, coords: { top: '78%', left: '55%' }, history: { en: 'Caravan stop.', ar: 'محطة القوافل.' }, visualSoul: 'Oasis' },
            { id: 'talioiuine', name: { en: 'Taliouine', ar: 'تاليوين' }, type: 'Rural Center', climate: 'Mountain', landmarks: { en: ['Saffron Fields'], ar: ['حقول الزعفران'] }, coords: { top: '70%', left: '42%' }, history: { en: 'Saffron capital.', ar: 'عاصمة الزعفران.' }, visualSoul: 'Mountain-Village' }
        ]
    },
    {
        id: 'guelmim-oued-noun',
        name: { en: 'Guelmim-Oued Noun', ar: 'كلميم-واد نون' },
        capital: 'Guelmim',
        zoomLevel: { scale: 3, x: "20%", y: "-30%" },
        provinces: [
            { id: 'guelmim', name: { en: 'Guelmim', ar: 'كلميم' }, type: 'Major City', climate: 'Saharan', landmarks: { en: ['Camel Market'], ar: ['سوق الإبل'] }, coords: { top: '82%', left: '28%' }, history: { en: 'Gateway to Sahara.', ar: 'بوابة الصحراء.' }, visualSoul: 'Oasis' },
            { id: 'tan-tan', name: { en: 'Tan-Tan', ar: 'طانطان' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['The Moussem'], ar: ['الموسم'] }, coords: { top: '85%', left: '22%' }, history: { en: 'Ocean and Desert.', ar: 'المحيط والصحراء.' }, visualSoul: 'Modern-Coastal' },
            { id: 'sidi-ifni', name: { en: 'Sidi Ifni', ar: 'سيدي إفني' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Legzira'], ar: ['لڭزيرا'] }, coords: { top: '78%', left: '25%' }, history: { en: 'Ait Baamrane stronghold.', ar: 'معقل أيت باعمران.' }, visualSoul: 'Modern-Coastal' },
            { id: 'assa', name: { en: 'Assa', ar: 'آسا' }, type: 'Medium City', climate: 'Saharan', landmarks: { en: ['Ancient Ksar'], ar: ['القصر القديم'] }, coords: { top: '85%', left: '30%' }, history: { en: 'Spiritual oasis.', ar: 'واحة روحية.' }, visualSoul: 'Oasis' },
            { id: 'zag', name: { en: 'Zag', ar: 'الزاك' }, type: 'Medium City', climate: 'Saharan', landmarks: { en: ['Border Post'], ar: ['النقطة الحدودية'] }, coords: { top: '88%', left: '32%' }, history: { en: 'Desert bastion.', ar: 'حصن الصحراء.' }, visualSoul: 'Modern' },
            { id: 'lakhsas', name: { en: 'Lakhsas', ar: 'لخصاص' }, type: 'Rural Center', climate: 'Continental', landmarks: { en: ['Mountains'], ar: ['الجبال'] }, coords: { top: '78%', left: '28%' }, history: { en: 'Historic pass.', ar: 'ممر تاريخي.' }, visualSoul: 'Modern' },
            { id: 'bouizakarne', name: { en: 'Bouizakarne', ar: 'بويزكارن' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['The Fort'], ar: ['الحصن'] }, coords: { top: '80%', left: '27%' }, history: { en: 'Desert crossroads.', ar: 'ملتقى طرق الصحراء.' }, visualSoul: 'Modern' },
            { id: 'timoulay', name: { en: 'Timoulay', ar: 'تيمولاي' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Palms'], ar: ['النخيل'] }, coords: { top: '81%', left: '29%' }, history: { en: 'Traditional oasis.', ar: 'واحة تقليدية.' }, visualSoul: 'Oasis' },
            { id: 'taghjijt', name: { en: 'Taghjijt', ar: 'تغجيجت' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Palm Groves'], ar: ['واحات النخيل'] }, coords: { top: '83%', left: '31%' }, history: { en: 'Agricultural oasis.', ar: 'واحة فلاحية.' }, visualSoul: 'Oasis' },
            { id: 'el-ouatya', name: { en: 'El Ouatya', ar: 'الوطية' }, type: 'Rural Center', climate: 'Coastal', landmarks: { en: ['Tan-Tan Beach'], ar: ['شاطئ طانطان'] }, coords: { top: '86%', left: '21%' }, history: { en: 'Coastal stop.', ar: 'محطة ساحلية.' }, visualSoul: 'Modern-Coastal' }
        ]
    },
    {
        id: 'laayoune-sakia-el-hamra',
        name: { en: 'Laâyoune-Sakia El Hamra', ar: 'العيون-الساقية الحمراء' },
        capital: 'Laayoune',
        zoomLevel: { scale: 3, x: "30%", y: "-40%" },
        provinces: [
            { id: 'laayoune', name: { en: 'Laâyoune', ar: 'العيون' }, type: 'Major City', climate: 'Saharan', landmarks: { en: ['Mechouar Square'], ar: ['ساحة المشور'] }, coords: { top: '92%', left: '18%' }, history: { en: 'Desert metropolis.', ar: 'حاضرة الصحراء.' }, visualSoul: 'Modern' },
            { id: 'boujdour', name: { en: 'Boujdour', ar: 'بوجدور' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['The Lighthouse'], ar: ['الفنار'] }, coords: { top: '95%', left: '12%' }, history: { en: 'Cape Bojador.', ar: 'رأس بوجدور.' }, visualSoul: 'Modern-Coastal' },
            { id: 'tarfaya', name: { en: 'Tarfaya', ar: 'الطرفاية' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Saint-Exupéry Museum'], ar: ['متحف سانت إكسوبيري'] }, coords: { top: '88%', left: '18%' }, history: { en: 'Villa Bens.', ar: 'فيلا بينس.' }, visualSoul: 'Modern-Coastal' },
            { id: 'smara', name: { en: 'Smara', ar: 'السمارة' }, type: 'Major City', climate: 'Saharan', landmarks: { en: ['Great Stone Mosque'], ar: ['المسجد العتيق'] }, coords: { top: '93%', left: '25%' }, history: { en: 'Spiritual Sahara capital.', ar: 'العاصمة الروحية للصحراء.' }, visualSoul: 'Medina' },
            { id: 'hakounia', name: { en: 'Hakounia', ar: 'الحكونية' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Desert Dunes'], ar: ['الكثبان الرملية'] }, coords: { top: '91%', left: '22%' }, history: { en: 'Historic outpost.', ar: 'نقطة تاريخية.' }, visualSoul: 'Modern' },
            { id: 'daoura', name: { en: 'Daoura', ar: 'الدورة' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Nomadic stop'], ar: ['محطة الركبان'] }, coords: { top: '90%', left: '19%' }, history: { en: 'Sakia link.', ar: 'صلة الساقية.' }, visualSoul: 'Modern' },
            { id: 'foum-el-oued', name: { en: 'Foum El Oued', ar: 'فم الواد' }, type: 'Rural Center', climate: 'Coastal', landmarks: { en: ['Beachfront'], ar: ['الواجهة البحرية'] }, coords: { top: '93%', left: '17%' }, history: { en: 'Laayoune beach.', ar: 'شاطئ العيون.' }, visualSoul: 'Modern-Coastal' }
        ]
    },
    {
        id: 'dakhla-oued-ed-dahab',
        name: { en: 'Dakhla-Oued Ed-Dahab', ar: 'الداخلة-وادي الذهب' },
        capital: 'Dakhla',
        zoomLevel: { scale: 2.5, x: "40%", y: "-60%" },
        provinces: [
            { id: 'dakhla', name: { en: 'Dakhla', ar: 'الداخلة' }, type: 'Major City', climate: 'Coastal', landmarks: { en: ['Dakhla Bay'], ar: ['خليج الداخلة'] }, coords: { top: '98%', left: '5%' }, history: { en: 'Villa Cisneros.', ar: 'فيلا سيسنيروس.' }, visualSoul: 'Modern-Coastal' },
            { id: 'aousserd', name: { en: 'Aousserd', ar: 'أوسرد' }, type: 'Major City', climate: 'Saharan', landmarks: { en: ['Mount Oulad Delim'], ar: ['جبل أولاد دليم'] }, coords: { top: '98%', left: '20%' }, history: { en: 'Sahara deep.', ar: 'عمق الصحراء.' }, visualSoul: 'Tent' },
            { id: 'el-guerguerat', name: { en: 'El Guerguerat', ar: 'الكركرات' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Border Post'], ar: ['النقطة الحدودية'] }, coords: { top: '99%', left: '2%' }, history: { en: 'African gateway.', ar: 'بوابة إفريقيا.' }, visualSoul: 'Modern' },
            { id: 'bir-anzarane', name: { en: 'Bir Anzarane', ar: 'بئر أنزران' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Battlefield Site'], ar: ['موقع المعركة'] }, coords: { top: '97%', left: '15%' }, history: { en: 'Historic valor site.', ar: 'موقع بسالة تاريخي.' }, visualSoul: 'Tent' },
            { id: 'mijik', name: { en: 'Mijik', ar: 'ميجيك' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Desert Wells'], ar: ['آبار الصحراء'] }, coords: { top: '97%', left: '25%' }, history: { en: 'Nomadic heart.', ar: 'قلب الترحال.' }, visualSoul: 'Tent' },
            { id: 'agwenit', name: { en: 'Agwenit', ar: 'أغوينيت' }, type: 'Rural Center', climate: 'Saharan', landmarks: { en: ['Desert Trails'], ar: ['مسالك الصحراء'] }, coords: { top: '98%', left: '28%' }, history: { en: 'Saharan frontier.', ar: 'تخوم صحراوية.' }, visualSoul: 'Tent' }
        ]
    }
];
