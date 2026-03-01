const fs = require('fs');
const path = require('path');

const dir = 'frontend/content/posts';

const oldLandmarks = [
    { id: 'rabat-hassan-tower', title: 'صومعة حسان', category: 'landmark', desc: 'مئذنة غير مكتملة لمسجد تاريخي بناه الموحدون في الرباط، تعتبر رمزاً شاهقاً للمدينة.', img: '/images/hassan-tower.jpg' },
    { id: 'casablanca-hassan-ii', title: 'مسجد الحسن الثاني', category: 'landmark', desc: 'معلمة دينية ومعمارية فريدة، يمتلك أطول مئذنة في العالم ويطل مباشرة على المحيط الأطلسي.', img: '/images/hassan-ii.jpg' },
    { id: 'tangier-hercules-cave', title: 'مغارة هرقل', category: 'landmark', desc: 'مغارة أسطورية ذات فتحة على شكل خريطة إفريقيا، تقع بالقرب من مدينة طنجة.', img: '/images/hercules-cave.jpg' },
    { id: 'meknes-volubilis', title: 'وليلي', category: 'landmark', desc: 'أهم المواقع الأثرية الرومانية في المغرب، تتميز بفسيفسائها البديعة ومعابدها التاريخية.', img: '/images/volubilis.jpg' },
    { id: 'essaouira-skala', title: 'صقالة الميناء', category: 'landmark', desc: 'برج مراقبة وحصن برتغالي يحرس مدينة الصويرة بأمواجها العاتية ومدافعها البرونزية.', img: '/images/skala.jpg' },
    { id: 'boujdour-lighthouse', title: 'منارة بوجدور', category: 'landmark', desc: 'معلمة تاريخية شامخة في الملاحة البحرية لصحراء المحيط الأطلسي، تقف قبالة جزر الكناري.', img: '/images/boujdour.jpg' }
];

oldLandmarks.forEach(l => {
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

console.log(`Generated ${oldLandmarks.length} old landmark files successfully.`);
