// This file is auto-populated at build time from generated-content.json
// Do not add manual articles here — use frontend/content/posts/*.md instead

import generatedData from './generated-content.json';

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
    generatedImage?: string;
}

// Load all articles from the build-time generated JSON
export const moroverseArticles: Record<string, MoroArticle> =
    (generatedData as any).articles || {};

/**
 * Get article by ID. Falls back to a minimal stub if not found.
 */
export const getArticle = (
    id: string,
    nameAr: string,
    nameEn: string,
    category: 'battle' | 'landmark' | 'city' | 'figure'
): MoroArticle => {
    const found = moroverseArticles[id];
    if (found) return found as MoroArticle;

    // Minimal stub — shown only if article isn't in the JSON yet
    return {
        id,
        title: { ar: nameAr, en: nameEn },
        category,
        metaDescription: { ar: '', en: '' },
        intro: { ar: 'قيد الإعداد...', en: 'Coming soon...' },
        sections: [],
        faqs: [],
        conclusion: { ar: '', en: '' }
    };
};