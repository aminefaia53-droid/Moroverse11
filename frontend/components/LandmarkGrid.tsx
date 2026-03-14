"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X, Crown, History, Mountain, Waves, Shield, Compass, Landmark as LandmarkIcon, TowerControl as Tower, ChevronRight, Loader2 } from 'lucide-react';
import { LangCode } from '../types/language';
import HeritageFactSheet, { HeritageItem } from './HeritageFactSheet';
import { SocialService } from '../services/SocialService';
import { Post } from '../types/social';

// ─── Soul Icon Helper ─────────────────────────────────────────────────────────
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

export default function LandmarkGrid({ lang }: { lang: LangCode }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedHeritageItem, setSelectedHeritageItem] = useState<HeritageItem | null>(null);
    const [landmarks, setLandmarks] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLandmarks() {
            setLoading(true);
            try {
                const data = await SocialService.getPostsByCategory('monument');
                setLandmarks(data);
            } catch (error) {
                console.error('FAILED_TO_FETCH_LANDMARKS:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchLandmarks();
    }, []);

    const handleLandmarkClick = (l: Post) => {
        const item: HeritageItem = {
            id: l.id,
            slug: (l as any).slug || l.id,
            name: { ar: l.location_name || '', en: l.location_name || '' },
            city: { ar: l.location_name || '', en: l.location_name || '' },
            history: l.content || '',
            imageUrl: l.image_url || undefined,
            model_url: l.model_url || undefined,
            type: 'landmark',
            visualSoul: l.location_type === 'monument' ? 'Tower' : 'Compass'
        };
        setSelectedHeritageItem(item);
    };

    const cities = useMemo(() => {
        const unique = new Set(landmarks.map(l => l.location_name).filter(Boolean));
        return Array.from(unique).sort() as string[];
    }, [landmarks]);

    const filtered = useMemo(() => {
        return landmarks.filter(l => {
            const matchesSearch = (l.location_name || '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = !selectedCity || l.location_name === selectedCity;
            return matchesSearch && matchesCity;
        });
    }, [landmarks, searchQuery, selectedCity]);

    const isRTL = lang === 'ar';

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-12 h-12 text-[#c5a059] animate-spin" />
                <p className="text-[#c5a059] font-black uppercase tracking-[0.3em] text-xs">
                    {isRTL ? 'جاري استحضار المعالم السيادية...' : 'Summoning Sovereign Landmarks...'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Header / Search / Filter */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="relative w-full max-w-md">
                    <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-[#c5a059]/40`} />
                    <input
                        type="text"
                        placeholder={isRTL ? 'ابحث عن معلم تاريخي...' : 'Search for a landmark...'}
                        className={`w-full ${isRTL ? 'pr-12' : 'pl-12'} py-4 bg-black/40 border border-[#c5a059]/20 rounded-2xl focus:border-[#c5a059] outline-none transition-all text-sm`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                        onClick={() => setSelectedCity(null)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCity ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-white/40 border border-white/10 hover:border-[#c5a059]/30'}`}
                    >
                        {isRTL ? 'كل المدن' : 'All Cities'}
                    </button>
                    {cities.map(city => (
                        <button
                            key={city}
                            onClick={() => setSelectedCity(city)}
                            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCity === city ? 'bg-[#c5a059] text-black' : 'bg-white/5 text-white/40 border border-white/10 hover:border-[#c5a059]/30'}`}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filtered.map((l, idx) => (
                        <motion.div
                            key={l.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleLandmarkClick(l)}
                            className="group relative h-[450px] rounded-3xl overflow-hidden border border-[#c5a059]/20 hover:border-[#c5a059] transition-all bg-black cursor-pointer shadow-2xl"
                        >
                            <img
                                src={l.image_url || 'https://images.unsplash.com/photo-1549733059-d81615d862e?q=80&w=1080&auto=format&fit=crop'}
                                alt={l.location_name || ''}
                                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 rounded-2xl bg-black/60 border border-[#c5a059]/30 text-[#c5a059]">
                                        <SoulIcon soul={l.location_type === 'monument' ? 'Tower' : 'Compass'} className="w-6 h-6" />
                                    </div>
                                    {l.model_url && (
                                        <div className="px-3 py-1 rounded-full bg-[#c5a059] text-black text-[9px] font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(197,160,89,0.5)]">
                                            Elite 3D Available
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-3xl font-black text-white leading-tight font-arabic">
                                            {l.location_name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[#c5a059] mt-2 group-hover:translate-x-1 transition-transform">
                                            <MapPin className="w-3 h-3" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{l.location_name}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/70 line-clamp-2 italic font-arabic">
                                        {l.content}
                                    </p>
                                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">Discover Heritage</span>
                                        <ChevronRight className="w-4 h-4 text-[#c5a059] group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
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
