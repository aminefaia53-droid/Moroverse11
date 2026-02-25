import fs from 'fs';
import path from 'path';

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

// Next 15+ compatible page component
export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug;

    const filePath = path.join(process.cwd(), 'content', `${slug}.html`);

    let content = '<h1 class="text-3xl text-center text-red-500 mt-20">عذراً، المقال غير موجود</h1>';
    if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
    }

    return (
        <main className="min-h-screen bg-moro-dark bg-[url('/bg-pattern.svg')] bg-repeat bg-center pb-20 pt-32">
            <div className="container mx-auto px-4 lg:px-20">
                <div
                    className="bg-black/40 backdrop-blur-md rounded-2xl border border-moro-gold/30 p-8 shadow-2xl"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </main>
    );
}
