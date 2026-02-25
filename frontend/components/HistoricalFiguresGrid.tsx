"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Crown, Shield, Compass, Palette, Sparkles, MapPin, Search, X } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');

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
                    detail: { type: 'figure_click', payload: figure.name[lang] }
                }));
                window.location.href = '/posts/' + figure.id + '?lang=' + lang;
            }}
            className="group cursor-pointer w-full"
        >
            <div className="bg-black/60 backdrop-blur-md hover:bg-black/80 p-8 rounded-[40px] border border-[#c5a059] hover:shadow-[0_0_30px_rgba(197,160,89,0.4)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden h-[420px] flex flex-col justify-between">

                {/* Dynamic HD Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[40px]">
                    {imageUrl && (
                        <div
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-10 group-hover:opacity-30'}`}
                            style={{ backgroundImage: `url(${imageUrl})`, filter: 'grayscale(50%) contrast(120%)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 group-hover:from-black/90 group-hover:via-black/70 to-transparent transition-colors duration-700" />
                        </div>
                    )}
                </div>

                {/* Fallback/Decorative SVG Icon */}
                <div className="absolute -right-6 -top-6 opacity-[0.04] group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-125 group-hover:rotate-12 z-0">
                    <CategoryIcon category={figure.category} className="w-48 h-48 text-white group-hover:text-primary transition-colors duration-700" />
                </div>

                <div className="relative z-10 flex flex-col h-full pointer-events-none">
                    {/* Header Icon & Era */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-sm">
                            <CategoryIcon category={figure.category} className="w-6 h-6 text-white transition-colors duration-500" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-black/40 group-hover:bg-primary/20 backdrop-blur-md border border-white/10 group-hover:border-primary/50 text-[9px] font-bold text-white uppercase tracking-wider max-w-[50%] text-center leading-tight transition-colors">
                            {figure.era[lang]}
                        </div>
                    </div>

                    {/* Name & Specialty */}
                    <div className="mb-4">
                        <h3 className="text-3xl font-black text-[#c5a059] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight transition-colors font-arabic">
                            {figure.name[lang]}
                        </h3>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 group-hover:bg-black/5 backdrop-blur-md text-white group-hover:text-primary text-[10px] font-bold uppercase tracking-widest border border-white/10 transition-colors">
                            <Sparkles className="w-3 h-3" />
                            {figure.specialty[lang]}
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="flex-grow mt-2">
                        <p className="text-[15px] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-relaxed tracking-wide max-h-32 overflow-hidden text-ellipsis line-clamp-4 font-medium transition-colors">
                            {figure.shortBio[lang]}
                        </p>
                    </div>

                    {/* Time Compass CTA */}
                    <div className="mt-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary group-hover:text-primary transition-all relative z-10 pt-4">
                        <div className="w-6 h-6 rounded-full bg-black/40 group-hover:bg-primary border border-white/10 group-hover:border-primary flex items-center justify-center transition-colors">
                            <Compass className="w-3 h-3 text-white transition-all group-hover:animate-pulse" />
                        </div>
                        <span>{lang === 'ar' ? `سافر إلى عالم ${figure.name.ar}` : `Journey back to ${figure.name.en}`}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
