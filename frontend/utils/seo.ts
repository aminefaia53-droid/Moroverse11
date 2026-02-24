import { MoroArticle } from '../data/moroverse-content';

export const generateArticleSchema = (article: MoroArticle) => {
    const baseUrl = "https://moroverse.ma"; // Replace with actual domain
    const url = `${baseUrl}/archive/${article.id}`;

    if (article.category === 'battle') {
        return {
            "@context": "https://schema.org",
            "@type": "HistoricalEvent",
            "name": article.title,
            "description": article.metaDescription,
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
            "name": article.title,
            "description": article.metaDescription,
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
        "name": article.title,
        "description": article.metaDescription,
        "url": url
    };
};

export const getMetaTags = (article: MoroArticle) => {
    return {
        title: `${article.title} | MoroVerse Royal Archive`,
        description: article.metaDescription,
        openGraph: {
            title: article.title,
            description: article.metaDescription,
            type: 'article',
            locale: 'ar_MA',
            siteName: 'MoroVerse'
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.metaDescription
        }
    };
};
