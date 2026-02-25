import { MoroArticle } from '../data/moroverse-content';

export const generateArticleSchema = (article: MoroArticle, lang: 'en' | 'ar' = 'ar') => {
    const baseUrl = "https://moroverse.ma"; // Replace with actual domain
    const url = `${baseUrl}/archive/${article.id}`;

    if (article.category === 'battle') {
        return {
            "@context": "https://schema.org",
            "@type": "HistoricalEvent",
            "name": article.title[lang],
            "description": article.metaDescription[lang],
            "url": url,
            "location": {
                "@type": "Place",
                "name": "المملكة المغربية",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "MA"
                }
            }
        };
    }

    if (article.category === 'landmark') {
        return {
            "@context": "https://schema.org",
            "@type": "LandmarksOrHistoricalBuildings",
            "name": article.title[lang],
            "description": article.metaDescription[lang],
            "url": url,
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "MA"
            }
        };
    }

    return {
        "@context": "https://schema.org",
        "@type": "City",
        "name": article.title[lang],
        "description": article.metaDescription[lang],
        "url": url
    };
};

export const getMetaTags = (article: MoroArticle, lang: 'en' | 'ar' = 'ar') => {
    return {
        title: `${article.title[lang]} | MoroVerse Royal Archive`,
        description: article.metaDescription[lang],
        openGraph: {
            title: article.title[lang],
            description: article.metaDescription[lang],
            type: 'article',
            locale: lang === 'ar' ? 'ar_MA' : 'en_US',
            siteName: 'MoroVerse'
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title[lang],
            description: article.metaDescription[lang]
        }
    };
};
