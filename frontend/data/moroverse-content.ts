export interface ArticleSection {
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

export const moroverseArticles: Record<string, MoroArticle> = {};

export const getArticle = (id: string, nameAr: string, nameEn: string, category: 'battle' | 'landmark' | 'city' | 'figure'): MoroArticle => {
    return moroverseArticles[id] || {
        id,
        title: { ar: nameAr, en: nameEn },
        category,
        metaDescription: { ar: '', en: '' },
        intro: { ar: 'محتوى قيد التطوير...', en: 'Content under development...' },
        sections: [],
        faqs: [],
        conclusion: { ar: '', en: '' }
    };
};