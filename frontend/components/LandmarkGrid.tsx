"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Landmark as LandmarkIcon, Crown, History, Mountain, Waves, Shield, X, Compass, Info, MapPin, ChevronRight, TowerControl as Tower, BookOpen, Search, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import ShareButton from './ShareButton';
import { Landmark } from '../data/morocco-landmarks';
import generatedContent from '../data/generated-content.json';
import { generateArticleSchema, getMetaTags } from '../utils/seo';
import { getArticle } from '../data/moroverse-content';
import { LangCode } from '../types/language';
import TranslatedText from './TranslatedText';

const fallbackLandmarks = [
    {
        id: "hassan-silo",
        name: { en: "Hassan's Silo", ar: "صومعة حسان" },
        city: { en: "Rabat", ar: "الرباط" },
        region: "Rabat-Salé-Kénitra",
        type: "Landmark",
        foundation: { en: "1195", ar: "1195" },
        visualSoul: "Tower",
        history: {
            en: "An incomplete mosque in Rabat, representing the architectural zenith of the Almohad dynasty.",
            ar: "صومعة مسجد غير مكتمل بالرباط، تمثل أوج العمارة الموحدية المغربية وتعتبر رمزاً سيادياً."
        },
        desc: { en: "", ar: "" },
        isPending: false
    },
    {
        id: "koutoubia",
        name: { en: "Koutoubia Mosque", ar: "مسجد الكتبية" },
        city: { en: "Marrakech", ar: "مراكش" },
        region: "Marrakech-Safi",
        type: "Landmark",
        foundation: { en: "1147", ar: "1147" },
        visualSoul: "Mosque",
        history: {
            en: "The largest mosque in Marrakech, renowned for its distinctive minaret and rich Moroccan-Andalusian history.",
            ar: "أكبر مسجد في مراكش، اشتهر بصومعته المتميزة وتاريخه المرابطي والموحدي العريق."
        },
        desc: { en: "", ar: "" },
        isPending: false
    },
    {
        id: "volubilis",
        name: { en: "Volubilis", ar: "وليلي" },
        city: { en: "Meknes", ar: "مكناس" },
        region: "Fès-Meknès",
        type: "Landmark",
        foundation: { en: "3rd century BC", ar: "القرن 3 قبل الميلاد" },
        visualSoul: "Ruin",
        history: {
            en: "A partly excavated Berber-Roman city near Meknes, showcasing Morocco's ancient history.",
            ar: "مدينة تاريخية وجزء من التراث العالمي، تعكس عراقة الحضارة المغربية منذ العصور المورية القديمة."
        },
        desc: { en: "", ar: "" },
        isPending: false
    }
];

const rawLandmarks = (generatedContent.landmarks && generatedContent.landmarks.length > 0) ? (generatedContent.landmarks as any[]) : fallbackLandmarks;
const dynamicLandmarks: Landmark[] = rawLandmarks.map(l => ({
    ...l,
    isPending: false, // FORCE-UNLOCK: Never display lock icons
    foundation: l.foundation || { en: 'Historical', ar: 'تاريخي' },
    history: l.history || l.desc || { en: 'A historic Moroccan landmark.', ar: 'معلمة تاريخية مغربية.' },
    visualSoul: l.visualSoul || 'Mosque',
    imageUrl: l.imageUrl || 'https://images.unsplash.com/photo-1549733059-d81615d862e?q=80&w=1080&auto=format&fit=crop'
})) as Landmark[];

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

import HeritageFactSheet, { HeritageItem } from './HeritageFactSheet';

export default function LandmarkGrid({ lang }: { lang: LangCode }) {
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHeritageItem, setSelectedHeritageItem] = useState<HeritageItem | null>(null);

    const handleLandmarkClick = (l: Landmark) => {
        const item: HeritageItem = {
            id: l.id,
            name: l.name,
            city: l.city,
            history: l.history,
            imageUrl: l.imageUrl || undefined,
            type: 'landmark'
        };
        setSelectedHeritageItem(item);
    };

    const cities = useMemo(() => {
        const allCities = dynamicLandmarks.map(l => l.city);
        const unique = Array.from(new Set(allCities.map(c => c.en))).map(en => allCities.find(c => c.en === en)!);
        return unique.sort((a, b) => {
            const valA = lang === 'en' ? a.en : a.ar;
            const valB = lang === 'en' ? b.en : b.ar;
            return valA.localeCompare(valB);
        });
    }, [lang]);

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
                    className={`w-full ${lang === 'ar' ? 'pr-14 pl-12' : 'pl-14 pr-12'} py-5 rounded-[32px] bg-black/40 border border-[#c5a059]/20 focus:border-primary focus:bg-black/60 focus:ring-0 outline-none transition-all text-sm font-medium text-white placeholder-white/30 backdrop-blur-sm`}
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
                        {lang === 'en' ? city.en : city.ar}
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
                            onClick={() => handleLandmarkClick(landmark)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            <HeritageFactSheet
                item={selectedHeritageItem}
                isOpen={!!selectedHeritageItem}
                onClose={() => setSelectedHeritageItem(null)}
                lang={lang}
            />
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
    lang: LangCode;
    onClick: (landmark: Landmark) => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, rotateY: 90, z: -100 }}
            whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            onClick={() => {
                console.log("Card Clicked:", landmark.id);
                onClick(landmark);
                window.dispatchEvent(new CustomEvent('moroverse-action', {
                    detail: { type: 'landmark_click', payload: lang === 'en' ? landmark.name.en : landmark.name.ar }
                }));
            }}
            className="group cursor-pointer relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full weather-card-fx z-10"
        >
            <div className="relative h-full w-full rounded-xl border-2 border-[#c5a059]/20 hover:border-[#c5a059]/80 transition-all duration-700 overflow-hidden shadow-2xl glass-card-elite group-hover:shadow-[0_20px_60px_rgba(197,160,89,0.25)] pointer-events-auto">

                {/* Bulletproof Background Image using img tag for correct object-fit/-position */}
                <img
                    src={landmark.imageUrl || 'https://images.unsplash.com/photo-1549733059-d81615d862e?q=80&w=1080&auto=format&fit=crop'}
                    alt={lang === 'en' ? landmark.name.en : landmark.name.ar}
                    className="absolute inset-0 z-[1] w-full h-full object-cover object-center transition-transform duration-300 ease-out"
                    style={{ filter: 'sepia(0.2) contrast(1.1) brightness(0.85) saturate(1.2)' }}
                />
                {/* Cinematic gradient overlay */}
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-40" />

                {/* Top Document Bar */}
                <div className="absolute top-0 inset-x-0 z-20 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-[#c5a059]/60" />
                        <span className="text-[8px] font-black text-[#c5a059]/60 uppercase tracking-[0.3em]">Royal Archive Unit-7v</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShareButton
                            id={landmark.id}
                            title={landmark.name.ar}
                            description={typeof landmark.history === 'object' ? landmark.history.ar : ''}
                            imageUrl={(landmark as any).imageUrl}
                            slug={(landmark as any).seo?.slug}
                            size="sm"
                        />
                        <div className="w-6 h-6 border-t border-r border-[#c5a059]/40" />
                    </div>
                </div>

                {/* Card Content Overlay (High Glassmorphism) */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10 flex flex-col justify-end bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent pt-32 translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ maskImage: 'linear-gradient(to top, black 40%, transparent)' }} />

                    <div className="relative z-20">
                        <div className="flex justify-between items-end mb-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl font-arabic leading-tight">
                                        <TranslatedText arabicText={landmark.name.ar} />
                                    </h3>
                                    {landmark.isPending && (
                                        <div className="p-1 rounded-md bg-primary/10 border border-primary/20">
                                            <Lock className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-[#c5a059]">
                                    <MapPin className="w-4 h-4 opacity-70" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
                                        <TranslatedText arabicText={landmark.city.ar} />
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 rounded-3xl bg-black/40 backdrop-blur-2xl border border-[#c5a059]/40 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                                <LandmarkSoulIcon soul={landmark.visualSoul} className="w-8 h-8 text-[#c5a059]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0">
                            {!landmark.isPending && landmark.foundation && (
                                <div className="flex items-center gap-4 py-3 border-y border-white/5">
                                    <div className="p-2 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20">
                                        <History className="w-4 h-4 text-[#c5a059]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">{lang === 'ar' ? 'عصر التأسيس' : 'FOUNDATION'}</span>
                                        <span className="text-xs font-bold text-white/90">
                                            <TranslatedText arabicText={landmark.foundation.ar} />
                                        </span>
                                    </div>
                                </div>
                            )}

                            <p className="text-base text-white/70 leading-relaxed italic font-medium font-arabic line-clamp-2">
                                {landmark.isPending
                                    ? (lang === 'ar' ? 'لا يزال هذا السجل يخضع لعملية التوثيق والتدقيق الملكي لضمان الدقة الكاملة.' : 'This record is currently undergoing royal documentation to ensure absolute accuracy.')
                                    : <TranslatedText arabicText={landmark.history.ar} />
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Indicator */}
                <div className="absolute bottom-6 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 transform translate-x-4 group-hover:translate-x-0">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-full ${landmark.isPending ? 'bg-primary/10 text-[#c5a059] border border-[#c5a059]/40' : 'bg-primary text-white shadow-[0_10px_30px_rgba(139,0,0,0.4)]'} text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-transform`}>
                        {landmark.isPending ? <Shield className="w-5 h-5 animate-pulse" /> : <Compass className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />}
                        <span>{landmark.isPending ? (lang === 'ar' ? 'فحص البطاقة' : 'Inspect ID Card') : (lang === 'ar' ? 'فتح الأرشيف' : 'Open Archive')}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
