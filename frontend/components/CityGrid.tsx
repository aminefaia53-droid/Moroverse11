"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Wind, Mountain, Sun, Waves, Building2, Home, Landmark, Filter, X, ChevronRight, Info, Globe, Compass, Trees as Tree, Tent, BookOpen, Crown } from 'lucide-react';
import { moroccoRegions, Location, ZoneType, ClimateType } from '../data/morocco-geography';
import { getArticle } from '../data/moroverse-content';
import { useLanguage } from '../context/LanguageContext';
import { LangCode } from '../types/language';
import TranslatedText from './TranslatedText';
import { generateArticleSchema } from '../utils/seo';
import generatedContent from '../data/generated-content.json';
import ArticleReader from './ArticleReader';
const dynamicCities = generatedContent.cities;

const SoulIcon = ({ soul, className }: { soul: string; className?: string }) => {
    switch (soul) {
        case 'Medina': return <Building2 className={className} />;
        case 'Kasbah': return <Landmark className={className} />;
        case 'Modern': return <Building2 className={className} />;
        case 'Modern-Coastal': return <Waves className={className} />;
        case 'Oasis': return <Tree className={className} />;
        case 'Mountain-Village': return <Mountain className={className} />;
        case 'Tent': return <Tent className={className} />;
        default: return <MapPin className={className} />;
    }
};

const ClimateIcon = ({ climate, className }: { climate: ClimateType; className?: string }) => {
    switch (climate) {
        case 'Coastal': return <Waves className={className} />;
        case 'Mountain': return <Mountain className={className} />;
        case 'Saharan': return <Sun className={className} />;
        case 'Continental': return <Wind className={className} />;
        case 'Mediterranean': return <Sun className={className} />;
        default: return <Globe className={className} />;
    }
};

interface ExtendedLocation extends Location {
    regionName: { en: string; ar: string };
}

export default function CityGrid({ lang }: { lang: LangCode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<ZoneType | 'All'>('All');
    const [selectedLocation, setSelectedLocation] = useState<ExtendedLocation | null>(null);
    const [showFullArticle, setShowFullArticle] = useState(false);
    const [visibleCount, setVisibleCount] = useState(20);

    // Flatten all locations
    const allLocations = useMemo(() => {
        const regionsLocations = moroccoRegions.flatMap(region =>
            region.provinces.map(loc => ({ ...loc, regionName: region.name }))
        ) as ExtendedLocation[];

        // Merge dynamic cities that match the type interface loosely
        const dynamicLocations = dynamicCities.map((c: any) => ({
            ...c,
            regionName: c.regionName || { en: 'Generated', ar: 'مُضاف' },
            province: 'Generated',
            regionId: 'all' // Generic fallback for new dynamic cities without strictly mapped regionIds
        })) as ExtendedLocation[];

        return [...regionsLocations, ...dynamicLocations];
    }, []);

    // Filter logic
    const filteredLocations = useMemo(() => {
        return allLocations.filter(loc => {
            const matchesSearch =
                loc.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                loc.name.ar.includes(searchQuery);
            const matchesRegion = !selectedRegion || (loc as any).regionId === selectedRegion || moroccoRegions.find(r => r.id === selectedRegion)?.provinces.some(p => p.id === loc.id);
            const matchesType = selectedType === 'All' || loc.type === selectedType;
            return matchesSearch && matchesRegion && matchesType;
        });
    }, [allLocations, searchQuery, selectedRegion, selectedType]);

    // Lazy loading more items on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                setVisibleCount(prev => Math.min(prev + 20, filteredLocations.length));
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [filteredLocations.length]);

    return (
        <div className="space-y-12">
            {/* Control Bar */}
            <div className="moro-glass p-8 rounded-3xl border border-primary/10 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Search */}
                    <div className="relative flex-grow group flex items-center">
                        <Search className={`absolute ${lang === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors z-10`} />
                        <input
                            type="text"
                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                            placeholder={lang === 'ar' ? 'بحث عن مدينة أو دوار...' : 'Search for a city or douar...'}
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

                    {/* Type Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {(['All', 'Major City', 'Medium City', 'Rural Center', 'Douar'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${selectedType === type ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'bg-black/30 border-white/5 text-white/50 hover:bg-black/60 hover:border-white/20 hover:text-white'}`}
                            >
                                {type === 'All' ? (lang === 'ar' ? 'الكل' : 'All') : (lang === 'ar' ? (type === 'Major City' ? 'مدينة كبرى' : type === 'Medium City' ? 'مدينة متوسطة' : type === 'Rural Center' ? 'مركز قروي' : 'دوار') : type)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Region Filter */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedRegion(null)}
                        className={`px-4 py-2 rounded-xl border text-[9px] font-bold transition-all ${!selectedRegion ? 'bg-primary/20 text-primary border-primary/50' : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white hover:bg-black/60'}`}
                    >
                        {lang === 'ar' ? 'كل الجهات' : 'All Regions'}
                    </button>
                    {moroccoRegions.map(region => (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegion(region.id)}
                            className={`px-4 py-2 rounded-xl border text-[9px] font-bold transition-all ${selectedRegion === region.id ? 'bg-primary/20 text-primary border-primary/50' : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white hover:bg-black/60'}`}
                        >
                            {lang === 'en' ? region.name.en : region.name.ar}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-6 px-2">
                <AnimatePresence mode='popLayout'>
                    {filteredLocations.slice(0, visibleCount).map((loc, idx) => (
                        <CityCard
                            key={loc.id}
                            loc={loc}
                            idx={idx}
                            lang={lang}
                            onClick={setSelectedLocation}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Fact Sheet Modal */}
            <AnimatePresence>
                {selectedLocation && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 pb-6 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLocation(null)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-xl cursor-pointer"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl bg-black/95 rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(197,160,89,0.15)] border border-[#c5a059]/30 overflow-y-auto max-h-[90vh]"
                        >
                            {/* Fact Sheet Header */}
                            <div className="relative h-80 bg-black/50 border-b border-[#c5a059]/30 flex flex-col items-center justify-start overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
                                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                                    <SoulIcon soul={selectedLocation.visualSoul} className="w-96 h-96 text-primary animate-pulse" />
                                </div>
                                <div className="relative z-10 text-center space-y-4 pt-16">
                                    <div className="flex justify-center">
                                        {selectedLocation && (
                                            <script
                                                type="application/ld+json"
                                                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(getArticle(selectedLocation.id, selectedLocation.name.ar, selectedLocation.name.en, 'city'), lang)) }}
                                            />
                                        )}
                                        <div className="p-6 bg-black rounded-full shadow-[0_0_30px_rgba(197,160,89,0.3)] border border-[#c5a059]">
                                            <SoulIcon soul={selectedLocation.visualSoul} className="w-12 h-12 text-[#c5a059]" />
                                        </div>
                                    </div>
                                    <h2 className="text-5xl font-black text-[#c5a059] font-arabic drop-shadow-md">
                                        <TranslatedText arabicText={selectedLocation?.name?.ar || ''} />
                                    </h2>
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="px-4 py-1.5 rounded-full bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/50 text-[10px] font-black uppercase tracking-widest">{selectedLocation?.type}</span>
                                        <span className="px-4 py-1.5 rounded-full bg-black/40 text-white/80 border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <ClimateIcon climate={selectedLocation?.climate as any} className="w-3 h-3 text-[#c5a059]" />
                                            {selectedLocation?.climate}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLocation(null)}
                                    className="absolute top-6 left-6 z-30 p-3 rounded-2xl bg-black/80 border-2 border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all shadow-[0_0_20px_rgba(197,160,89,0.4)] flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                                >
                                    <X className="w-5 h-5" />
                                    <span className="hidden md:inline">{lang === 'ar' ? 'إغلاق' : 'Close'}</span>
                                </button>
                            </div>

                            {/* Fact Sheet Content */}
                            <div className="p-12 pb-32 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059] mb-4">
                                            <Compass className="w-4 h-4" />
                                            {lang === 'ar' ? 'الموقع الجغرافي' : 'GEOGRAPHIC LOCATION'}
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-3 border-b border-[#c5a059]/10">
                                                <span className="text-[11px] font-bold text-white/50 uppercase">{lang === 'ar' ? 'الجهة' : 'REGION'}</span>
                                                <span className="text-sm font-bold text-white">{lang === 'en' ? (selectedLocation?.regionName?.en || '') : (selectedLocation?.regionName?.ar || '')}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-[#c5a059]/10">
                                                <span className="text-[11px] font-bold text-white/50 uppercase">{lang === 'ar' ? 'الإقليم' : 'PROVINCE'}</span>
                                                <span className="text-sm font-bold text-white">{selectedLocation?.province || (lang === 'ar' ? 'مركزي' : 'Autonomous')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#c5a059] mb-4">
                                            <Info className="w-4 h-4" />
                                            {lang === 'ar' ? 'النبذة التاريخية' : 'HISTORICAL BRIEF'}
                                        </h4>
                                        <p className="text-lg text-white/90 leading-relaxed tracking-wide font-serif italic text-justify">
                                            <TranslatedText arabicText={selectedLocation?.history?.ar || ''} />
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
                                            <Landmark className="w-4 h-4" />
                                            {lang === 'ar' ? 'أهم المعالم' : 'TOP LANDMARKS'}
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {((selectedLocation.landmarks as any)[lang] || (selectedLocation.landmarks as any)['ar']) ? ((selectedLocation.landmarks as any)[lang] || (selectedLocation.landmarks as any)['ar']).map((landmark: string, i: number) => (
                                                <div key={i} className="px-4 py-3 rounded-2xl bg-black/60 border border-[#c5a059]/30 flex items-center gap-3 group hover:border-primary/60 transition-all">
                                                    <div className="w-2 h-2 rounded-full bg-[#c5a059]/60 group-hover:bg-primary" />
                                                    <span className="text-[11px] font-bold text-white/80">{landmark}</span>
                                                </div>
                                            )) : (
                                                <TranslatedText arabicText={selectedLocation.landmarks.ar.join(', ')} className="text-white/80 text-sm" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                        <p className="text-[10px] text-primary/60 font-medium leading-relaxed tracking-wide">
                                            {lang === 'ar'
                                                ? 'هذا المدخل جزء من الأرشيف الرقمي لـ MoroVerse. جميع المعلومات موثقة جغرافياً وتاريخياً لتعزيز الوعي بالهوية الوطنية.'
                                                : 'This entry is part of the MoroVerse digital archive. All information is geographically and historically documented to enhance national identity awareness.'
                                            }
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setShowFullArticle(true)}
                                        className="w-full py-5 rounded-[28px] bg-gradient-to-r from-[#8b0000] to-[#500000] text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(139,0,0,0.4)] hover:shadow-[0_0_30px_rgba(197,160,89,0.7)] hover:from-[#c5a059] hover:to-[#a08030] transition-all duration-500 border border-white/10"
                                    >
                                        <Compass className="w-5 h-5 animate-pulse" />
                                        {lang === 'ar' ? `سافر إلى عالم ${selectedLocation.name.ar}` : `Journey to ${selectedLocation.name.en}`}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* FULL ARTICLE READER */}
            {selectedLocation && (
                <ArticleReader
                    article={getArticle(selectedLocation.id, selectedLocation.name.ar, selectedLocation.name.en, 'city')}
                    isOpen={showFullArticle}
                    onClose={() => setShowFullArticle(false)}
                />
            )}
        </div>
    );
}

function CityCard({
    loc,
    idx,
    lang,
    onClick
}: {
    loc: ExtendedLocation;
    idx: number;
    lang: LangCode;
    onClick: (loc: ExtendedLocation) => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, rotateX: -90, z: -100 }}
            animate={{ opacity: 1, rotateX: 0, z: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx % 10 * 0.1 }}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px', transformOrigin: "top center" }}
            onClick={() => {
                onClick(loc);
                window.dispatchEvent(new CustomEvent('moroverse-action', {
                    detail: { type: 'city_click', payload: lang === 'en' ? loc.name.en : loc.name.ar }
                }));
            }}
            className="group cursor-pointer relative aspect-video md:aspect-square lg:aspect-video w-full weather-card-fx"
        >
            <div className="relative h-full w-full rounded-xl border-2 border-[#c5a059]/20 hover:border-[#c5a059]/80 transition-all duration-700 overflow-hidden shadow-2xl glass-card-elite group-hover:shadow-[0_20px_60px_rgba(197,160,89,0.25)]">

                {/* Image Background */}
                <div className="absolute inset-0 z-0 bg-black">
                    <img
                        src={`/images/${loc.id}.jpg`}
                        alt={lang === 'en' ? loc.name.en : loc.name.ar}
                        className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-60`}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    {/* Zellij Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.15]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />

                    {/* Multi-layered Cinematic Gradient based on Climate/Region */}
                    <div className={`absolute inset-0 bg-gradient-to-t opacity-90 transition-opacity duration-700 ${loc.climate === 'Coastal' || loc.climate === 'Mediterranean' ? 'from-[#0b1f38] via-black/60 to-transparent' :
                        loc.climate === 'Saharan' ? 'from-[#4a1c0d] via-black/60 to-transparent' :
                            'from-[#2a0808] via-black/60 to-transparent'
                        }`} />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />
                </div>

                {/* Card Content Overlay */}
                <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-4 rounded-full bg-black/60 backdrop-blur-xl border border-[#c5a059]/30 group-hover:border-[#c5a059] transition-all duration-500">
                            <SoulIcon soul={loc.visualSoul} className="w-6 h-6 text-[#c5a059]" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a059]/40 text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em]">
                                {loc.type}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-4xl font-black text-[#c5a059] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-arabic leading-tight transform group-hover:translate-x-2 transition-transform duration-500">
                            <TranslatedText arabicText={loc.name.ar} />
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="h-[2px] w-8 bg-[#c5a059] group-hover:w-16 transition-all duration-500" />
                            <span className="text-xs font-bold text-white/90 uppercase tracking-widest drop-shadow-md">
                                {lang === 'en' ? loc.regionName.en : loc.regionName.ar}
                            </span>
                        </div>
                        <p className="text-sm text-white/80 line-clamp-1 italic font-medium opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 mt-4 max-w-[90%] font-arabic">
                            <TranslatedText arabicText={loc.history.ar} />
                        </p>
                    </div>
                </div>

                {/* Interactive Indicator */}
                <div className="absolute bottom-6 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                    <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#c5a059] text-black text-[10px] font-black uppercase tracking-widest shadow-xl">
                        <Compass className="w-4 h-4 animate-spin-slow" />
                        <span>{lang === 'ar' ? 'رحلة تاريخية' : 'Begin Journey'}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
