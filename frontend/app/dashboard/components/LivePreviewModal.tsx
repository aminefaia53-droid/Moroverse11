'use client';

import { useEffect, useState } from 'react';
import { X, Globe } from 'lucide-react';
import { marked } from 'marked';

interface LivePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    titleEn: string;
    titleAr: string;
    descEn: string;
    descAr: string;
    imageUrl: string;
    category: string;
    cityEn?: string;
    cityAr?: string;
}

export default function LivePreviewModal({
    isOpen, onClose, titleEn, titleAr, descEn, descAr, imageUrl, category, cityEn, cityAr
}: LivePreviewModalProps) {
    const [htmlEn, setHtmlEn] = useState('');
    const [htmlAr, setHtmlAr] = useState('');
    const [lang, setLang] = useState<'en' | 'ar'>('en');

    useEffect(() => {
        if (!isOpen) return;
        Promise.resolve(marked(descEn || '*No English description yet.*')).then(r => setHtmlEn(r as string));
        Promise.resolve(marked(descAr || '*لا توجد ترجمة عربية بعد.*')).then(r => setHtmlAr(r as string));
    }, [isOpen, descEn, descAr]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col font-outfit overflow-auto" dir="ltr">
            {/* Preview header */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#0a192f] border-b border-[#c5a059]/30 shrink-0">
                <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gold-royal" />
                    <span className="text-white font-bold font-cinzel">Live Preview</span>
                    <span className="text-xs text-gray-500 border border-gray-700 rounded px-2 py-0.5">moroverse11.vercel.app</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Language toggle */}
                    <div className="flex bg-[#112240] rounded-lg p-1 border border-[#c5a059]/20">
                        <button onClick={() => setLang('en')} className={`px-4 py-1 rounded-md text-xs font-bold transition-colors ${lang === 'en' ? 'bg-gold-royal text-white' : 'text-gray-400 hover:text-white'}`}>EN</button>
                        <button onClick={() => setLang('ar')} className={`px-4 py-1 rounded-md text-xs font-bold transition-colors ${lang === 'ar' ? 'bg-gold-royal text-white' : 'text-gray-400 hover:text-white'}`}>AR</button>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Fake browser address bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-[#112240] border-b border-[#c5a059]/10 shrink-0">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 bg-[#0a192f] rounded-md px-3 py-1 text-xs text-gray-400 border border-[#c5a059]/10">
                    moroverse11.vercel.app/{category}/{titleEn.toLowerCase().replace(/\s+/g, '-')}
                </div>
            </div>

            {/* Article content */}
            <div className="flex-1 overflow-y-auto bg-[#050d1a]">
                <article className={`max-w-4xl mx-auto py-12 px-6 md:px-10 ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {/* Hero Image */}
                    {imageUrl && (
                        <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8 relative shadow-2xl">
                            <img src={imageUrl} alt={titleEn} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050d1a] via-transparent to-transparent" />
                        </div>
                    )}

                    {/* Category badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-gold-royal border border-gold-royal/50 rounded-full px-3 py-1">{category}</span>
                        {(cityEn || cityAr) && (
                            <span className="text-xs text-gray-500">{lang === 'ar' ? cityAr : cityEn}</span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white leading-tight mb-8">
                        {lang === 'ar' ? titleAr : titleEn}
                    </h1>

                    {/* Divider */}
                    <div className="h-0.5 w-24 bg-gold-royal rounded mb-8" />

                    {/* Article body */}
                    <div
                        className="prose prose-invert prose-stone max-w-none
                            prose-headings:font-cinzel prose-headings:text-gold-royal
                            prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-lg
                            prose-a:text-blue-400 prose-blockquote:border-l-gold-royal
                            prose-blockquote:text-gray-400 prose-code:text-gold-royal
                            prose-strong:text-white prose-hr:border-[#c5a059]/20"
                        dangerouslySetInnerHTML={{ __html: lang === 'ar' ? htmlAr : htmlEn }}
                    />
                </article>
            </div>
        </div>
    );
}
