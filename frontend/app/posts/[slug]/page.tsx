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
        <main className="min-h-screen bg-slate-950 pb-20 pt-32 relative">
            {/* Dark royal background texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />

            <div className="container mx-auto px-4 lg:px-20 relative z-10">
                <div
                    className="bg-black/95 backdrop-blur-xl rounded-2xl border border-[#c5a059]/40 p-10 md:p-16 shadow-[0_0_50px_rgba(197,160,89,0.15)] text-white/90 prose prose-invert lg:prose-xl max-w-5xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </main>
    );
}
