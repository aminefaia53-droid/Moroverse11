"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Landmark as LandmarkIcon, Crown, History, Mountain, Waves, Shield, X, Compass, Info, MapPin, ChevronRight, TowerControl as Tower, BookOpen, Search } from 'lucide-react';
import { Landmark } from '../data/morocco-landmarks';
import generatedContent from '../data/generated-content.json';
import { getArticle } from '../data/moroverse-content';
import ArticleReader from './ArticleReader';
import { generateArticleSchema } from '../utils/seo';

const dynamicLandmarks: Landmark[] = generatedContent.landmarks as Landmark[];

const LandmarkSoulIcon = ({ soul, className }: { soul: Landmark['visualSoul']; className?: string }) => {
    switch (soul) {
        case 'Mosque': return <LandmarkIcon className={className} />;
        case 'Tower': return <Tower className={className} />;
        case 'Palace': return <Crown className={className} />;
        case 'Ruin': return <History className={className} />;
        case 'Cave': return <Mountain className={className} />;
        case 'Lighthouse': return <Waves className={className} />;
        case 'Fortress': return <Shield className={className} />;
        default: return <LandmarkIcon className={className} />;
    }
};

export default function LandmarkGrid({ lang }: { lang: 'en' | 'ar' }) {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
    const [showFullArticle, setShowFullArticle] = useState(false);

    const cities = useMemo(() => {
        const allCities = dynamicLandmarks.map(l => l.city);
        const unique = Array.from(new Set(allCities.map(c => c.en))).map(en => allCities.find(c => c.en === en)!);
        return unique;
    }, []);

    const filteredLandmarks = useMemo(() => {
        return dynamicLandmarks.filter(l => {
            const matchesCity = !selectedCity || l.city.en === selectedCity;
            const matchesSearch =
                l.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.name.ar.includes(searchQuery) ||
                l.city.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.city.ar.includes(searchQuery);
            return matchesCity && matchesSearch;
        });
    }, [selectedCity, searchQuery]);

    return (
        <div className="space-y-12">
            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto relative group flex items-center`}>
                <Search className={`absolute ${lang === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors z-10`} />
                <input
                    type="text"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    placeholder={lang === 'ar' ? 'بحث عن معلم أو مدينة تاريخية...' : 'Search for a landmark or historic city...'}
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

            {/* Mini Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => setSelectedCity(null)}
                    className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCity ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white hover:bg-black/60'}`}
                >
                    {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {cities.map(city => (
                    <button
                        key={city.en}
                        onClick={() => setSelectedCity(city.en)}
                        className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedCity === city.en ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white hover:bg-black/60'}`}
                    >
                        {city[lang]}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2">
                <AnimatePresence mode='popLayout'>
                    {filteredLandmarks.map((landmark, idx) => (
                        <LandmarkCard
                            key={landmark.id}
                            landmark={landmark}
                            idx={idx}
                            lang={lang}
                            onClick={setSelectedLandmark}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Landmark Fact Sheet Modal */}
            <AnimatePresence>
                {selectedLandmark && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLandmark(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-4xl bg-black/90 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(197,160,89,0.15)] border border-[#c5a059]/30 overflow-hidden"
                        >
                            {/* Header Visual */}
                            <div className="h-80 bg-black/50 border-b border-[#c5a059]/30 flex flex-col items-center justify-start relative overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
                                <div className="absolute inset-0 opacity-10 flex items-center justify-center animate-pulse">
                                    <LandmarkSoulIcon soul={selectedLandmark.visualSoul} className="w-[500px] h-[500px] text-primary" />
                                </div>
                                <div className="relative z-10 text-center pt-16">
                                    {selectedLandmark && (
                                        <script
                                            type="application/ld+json"
                                            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(getArticle(selectedLandmark.id, selectedLandmark.name.ar, selectedLandmark.name.en, 'landmark'), lang)) }}
                                        />
                                    )}
                                    <div className="inline-block p-6 rounded-full bg-black shadow-[0_0_30px_rgba(197,160,89,0.3)] border border-[#c5a059] mb-6">
                                        <LandmarkSoulIcon soul={selectedLandmark.visualSoul} className="w-12 h-12 text-[#c5a059]" />
                                    </div>
                                    <h2 className="text-5xl font-black text-[#c5a059] font-arabic drop-shadow-md">{selectedLandmark.name[lang]}</h2>
                                    <p className="text-[11px] font-black text-white/80 uppercase tracking-[0.3em] mt-2">{selectedLandmark.city[lang]}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedLandmark(null)}
                                    className="absolute top-6 left-6 z-30 p-3 rounded-2xl bg-black/80 border-2 border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all shadow-[0_0_20px_rgba(197,160,89,0.4)] flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                                >
                                    <X className="w-5 h-5" />
                                    <span className="hidden md:inline">{lang === 'ar' ? 'إغلاق' : 'Close'}</span>
                                </button>
                            </div>

                            {/* Data Content */}
                            <div className="p-12 md:p-16 pb-32 grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-6">
                                            <Compass className="w-4 h-4" />
                                            {lang === 'ar' ? 'التوثيق الزمني' : 'TEMPORAL DOCUMENTATION'}
                                        </h4>
                                        <div className="p-6 rounded-3xl bg-black/40 border border-[#c5a059]/20 space-y-4">
                                            <div className="flex justify-between items-center pb-4 border-b border-[#c5a059]/10">
                                                <span className="text-[11px] font-bold text-white/50 uppercase">{lang === 'ar' ? 'تاريخ التأسيس' : 'FOUNDED'}</span>
                                                <span className="text-sm font-black text-white">{selectedLandmark.foundation[lang]}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-[11px] font-bold text-white/50 uppercase">{lang === 'ar' ? 'نمط العمارة' : 'STYLE'}</span>
                                                <span className="text-sm font-black text-white">{selectedLandmark.visualSoul}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059] mb-6">
                                            <Info className="w-4 h-4" />
                                            {lang === 'ar' ? 'النبذة المعمارية والسيادية' : 'ARCHITECTURAL BRIEF'}
                                        </h4>
                                        <p className="text-lg text-white/90 leading-relaxed tracking-wide font-serif italic text-justify">
                                            "{selectedLandmark.history[lang]}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <div className="p-10 rounded-[40px] bg-black/40 border border-[#c5a059]/20 relative overflow-hidden">
                                        <LandmarkIcon className="absolute -left-10 -top-10 w-40 h-40 text-[#c5a059] opacity-[0.05]" />
                                        <p className="text-[11px] text-[#c5a059] font-medium leading-relaxed tracking-wide relative z-10 italic">
                                            {lang === 'ar'
                                                ? 'تُعد هذه المعلمة جزءاً أصيلاً من الذاكرة الجماعية المغربية. يوثق مشروع MoroVerse إبداع الصانع المغربي وعظمة الدول التي تعاقبت على حكم المملكة، لتبقى منارة للأجيال القادمة.'
                                                : 'This landmark is an integral part of Moroccan collective memory. The MoroVerse project documents the creativity of Moroccan artisans and the grandeur of the dynasties that ruled the Kingdom.'
                                            }
                                        </p>
                                        <div className="mt-8 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                                <Crown className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Royal Archive verified</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowFullArticle(true)}
                                        className="w-full py-5 rounded-[32px] bg-primary text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(139,0,0,0.3)] hover:scale-105 hover:shadow-[0_0_20px_rgba(197,160,89,0.8)] transition-all mt-8 group"
                                    >
                                        <Compass className="w-5 h-5 animate-pulse" />
                                        {lang === 'ar' ? `سافر إلى عالم ${selectedLandmark.name.ar}` : `Journey back to ${selectedLandmark.name.en}`}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FULL ARTICLE READER */}
            {selectedLandmark && (
                <ArticleReader
                    article={getArticle(selectedLandmark.id, selectedLandmark.name.ar, selectedLandmark.name.en, 'landmark')}
                    isOpen={showFullArticle}
                    onClose={() => setShowFullArticle(false)}
                />
            )}
        </div>
    );
}

function LandmarkCard({
    landmark,
    idx,
    lang,
    onClick
}: {
    landmark: Landmark;
    idx: number;
    lang: 'en' | 'ar';
    onClick: (landmark: Landmark) => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            onClick={() => {
                onClick(landmark);
                window.dispatchEvent(new CustomEvent('moroverse-action', {
                    detail: { type: 'landmark_click', payload: landmark.name[lang] }
                }));
            }}
            className="group cursor-pointer relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full"
        >
            <div className="relative h-full w-full rounded-xl border-2 border-[#c5a059]/20 hover:border-[#c5a059]/80 transition-all duration-700 overflow-hidden shadow-2xl glass-card-elite group-hover:shadow-[0_20px_60px_rgba(197,160,89,0.25)]">

                {/* Cinematic Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={`/images/${landmark.id}.jpg`}
                        alt={landmark.name[lang]}
                        className={`w-full h-full object-cover transition-all duration-1000 transform group-hover:scale-110 opacity-90 group-hover:opacity-100`}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    {/* Multi-layered Cinematic Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-40" />
                </div>

                {/* Card Content Overlay */}
                <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-4 rounded-full bg-black/60 backdrop-blur-xl border border-[#c5a059]/30 group-hover:border-[#c5a059] transition-all duration-500">
                            <LandmarkSoulIcon soul={landmark.visualSoul} className="w-8 h-8 text-[#c5a059]" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a059]/40 text-[#c5a059] text-[10px] font-black uppercase tracking-[0.2em]">
                                {landmark.visualSoul}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-4xl font-black text-[#c5a059] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-arabic leading-tight transform group-hover:translate-x-2 transition-transform duration-500">
                            {landmark.name[lang]}
                        </h3>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-[#c5a059]" />
                            <span className="text-xs font-bold text-white/90 uppercase tracking-widest drop-shadow-md">
                                {landmark.city[lang]}
                            </span>
                        </div>
                        <p className="text-sm text-white/80 line-clamp-2 italic font-medium opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 mt-4 max-w-[90%]">
                            "{landmark.history[lang]}"
                        </p>
                    </div>
                </div>

                {/* Interactive Indicator */}
                <div className="absolute bottom-6 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#c5a059] text-black text-[10px] font-black uppercase tracking-widest shadow-xl">
                        <Compass className="w-4 h-4 animate-spin-slow" />
                        <span>{lang === 'ar' ? 'رحلة تاريخية' : 'Visit Landmark'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
