"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Crown, Shield, Compass, Palette, Sparkles, MapPin } from 'lucide-react';
import { HistoricalFigure, moroccoFigures } from '../data/morocco-figures';
import { useAutoImageFetcher } from '../hooks/useAutoImageFetcher';

const CategoryIcon = ({ category, className }: { category: HistoricalFigure['category']; className?: string }) => {
    switch (category) {
        case 'Science': return <BookOpen className={className} />;
        case 'Politics': return <Crown className={className} />;
        case 'Resistance': return <Shield className={className} />;
        case 'Exploration': return <Compass className={className} />;
        case 'Arts': return <Palette className={className} />;
        default: return <Sparkles className={className} />;
    }
};

export default function HistoricalFiguresGrid({ lang }: { lang: 'en' | 'ar' }) {
    const [selectedCategory, setSelectedCategory] = useState<HistoricalFigure['category'] | null>(null);

    const categories = useMemo(() => {
        const cats = new Set(moroccoFigures.map(f => f.category));
        return Array.from(cats);
    }, []);

    const filteredFigures = useMemo(() => {
        if (!selectedCategory) return moroccoFigures;
        return moroccoFigures.filter(f => f.category === selectedCategory);
    }, [selectedCategory]);

    const getCategoryLabel = (cat: HistoricalFigure['category'], lang: 'en' | 'ar') => {
        const labels = {
            'Science': { en: 'Science', ar: 'العلوم' },
            'Politics': { en: 'Politics', ar: 'السياسة' },
            'Resistance': { en: 'Resistance', ar: 'المقاومة' },
            'Exploration': { en: 'Exploration', ar: 'الاستكشاف' },
            'Arts': { en: 'Arts', ar: 'الفنون' }
        };
        return labels[cat][lang];
    };

    return (
        <div className="space-y-16">
            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCategory
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : 'bg-white/50 border-primary/10 text-foreground/40 hover:border-primary/30'
                        }`}
                >
                    {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedCategory === cat
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                            : 'bg-white/50 border-primary/10 text-foreground/40 hover:border-primary/30'
                            }`}
                    >
                        <CategoryIcon category={cat} className="w-3 h-3" />
                        {getCategoryLabel(cat, lang)}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredFigures.map((figure, idx) => (
                        <FigureCard key={figure.id} figure={figure} idx={idx} lang={lang} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

function FigureCard({ figure, idx, lang }: { figure: HistoricalFigure; idx: number; lang: 'en' | 'ar' }) {
    const { imageUrl, isLoading } = useAutoImageFetcher({
        query: figure.name.en, // Use English name for better Wiki API results generally, but fallback is handled in hook
        preloadedImageUrl: figure.imageUrl
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            onClick={() => {
                window.dispatchEvent(new CustomEvent('moroverse-action', {
                    detail: { type: 'figure_click', payload: figure.name.ar }
                }));
            }}
            className="group cursor-pointer snap-center min-w-[85vw] md:min-w-0 flex-shrink-0"
        >
            <div className="moro-glass p-8 rounded-[40px] border border-primary/10 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden bg-white/60 h-[420px] flex flex-col justify-between">

                {/* Dynamic HD Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[40px]">
                    {imageUrl && (
                        <div
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-10 group-hover:opacity-20'}`}
                            style={{ backgroundImage: `url(${imageUrl})`, filter: 'grayscale(50%) contrast(120%)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                        </div>
                    )}
                </div>

                {/* Fallback/Decorative SVG Icon */}
                <div className="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-125 group-hover:rotate-12 z-0">
                    <CategoryIcon category={figure.category} className="w-48 h-48 text-primary" />
                </div>

                <div className="relative z-10 flex flex-col h-full pointer-events-none">
                    {/* Header Icon & Era */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/50 backdrop-blur-md border border-primary/10 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-sm">
                            <CategoryIcon category={figure.category} className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-500" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-[9px] font-bold text-slate-500 uppercase tracking-wider max-w-[50%] text-center leading-tight">
                            {figure.era[lang]}
                        </div>
                    </div>

                    {/* Name & Specialty */}
                    <div className="mb-4">
                        <h3 className="text-2xl font-black text-foreground/80 mb-2 leading-tight drop-shadow-sm">
                            {figure.name[lang]}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                            <Sparkles className="w-3 h-3" />
                            {figure.specialty[lang]}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="flex-grow mt-2">
                        <p className="text-sm text-foreground/80 leading-relaxed tracking-wide max-h-32 overflow-hidden text-ellipsis line-clamp-4 font-medium">
                            {figure.shortBio[lang]}
                        </p>
                    </div>

                    {/* Decorative bottom line */}
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                </div>
            </div>
        </motion.div>
    );
}
