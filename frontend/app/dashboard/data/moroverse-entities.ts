// ============================================================
//  Moroverse Smart Entities — All known Moroccan entities
//  Used for auto-sync EN/AR dropdowns in the Editor
// ============================================================

export interface BilingualEntry {
    en: string;
    ar: string;
}

// ——————————————————— CITIES ———————————————————
export const MOROCCAN_CITIES: BilingualEntry[] = [
    { en: 'Marrakech', ar: 'مراكش' },
    { en: 'Fez', ar: 'فاس' },
    { en: 'Tangier', ar: 'طنجة' },
    { en: 'Rabat', ar: 'الرباط' },
    { en: 'Casablanca', ar: 'الدار البيضاء' },
    { en: 'Meknes', ar: 'مكناس' },
    { en: 'Chefchaouen', ar: 'شفشاون' },
    { en: 'Agadir', ar: 'أكادير' },
    { en: 'Ouarzazate', ar: 'ورزازات' },
    { en: 'Essaouira', ar: 'الصويرة' },
    { en: 'Tetouan', ar: 'تطوان' },
    { en: 'Oujda', ar: 'وجدة' },
    { en: 'Al Hoceima', ar: 'الحسيمة' },
    { en: 'Dakhla', ar: 'الداخلة' },
    { en: 'Laayoune', ar: 'العيون' },
    { en: 'Tarfaya', ar: 'طرفاية' },
    { en: 'Safi', ar: 'آسفي' },
    { en: 'El Jadida', ar: 'الجديدة' },
    { en: 'Beni Mellal', ar: 'بني ملال' },
    { en: 'Khouribga', ar: 'خريبكة' },
    { en: 'Settat', ar: 'سطات' },
    { en: 'Khenifra', ar: 'خنيفرة' },
    { en: 'Errachidia', ar: 'الراشيدية' },
    { en: 'Tiznit', ar: 'تيزنيت' },
    { en: 'Taroudant', ar: 'تارودانت' },
    { en: 'Zagora', ar: 'زاكورة' },
    { en: 'Merzouga', ar: 'مرزوكة' },
    { en: 'Ifrane', ar: 'إفران' },
    { en: 'Azrou', ar: 'أزرو' },
    { en: 'Nador', ar: 'الناظور' },
    { en: 'Berkane', ar: 'بركان' },
    { en: 'Guercif', ar: 'كرسيف' },
    { en: 'Figuig', ar: 'فجيج' },
];

// ——————————————————— LANDMARKS ———————————————————
export const MOROCCAN_LANDMARKS: BilingualEntry[] = [
    { en: 'Koutoubia Mosque', ar: 'مسجد الكتبية' },
    { en: 'Bahia Palace', ar: 'قصر الباهية' },
    { en: 'Badi Palace', ar: 'قصر البديع' },
    { en: 'Saadian Tombs', ar: 'مقابر السعديين' },
    { en: 'Jardin Majorelle', ar: 'حديقة ماجوريل' },
    { en: 'Al-Qarawiyyin University', ar: 'جامعة القرويين' },
    { en: 'Bou Inania Madrasa', ar: 'مدرسة بو عنانية' },
    { en: 'Chouara Tannery', ar: 'دباغة الشوارة' },
    { en: 'Bab Bou Jeloud', ar: 'باب بو جلود' },
    { en: 'Hassan Tower', ar: 'صومعة حسان' },
    { en: 'Mausoleum of Mohammed V', ar: 'ضريح محمد الخامس' },
    { en: 'Kasbah of the Udayas', ar: 'قصبة الوداية' },
    { en: 'Chellah Necropolis', ar: 'شالة' },
    { en: 'Hercules Caves', ar: 'كهوف هرقل' },
    { en: 'Kasbah of Tangier', ar: 'قصبة طنجة' },
    { en: 'Ait Ben Haddou', ar: 'أيت بن حدو' },
    { en: 'Draa Valley', ar: 'وادي درعة' },
    { en: 'Todra Gorge', ar: 'نهر تودغة' },
    { en: 'Dades Valley', ar: 'وادي دادس' },
    { en: 'Erg Chebbi Dunes', ar: 'عرق شبي' },
    { en: 'Volubilis Ruins', ar: 'وليلي' },
    { en: 'Moulay Idriss Zerhoun', ar: 'مولاي إدريس زرهون' },
    { en: 'Meknes Imperial City', ar: 'مدينة مكناس العتيقة' },
    { en: 'Bab Mansour', ar: 'باب منصور' },
    { en: 'El Badi Palace Ruins', ar: 'أطلال قصر البديع' },
    { en: 'Essaouira Ramparts', ar: 'أسوار الصويرة' },
    { en: 'Skala du Port', ar: 'سكالا الميناء' },
    { en: 'Chefchaouen Medina', ar: 'مدينة شفشاون القديمة' },
    { en: 'Rif Mountains', ar: 'جبال الريف' },
    { en: 'Atlas Mountains', ar: 'جبال الأطلس' },
    { en: 'Toubkal Peak', ar: 'قمة توبقال' },
    { en: 'Cape Spartel Lighthouse', ar: 'منارة رأس سبارتل' },
    { en: 'Roman Baths of Volubilis', ar: 'الحمامات الرومانية لوليلي' },
    { en: 'Tinmel Mosque', ar: 'مسجد تينمل' },
    { en: 'Kasbah Taourirt', ar: 'قصبة تاوريرت' },
    { en: 'Kasbah Amerhidil', ar: 'قصبة أمرهيدل' },
    { en: 'Fez el-Bali Medina', ar: 'مدينة فاس البالي' },
];

// ——————————————————— BATTLES ———————————————————
export const MOROCCAN_BATTLES: BilingualEntry[] = [
    { en: 'Battle of Tours', ar: 'معركة بلاط الشهداء' },
    { en: 'Battle of Three Kings', ar: 'معركة المعارك / معركة وادي المخازن' },
    { en: 'Battle of Oued El Makhazin', ar: 'معركة وادي المخازن' },
    { en: 'Battle of Isly', ar: 'معركة إيسلي' },
    { en: 'Battle of Anwal (Annual)', ar: 'معركة أنوال' },
    { en: 'Battle of Tondibi', ar: 'معركة تندبي' },
    { en: 'Siege of Ceuta', ar: 'حصار سبتة' },
    { en: 'Battle of Alcácer Quibir', ar: 'معركة القصر الكبير' },
    { en: 'Battle of Guadalquivir', ar: 'معركة وادي لكبير' },
    { en: 'Battle of Zallaqa', ar: 'معركة الزلاقة' },
    { en: 'Battle of las Navas de Tolosa', ar: 'معركة العقاب' },
    { en: 'Siege of Algeciras', ar: 'حصار الجزيرة الخضراء' },
    { en: 'Battle of Oran', ar: 'معركة وهران' },
    { en: 'Rif War', ar: 'حرب الريف' },
    { en: 'Battle of Sidi Ifni', ar: 'معركة سيدي إفني' },
    { en: 'Battle of Sebta', ar: 'معركة سبتة' },
    { en: 'Battle of Taza', ar: 'معركة تازة' },
];

// ——————————————————— HISTORICAL FIGURES ———————————————————
export const MOROCCAN_FIGURES: BilingualEntry[] = [
    { en: 'Yusuf ibn Tashfin', ar: 'يوسف بن تاشفين' },
    { en: 'Ahmad al-Mansur al-Dhahabi', ar: 'أحمد المنصور الذهبي' },
    { en: 'Idris I', ar: 'إدريس الأول' },
    { en: 'Idris II', ar: 'إدريس الثاني' },
    { en: 'Abd al-Mumin', ar: 'عبد المؤمن' },
    { en: 'Yaqub al-Mansur', ar: 'يعقوب المنصور' },
    { en: 'Mohammed V', ar: 'محمد الخامس' },
    { en: 'Hassan II', ar: 'الحسن الثاني' },
    { en: 'Mohammed VI', ar: 'محمد السادس' },
    { en: 'Fatima al-Fihri', ar: 'فاطمة الفهرية' },
    { en: 'Ibn Battuta', ar: 'ابن بطوطة' },
    { en: 'Leo Africanus', ar: 'ليون الإفريقي' },
    { en: 'Tariq ibn Ziyad', ar: 'طارق بن زياد' },
    { en: 'Moussa ibn Noussair', ar: 'موسى بن نصير' },
    { en: 'Abdelkrim al-Khattabi', ar: 'عبد الكريم الخطابي' },
    { en: 'Allal al-Fassi', ar: 'علال الفاسي' },
    { en: 'Mohammed el-Baqqali', ar: 'محمد الباقلي' },
    { en: 'Ibn Khaldun', ar: 'ابن خلدون' },
    { en: 'Al-Idrisi', ar: 'الإدريسي' },
    { en: 'Ibn Rushd (Averroes)', ar: 'ابن رشد' },
    { en: 'Ibn Toumert', ar: 'ابن تومرت' },
    { en: 'Moulay Ismail', ar: 'مولاي إسماعيل' },
    { en: 'Moulay Rashid', ar: 'مولاي رشيد' },
    { en: 'Abu Inan Faris', ar: 'أبو عنان فارس' },
    { en: 'Mohammed al-Sheikh', ar: 'محمد الشيخ' },
];

// ——————————————————— MAP & META ———————————————————
export type Category = 'cities' | 'landmarks' | 'battles' | 'figures' | 'elite_tours';

export const CATEGORY_LABELS: Record<Category, string> = {
    cities: 'Cities / المدن',
    landmarks: 'Landmarks / المعالم',
    battles: 'Battles / المعارك',
    figures: 'Figures / الشخصيات',
    elite_tours: 'Elite Tours / رحلات النخبة'
};

export const CATEGORY_ENTITIES: Record<Category, BilingualEntry[]> = {
    cities: MOROCCAN_CITIES,
    landmarks: MOROCCAN_LANDMARKS,
    battles: MOROCCAN_BATTLES,
    figures: MOROCCAN_FIGURES,
    elite_tours: [
        { en: 'Merchich Region', ar: 'منطقة مرشيش' },
        { en: 'Kara Prison', ar: 'سجن قارة' },
        { en: 'Agadir Ruins', ar: 'أطلال زلزال أكادير' },
        { en: 'Erg Chebbi Dunes', ar: 'كثبان عرق الشبي' },
        { en: 'Ouarzazate Studios', ar: 'استوديوهات ورزازات' }
    ]
};
