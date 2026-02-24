import { Metadata } from 'next';
import { getArticle, moroverseArticles } from '../../../data/moroverse-content';
import { getMetaTags, generateArticleSchema } from '../../../utils/seo';
import ArticleReaderPage from './ArticleReaderPage';

interface Props {
    params: { slug: string };
}

export async function generateStaticParams() {
    return Object.keys(moroverseArticles).map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const article = getArticle(params.slug, params.slug, 'battle'); // Fallback logic in getArticle
    const meta = getMetaTags(article);

    return {
        title: meta.title,
        description: meta.description,
        openGraph: meta.openGraph,
        twitter: meta.twitter,
    };
}

export default function Page({ params }: Props) {
    const article = getArticle(params.slug, params.slug, 'battle');
    const schema = generateArticleSchema(article);

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
