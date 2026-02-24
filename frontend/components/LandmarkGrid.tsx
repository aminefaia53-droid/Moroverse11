"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Landmark as LandmarkIcon, Crown, History, Mountain, Waves, Shield, X, Compass, Info, MapPin, ChevronRight, TowerControl as Tower, BookOpen } from 'lucide-react';
import { Landmark, moroccoLandmarks } from '../data/morocco-landmarks';
import { useAutoImageFetcher } from '../hooks/useAutoImageFetcher';
import { getArticle } from '../data/moroverse-content';
import ArticleReader from './ArticleReader';
import { generateArticleSchema } from '../utils/seo';

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
    const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
    const [showFullArticle, setShowFullArticle] = useState(false);

    const cities = useMemo(() => {
        const allCities = moroccoLandmarks.map(l => l.city);
        const unique = Array.from(new Set(allCities.map(c => c.en))).map(en => allCities.find(c => c.en === en)!);
        return unique;
    }, []);

    const filteredLandmarks = useMemo(() => {
        if (!selectedCity) return moroccoLandmarks;
        return moroccoLandmarks.filter(l => l.city.en === selectedCity);
    }, [selectedCity]);

    return (
        <div className="space-y-16">
            {/* Mini Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => setSelectedCity(null)}
                    className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCity ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white/50 border-primary/10 text-foreground/40 hover:border-primary/30'}`}
                >
                    {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {cities.map(city => (
                    <button
                        key={city.en}
                        onClick={() => setSelectedCity(city.en)}
                        className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedCity === city.en ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white/50 border-primary/10 text-foreground/40 hover:border-primary/30'}`}
                    >
                        {city[lang]}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                            className="absolute inset-0 bg-white/60 backdrop-blur-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-4xl bg-white rounded-[50px] shadow-2xl border border-primary/10 overflow-hidden"
                        >
                            {/* Header Visual */}
                            <div className="h-64 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 flex items-center justify-center animate-pulse">
                                    <LandmarkSoulIcon soul={selectedLandmark.visualSoul} className="w-[500px] h-[500px] text-primary" />
                                </div>
                                <div className="relative z-10 text-center">
                                    {selectedLandmark && (
                                        <script
                                            type="application/ld+json"
                                            dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(getArticle(selectedLandmark.id, selectedLandmark.name.ar, 'landmark'))) }}
                                        />
                                    )}
                                    <div className="inline-block p-6 rounded-full bg-white shadow-xl border border-primary/10 mb-6">
                                        <LandmarkSoulIcon soul={selectedLandmark.visualSoul} className="w-12 h-12 text-primary" />
                                    </div>
                                    <h2 className="text-4xl font-black text-foreground">{selectedLandmark.name[lang]}</h2>
                                    <p className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mt-2">{selectedLandmark.city[lang]}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedLandmark(null)}
                                    className="absolute top-10 right-10 p-3 rounded-2xl bg-white/80 hover:bg-white transition-all text-foreground/40 hover:text-primary z-20 shadow-lg"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Data Content */}
                            <div className="p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-6">
                                            <Compass className="w-4 h-4" />
                                            {lang === 'ar' ? 'التوثيق الزمني' : 'TEMPORAL DOCUMENTATION'}
                                        </h4>
                                        <div className="p-6 rounded-3xl bg-slate-50 border border-primary/5 space-y-4">
                                            <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                                                <span className="text-[11px] font-bold text-foreground/30 uppercase">{lang === 'ar' ? 'تاريخ التأسيس' : 'FOUNDED'}</span>
                                                <span className="text-sm font-black text-foreground/70">{selectedLandmark.foundation[lang]}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-[11px] font-bold text-foreground/30 uppercase">{lang === 'ar' ? 'نمط العمارة' : 'STYLE'}</span>
                                                <span className="text-sm font-black text-foreground/70">{selectedLandmark.visualSoul}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-6">
                                            <Info className="w-4 h-4" />
                                            {lang === 'ar' ? 'النبذة المعمارية والسيادية' : 'ARCHITECTURAL BRIEF'}
                                        </h4>
                                        <p className="text-lg text-foreground/60 leading-relaxed tracking-wide font-serif italic text-justify">
                                            "{selectedLandmark.history[lang]}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/10 relative overflow-hidden">
                                        <LandmarkIcon className="absolute -left-10 -top-10 w-40 h-40 text-primary opacity-[0.03]" />
                                        <p className="text-[11px] text-primary/60 font-medium leading-relaxed tracking-wide relative z-10 italic">
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
                                        className="w-full py-5 rounded-[32px] bg-primary text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 hover:shadow-[0_0_20px_rgba(197,160,89,0.8)] transition-all mt-8"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        {lang === 'ar' ? 'اقرأ السجل التاريخي الكامل' : 'READ FULL HISTORICAL RECORD'}
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
                    article={getArticle(selectedLandmark.id, selectedLandmark.name.ar, 'landmark')}
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
    const { imageUrl, isLoading } = useAutoImageFetcher({
        query: landmark.name.en,
        preloadedImageUrl: landmark.imageUrl
    });

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
                    detail: { type: 'landmark_click', payload: landmark.name.ar }
                }));
            }}
            className="group cursor-pointer snap-center min-w-[85vw] md:min-w-0 flex-shrink-0"
        >
            <div className="moro-glass p-8 rounded-[40px] border border-primary/5 hover:border-primary/30 transition-all duration-700 hover:shadow-2xl relative overflow-hidden bg-white/40 h-80 flex flex-col justify-between">

                {/* Dynamic HD Background Image */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[40px]">
                    {imageUrl && (
                        <div
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-[0.15] group-hover:opacity-30'}`}
                            style={{ backgroundImage: `url(${imageUrl})`, filter: 'grayscale(30%) contrast(110%)' }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
                        </div>
                    )}
                </div>

                {/* 3D-ish Icon Background Fallback */}
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 transform group-hover:-translate-y-4 group-hover:scale-110 z-0">
                    <LandmarkSoulIcon soul={landmark.visualSoul} className="w-64 h-64 text-primary" />
                </div>

                <div className="relative z-10 flex flex-col pointer-events-none">
                    <div className="w-16 h-16 rounded-3xl bg-white/50 backdrop-blur-md border border-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-all duration-500 shadow-sm">
                        <LandmarkSoulIcon soul={landmark.visualSoul} className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground/80 mb-2 drop-shadow-sm">{landmark.name[lang]}</h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/5 w-fit mt-1">
                        <MapPin className="w-3 h-3" />
                        {landmark.city[lang]}
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary transition-all">
                    <div className="w-6 h-6 rounded-full bg-white/50 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                        <ChevronRight className="w-3 h-3 text-primary group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <span>{lang === 'ar' ? 'عرض السجل التاريخي' : 'View Historical Record'}</span>
                </div>
            </div>
        </motion.div>
    );
}
