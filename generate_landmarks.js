const fs = require('fs');
const path = require('path');

const dir = 'frontend/content/posts';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const landmarks = [
    // Fes
    { id: 'fes-al-qarawiyyin', title: 'جامع القرويين', category: 'landmark', desc: 'أقدم جامعة مستمرة في العالم وأحد أهم المراكز الروحية والعلمية في مدينة فاس التاريخية.', img: '/images/al-qarawiyyin.jpg' },
    { id: 'fes-al-attarine', title: 'مدرسة العطارين', category: 'landmark', desc: 'تحفة المعمار المريني في فاس، تتميز بالنقوش الجصية والزليج الدقيق والخشب المحفور.', img: '/images/al-attarine.jpg' },
    { id: 'fes-chouara-tannery', title: 'دار الدبغ', category: 'landmark', desc: 'أشهر دار لدباغة الجلود في فاس، حيث الألوان الزاهية والعمل اليدوي المتوارث منذ قرون.', img: '/images/chouara.jpg' },
    { id: 'fes-bab-boujloud', title: 'باب بوجلود', category: 'landmark', desc: 'المدخل الرئيسي الأزرق للمدينة القديمة في فاس، رمز العمارة المورسكية الجميلة.', img: '/images/bab-boujloud.jpg' },

    // Marrakech
    { id: 'marrakech-jemaa-el-fnaa', title: 'جامع الفنا', category: 'landmark', desc: 'الساحة النابضة بالحياة قلب مراكش، مسرح مفتوح يجمع رواة القصص، الموسيقيين، والمأكولات الشعبية.', img: '/images/jemaa-el-fnaa.jpg' },
    { id: 'marrakech-bahia-palace', title: 'قصر الباهية', category: 'landmark', desc: 'قصر أندلسي مغربي مذهل يعكس ترف وعظمة القرن التاسع عشر بحدائقه وزخارفه المعقدة.', img: '/images/bahia-palace.jpg' },
    { id: 'marrakech-el-badi-palace', title: 'قصر البديع', category: 'landmark', desc: 'أطلال قصر سعدي عظيم كان يُعتبر من عجائب الدنيا في زمانه، بناه أحمد المنصور الذهبي.', img: '/images/el-badi.jpg' },
    { id: 'marrakech-ben-youssef', title: 'مدرسة بن يوسف', category: 'landmark', desc: 'من أكبر المدارس التاريخية في المغرب الأقصى، تحفة تجمع بين تناسق الزليج وجمال النقش والمقرنصات.', img: '/images/ben-youssef.jpg' },
    { id: 'marrakech-majorelle', title: 'حدائق ماجوريل', category: 'landmark', desc: 'واحة استوائية ساحرة في قلب مراكش تمزج بين اللون الأزرق الماجوريل والنباتات النادرة.', img: '/images/majorelle.jpg' },

    // Meknes
    { id: 'meknes-bab-mansour', title: 'باب المنصور لعلج', category: 'landmark', desc: 'أضخم وأجمل أبواب المغرب، يزين مدخل العاصمة الإسماعيلية مكناس بنقوشه وزخارفه الأخاذة.', img: '/images/bab-mansour.jpg' },
    { id: 'meknes-sahrij-souani', title: 'صهريج السواني', category: 'landmark', desc: 'خزان مائي عظيم وبنية تحتية تاريخية أمر ببنائها السلطان المولى إسماعيل لتزويد مكناس بالمياه.', img: '/images/sahrij-souani.jpg' },
    { id: 'meknes-habs-qara', title: 'حبس قرا', category: 'landmark', desc: 'سجن تاريخي غامض ومترامي الأطراف يقع تحت الأرض في قلب قصبة مكناس الإسماعيلية.', img: '/images/habs-qara.jpg' },

    // Rabat
    { id: 'rabat-kasbah-oudaya', title: 'قصبة الوداية', category: 'landmark', desc: 'قلعة تاريخية بيضاء وزرقاء تقع على مصب نهر أبي رقراق، تتميز بحدائقها الأندلسية العبقة.', img: '/images/kasbah-oudaya.jpg' },
    { id: 'rabat-chellah', title: 'موقع شالة', category: 'landmark', desc: 'مدينة أثرية تعانق الآثار الرومانية والإسلامية المرينية، حيث الهدوء وأعشاش طيور اللقلق.', img: '/images/chellah.jpg' },
    { id: 'rabat-mohammed-v-mausoleum', title: 'ضريح محمد الخامس', category: 'landmark', desc: 'تحفة معمارية مغربية معاصرة تضم رفات الملك محمد الخامس والملك الحسن الثاني طيب الله ثراهما.', img: '/images/mohammed-v.jpg' },

    // Others
    { id: 'casablanca-habous', title: 'حي الأحباس بالدار البيضاء', category: 'landmark', desc: 'حي تاريخي بني في بداية القرن العشرين يجمع بين التخطيط الحديث والمعمار المغربي التقليدي.', img: '/images/habous.jpg' },
    { id: 'safi-ksar-el-bahr', title: 'قصر البحر بآسفي', category: 'landmark', desc: 'حصن برتغالي عتيد يطل بشموخ على أمواج المحيط الأطلسي لمدينة آسفي العريقة.', img: '/images/ksar-el-bahr.jpg' },
    { id: 'ait-ben-haddou', title: 'قصبة أيت بن حدو', category: 'landmark', desc: 'قرية طينية محصنة في سفوح الأطلس، تصنف كتراث عالمي لليونسكو وظهرت في عدة أفلام عالمية.', img: '/images/ait-ben-haddou.jpg' },
    { id: 'atlas-studios', title: 'استوديوهات أطلس', category: 'landmark', desc: 'هوليود إفريقيا في ورزازات، أحد أكبر استوديوهات التصوير السينمائي المفتوحة في العالم.', img: '/images/atlas-studios.jpg' },
    { id: 'erg-chebbi', title: 'عرق الشبي بمرزوكة', category: 'landmark', desc: 'كثبان رملية ذهبية ساحرة تعانق عنان السماء في صحراء مرزوكة، وجهة سحرية لا تُنسى.', img: '/images/erg-chebbi.jpg' },
    { id: 'ouzoud-falls', title: 'شلالات أوزود', category: 'landmark', desc: 'أعلى وأجمل شلالات المغرب، جنة طبيعية مخفية في جبال الأطلس المتوسط.', img: '/images/ouzoud.jpg' },
    { id: 'ifrane-lion', title: 'أسد إيفران', category: 'landmark', desc: 'تمثال حجري شهير يرمز لأسد الأطلس، يتوسط مدينة إيفران الملقبة بسويسرا المغرب.', img: '/images/ifrane-lion.jpg' },
    { id: 'dakhla-sebkha', title: 'سبخة الداخلة', category: 'landmark', desc: 'لؤلؤة الصحراء المغربية حيث يلتقي بحر الأطلسي برمال الصحراء في مشهد طبيعي فريد.', img: '/images/dakhla.jpg' }
];

landmarks.forEach(l => {
    const fileContent = `---
title: "${l.title}"
category: "${l.category}"
description: "${l.desc}"
image: "${l.img}"
---

# ${l.title}

${l.desc}
`;
    fs.writeFileSync(path.join(dir, `${l.id}.md`), fileContent, 'utf8');
});

console.log(`Generated ${landmarks.length} files successfully.`);
