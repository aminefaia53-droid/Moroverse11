import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Metadata } from 'next';
import { LangCode, SUPPORTED_LANGUAGES } from '../../../types/language';

// Generate static routes at build time - reads BOTH .md from posts/ AND .html from content/
export async function generateStaticParams() {
    const params: { slug: string }[] = [];

    // 1. .md files from content/posts/
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    if (fs.existsSync(postsDir)) {
        const mdFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
        mdFiles.forEach(file => params.push({ slug: file.replace('.md', '') }));
    }

    // 2. .html files from content/ (legacy)
    const contentDir = path.join(process.cwd(), 'content');
    if (fs.existsSync(contentDir)) {
        const htmlFiles = fs.readdirSync(contentDir).filter(f => f.endsWith('.html'));
        htmlFiles.forEach(file => {
            const slug = file.replace('.html', '');
            if (!params.find(p => p.slug === slug)) params.push({ slug });
        });
    }

    return params;
}

// Generate metadata
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const slug = params.slug;

    // Try to get title from .md frontmatter
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const mdPath = path.join(postsDir, `${slug}.md`);
    let title = `${slug.replace(/-/g, ' ')} | MoroVerse`;
    let description = `اكتشف ${slug.replace(/-/g, ' ')} في موسوعة MoroVerse الرقمية للتاريخ المغربي.`;
    let imageUrl = `https://moroverse.vercel.app/hero-bg.png`;

    if (fs.existsSync(mdPath)) {
        const raw = fs.readFileSync(mdPath, 'utf8');
        const { data } = matter(raw);
        if (data.title) title = `${data.title} | MoroVerse`;
        if (data.description) description = data.description;
        if (data.image) imageUrl = data.image;
    }

    const canonicalUrl = `https://moroverse.vercel.app/posts/${slug}`;

    return {
        title,
        description,
        keywords: 'تاريخ المغرب, موسوعة مغربية, MoroVerse',
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

// Main page component
export default async function PostPage(props: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ lang?: string }>
}) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const slug = params.slug;
    const rawLang = searchParams.lang;
    const lang = (SUPPORTED_LANGUAGES.find(l => l.code === rawLang)?.code as LangCode) || 'ar';

    let content = '<h1 style="color:#D4AF37;text-align:center;margin:5rem auto;">عذراً، المقال غير موجود</h1>';
    let articleTitle = '';
    let articleImage = '';
    let articleCity = '';

    // === Priority 1: .md file from content/posts/ ===
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    const mdPath = path.join(postsDir, `${slug}.md`);

    if (fs.existsSync(mdPath)) {
        const raw = fs.readFileSync(mdPath, 'utf8');
        const { data, content: mdContent } = matter(raw);
        articleTitle = data.title || '';
        articleImage = data.image || '';
        articleCity = data.city || '';
        content = await marked(mdContent);
    } else {
        // === Priority 2: Legacy .html file from content/ ===
        const contentDir = lang === 'en'
            ? path.join(process.cwd(), 'content', 'en')
            : path.join(process.cwd(), 'content');
        const htmlPath = path.join(contentDir, `${slug}.html`);

        if (fs.existsSync(htmlPath)) {
            content = fs.readFileSync(htmlPath, 'utf8');
        } else if (lang === 'en') {
            const fallbackPath = path.join(process.cwd(), 'content', `${slug}.html`);
            if (fs.existsSync(fallbackPath)) {
                content = fs.readFileSync(fallbackPath, 'utf8');
            }
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

            {/* Hero image from frontmatter */}
            {articleImage && (
                <div className="container mx-auto px-4 lg:px-20 mb-8 relative z-10">
                    <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden border border-[#c5a059]/30">
                        <img
                            src={articleImage}
                            alt={articleTitle || slug}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        {(articleTitle || articleCity) && (
                            <div className="absolute bottom-6 right-6 text-right">
                                {articleTitle && <h1 className="text-2xl md:text-4xl font-black text-[#c5a059] drop-shadow-lg">{articleTitle}</h1>}
                                {articleCity && <p className="text-white/70 text-sm font-bold uppercase tracking-widest mt-1">{articleCity}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}

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
