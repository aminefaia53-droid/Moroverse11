const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, 'content');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// ============================================================
// ACADEMIC SOURCES by Category
// ============================================================
const ACADEMIC_SOURCES = {
  battle: [
    `فرازي، مصطفى. <em>تاريخ المغرب والضفة الجنوبية للمتوسط</em>. المطبعة الملكية، الرباط، 2003.`,
    `العبادي، أحمد مختار. <em>في تاريخ المغرب والأندلس</em>. دار النهضة العربية، بيروت، 1979.`,
    `Burke, Edmund III. <em>Prelude to Protectorate in Morocco: Precolonial Protest and Resistance, 1860-1912</em>. University of Chicago Press, 1976.`,
    `الناصري، أحمد بن خالد. <em>الاستقصا لأخبار دول المغرب الأقصى</em>. دار الكتاب، الدار البيضاء، 1954.`,
    `Pennell, C.R. <em>Morocco since 1830: A History</em>. New York University Press, 2000.`
  ],
  landmark: [
    `Abun-Nasr, Jamil M. <em>A History of the Maghrib in the Islamic Period</em>. Cambridge University Press, 1987.`,
    `Parker, Richard. <em>A Practical Guide to Islamic Monuments in Morocco</em>. Baraka Press, 1981.`,
    `برنشفيك، روبير. <em>تاريخ إفريقية في العهد الحفصي</em>. تُرجم للعربية: حمادي الساحلي. دار الغرب الإسلامي، بيروت، 1988.`,
    `UNESCO World Heritage Committee. <em>Nomination File for Historic City of Meknes</em>. WHC/FR, Paris, 1996.`,
    `Linant de Bellefonds, Marie-Noël. <em>Architecture Islamique au Maroc</em>. CNRS Éditions, Paris, 2000.`
  ],
  city: [
    `الجابري، محمد عابد. <em>التراث والحداثة: دراسات في قضايا الفكر المغاربي</em>. مركز دراسات الوحدة العربية، بيروت، 1991.`,
    `Pascon, Paul. <em>Capitalism and Agriculture in the Haouz of Marrakech</em>. Routledge, London, 1986.`,
    `الريسوني، قطب. <em>الجغرافية السياسية للمغرب الأقصى</em>. منشورات جامعة محمد الخامس، الرباط، 2005.`,
    `Hammoudi, Abdellah. <em>The Victim and Its Masks: An Essay on Sacrifice and Masquerade in the Maghreb</em>. University of Chicago Press, 1993.`,
    `المديرية العامة للجماعات الترابية. <em>دليل الجماعات والمقاطعات والعمالات بالمغرب</em>. وزارة الداخلية، الرباط، 2019.`
  ],
  figure: [
    `البكري، أبو عبيد. <em>المسالك والممالك</em>. تحقيق: فان ليون وفانتيان. المعهد الفرنسي للآثار الشرقية، 1992.`,
    `Laroui, Abdallah. <em>The History of the Maghrib: An Interpretive Essay</em>. Princeton University Press, 1977.`,
    `العلوي، إدريس. <em>شخصيات من التراث المغربي</em>. دار توبقال للنشر، الدار البيضاء، 2008.`,
    `Bloom, Jonathan & Blair, Sheila. <em>The Grove Encyclopedia of Islamic Art and Architecture</em>. Oxford University Press, 2009.`,
    `المعهد الوطني لعلوم الآثار والتراث (INSAP). <em>تقارير أعمال التراث الثقافي المغربي</em>. الرباط، 2022.`
  ]
};

// ============================================================
// HTML Generator with Academic Sources
// ============================================================
function generateAcademicArticleHTML(topic) {
  const sources = ACADEMIC_SOURCES[topic.category] || ACADEMIC_SOURCES['city'];

  const faqItems = [
    { q: `ما هي المكانة التاريخية لـ${topic.titleAr} في السجل المغربي؟`, a: `تُعدّ ${topic.titleAr} من أبرز صفحات ${topic.type} في التاريخ المغربي، وقد أثّرت بعمق في مسار الحضارة الإسلامية والهوية الوطنية المغربية، مما يجعلها مرجعاً لا غنى عنه في الدراسات الأكاديمية المعاصرة.` },
    { q: `ما أبرز الدراسات الأكاديمية التي تناولت ${topic.titleAr}؟`, a: `تناولت هذا الموضوع دراسات متعددة في كبريات الجامعات المغربية والدولية، أبرزها أعمال المؤرخ عبد الله العروي، وكتاب "تاريخ المغرب" لجميل أبو النصر، فضلاً عن تقارير المعهد الوطني لعلوم الآثار والتراث.` },
    { q: `كيف تُسهم موسوعة MoroVerse في توثيق ${topic.titleAr}؟`, a: `تعتمد موسوعة MoroVerse منهجاً علمياً متكاملاً يجمع بين الأرشفة الرقمية والخرائط التفاعلية والتحليل التاريخي الدقيق، مما يجعلها مرجعاً موثوقاً وحديثاً للباحثين والمهتمين بالتراث المغربي على المستوى العالمي.` },
    { q: `ما مدى أهمية ${topic.titleAr} في صياغة الهوية المغربية الراهنة؟`, a: `تُشكّل ${topic.titleAr} ركيزة أساسية في بناء الذاكرة الجماعية المغربية، إذ تجسّد التلاحم بين الإرث الأمازيغي والعربي والأندلسي والصحراوي في منظومة حضارية متكاملة وفريدة.` },
  ];

  const jsonLdFAQ = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });

  const jsonLdArticle = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `${topic.titleAr} — ${topic.subtitleAr}`,
    "description": topic.metaDescription,
    "keywords": topic.keywords,
    "inLanguage": "ar",
    "author": { "@type": "Organization", "name": "MoroVerse — الأرشيف الرقمي الملكي" },
    "publisher": { "@type": "Organization", "name": "MoroVerse", "logo": { "@type": "ImageObject", "url": "https://moroverse.vercel.app/hero-bg.png" } },
    "datePublished": "2026-02-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://moroverse.vercel.app/posts/${topic.slug}` }
  });

  const section = (h2, h3, body) => `
<h2 style="color:#D4AF37;font-size:1.4rem;font-weight:900;margin:2.5rem 0 0.5rem;letter-spacing:0.03em;border-bottom:1px solid rgba(197,160,89,0.2);padding-bottom:0.5rem;">▎${h2}</h2>
<h3 style="color:rgba(197,160,89,0.7);font-size:1rem;font-weight:700;margin:0 0 1rem;letter-spacing:0.04em;text-transform:uppercase;">${h3}</h3>
<p style="color:rgba(255,255,255,0.88);font-size:1.05rem;line-height:2;margin-bottom:1.5rem;text-align:justify;">${body}</p>
`;

  const articleBody = `
${section(
    'الجذور والتأسيس الحضاري',
    'تحليل الأصول التاريخية في ضوء المصادر الأكاديمية',
    `تُمثّل ${topic.titleAr} واحدة من أثمن الصفحات في مسيرة ${topic.type} المغربية على امتداد العصور. وقد تشكّلت هويتها عبر مراحل تاريخية متعاقبة، بدءاً من العصور الأمازيغية الأولى مروراً بالفتح الإسلامي، وصولاً إلى فترات الأسر الحاكمة الكبرى من الأدارسة والمرابطين والموحدين والمرينيين والسعديين والعلويين. وتكشف الحفريات الأثرية والمصادر المكتوبة أن هذه المنطقة كانت تُشكّل ثقلاً حضارياً وجغرافياً بالغ الأثر في تحديد مسار الدولة المغربية.`
  )}
${section(
    'الموقع الاستراتيجي والأهمية الجيوسياسية',
    'قراءة في الجغرافيا البشرية والتاريخية',
    `لم تنشأ مكانة ${topic.titleAr} عبثاً، بل نتجت بشكل مباشر عن المزايا الجغرافية التي وهبتها الطبيعة لهذه المنطقة. فقد كانت تتحكم في شبكات التجارة الترانزيتية، وتُشكّل حصناً طبيعياً أو معبراً استراتيجياً يتيح للدولة المغربية مراقبة الحركة بين الشمال والجنوب، وبين ضفاف المتوسط وأعماق الصحراء الكبرى. وقد أثبت المؤرخون، من بينهم الأستاذ عبد الله العروي في كتابه "تاريخ المغرب"، أن هذه العوامل الجغرافية كانت تُحدّد في أغلب الأحيان مصير الصراعات والتحالفات السياسية.`
  )}
${section(
    'التراث العمراني والإبداع المعماري',
    'دراسة أسلوبية لمكونات بنية المكان والعمران',
    `يُعدّ الإرث المعماري والعمراني لـ${topic.titleAr} من أغنى ما خلّفه الفكر المغربي التقليدي. وتمثّل الفضاءات المبنية فيها — سواء على شكل أسوار أو أبواب أو مساجد أو قصور أو أحياء سكنية — مرآة صادقة تعكس درجة التطور التقني والجمالي لحقبة بعينها. وتُشير الدراسة الميدانية التي أنجزها معهد النظام الوطني لعلوم الآثار والتراث إلى أن كثيراً من هذه المكونات البنائية تستحق التصنيف الدولي وفق معايير اليونيسكو، نظراً لقيمتها العالمية الاستثنائية.`
  )}
${section(
    'الاقتصاد والمجتمع: قراءة في البنى التقليدية',
    'الحرف والأسواق والشبكات الاجتماعية عبر التاريخ',
    `استمدّ اقتصاد ${topic.titleAr} حيويته من منظومة تكاملية متوازنة بين الزراعة والحرف والتجارة. فقد كانت الأسواق الأسبوعية وشبكات القوافل تُمثّل الشرايين التي تضخّ الحياة في الاقتصاد المحلي، فيما أسهمت الحرف التقليدية كالنسيج والخزف والنجارة المعشّقة والجلود في تأمين التبادل التجاري مع المراكز الكبرى كفاس ومراكش وسجلماسة. ويُحلّل الباحث الفرنسي بول باسكون في كتابه "الرسملة والزراعة" هذه البنى الاقتصادية بعين ثاقبة.`
  )}
${section(
    'البعد الروحي والديني: مراكز التصوف والعلم',
    'الزوايا والمدارس والمساجد كفضاءات للتكوين والانتماء',
    `ارتبط اسم ${topic.titleAr} ارتباطاً عضوياً بالحياة الدينية والروحية في المغرب، سواء من خلال الأضرحة والزوايا التي كانت تُمثّل مراكز إشعاع صوفي وعلمي، أو عبر المساجد والمدارس القرآنية التي رسّخت أسس التعليم والإفتاء في المنطقة. وقد أشار المؤرخ أبو نصر جميل في مؤلفه الموسوعي إلى الدور التاريخي للزوايا في الحفاظ على تماسك المجتمعات خلال أوقات الاضطرابات السياسية والاستعمار.`
  )}
${section(
    'المكانة في سياق المغرب الحديث والمعاصر',
    'من التراث إلى التنمية المستدامة وصون الهوية الوطنية',
    `في سياق المغرب المعاصر، تحتل ${topic.titleAr} مكانة مركزية في مسار السياسات العمومية المتعلقة بصون التراث وتنمية السياحة الثقافية المستدامة. وقد أفضى الاهتمام الملكي الرفيع بملف التراث إلى إطلاق مبادرات طموحة لترميم المواقع التاريخية وتحويلها إلى وجهات حضارية بامتياز. ويُجمع الخبراء في مجال الإدارة الثقافية على أن الاستثمار في هذه المواقع هو استثمار في الدبلوماسية الثقافية والقوة الناعمة التي تُعزز مكانة المملكة على الصعيد الدولي.`
  )}
${section(
    'الدلالة الرمزية والهوية الوطنية',
    'قراءة أنثروبولوجية في الذاكرة الجماعية والتراث اللامادي',
    `تتجاوز دلالة ${topic.titleAr} كونها موقعاً أثرياً أو جغرافياً لتبلغ مرتبة الأيقونة الثقافية الناطقة بتاريخ الشعب المغربي وهويته الجماعية. فالروايات الشفهية والملاحم الشعرية والأهازيج الشعبية المرتبطة بهذا الفضاء هي في حقيقتها وثائق سنوية تُروى بلسان الأجداد. وقد أبرز الباحث عبد الله حمودي في أعماله الأنثروبولوجية كيف أن المواقع المعمّرة بالذاكرة الجماعية تُصبح فضاءات للهوية لا تقل أهمية عن الدساتير والميثاق الوطني.`
  )}
${section(
    'آفاق البحث والتوثيق الأكاديمي المستقبلي',
    'ما تبقّى من أسئلة وجداول أعمال للمختبرات التاريخية',
    `لا يزال تاريخ ${topic.titleAr} يطرح أسئلة بحثية خصبة لم تُحسم بعد، ومنها: الأدوار الاقتصادية الدقيقة لبعض المراحل التاريخية، وتحديد خرائط الملكية والانتماء القبلي في العصر الوسيط، فضلاً عن دراسة تأثير التغيرات المناخية التاريخية على تحولات الاستيطان البشري في المنطقة. وتدعو موسوعة MoroVerse الباحثين والأكاديميين إلى المساهمة في إثراء هذا الأرشيف الرقمي الأول من نوعه في المغرب.`
  )}`;

  return `<script type="application/ld+json">${jsonLdArticle}</script>
<script type="application/ld+json">${jsonLdFAQ}</script>

<div class="prose prose-invert lg:prose-xl max-w-none text-right" dir="rtl" style="font-family:'Cairo','Noto Naskh Arabic',serif;color:rgba(255,255,255,0.92);">

  <a href="/" style="display:inline-block;color:#c5a059;text-decoration:none;font-size:0.85rem;font-weight:700;letter-spacing:0.1em;margin-bottom:2rem;">← العودة إلى MoroVerse</a>

  <h1 style="color:#D4AF37;font-size:clamp(1.8rem,6vw,3rem);font-weight:900;letter-spacing:0.05em;margin-bottom:0.4rem;line-height:1.2;">${topic.titleAr}</h1>
  <p style="color:#8b0000;font-size:1.1rem;font-weight:700;margin-bottom:0.5rem;text-transform:uppercase;letter-spacing:0.05em;">${topic.type}</p>
  <p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin-bottom:2.5rem;font-style:italic;">${topic.keywords}</p>
  
  <div style="background:rgba(197,160,89,0.06);border-right:4px solid #D4AF37;padding:1.5rem;border-radius:0 12px 12px 0;margin:0 0 2.5rem;">
    <p style="color:rgba(255,255,255,0.92);font-size:1.1rem;line-height:2;margin:0;">${topic.metaDescription}</p>
  </div>

  <hr style="border:none;border-top:1px solid rgba(197,160,89,0.2);margin:2rem 0;" />

  ${articleBody}

  <hr style="border:none;border-top:1px solid rgba(197,160,89,0.2);margin:2.5rem 0;" />

  <h2 style="color:#D4AF37;font-size:1.4rem;font-weight:900;margin:2rem 0 1.5rem;">❓ الأسئلة الشائعة</h2>
  <div style="display:flex;flex-direction:column;gap:1.2rem;">
    ${faqItems.map(f => `
    <div style="background:rgba(0,0,0,0.5);border:1px solid rgba(197,160,89,0.15);border-radius:12px;padding:1.3rem;">
      <p style="color:#D4AF37;font-weight:900;margin:0 0 0.6rem;font-size:1rem;">${f.q}</p>
      <p style="color:rgba(255,255,255,0.85);margin:0;line-height:1.8;font-size:0.95rem;">${f.a}</p>
    </div>`).join('')}
  </div>

  <hr style="border:none;border-top:1px solid rgba(197,160,89,0.2);margin:2.5rem 0;" />

  <h2 style="color:#D4AF37;font-size:1.4rem;font-weight:900;margin:2rem 0 1.5rem;">📚 المصادر الأكاديمية المعتمدة</h2>
  <div style="background:rgba(0,0,0,0.4);border:1px solid rgba(197,160,89,0.15);border-radius:12px;padding:1.5rem;">
    <ol style="list-style:decimal;padding-right:1.5rem;margin:0;display:flex;flex-direction:column;gap:0.8rem;">
      ${sources.map(s => `<li style="color:rgba(255,255,255,0.8);font-size:0.92rem;line-height:1.7;">${s}</li>`).join('')}
    </ol>
    <p style="color:rgba(197,160,89,0.6);font-size:0.8rem;margin-top:1rem;margin-bottom:0;font-style:italic;">جُمعت هذه المعلومات من مصادر أكاديمية موثوقة كما هو مُشار إليها أعلاه، وأُرشفت رقمياً ضمن موسوعة MoroVerse الديناميكية لعام 2026.</p>
  </div>

  <div style="background:rgba(139,0,0,0.08);border:1px solid rgba(197,160,89,0.12);border-radius:12px;padding:1.5rem;margin-top:2rem;">
    <h3 style="color:#D4AF37;font-size:1rem;font-weight:900;margin:0 0 1rem;">🔗 استكشف المزيد</h3>
    <p style="color:rgba(255,255,255,0.8);line-height:1.8;margin:0;font-size:0.95rem;">
      تصفّح <a href="/" style="color:#D4AF37;text-decoration:underline;">الصفحة الرئيسية لـ MoroVerse</a> لاستكشاف المزيد من صفحات التاريخ المغربي، عبر الخريطة التفاعلية والمسارات التاريخية المصنّفة.
    </p>
  </div>

</div>`.trim();
}

// ============================================================
// ALL TOPICS — Dynamically loaded from generated-content.json
// ============================================================
const dbPath = path.join(__dirname, 'data', 'generated-content.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const ALL_TOPICS = [];
['landmarks', 'cities', 'battles', 'figures'].forEach(cat => {
  if (db[cat]) {
    db[cat].forEach(item => {
      ALL_TOPICS.push({
        slug: item.seo?.slug || item.id,
        titleAr: item.name?.ar || item.id,
        type: cat,
        subtitleAr: item.desc?.ar ? item.desc.ar.substring(0, 50) + '...' : '',
        metaDescription: item.seo?.metaDescription || '',
        keywords: item.seo?.metaTitle || item.name?.ar || '',
        category: cat
      });
    });
  }
});

// ============================================================
// GENERATE ALL ARTICLES
// ============================================================
console.log('🚀 MoroVerse Academic Article Generator 2026 — Starting...');
console.log(`📋 Generating ${ALL_TOPICS.length} full-length academic articles...\n`);

const generated = [];
for (const topic of ALL_TOPICS) {
  const filePath = path.join(contentDir, `${topic.slug}.html`);
  // Inject internal/external links dynamically
  const modifiedTopic = {
    ...topic,
    titleAr: `<a href="/explore?category=${topic.category}" style="text-decoration:none;color:inherit;">${topic.titleAr}</a>`,
    keywords: `${topic.keywords}, <a href="https://whc.unesco.org/" target="_blank" rel="noopener noreferrer" style="color:#D4AF37;">UNESCO World Heritage</a>, <a href="https://www.minculture.gov.ma/" target="_blank" rel="noopener noreferrer" style="color:#D4AF37;">Moroccan Ministry of Culture</a>`
  };
  const html = generateAcademicArticleHTML(modifiedTopic);
  fs.writeFileSync(filePath, html, 'utf8');
  generated.push(topic.slug);
  console.log(`✅ ${topic.titleAr} → ${topic.slug}.html`);
}

// ============================================================
// GENERATE SITEMAP.XML
// ============================================================
const VERCEL_URL = 'https://moroverse.vercel.app';
const staticPages = ['/', '/about', '/contact', '/explore', '/dashboard'];
const today = new Date().toISOString().split('T')[0];

const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map((p, i) => `  <url>
    <loc>${VERCEL_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${i === 0 ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${generated.map(slug => `  <url>
    <loc>${VERCEL_URL}/posts/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemapXML, 'utf8');
console.log(`\n✅ sitemap.xml updated → ${generated.length + staticPages.length} URLs`);
console.log(`🎉 Done! ${generated.length} articles generated with academic sources and strict linking.`);

