import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

// Slug → article meta mapping
const ARTICLE_META: Record<string, { title: string; description: string; keywords: string; image?: string }> = {
    'tazenakht-forgotten-village': { title: 'تازناخت — القرية المنسية في ظل الأطلس | MoroVerse', description: 'اكتشف سر قرية تازناخت، عاصمة الزربية المغربية المنسية في ظلال الأطلس الصغير. تاريخ عريق ونسيج جميل.', keywords: 'تازناخت, زرابي مغربية, أطلس صغير, ورزازات, حرف يدوية' },
    'agbalou-nkardous-resistence': { title: 'أغبالو نكردوس — معقل المقاومة | MoroVerse', description: 'قصة أغبالو نكردوس، معقل المقاومة المجيدة في أعالي جبال أطلس أزيلال. اكتشف أسرار هذه القرية البطولية.', keywords: 'أغبالو نكردوس, مقاومة مغربية, أطلس, تادلة أزيلال' },
    'sidi-bou-othmane-battle-1912': { title: 'معركة سيدي بوعثمان 1912 | MoroVerse', description: 'معركة سيدي بوعثمان 1912، الملحمة التي خلّدت صمود رجال الجنوب في مواجهة الجيش الفرنسي الغازي.', keywords: 'سيدي بوعثمان, معركة 1912, مغرب, استعمار, مراكش' },
    'el-hri-battle-1914': { title: 'معركة لهري 1914 — مقبرة الغزاة | MoroVerse', description: 'كيف حقق موحى أوحمو الزياني انتصاراً أسطورياً في معركة لهري 1914، محولاً إياها إلى مقبرة للجيش الفرنسي.', keywords: 'لهري, معركة 1914, موحى أوحمو الزياني, مقاومة, أطلس' },
    'battle-of-zallaqa-1086': { title: 'معركة الزلاقة 1086 — انتصار المرابطين | MoroVerse', description: 'اكتشف كيف أنقذ يوسف بن تاشفين الأندلس في معركة الزلاقة الخالدة سنة 1086م.', keywords: 'الزلاقة, 1086, يوسف بن تاشفين, المرابطون, الأندلس' },
    'battle-of-wadi-al-makhazin-1578': { title: 'معركة وادي المخازن 1578 — الملوك الثلاثة | MoroVerse', description: 'معركة الملوك الثلاثة في وادي المخازن 1578، الانتصار الساحق الذي أعاد رسم خريطة المتوسط.', keywords: 'وادي المخازن, 1578, معركة الملوك الثلاثة, السعديون, البرتغال' },
    'battle-of-isly-1844': { title: 'معركة إيسلي 1844 | MoroVerse', description: 'وقائع معركة إيسلي 1844 وأثرها على مسيرة المغرب في مواجهة التوسع الفرنسي في القرن التاسع عشر.', keywords: 'إيسلي, 1844, محمد الرابع, فرنسا, مغرب' },
    'volubilis-roman-ruins': { title: 'وليلي — المدينة الرومانية المغربية | MoroVerse', description: 'وليلي، درة المغرب الأثرية ومدينة الزيتون والفسيفساء الرومانية المصنفة من اليونيسكو.', keywords: 'وليلي, مكناس, رومان, أثار مغرب, يونيسكو' },
    'ait-benhaddou-kasbah': { title: 'قصبة أيت بن حدو — أيقونة السينما العالمية | MoroVerse', description: 'قصبة أيت بن حدو، التراث الطيني العالمي المصنّف من اليونيسكو ومسرح كبريات الأفلام العالمية.', keywords: 'أيت بن حدو, ورزازات, قصبة, يونيسكو, سينما عالمية' },
    'tinmel-mosque': { title: 'مسجد تينمل — معقل الموحدين | MoroVerse', description: 'مسجد تينمل، التحفة المعمارية المنسية في قلب جبال الأطلس الكبير وأصل دولة الموحدين العظيمة.', keywords: 'تينمل, مسجد, الموحدون, أطلس كبير, مغرب' },
    'fatima-al-fihriya': { title: 'فاطمة الفهرية — مؤسسة أول جامعة في العالم | MoroVerse', description: 'قصة فاطمة الفهرية الملهمة، مؤسسة جامعة القرويين بفاس، أقدم جامعة في العالم لا تزال تعمل.', keywords: 'فاطمة الفهرية, جامعة القرويين, فاس, إدريسيون, المرأة المغربية' },
    'ibn-battuta': { title: 'ابن بطوطة — أعظم رحالة في التاريخ | MoroVerse', description: 'الرحلة الأسطورية لابن بطوطة ابن طنجة الذي طاف 44 دولة على مدى 29 عاماً ليصف العالم الوسيط.', keywords: 'ابن بطوطة, طنجة, رحلات, جغرافيا, مغرب' },
    'yusuf-ibn-tashfin': { title: 'يوسف بن تاشفين — مؤسس مراكش | MoroVerse', description: 'سيرة يوسف بن تاشفين، مؤسس مراكش والإمبراطورية المرابطية الكبرى ومنقذ الأندلس الإسلامية.', keywords: 'يوسف بن تاشفين, مراكش, المرابطون, الأندلس الإسلامية' },
    'marrakech-city': { title: 'مراكش — البهجة الحمراء | MoroVerse', description: 'دليل شامل عن مراكش، المدينة الملكية الحمراء وقلب السياحة الثقافية في المغرب.', keywords: 'مراكش, جامع الفنا, مدينة حمراء, سياحة مغرب, كوتوبية' },
    'fes-city': { title: 'فاس — عاصمة الثقافة والروح | MoroVerse', description: 'فاس العريقة، عاصمة الثقافة والعلم وأكبر مدينة عتيقة في العالم، مهد الحضارة المغربية.', keywords: 'فاس, فاس البالي, يونيسكو, القرويين, حرف تقليدية' },
    'sahara-morocco-merzouga': { title: 'صحراء مرزوكة — جنة الكثبان الذهبية | MoroVerse', description: 'استكشف سحر كثبان مرزوقة الرملية في الصحراء المغربية الكبرى تحت سماء ملأى بالنجوم.', keywords: 'مرزوقة, الصحراء المغربية, إرق شبي, سياحة صحراوية, نجوم ليل' },
};

// Generate static routes at build time
export async function generateStaticParams() {
    const contentDir = path.join(process.cwd(), 'content');
    if (!fs.existsSync(contentDir)) return [];

    const files = fs.readdirSync(contentDir);
    return files
        .filter(file => file.endsWith('.html'))
        .map(file => ({
            slug: file.replace('.html', '')
        }));
}

// Generate dynamic metadata for each article
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const slug = params.slug;
    const meta = ARTICLE_META[slug];

    const title = meta?.title ?? `${slug.replace(/-/g, ' ')} | MoroVerse`;
    const description = meta?.description ?? `اكتشف ${slug.replace(/-/g, ' ')} في موسوعة MoroVerse الرقمية للتاريخ المغربي.`;
    const imageUrl = `https://moroverse.vercel.app/hero-bg.png`;
    const canonicalUrl = `https://moroverse.vercel.app/posts/${slug}`;

    return {
        title,
        description,
        keywords: meta?.keywords ?? 'تاريخ المغرب, موسوعة مغربية, MoroVerse',
        robots: 'index, follow',
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'MoroVerse — الأرشيف الرقمي المغربي',
            locale: 'ar_MA',
            type: 'article',
            images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
    };
}

// Next 15+ compatible page component
export default async function PostPage(props: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ lang?: string }>
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const slug = params.slug;
    const lang = searchParams.lang === 'en' ? 'en' : 'ar';

    const contentDir = lang === 'en' ? path.join(process.cwd(), 'content', 'en') : path.join(process.cwd(), 'content');
    const filePath = path.join(contentDir, `${slug}.html`);

    let content = lang === 'ar'
        ? '<h1 style="color:#D4AF37;text-align:center;margin:5rem auto;">عذراً، المقال غير موجود</h1>'
        : '<h1 style="color:#D4AF37;text-align:center;margin:5rem auto;">Sorry, article not found</h1>';

    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
    } else if (lang === 'en') {
        // Fallback to Arabic if English not found
        const fallbackPath = path.join(process.cwd(), 'content', `${slug}.html`);
        if (fs.existsSync(fallbackPath)) {
            content = fs.readFileSync(fallbackPath, 'utf8');
        }
    }

    return (
        <main className={`min-h-screen bg-black pb-20 pt-32 relative ${lang === 'ar' ? 'font-arabic' : 'font-sans'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {/* Zellij background texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/az-subtle.png')" }} />

            {/* Back link */}
            <div className="container mx-auto px-4 lg:px-20 mb-6 relative z-10">
                <a href={`/?lang=${lang}`} style={{ color: '#c5a059', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em' }}>
                    {lang === 'ar' ? '← العودة إلى MoroVerse' : '← Back to MoroVerse'}
                </a>
            </div>

            <div className="container mx-auto px-4 lg:px-20 relative z-10">
                <div
                    className="bg-black/95 backdrop-blur-xl rounded-2xl border border-[#c5a059]/40 p-8 md:p-16 shadow-[0_0_50px_rgba(197,160,89,0.15)] text-white/90 prose prose-invert lg:prose-xl max-w-5xl mx-auto"
                    style={{ lineHeight: '1.9' }}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </main>
    );
}
