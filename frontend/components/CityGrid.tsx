"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Wind, Mountain, Sun, Waves, Building2, Home, Landmark, Filter, X, ChevronRight, Info, Globe, Compass, Trees as Tree, Tent, BookOpen, Crown } from 'lucide-react';
import { moroccoRegions, Location, ZoneType, ClimateType } from '../data/morocco-geography';
import { getArticle } from '../data/moroverse-content';
import ArticleReader from './ArticleReader';
import { generateArticleSchema } from '../utils/seo';

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

export default function CityGrid({ lang }: { lang: 'en' | 'ar' }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<ZoneType | 'All'>('All');
    const [selectedLocation, setSelectedLocation] = useState<ExtendedLocation | null>(null);
    const [showFullArticle, setShowFullArticle] = useState(false);
    const [visibleCount, setVisibleCount] = useState(20);

    // Flatten all locations
    const allLocations = useMemo(() => {
        return moroccoRegions.flatMap(region =>
            region.provinces.map(loc => ({ ...loc, regionName: region.name }))
        ) as ExtendedLocation[];
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
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                        <input
                            type="text"
                            placeholder={lang === 'ar' ? 'بحث عن مدينة أو دوار...' : 'Search for a city or douar...'}
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/50 border border-primary/10 focus:border-primary/40 focus:ring-0 outline-none transition-all text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {(['All', 'Major City', 'Medium City', 'Rural Center', 'Douar'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-6 py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${selectedType === type ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30' : 'bg-white/50 border-primary/10 text-foreground/40 hover:border-primary/30 hover:text-foreground'}`}
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
                        className={`px-4 py-2 rounded-xl border text-[9px] font-bold transition-all ${!selectedRegion ? 'bg-primary/10 text-primary border-primary/20' : 'bg-transparent text-foreground/40 border-foreground/5 hover:border-primary/20 hover:text-foreground'}`}
                    >
                        {lang === 'ar' ? 'كل الجهات' : 'All Regions'}
                    </button>
                    {moroccoRegions.map(region => (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegion(region.id)}
                            className={`px-4 py-2 rounded-xl border text-[9px] font-bold transition-all ${selectedRegion === region.id ? 'bg-primary/10 text-primary border-primary/20' : 'bg-transparent text-foreground/40 border-foreground/5 hover:border-primary/20 hover:text-foreground'}`}
                        >
                            {region.name[lang]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredLocations.slice(0, visibleCount).map((loc, idx) => (
                        <motion.div
                            layout
                            key={loc.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx % 10 * 0.05 }}
                            onClick={() => {
                                setSelectedLocation(loc);
                                window.dispatchEvent(new CustomEvent('moroverse-action', {
                                    detail: { type: 'city_click', payload: loc.name.ar }
                                }));
                            }}
                            className="group cursor-pointer relative"
                        >
                            <div className="moro-glass p-6 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full overflow-hidden flex flex-col">
                                {/* Visual Identity Backdrop */}
                                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none transform group-hover:rotate-12 scale-150">
                                    <SoulIcon soul={loc.visualSoul} className="w-48 h-48 text-primary" />
                                </div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="p-3 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors">
                                        <SoulIcon soul={loc.visualSoul} className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-2 py-1 rounded-full">
                                            {loc.type}
                                        </span>
                                        <span className="text-[8px] font-medium text-foreground/30 mt-1 uppercase tracking-widest">
                                            {loc.climate}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-foreground/80 mb-1 group-hover:text-primary transition-colors">
                                        {loc.name[lang]}
                                    </h3>
                                    <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-widest mb-4">
                                        {loc.regionName[lang]}
                                    </p>

                                    <div className="w-8 h-1 bg-primary/20 mb-4 group-hover:w-full transition-all duration-500" />

                                    <p className="text-xs text-foreground/60 leading-relaxed line-clamp-2 italic mb-6">
                                        "{loc.history[lang]}"
                                    </p>
                                </div>

                                <button className="mt-auto flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-all">
                                    {lang === 'ar' ? 'عرض دفتر التعريف' : 'View Fact Sheet'}
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Fact Sheet Modal */}
            <AnimatePresence>
                {selectedLocation && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLocation(null)}
                            className="absolute inset-0 bg-white/40 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl border border-primary/10 overflow-hidden"
                        >
                            {/* Fact Sheet Header */}
                            <div className="relative h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                                    <SoulIcon soul={selectedLocation.visualSoul} className="w-96 h-96 text-primary animate-pulse" />
                                </div>
                                <div className="relative z-10 text-center space-y-4">
                                    <div className="flex justify-center">
                                        {selectedLocation && (
                                            <script
                                                type="application/ld+json"
                                                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(getArticle(selectedLocation.id, selectedLocation.name.ar, 'city'))) }}
                                            />
                                        )}
                                        <div className="p-6 bg-white rounded-full shadow-2xl border border-primary/10">
                                            <SoulIcon soul={selectedLocation.visualSoul} className="w-12 h-12 text-primary" />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black text-foreground">{selectedLocation.name[lang]}</h2>
                                    <div className="flex items-center justify-center gap-4">
                                        <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">{selectedLocation.type}</span>
                                        <span className="px-4 py-1.5 rounded-full bg-slate-100 text-foreground/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <ClimateIcon climate={selectedLocation.climate} className="w-3 h-3" />
                                            {selectedLocation.climate}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedLocation(null)}
                                    className="absolute top-8 right-8 p-3 rounded-2xl bg-white/80 hover:bg-white transition-all text-foreground/40 hover:text-primary z-20 shadow-lg"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Fact Sheet Content */}
                            <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
                                            <Compass className="w-4 h-4" />
                                            {lang === 'ar' ? 'الموقع الجغرافي' : 'GEOGRAPHIC LOCATION'}
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center py-3 border-b border-primary/5">
                                                <span className="text-[11px] font-bold text-foreground/30 uppercase">{lang === 'ar' ? 'الجهة' : 'REGION'}</span>
                                                <span className="text-sm font-bold text-foreground/70">{selectedLocation.regionName[lang]}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-3 border-b border-primary/5">
                                                <span className="text-[11px] font-bold text-foreground/30 uppercase">{lang === 'ar' ? 'الإقليم' : 'PROVINCE'}</span>
                                                <span className="text-sm font-bold text-foreground/70">{selectedLocation.province || (lang === 'ar' ? 'مركزي' : 'Autonomous')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">
                                            <Info className="w-4 h-4" />
                                            {lang === 'ar' ? 'النبذة التاريخية' : 'HISTORICAL BRIEF'}
                                        </h4>
                                        <p className="text-sm text-foreground/60 leading-relaxed font-serif italic">
                                            "{selectedLocation.history[lang]}"
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
                                            {selectedLocation.landmarks[lang].map((landmark, i) => (
                                                <div key={i} className="px-4 py-3 rounded-2xl bg-slate-50 border border-primary/5 flex items-center gap-3 group hover:border-primary/20 transition-all">
                                                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary" />
                                                    <span className="text-[11px] font-bold text-foreground/70">{landmark}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                                        <p className="text-[10px] text-primary/60 font-medium leading-relaxed">
                                            {lang === 'ar'
                                                ? 'هذا المدخل جزء من الأرشيف الرقمي لـ MoroVerse. جميع المعلومات موثقة جغرافياً وتاريخياً لتعزيز الوعي بالهوية الوطنية.'
                                                : 'This entry is part of the MoroVerse digital archive. All information is geographically and historically documented to enhance national identity awareness.'
                                            }
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setShowFullArticle(true)}
                                        className="w-full py-5 rounded-[32px] bg-primary text-white text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        {lang === 'ar' ? 'اقرأ المقال الكامل' : 'READ FULL ARTICLE'}
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
                    article={getArticle(selectedLocation.id, selectedLocation.name.ar, 'city')}
                    isOpen={showFullArticle}
                    onClose={() => setShowFullArticle(false)}
                />
            )}
        </div>
    );
}
