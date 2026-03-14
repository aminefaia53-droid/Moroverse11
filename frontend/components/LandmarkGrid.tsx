"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X, Crown, History, Mountain, Waves, Shield, Compass, Landmark as LandmarkIcon, TowerControl as Tower, ChevronRight } from 'lucide-react';
import generatedContent from '../data/generated-content.json';
import { LangCode } from '../types/language';
import HeritageFactSheet, { HeritageItem } from './HeritageFactSheet';
import ShareButton from './ShareButton';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LandmarkData {
    id: string;
    name: { en: string; ar: string };
    city: { en: string; ar: string };
    foundation?: { en: string; ar: string };
    history?: { en: string; ar: string } | string;
    desc?: { en: string; ar: string } | string;
    visualSoul?: string;
    imageUrl?: string;
    seo?: { slug?: string };
    isPending?: boolean;
}

// ─── Static Data (same pattern as BattleDashboard) ───────────────────────────
const staticLandmarks: LandmarkData[] = [
    {
        id: "rabat-hassan-tower-static",
        name: { en: "Hassan Tower", ar: "صومعة حسان" },
        city: { en: "Rabat", ar: "الرباط" },
        foundation: { en: "1195", ar: "1195" },
        visualSoul: "Tower",
        history: { en: "The unfinished minaret of the Hassan Mosque in Rabat, one of the finest examples of Almohad architecture.", ar: "صومعة مسجد حسان غير المكتمل في الرباط، من أروع نماذج العمارة الموحدية." },
        imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop"
    },
    {
        id: "koutoubia-static",
        name: { en: "Koutoubia Mosque", ar: "مسجد الكتبية" },
        city: { en: "Marrakech", ar: "مراكش" },
        foundation: { en: "1147", ar: "1147" },
        visualSoul: "Mosque",
        history: { en: "The largest mosque in Marrakech, renowned for its stunning minaret.", ar: "أكبر مسجد في مراكش، اشتهر بصومعته المتميزة." },
        imageUrl: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop"
    }
];

// Merge static + dynamic, deduplicate by id
const allLandmarks: LandmarkData[] = [
    ...staticLandmarks,
    ...((generatedContent.landmarks || []) as LandmarkData[])
].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    .map(l => ({
        ...l,
        isPending: false, // FORCE: all unlocked
        foundation: l.foundation || { en: 'Historical', ar: 'تاريخي' },
        history: l.history || l.desc || { en: 'A historic Moroccan landmark.', ar: 'معلمة تاريخية مغربية.' },
        visualSoul: l.visualSoul || 'Mosque',
        imageUrl: l.imageUrl || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop'
    }));

// ─── Soul Icon ────────────────────────────────────────────────────────────────
function SoulIcon({ soul, className }: { soul?: string; className?: string }) {
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
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function LandmarkGrid({ lang }: { lang: LangCode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedHeritageItem, setSelectedHeritageItem] = useState<HeritageItem | null>(null);

    // Click handler — mirrors BattleDashboard exactly
    const handleLandmarkClick = (l: LandmarkData) => {
        const historyObj = typeof l.history === 'object' ? l.history : { en: String(l.history || ''), ar: String(l.history || '') };
        const item: HeritageItem = {
            id: l.id,
            slug: l.seo?.slug || l.id,
            name: l.name,
            city: l.city,
            history: historyObj,
            foundation: l.foundation,
            visualSoul: l.visualSoul,
            imageUrl: l.imageUrl,
            isPending: false, // ALWAYS FALSE
            type: 'landmark'
        };
        setSelectedHeritageItem(item);
    };

    // Unique cities for filter bar
    const cities = useMemo(() => {
        const map = new Map<string, { en: string; ar: string }>();
        allLandmarks.forEach(l => { if (!map.has(l.city.en)) map.set(l.city.en, l.city); });
        return Array.from(map.values()).sort((a, b) => a.en.localeCompare(b.en));
    }, []);

    // Filtered list
    const displayLandmarks = useMemo(() => {
        return allLandmarks.filter(l => {
            const matchesCity = !selectedCity || l.city.en === selectedCity;
            const q = searchQuery.toLowerCase();
            const matchesSearch = !q ||
                l.name.en.toLowerCase().includes(q) ||
                l.name.ar.includes(searchQuery) ||
                l.city.en.toLowerCase().includes(q) ||
                l.city.ar.includes(searchQuery);
            return matchesCity && matchesSearch;
        });
    }, [selectedCity, searchQuery]);

    return (
        <div className="space-y-12">
            {/* Search */}
            <div className="max-w-2xl mx-auto relative group flex items-center">
                <Search className={`absolute ${lang === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors z-10`} />
                <input
                    type="text"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    placeholder={lang === 'ar' ? 'بحث عن معلم أو مدينة...' : 'Search for a landmark or city...'}
                    className={`w-full ${lang === 'ar' ? 'pr-14 pl-12' : 'pl-14 pr-12'} py-5 rounded-[32px] bg-black/40 border border-[#c5a059]/20 focus:border-primary outline-none transition-all text-sm font-medium text-white placeholder-white/30`}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className={`absolute ${lang === 'ar' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full z-10`}>
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                )}
            </div>

            {/* City Filters */}
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => setSelectedCity(null)}
                    className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCity ? 'bg-primary text-white border-primary' : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white'}`}
                >
                    {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {cities.map(city => (
                    <button
                        key={city.en}
                        onClick={() => setSelectedCity(city.en)}
                        className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedCity === city.en ? 'bg-primary text-white border-primary' : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white'}`}
                    >
                        {lang === 'en' ? city.en : city.ar}
                    </button>
                ))}
            </div>

            {/* Cards Grid — same pattern as BattleDashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {displayLandmarks.map((l, idx) => (
                        <motion.div
                            key={l.id}
                            initial={{ opacity: 0, rotateY: 90, z: -100 }}
                            animate={{ opacity: 1, rotateY: 0, z: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.04 }}
                            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                            onClick={() => handleLandmarkClick(l)}
                            className="group relative h-[480px] rounded-xl overflow-hidden glass-card-elite border border-primary/50 hover:border-primary transition-all duration-700 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-[0_0_30px_rgba(197,160,89,0.4)]"
                        >
                            {/* Background image */}
                            <div className="absolute inset-0 z-0 bg-[#0f0a05]">
                                <img
                                    src={l.imageUrl || 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop'}
                                    alt={lang === 'en' ? l.name.en : l.name.ar}
                                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 opacity-40 group-hover:opacity-60"
                                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                            </div>

                            {/* Card Content */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 tracking-widest">
                                                {typeof l.foundation === 'object' ? (lang === 'ar' ? l.foundation.ar : l.foundation.en) : (l.foundation || '—')}
                                            </span>
                                        </div>
                                        <ShareButton
                                            title={lang === 'en' ? l.name.en : l.name.ar}
                                            description={typeof l.history === 'object' ? (lang === 'en' ? l.history.en : l.history.ar) : String(l.history || '')}
                                            imageUrl={l.imageUrl}
                                            id={l.id}
                                        />
                                    </div>
                                    <h4 className="text-3xl font-serif text-primary font-black uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                        {lang === 'ar' ? l.name.ar : l.name.en}
                                    </h4>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <MapPin className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[9px] uppercase font-black tracking-widest">
                                            {lang === 'en' ? l.city.en : l.city.ar}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[14px] text-white/80 leading-relaxed line-clamp-2 italic">
                                        {typeof l.history === 'object'
                                            ? (lang === 'en' ? l.history.en : l.history.ar)
                                            : String(l.history || '')}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <SoulIcon soul={l.visualSoul} className="w-4 h-4 text-primary" />
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                                                {lang === 'ar' ? `افتح أرشيف ${l.name.ar}` : `Open Archive: ${l.name.en}`}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal — rendered at grid level, same as BattleDashboard */}
            <HeritageFactSheet
                item={selectedHeritageItem}
                isOpen={!!selectedHeritageItem}
                onClose={() => setSelectedHeritageItem(null)}
                lang={lang}
            />
        </div>
    );
}
