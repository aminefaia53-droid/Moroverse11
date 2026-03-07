import { Metadata } from 'next';
import { getArticle, moroverseArticles } from '../../../data/moroverse-content';
import { getMetaTags, generateArticleSchema } from '../../../utils/seo';
import ArticleReaderPage from './ArticleReaderPage';
import { LangCode, SUPPORTED_LANGUAGES } from '../../../types/language';

interface Props {
    params: { slug: string };
    searchParams: { lang?: string };
}

export async function generateStaticParams() {
    return Object.keys(moroverseArticles).map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const rawLang = searchParams.lang;
    const lang = (SUPPORTED_LANGUAGES.find(l => l.code === rawLang)?.code as LangCode) || 'ar';
    const article = getArticle(params.slug, params.slug, params.slug, 'battle');
    const meta = getMetaTags(article, lang);

    return {
        title: meta.title,
        description: meta.description,
        openGraph: meta.openGraph,
        twitter: meta.twitter,
    };
}

export default function Page({ params, searchParams }: Props) {
    const rawLang = searchParams.lang;
    const lang = (SUPPORTED_LANGUAGES.find(l => l.code === rawLang)?.code as LangCode) || 'ar';
    const article = getArticle(params.slug, params.slug, params.slug, 'battle');
    const schema = generateArticleSchema(article, lang);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <ArticleReaderPage article={article} />
        </>
    );
}
