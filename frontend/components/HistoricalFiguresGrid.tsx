"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Crown, Shield, Compass, Palette, Sparkles, MapPin, Search, X } from 'lucide-react';
import { HistoricalFigure, moroccoFigures } from '../data/morocco-figures';
import { useAutoImageFetcher } from '../hooks/useAutoImageFetcher';
import { getArticle } from '../data/moroverse-content';
import ArticleReader from './ArticleReader';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);
    const [showFullArticle, setShowFullArticle] = useState(false);

    const categories = useMemo(() => {
        const cats = new Set(moroccoFigures.map(f => f.category));
        return Array.from(cats);
    }, []);

    const filteredFigures = useMemo(() => {
        return moroccoFigures.filter(f => {
            const matchesCategory = !selectedCategory || f.category === selectedCategory;
            const matchesSearch =
                f.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.name.ar.includes(searchQuery) ||
                f.specialty.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                f.specialty.ar.includes(searchQuery);
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

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
        <div className="space-y-12">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative group flex items-center">
                <Search className={`absolute ${lang === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors z-10`} />
                <input
                    type="text"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    placeholder={lang === 'ar' ? 'بحث عن شخصية أو عبقري تاريخي...' : 'Search for a figure or historical genius...'}
                    className={`w-full ${lang === 'ar' ? 'pr-14 pl-12' : 'pl-14 pr-12'} py-5 rounded-[32px] bg-black/40 border border-[#c5a059]/20 focus:border-primary focus:bg-black/60 focus:ring-0 outline-none transition-all text-sm font-medium text-white placeholder-white/30 backdrop-blur-xl`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className={`absolute ${lang === 'ar' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors z-10`}
                    >
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCategory
                        ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(197,160,89,0.4)]'
                        : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white hover:bg-black/60'
                        }`}
                >
                    {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedCategory === cat
                            ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(197,160,89,0.4)]'
                            : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white hover:bg-black/60'
                            }`}
                    >
                        <CategoryIcon category={cat} className="w-3 h-3" />
                        {getCategoryLabel(cat, lang)}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6 px-2">
                <AnimatePresence mode='popLayout'>
                    {filteredFigures.map((figure, idx) => (
                        <FigureCard
                            key={figure.id}
                            figure={figure}
                            idx={idx}
                            lang={lang}
                            onClick={(f) => {
                                setSelectedFigure(f);
                                setShowFullArticle(true);
                            }}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* FULL ARTICLE READER */}
            {selectedFigure && (
                <ArticleReader
                    article={getArticle(selectedFigure.id, selectedFigure.name.ar, selectedFigure.name.en, 'figure')}
                    isOpen={showFullArticle}
                    onClose={() => setShowFullArticle(false)}
                />
            )}
        </div>
    );
}

function FigureCard({
    figure,
    idx,
    lang,
    onClick
}: {
    figure: HistoricalFigure;
    idx: number;
    lang: 'en' | 'ar';
    onClick: (figure: HistoricalFigure) => void;
}) {
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
                    detail: { type: 'figure_click', payload: figure.name[lang] }
                }));
                onClick(figure);
            }}
            className="group cursor-pointer relative aspect-[3/4] w-full"
        >
            <div className="relative h-full w-full rounded-xl border-2 border-[#c5a059]/20 hover:border-[#c5a059]/80 transition-all duration-700 overflow-hidden shadow-2xl glass-card-elite group-hover:shadow-[0_20px_60px_rgba(197,160,89,0.25)]">

                {/* Cinematic Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={figure.imageUrl || imageUrl || undefined}
                        alt={figure.name[lang]}
                        className={`w-full h-full object-cover transition-all duration-1000 transform group-hover:scale-110 ${isLoading ? 'opacity-0' : 'opacity-90 group-hover:opacity-100'}`}
                    />
                    {/* Multi-layered Cinematic Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-95" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-40" />
                </div>

                {/* Card Content Overlay */}
                <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-4 rounded-full bg-black/60 backdrop-blur-xl border border-[#c5a059]/30 group-hover:border-[#c5a059] transition-all duration-500">
                            <CategoryIcon category={figure.category} className="w-8 h-8 text-[#c5a059]" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a059]/40 text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em]">
                                {figure.era[lang]}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-4xl font-black text-[#c5a059] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-arabic leading-tight transform group-hover:translate-x-2 transition-transform duration-500">
                            {figure.name[lang]}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white group-hover:text-primary text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-colors">
                            <Sparkles className="w-3 h-3 text-[#c5a059]" />
                            {figure.specialty[lang]}
                        </div>
                        <p className="text-sm text-white/80 line-clamp-2 italic font-medium opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 mt-4 max-w-[90%]">
                            {figure.shortBio[lang]}
                        </p>
                    </div>
                </div>

                {/* Interactive Indicator */}
                <div className="absolute bottom-6 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#c5a059] text-black text-[10px] font-black uppercase tracking-widest shadow-xl">
                        <Compass className="w-4 h-4 animate-spin-slow" />
                        <span>{lang === 'ar' ? 'سيرة ذاتية' : 'Read Memoir'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
