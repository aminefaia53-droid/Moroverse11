import { MoroArticle } from '../data/moroverse-content';

type SeoLang = 'ar' | 'en';

const getSafeLabel = (obj: { en: string; ar: string }, lang: string): string => {
    return lang === 'en' ? obj.en : obj.ar;
};

export const generateArticleSchema = (article: MoroArticle, lang: string = 'ar') => {
    const baseUrl = "https://moroverse.ma";
    const url = `${baseUrl}/archive/${article.id}`;
    const name = getSafeLabel(article.title, lang);
    const description = getSafeLabel(article.metaDescription, lang);

    if (article.category === 'battle') {
        return {
            "@context": "https://schema.org",
            "@type": "HistoricalEvent",
            "name": name,
            "description": description,
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
            "name": name,
            "description": description,
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
        "name": name,
        "description": description,
        "url": url
    };
};

export const getMetaTags = (article: MoroArticle, lang: string = 'ar') => {
    const name = getSafeLabel(article.title, lang);
    const description = getSafeLabel(article.metaDescription, lang);

    return {
        title: `${name} | MoroVerse Royal Archive`,
        description: description,
        openGraph: {
            title: name,
            description: description,
            type: 'article',
            locale: lang === 'ar' ? 'ar_MA' : 'en_US',
            siteName: 'MoroVerse'
        },
        twitter: {
            card: 'summary_large_image',
            title: name,
            description: description
        }
    };
};
