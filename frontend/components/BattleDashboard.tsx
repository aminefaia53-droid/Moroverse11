"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Calendar, Shield, MapPin, Users, Target, Info, Quote, Activity, ChevronRight, X, Layers, BookOpen, Crown, Search, Compass } from 'lucide-react';
import { getArticle } from '../data/moroverse-content';
import ArticleReader from './ArticleReader';
import { generateArticleSchema } from '../utils/seo';
import generatedContent from '../data/generated-content.json';

interface Battle {
    id: string;
    year: string;
    date?: string;
    location: { en: string; ar: string };
    dynasty: string;
    era: 'Foundational' | 'Ancient' | 'Islamic' | 'Imperial' | 'Modern Resistance' | 'Liberation' | 'Territorial';
    name: { en: string; ar: string };
    desc: { en: string; ar: string };
    combatants: { en: string; ar: string };
    leaders: { en: string; ar: string };
    outcome: { en: string; ar: string };
    tactics: { en: string; ar: string };
    impact: { en: string; ar: string };
    casualties?: { en: string; ar: string };
}

const staticBattles: Battle[] = [
    // --- FOUNDATIONAL & ANCIENT ---
    {
        id: 'aedemon-revolt',
        year: '40 AD',
        location: { en: 'Mauretania Tingitana', ar: 'موريتانيا الطنجية' },
        era: 'Ancient',
        dynasty: 'Moorish Resistance',
        name: { en: 'Aedemon Revolt', ar: 'ثورة أيديمون' },
        desc: { en: 'National uprising against the Roman Empire following the murder of King Ptolemy.', ar: 'انتفاضة وطنية ضد الإمبراطورية الرومانية بعد مقتل الملك بطليموس.' },
        combatants: { en: 'Moorish Tribes vs Rome', ar: 'القبائل المورية ضد روما' },
        leaders: { en: 'Aedemon', ar: 'إيديمون' },
        outcome: { en: 'Stiff resistance shaping future autonomy.', ar: 'مقاومة صلبة شكلت الحكم الذاتي المستقبلي.' },
        tactics: { en: 'High-altitude guerrilla strikes.', ar: 'ضربات حرب العصابات في المرتفعات.' },
        impact: { en: 'Defined the Limes boundaries in North Africa.', ar: 'حددت تخوم "الليميس" في شمال إفريقيا.' }
    },

    // --- ISLAMIC FOUNDATIONS (IDRISID & REVOLT) ---
    {
        id: 'battle-of-bagdoura-741',
        year: '740',
        location: { en: 'Near Tangier / Bagdoura', ar: 'قرب طنجة / باقدورة' },
        era: 'Islamic',
        dynasty: 'Great Berber Revolt',
        name: { en: 'Battle of the Nobles', ar: 'معركة الأشراف (بقدورة)' },
        desc: { en: 'The decisive explosion of Moroccan independence against Umayyad marginalization.', ar: 'الانفجار الحاسم للاستقلال المغربي ضد التهميش الأموي.' },
        combatants: { en: 'Berber United Tribes vs Umayyad Caliphate', ar: 'القبائل المتحدة ضد الخلافة الأموية' },
        leaders: { en: 'Maysara al-Matghari', ar: 'ميسرة المطغري' },
        outcome: { en: 'Strategic victory for Moroccan autonomy.', ar: 'انتصار استراتيجي للحكم الذاتي المغربي.' },
        tactics: { en: 'Massive coordinated flank attacks.', ar: 'هجمات التفاف منسقة ضخمة.' },
        impact: { en: 'The birth of independent Moroccan statehood.', ar: 'ولادة الدولة المغربية المستقلة.' }
    },
    {
        id: 'tlemcen-idrisid',
        year: '789',
        location: { en: 'Tlemcen (Frontiers)', ar: 'تلمسان (التخوم)' },
        era: 'Foundational',
        dynasty: 'Idrisid',
        name: { en: 'Conquest of Tlemcen', ar: 'فتح تلمسان' },
        desc: { en: 'Idris I secures the eastern borders, unifying the Maghreb under a central authority.', ar: 'إدريس الأول يؤمن الحدود الشرقية، موحداً المغرب تحت سلطة مركزية.' },
        combatants: { en: 'Idrisid Forces vs Local Emirates', ar: 'القوات الإدريسية ضد الإمارات المحلية' },
        leaders: { en: 'Idris I', ar: 'إدريس الأول' },
        outcome: { en: 'Expansion and consolidation.', ar: 'توسع وتوطيد.' },
        tactics: { en: 'Diplomatic unification backed by tribal cavalry.', ar: 'توحيد دبلوماسي مدعوم بخيالة القبائل.' },
        impact: { en: 'Stabilized the first Moroccan Islamic Monarchy.', ar: 'استقرار أول ملكية إسلامية مغربية.' }
    },

    // --- IMPERIAL GLORY (ALMORAVID, ALMOHAD, MERINID) ---
    {
        id: 'battle-of-zallaqa-1086',
        year: '1086',
        location: { en: 'Zallaqa, Al-Andalus', ar: 'الزلاقة، الأندلس' },
        era: 'Imperial',
        dynasty: 'Almoravid',
        name: { en: 'Battle of Zallaqa', ar: 'معركة الزلاقة' },
        desc: { en: 'Yusuf ibn Tashfin saves Al-Andalus from collapse.', ar: 'يوسف بن تاشفين ينقذ الأندلس من الانهيار.' },
        combatants: { en: 'Almoravids & Taifas vs Castile', ar: 'المرابطون والطوائف ضد قشتالة' },
        leaders: { en: 'Yusuf ibn Tashfin', ar: 'يوسف بن تاشفين' },
        outcome: { en: 'Total Imperial victory.', ar: 'انتصار إمبراطوري كامل.' },
        tactics: { en: 'Psychological use of drums and elite reinforcements.', ar: 'الاستخدام النفسي للطبول وتعزيزات النخبة.' },
        impact: { en: 'Extended Muslim presence in Europe for 400 years.', ar: 'مدد التواجد الإسلامي في أوروبا لـ 400 سنة.' }
    },
    {
        id: 'battle-of-al-ark-1195',
        year: '1195',
        location: { en: 'Alarcos, Al-Andalus', ar: 'الأرك، الأندلس' },
        era: 'Imperial',
        dynasty: 'Almohad',
        name: { en: 'Battle of Alarcos', ar: 'معركة الأرك' },
        desc: { en: 'The peak of Almohad military architectural and field power.', ar: 'ذروة القوة المعمارية والميدانية الموحدية.' },
        combatants: { en: 'Almohad Caliphate vs Castile', ar: 'الخلافة الموحدية ضد قشتالة' },
        leaders: { en: 'Yaqub al-Mansur', ar: 'يعقوب المنصور' },
        outcome: { en: 'Crushing victory.', ar: 'نصر ساحق.' },
        tactics: { en: 'Innovative combined arms (Archer/Cavalry).', ar: 'تنسيق مبتكر بين الرماية والخيالة.' },
        impact: { en: 'Established Almohads as the supreme Western power.', ar: 'ثبت الموحدين كقوة عظمى في الغرب.' }
    },
    {
        id: 'battle-of-las-navas-de-tolosa-1212',
        year: '1212',
        location: { en: 'Al-Andalus', ar: 'حصن العقاب، الأندلس' },
        era: 'Imperial',
        dynasty: 'Almohad',
        name: { en: 'Battle of Las Navas de Tolosa', ar: 'معركة حصن العقاب' },
        desc: { en: 'A pivotal turning point in Al-Andalus history.', ar: 'منعرج حاسم في تاريخ الأندلس.' },
        combatants: { en: 'Almohad Caliphate vs Christian Coalition', ar: 'الخلافة الموحدية ضد التحالف المسيحي' },
        leaders: { en: 'Muhammad al-Nasir', ar: 'محمد الناصر' },
        outcome: { en: 'Stiff resistance against superior numbers.', ar: 'مقاومة صلبة ضد أعداد متفوقة.' },
        tactics: { en: 'Elite Palatial Guard formation.', ar: 'تشكيلات الحرس السلطاني النخبوية.' },
        impact: { en: 'Defined the final stage of Almohad presence in Al-Andalus.', ar: 'حددت المرحلة الأخيرة للتواجد الموحدي بالأندلس.' }
    },
    {
        id: 'battle-of-dononiyah-1276',
        year: '1276',
        location: { en: 'Dononiyah, Al-Andalus', ar: 'الدونونية، الأندلس' },
        era: 'Imperial',
        dynasty: 'Merinid',
        name: { en: 'Battle of Dononiyah', ar: 'معركة الدونونية' },
        desc: { en: 'Heroic Merinid expedition to stabilize the Strait and Al-Andalus.', ar: 'حملة مرينية بطولية لتثبيت المضيق والأندلس.' },
        combatants: { en: 'Merinid Empire vs Castile', ar: 'الإمبراطورية المرينية ضد قشتالة' },
        leaders: { en: 'Abu Yusuf Yaqub', ar: 'أبو يوسف يعقوب' },
        outcome: { en: 'Strategic victory.', ar: 'انتصار استراتيجي.' },
        tactics: { en: 'Combined naval and land tactics.', ar: 'تنسيق بحري وبري.' },
        impact: { en: 'Extended Merinid influence across the Strait.', ar: 'مد النفوذ المريني عبر المضيق.' }
    },
    {
        id: 'sale-1260',
        year: '1260',
        date: 'September (Eid al-Fitr)',
        location: { en: 'Sale, Atlantic Coast', ar: 'سلا، الساحل الأطلسي' },
        era: 'Imperial',
        dynasty: 'Merinid',
        name: { en: 'Battle of Sale', ar: 'معركة سلا 1260' },
        desc: { en: 'A heroic counter-attack against a surprise Castilian naval raid during Eid festivities.', ar: 'هجوم مضاد بطولي ضد غارة بحرية قشتالية مفاجئة خلال احتفالات العيد.' },
        combatants: { en: 'Merinid Garrison vs Castilian Fleet', ar: 'حامية المرينين ضد الأسطول القشتالي' },
        leaders: { en: 'Yaqub b. Abd al-Haqq', ar: 'يعقوب بن عبد الحق' },
        outcome: { en: 'Repelled the invaders with heavy enemy losses.', ar: 'دحر الغزاة مع خسائر فادحة للعدو.' },
        tactics: { en: 'Rapid urban mobilization and port defense.', ar: 'تعبئة حضرية سريعة ودفاع عن الميناء.' },
        impact: { en: 'Secured the Merinid coastline and discouraged naval incursions.', ar: 'أمن الساحل المريني وردع التوغلات البحرية.' }
    },
    {
        id: 'algeciras-1278',
        year: '1278',
        location: { en: 'Algeciras / Strait', ar: 'الجزيرة الخضراء / المضيق' },
        era: 'Imperial',
        dynasty: 'Merinid',
        name: { en: 'Battle of Algeciras', ar: 'معركة الجزيرة الخضراء' },
        desc: { en: 'Naval victory securing the logistics bridge between Morocco and Spain.', ar: 'نصر بحري أمن جسر اللوجستيك بين المغرب وإسبانيا.' },
        combatants: { en: 'Merinid Navy vs Castile', ar: 'البحرية المرينية ضد قشتالة' },
        leaders: { en: 'Abu Yusuf Yaqub', ar: 'أبو يوسف يعقوب' },
        outcome: { en: 'Naval supremacy established.', ar: 'تثبيت السيادة البحرية.' },
        tactics: { en: 'Fire-ship deployments and ramming.', ar: 'نشر السفن الحارقة والاصطدام.' },
        impact: { en: 'Maintained the Maghrebi presence in Gibraltar.', ar: 'حافظ على التواجد المغربي في جبل طارق.' }
    },

    // --- GLOBAL SOVEREIGN (SAADI & ALAOUITE) ---
    {
        id: 'battle-of-wadi-al-makhazin-1578',
        year: '1578',
        location: { en: 'Wadi Al-Makhazin / Ksar el-Kebir', ar: 'وادي المخازن / القصر الكبير' },
        era: 'Imperial',
        dynasty: 'Saadi',
        name: { en: 'Battle of the Three Kings', ar: 'معركة وادي المخازن' },
        desc: { en: 'Global confrontation that ended Portuguese expansion in Africa.', ar: 'مواجهة عالمية أنهت التوسع البرتغالي في إفريقيا.' },
        combatants: { en: 'Moroccan Sovereign Army vs Portugal', ar: 'الجيش المغربي ضد البرتغال' },
        leaders: { en: 'Abd al-Malik & Ahmad al-Mansur', ar: 'عبد الملك وأحمد المنصور' },
        outcome: { en: 'Total Sovereignty secured.', ar: 'تأمين السيادة المطلقة.' },
        tactics: { en: 'Strategic bridge sabotage and artillery mastery.', ar: 'تخريب القنطرة الاستراتيجي وإتقان المدفعية.' },
        impact: { en: 'Morocco recognized as a global power.', ar: 'الاعتراف بالمغرب كقوة عالمية.' }
    },
    {
        id: 'oued-sebou-maamora-1515',
        year: '1515',
        location: { en: 'Wadi Sebou, Maamora', ar: 'وادي سيبو، المعمورة' },
        era: 'Imperial',
        dynasty: 'Saadi (Emergent)',
        name: { en: 'Battle of Oued Sebou', ar: 'معركة وادي سيبو' },
        desc: { en: 'Saadi and tribal resistance against Portuguese naval fortifications.', ar: 'المقاومة السعدية والقبلية ضد التحصينات البحرية البرتغالية.' },
        combatants: { en: 'Moroccan Tribes vs Portugal', ar: 'القبائل المغربية ضد البرتغال' },
        leaders: { en: 'Sheikh of Soufyan', ar: 'شيخ قبائل سفيان' },
        outcome: { en: 'Repelled and contained invaders.', ar: 'دحر واحتواء الغزاة.' },
        tactics: { en: 'River-bank ambushes.', ar: 'كمائن ضفاف النهر.' },
        impact: { en: 'Restricted Portuguese influence to coastal enclaves.', ar: 'حصر النفوذ البرتغالي في الموانئ الساحلية.' }
    },
    {
        id: 'ceuta-siege',
        year: '1694 - 1727',
        location: { en: 'Ceuta (Sebta)', ar: 'سبتة المحتلة' },
        era: 'Imperial',
        dynasty: 'Alaouite',
        name: { en: 'Great Siege of Ceuta', ar: 'حصار سبتة العظيم' },
        desc: { en: 'The longest siege in history, lasting 26 years to liberate the northern stronghold.', ar: 'أطول حصار في التاريخ، دام 26 سنة لتحرير المعقل الشمالي.' },
        combatants: { en: 'Moulay Ismail Forces vs Spain', ar: 'جيش مولاي إسماعيل ضد إسبانيا' },
        leaders: { en: 'Moulay Ismail', ar: 'مولاي إسماعيل' },
        outcome: { en: 'Heroic persistence and liberation of outer zones.', ar: 'إصرار بطولي وتحرير المناطق الخارجية.' },
        tactics: { en: 'Multi-decade trenching and constant naval harrying.', ar: 'خندقة لعقود ومناوشات بحرية مستمرة.' },
        impact: { en: 'Symbol of Moroccan refusal to accept enclave loss.', ar: 'رمز للرفض المغربي لاستلاب الثغور.' }
    },
    {
        id: 'mazagan-1769',
        year: '1769',
        location: { en: 'Mazagan (El Jadida)', ar: 'مازاغان (الجديدة)' },
        era: 'Imperial',
        dynasty: 'Alaouite',
        name: { en: 'Liberation of Mazagan', ar: 'تحرير مازاغان' },
        desc: { en: 'Final expulsion of Portuguese forces from Moroccan soil.', ar: 'طرد نهائي للقوات البرتغالية من التراب المغربي.' },
        combatants: { en: 'Royal Army vs Portugal', ar: 'الجيش السلطاني ضد البرتغال' },
        leaders: { en: 'Mohammed b. Abdallah', ar: 'محمد بن عبد الله' },
        outcome: { en: 'Complete liberation.', ar: 'تحرير كامل.' },
        tactics: { en: 'Systematic siege and psychological pressure.', ar: 'حصار منهجي وضغط نفسي.' },
        impact: { en: 'Unified the entire Atlantic coastline.', ar: 'توحيد كامل الساحل الأطلسي.' }
    },

    // --- MODERN RESISTANCE (1900 - 1956) ---
    {
        id: 'battle-of-annual-1921',
        year: '1921',
        location: { en: 'Annual, Rif', ar: 'أنوال، الريف' },
        era: 'Modern Resistance',
        dynasty: 'Rif Resistance',
        name: { en: 'Battle of Annual', ar: 'معركة أنوال' },
        desc: { en: 'Epic victory of tribal forces against a modern European army.', ar: 'نصر ملحمي لقوى القبائل ضد جيش أوروبي حديث.' },
        combatants: { en: 'Rif Regulars vs Spain', ar: 'متطوعو الريف ضد إسبانيا' },
        leaders: { en: 'Abdelkrim al-Khattabi', ar: 'عبد الكريم الخطابي' },
        outcome: { en: 'Legendary victory.', ar: 'انتصار أسطوري.' },
        tactics: { en: 'Mobile flanking and trench-jumping.', ar: 'التفاف متحرك واقتحام الخنادق.' },
        impact: { en: 'Global symbol of decolonization.', ar: 'رمز عالمي لتصفية الاستعمار.' }
    },
    {
        id: 'battle-of-bougafer-1933',
        year: '1933',
        location: { en: 'Mount Bougafer, Anti-Atlas', ar: 'جبل بوغافر' },
        era: 'Modern Resistance',
        dynasty: 'Ait Atta Resistance',
        name: { en: 'Battle of Bougafer', ar: 'معركة بوغافر' },
        desc: { en: 'A heroic stand of the Ait Atta tribes against the French colonial forces.', ar: 'ملحمة صمود قبائل أيت عطا ضد القوات الاستعمارية الفرنسية.' },
        combatants: { en: 'Ait Atta Tribes vs France', ar: 'قبائل أيت عطا ضد فرنسا' },
        leaders: { en: 'Assou ou-Baslam', ar: 'عسو أوبسلام' },
        outcome: { en: 'Strategic stalemate and heroic compromise.', ar: 'تعادل استراتيجي وتوافق بطولي.' },
        tactics: { en: 'Guerrilla mountain warfare.', ar: 'حرب العصابات الجبلية.' },
        impact: { en: 'Delayed colonial control in the Atlas region.', ar: 'أخرت السيطرة الاستعمارية في منطقة الأطلس.' }
    },
    {
        id: 'battle-of-isly-1844',
        year: '1844',
        location: { en: 'Isly River, Oujda', ar: 'وادي إيسلي، وجدة' },
        era: 'Imperial',
        dynasty: 'Alaouite',
        name: { en: 'Battle of Isly', ar: 'معركة إيسلي' },
        desc: { en: 'Moroccan forces defend North African sovereignty against expansionism.', ar: 'القوات المغربية تدافع عن سيادة شمال إفريقيا ضد التوسع.' },
        combatants: { en: 'Royal Moroccan Army vs France', ar: 'الجيش السلطاني المغربي ضد فرنسا' },
        leaders: { en: 'Sidi Mohammed', ar: 'سيدي محمد' },
        outcome: { en: 'Hard-fought tactical loss.', ar: 'خسارة تكتيكية بشرف.' },
        tactics: { en: 'Cavalry charges against modern artillery.', ar: 'هجمات الخيالة ضد المدفعية الحديثة.' },
        impact: { en: 'Marked the beginning of modern structural reforms.', ar: 'شكلت بداية الإصلاحات الهيكلية الحديثة.' }
    },
    {
        id: 'battle-of-tetouan-1860',
        year: '1860',
        location: { en: 'Tetouan', ar: 'تطوان' },
        era: 'Imperial',
        dynasty: 'Alaouite',
        name: { en: 'Battle of Tetouan', ar: 'معركة تطوان' },
        desc: { en: 'Defense of the White Dove against European naval and land incursions.', ar: 'الدفاع عن الحمامة البيضاء ضد التوغلات البحرية والبرية الأوروبية.' },
        combatants: { en: 'Moroccan Army vs Spain', ar: 'الجيش المغربي ضد إسبانيا' },
        leaders: { en: 'Moulay Abbas', ar: 'مولاي عباس' },
        outcome: { en: 'Strategic urban resistance.', ar: 'مقاومة حضرية استراتيجية.' },
        tactics: { en: 'Urban rampart defense.', ar: 'الدفاع عن أسوار المدينة.' },
        impact: { en: 'Demonstrated Moroccan resilience in the north.', ar: 'أظهرت الصمود المغربي في الشمال.' }
    },
    {
        id: 'tazizaoute-1932',
        year: '1932',
        location: { en: 'Mount Tazizaoute, Atlas', ar: 'جبل تازيزاوت، الأطلس' },
        era: 'Modern Resistance',
        dynasty: 'Atlas Resistance',
        name: { en: 'Battle of Tazizaoute', ar: 'معركة تازيزاوت' },
        desc: { en: 'Heroic resistance of children, women, and men in the High Atlas against total colonial siege.', ar: 'مقاومة بطولية للأطفال والنساء والرجال في الأطلس ضد حصار استعماري شامل.' },
        combatants: { en: 'Atlas Tribes vs France', ar: 'قبائل الأطلس ضد فرنسا' },
        leaders: { en: 'Sidi M`ha ou Hammou', ar: 'سيدي محى أوحمو' },
        outcome: { en: 'Heroic sacrifice.', ar: 'تضحية بطولية.' },
        tactics: { en: 'Cave defense and attrition.', ar: 'الدفاع بالكهوف والاستنزاف.' },
        impact: { en: 'Proved the unbreakable spirit of the Atlas people.', ar: 'أثبتت الروح التي لا تقهر لأهل الأطلس.' }
    },
    {
        id: 'sidi-bou-othmane-battle-1912',
        year: '1912',
        location: { en: 'Sidi Bou Othmane, Marrakech', ar: 'سيدي بوعثمان، مراكش' },
        era: 'Modern Resistance',
        dynasty: 'Southern Resistance',
        name: { en: 'Battle of Sidi Bou Othmane', ar: 'معركة سيدي بوعثمان' },
        desc: { en: 'The epic resistance against French colonial entry into the south.', ar: 'الملحمة الخالدة لدخول الاستعمار الفرنسي ومقاومة رجال الجنوب' },
        combatants: { en: 'Southern Tribes vs France', ar: 'قبائل الجنوب ضد فرنسا' },
        leaders: { en: 'Ahmed al-Hiba', ar: 'أحمد الهيبة' },
        outcome: { en: 'Heavy losses but immortalized courage.', ar: 'خسائر فادحة لكن شجاعة خالدة.' },
        tactics: { en: 'Direct confrontation and massive infantry charges.', ar: 'مواجهة مباشرة وهجوم مشاة ضخم.' },
        impact: { en: 'Slowed the colonial advance to the south.', ar: 'أبطأت الزحف الاستعماري نحو الجنوب.' }
    },
    {
        id: 'el-hri-battle-1914',
        year: '1914',
        location: { en: 'El Hri, Khenifra', ar: 'لهري، خنيفرة' },
        era: 'Modern Resistance',
        dynasty: 'Zayani Resistance',
        name: { en: 'Battle of El Hri', ar: 'معركة لهري' },
        desc: { en: 'The graveyard of invaders and the legendary victory of Zayani resistance.', ar: 'مقبرة الغزاة وانتصار موحى أوحمو الزياني الأسطوري' },
        combatants: { en: 'Zayanes vs France', ar: 'قبائل زيان ضد فرنسا' },
        leaders: { en: 'Moha ou Hammou Zayani', ar: 'موحى أوحمو الزياني' },
        outcome: { en: 'Crushing victory over French forces.', ar: 'انتصار ساحق على القوات الفرنسية.' },
        tactics: { en: 'Surprise encirclement and mountain ambushes.', ar: 'تطويق مفاجئ وكمائن جبلية.' },
        impact: { en: 'One of the greatest defeats of colonial France in Africa.', ar: 'من أعظم هزائم فرنسا الاستعمارية في إفريقيا.' }
    },

    // --- LIBERATION & SAHARA (ECCUVILLON & BEYOND) ---
    {
        id: 'ecouvillon-1958',
        year: '1958',
        location: { en: 'Southern Provinces / Sahara', ar: 'الأقاليم الجنوبية / الصحراء' },
        era: 'Liberation',
        dynasty: 'Liberation Army',
        name: { en: 'Operation Ecouvillon', ar: 'عملية إيكوفيون' },
        desc: { en: 'The Liberation Army faces a joint Franco-Spanish aerial and ground offensive in the desert.', ar: 'جيش التحرير يواجه هجوماً جوياً وبرياً فرنسياً-إسبانياً مشتركاً في الصحراء.' },
        combatants: { en: 'Moroccan Liberation Army (ALN) vs France & Spain', ar: 'جيش التحرير المغربي ضد فرنسا وإسبانيا' },
        leaders: { en: 'Saharan Resistance Commanders', ar: 'قادة المقاومة الصحراوية' },
        outcome: { en: 'Heavy resistance followed by strategic tactical retreats.', ar: 'مقاومة عنيفة تلتها تراجعات تكتيكية استراتيجية.' },
        tactics: { en: 'Mobile desert warfare and oasis defense.', ar: 'حرب الصحراء المتحركة والدفاع عن الواحات.' },
        impact: { en: 'Solidified the Moroccan identity of the Saharan provinces.', ar: 'كرست الهوية المغربية للأقاليم الصحراوية.' }
    },
    {
        id: 'battle-of-dcheira-1958',
        year: '1958',
        location: { en: 'Dcheira, Sahara', ar: 'الدشيرة، الصحراء' },
        era: 'Liberation',
        dynasty: 'Liberation Army',
        name: { en: 'Battle of Dcheira', ar: 'معركة الدشيرة' },
        desc: { en: 'A decisive blow against the Spanish Foreign Legion in the Sahara.', ar: 'ضربة حاسمة ضد الفيلق الأجنبي الإسباني في الصحراء.' },
        combatants: { en: 'ALN vs Spain', ar: 'جيش التحرير ضد إسبانيا' },
        leaders: { en: 'Regional Commanders', ar: 'القادة الجهويون' },
        outcome: { en: 'Tactical Moroccan victory.', ar: 'انتصار تكتيكي مغربي.' },
        tactics: { en: 'Sand-dune ambushes.', ar: 'كمائن الكثبان الرملية.' },
        impact: { en: 'Forced Spain to reconsider Saharan presence.', ar: 'أجبرت إسبانيا على إعادة النظر في تواجدها.' }
    },
    {
        id: 'amgala-i',
        year: '1976',
        location: { en: 'Amgala, Sahara', ar: 'أمقالة، الصحراء' },
        era: 'Territorial',
        dynasty: 'FAR (Royal Armed Forces)',
        name: { en: 'Battle of Amgala I', ar: 'معركة أمقالة الأولى' },
        desc: { en: 'Defense of territorial integrity post-Green March.', ar: 'الدفاع عن الوحدة الترابية بعد المسيرة الخضراء.' },
        combatants: { en: 'FAR vs Foreign Backed Mercenaries', ar: 'القوات المسلحة الملكية ضد المرتزقة المدعومين خارجياً' },
        leaders: { en: 'Royal Field Officers', ar: 'ضباط الرباط الميدانيون' },
        outcome: { en: 'Decisive FAR control.', ar: 'سيطرة حاسمة للقوات الملكية.' },
        tactics: { en: 'Modern combined arms in desert terrain.', ar: 'تنسيق حديث في التضاريس الصحراوية.' },
        impact: { en: 'Secured the strategic Amgala point.', ar: 'تأمين نقطة أمقالة الاستراتيجية.' }
    }
];

const dynamicBattles = generatedContent.battles as Battle[];
const battles: Battle[] = [...staticBattles, ...dynamicBattles];

type EraType = Battle['era'] | 'All';

const eras = [
    { id: 'All', en: 'All Eras', ar: 'كل العصور' },
    { id: 'Ancient', en: 'Ancient Resistance', ar: 'العصور القديمة' },
    { id: 'Foundational', en: 'Foundational (Idrisid)', ar: 'عهد الأدارسة' },
    { id: 'Imperial', en: 'The Great Empires', ar: 'عهد المرابطين والموحدين' },
    { id: 'Merinid', en: 'Merinid Era', ar: 'عهد المرينيين' },
    { id: 'Sovereign', en: 'Global Sovereignty', ar: 'عهد السعديين والعلويين' },
    { id: 'Modern Resistance', en: 'Modern Resistance', ar: 'المقاومة' },
    { id: 'Territorial', en: 'Territorial Integrity', ar: 'ملحمة الصحراء' }
];

import { LangCode } from '../types/language';

export default function BattleDashboard({ lang }: { lang: LangCode }) {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
    const [showFullArticle, setShowFullArticle] = useState(false);

    // Filter mapping logic
    const displayBattles = useMemo(() => {
        return battles.filter(b => {
            const matchesFilter = (() => {
                if (filter === 'All') return true;
                if (filter === 'Imperial') return b.dynasty === 'Almoravid' || b.dynasty === 'Almohad';
                if (filter === 'Sovereign') return b.dynasty === 'Saadi' || b.dynasty.includes('Alaouite');
                if (filter === 'Merinid') return b.dynasty === 'Merinid';
                return b.era === filter || b.era.includes(filter);
            })();

            const matchesSearch =
                b.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.name.ar.includes(searchQuery) ||
                b.location.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.location.ar.includes(searchQuery);

            return matchesFilter && matchesSearch;
        });
    }, [filter, searchQuery]);

    return (
        <div className="relative w-full max-w-7xl mx-auto py-12 px-4 mb-20 space-y-12">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group w-full flex items-center">
                <Search className={`absolute ${lang === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors z-10`} />
                <input
                    type="text"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    placeholder={lang === 'ar' ? 'بحث عن معركة أو عصر تاريخي...' : 'Search for a battle or historical era...'}
                    className={`w-full ${lang === 'ar' ? 'pr-14 pl-12' : 'pl-14 pr-12'} py-5 rounded-[32px] bg-black/40 border border-[#c5a059]/20 focus:border-primary focus:bg-black/60 focus:ring-0 outline-none transition-all text-sm font-medium text-white placeholder-white/30 backdrop-blur-xl`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className={`absolute ${lang === 'ar' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors z-10`}
                    >
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                )}
            </div>

            {/* Header section */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-6 text-right">
                    <div className="p-5 bg-primary/10 rounded-3xl border border-primary/20 shadow-inner">
                        {selectedBattle && (
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(getArticle(selectedBattle.id, selectedBattle.name.ar, selectedBattle.name.en, 'battle'), lang as string)) }}
                            />
                        )}
                        <Swords className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-5xl font-serif text-foreground uppercase tracking-widest font-black">
                            {lang === 'ar' ? 'سجلات البسالة والفتح' : 'ENCYCLOPEDIA OF VALOR'}
                        </h2>
                        <p className="text-foreground/30 text-[11px] tracking-[0.6em] uppercase mt-3 font-black">
                            {lang === 'ar' ? 'الأرشيف الإمبراطوري العظيم' : 'THE GRAND IMPERIAL ARCHIVES'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    {eras.map(e => (
                        <button
                            key={e.id}
                            onClick={() => setFilter(e.id)}
                            className={`px-6 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${filter === e.id ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/40' : 'moro-glass text-foreground/40 border-foreground/10 hover:border-primary/30 hover:text-foreground'}`}
                        >
                            {lang === 'ar' ? e.ar : e.en}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {displayBattles.map((b, idx) => (
                        <motion.div
                            key={b.id}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5, delay: idx * 0.03 }}
                            onClick={() => setSelectedBattle(b)}
                            className="group relative h-[480px] rounded-xl overflow-hidden glass-card-elite hover:bg-black/80 border border-primary/50 hover:border-primary transition-all duration-700 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]"
                        >
                            {/* Visual Layer */}
                            <div className="absolute inset-0 z-0">
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-[0.05] group-hover:opacity-20 transition-opacity duration-1000 ${b.era === 'Modern Resistance' || b.era === 'Liberation' ? 'from-amber-600' :
                                    b.era === 'Imperial' ? 'from-star-red' :
                                        b.era === 'Ancient' || b.era === 'Islamic' ? 'from-slate-600' : 'from-emerald-700'
                                    } to-transparent`} />
                                <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-5">
                                    {Array.from({ length: 100 }).map((_, i) => (
                                        <div key={i} className="border-[0.2px] border-foreground/10" />
                                    ))}
                                </div>
                            </div>

                            <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="px-5 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 tracking-widest">
                                                {b.year}
                                            </span>
                                            <div className="h-px w-8 bg-primary/10" />
                                            <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.3em]">
                                                {b.era}
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className="text-4xl font-serif text-primary font-black uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-colors font-arabic">
                                        {lang === 'ar' ? b.name.ar : b.name.en}
                                    </h4>
                                    <div className="flex items-center gap-2 text-gold-royal/80">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="text-[9px] uppercase font-black tracking-widest text-white/90">
                                            {lang === 'en' ? b.location.en : b.location.ar}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[15px] text-white leading-relaxed line-clamp-2 italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                        "{lang === 'en' ? b.desc.en : b.desc.ar}"
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-foreground/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center">
                                                <Layers className="w-3.5 h-3.5 text-primary" />
                                            </div>
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                                                {lang === 'ar' ? `سافر إلى عالم ${b.name.ar}` : `Journey into ${b.name.en}`}
                                            </span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 text-primary group-hover:translate-x-2 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Fact Sheet Overlay - Remained similar but with refined data handling */}
            <AnimatePresence>
                {selectedBattle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-14 bg-black/60 backdrop-blur-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 100, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 100, opacity: 0 }}
                            className="bg-black/95 w-full max-w-6xl h-full max-h-[85vh] rounded-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(197,160,89,0.15)] border border-[#c5a059]/30 relative flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedBattle(null)}
                                className="absolute top-8 right-8 z-50 p-4 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="md:w-1/3 bg-slate-900 relative overflow-hidden flex flex-col justify-end p-10">
                                <div className="absolute inset-0 z-0 opacity-40">
                                    <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black ${selectedBattle.era === 'Modern Resistance' || selectedBattle.era === 'Liberation' ? 'bg-amber-900/40' :
                                        selectedBattle.era === 'Imperial' ? 'bg-star-red/40' : 'bg-emerald-900/40'
                                        }`} />
                                </div>
                                <div className="relative z-10 space-y-4">
                                    <span className="text-gold-sand text-[9px] font-black uppercase tracking-[0.5em]">{selectedBattle.era} ERA</span>
                                    <h2 className="text-white text-5xl font-serif font-black uppercase leading-none">
                                        {lang === 'en' ? selectedBattle.name.en : selectedBattle.name.ar}
                                    </h2>
                                    <div className="flex flex-col pt-4">
                                        <span className="text-white/30 text-[9px] uppercase font-black">Timeline</span>
                                        <span className="text-gold-sand text-3xl font-display">{selectedBattle.year}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-black/40 backdrop-blur-xl overflow-y-auto p-12 md:p-16 text-white/90 glass-card-elite">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-primary">
                                                <MapPin className="w-4 h-4" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'الموقع الجغرافي' : 'LOCATION'}</h4>
                                            </div>
                                            <p className="text-xl font-bold text-white/90">
                                                {lang === 'en' ? selectedBattle.location.en : selectedBattle.location.ar}
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-primary">
                                                <Users className="w-4 h-4" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'الجبهات والقيادة' : 'FORCES & COMMAND'}</h4>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-base">
                                                    <span className="text-white/40 font-black text-[9px] uppercase mr-2">Military:</span> {lang === 'en' ? selectedBattle.combatants.en : selectedBattle.combatants.ar}
                                                </p>
                                                <p className="text-base">
                                                    <span className="text-white/40 font-black text-[9px] uppercase mr-2">Command:</span> <span className="text-primary font-bold">{lang === 'en' ? selectedBattle.leaders.en : selectedBattle.leaders.ar}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-gold-royal">
                                                <Activity className="w-4 h-4" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'الخسائر' : 'CASUALTIES'}</h4>
                                            </div>
                                            <p className="text-base text-white/60">
                                                {lang === 'en' ? (selectedBattle.casualties?.en || 'Not recorded in logs') : (selectedBattle.casualties?.ar || 'غير مسجلة بدقة')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-emerald-500">
                                                <Target className="w-4 h-4" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'النهج التكتيكي' : 'TACTICAL APPROACH'}</h4>
                                            </div>
                                            <div className="p-6 bg-emerald-500/10 rounded-xl border-l-4 border-emerald-500 italic text-base text-emerald-400 leading-relaxed">
                                                "{lang === 'en' ? selectedBattle.tactics.en : selectedBattle.tactics.ar}"
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-red-500">
                                                <Quote className="w-4 h-4" />
                                                <h4 className="text-[10px] font-black uppercase tracking-widest">{lang === 'ar' ? 'الأثر التاريخي' : 'HISTORICAL LEGACY'}</h4>
                                            </div>
                                            <p className="text-base text-white/70 leading-relaxed">
                                                {lang === 'en' ? selectedBattle.impact.en : selectedBattle.impact.ar}
                                            </p>
                                        </div>

                                        <div className="p-8 bg-black/40 rounded-xl border border-white/5">
                                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">Outcome</span>
                                            <p className="text-xl font-black text-primary uppercase">
                                                {lang === 'en' ? selectedBattle.outcome.en : selectedBattle.outcome.ar}
                                            </p>
                                        </div>

                                        {(() => {
                                            // Slugs from content directory
                                            const academicSlugs = [
                                                'oued-sebou-maamora-1515',
                                                'battle-of-bagdoura-741',
                                                'battle-of-zallaqa-1086',
                                                'battle-of-al-ark-1195',
                                                'battle-of-las-navas-de-tolosa-1212',
                                                'battle-of-dononiyah-1276',
                                                'battle-of-wadi-al-makhazin-1578',
                                                'battle-of-isly-1844',
                                                'battle-of-tetouan-1860',
                                                'sidi-bou-othmane-battle-1912',
                                                'el-hri-battle-1914',
                                                'battle-of-annual-1921',
                                                'battle-of-bougafer-1933',
                                                'battle-of-dcheira-1958',
                                                'agbalou-nkardous-resistence',
                                                'tazenakht-forgotten-village'
                                            ];
                                            const isAcademic = academicSlugs.includes(selectedBattle.id);
                                            return (
                                                <button
                                                    onClick={() => {
                                                        if (isAcademic) {
                                                            window.location.href = '/posts/' + selectedBattle.id + '?lang=' + lang;
                                                        } else {
                                                            setShowFullArticle(true);
                                                        }
                                                    }}
                                                    className="w-full py-5 rounded-xl bg-gradient-to-r from-[#8b0000] to-[#500000] text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(139,0,0,0.4)] hover:shadow-[0_0_30px_rgba(197,160,89,0.7)] hover:from-[#c5a059] hover:to-[#a08030] transition-all border border-white/10 group"
                                                >
                                                    <Compass className="w-5 h-5 animate-pulse" />
                                                    {lang === 'ar' ? `سافر إلى عالم ${selectedBattle.name.ar}` : `Journey into ${selectedBattle.name.en}`}
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULL ARTICLE READER */}
            {selectedBattle && (
                <ArticleReader
                    article={getArticle(selectedBattle.id, selectedBattle.name.ar, selectedBattle.name.en, 'battle')}
                    isOpen={showFullArticle}
                    onClose={() => setShowFullArticle(false)}
                />
            )}
        </div>
    );
}
