"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Calendar, Shield, MapPin, Users, Target, Info, Quote, Activity, ChevronRight, X, Layers, BookOpen, Crown, Search, Compass, Loader2 } from 'lucide-react';
import HeritageFactSheet, { HeritageItem } from './HeritageFactSheet';
import ShareButton from './ShareButton';
import { LangCode } from '../types/language';
import { SocialService } from '../services/SocialService';
import { Post } from '../types/social';

interface Battle {
    id: string;
    slug?: string;
    year: string;
    date?: string;
    location: { en: string; ar: string };
    dynasty: string;
    era: string;
    name: { en: string; ar: string };
    desc: { en: string; ar: string };
    combatants: { en: string; ar: string };
    leaders: { en: string; ar: string };
    outcome: { en: string; ar: string };
    tactics: { en: string; ar: string };
    impact: { en: string; ar: string };
    imageUrl?: string;
}

const eras = [
    { id: 'All', en: 'All Eras', ar: 'كل العصور' },
    { id: 'Ancient', en: 'Ancient Resistance', ar: 'العصور القديمة' },
    { id: 'Islamic', en: 'Islamic Era', ar: 'العصور الإسلامية' },
    { id: 'Imperial', en: 'The Great Empires', ar: 'الإمبراطوريات الكبرى' },
    { id: 'Modern', en: 'Modern Resistance', ar: 'المقاومة الحديثة' },
    { id: 'Territorial', en: 'Territorial Integrity', ar: 'الوحدة الترابية' }
];

export default function BattleDashboard({ lang }: { lang: LangCode }) {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedHeritageItem, setSelectedHeritageItem] = useState<HeritageItem | null>(null);
    const [battles, setBattles] = useState<Battle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBattles() {
            setLoading(true);
            try {
                const posts = await SocialService.getPostsByCategory('battle');
                const mappedBattles: Battle[] = posts.map(p => ({
                    id: p.id,
                    slug: (p as any).slug || p.id,
                    year: (p as any).year || 'TBD',
                    location: { en: p.location_name || '', ar: p.location_name || '' },
                    dynasty: (p as any).dynasty || 'Moroccan Sovereign',
                    era: (p as any).era || 'Imperial',
                    name: { en: p.location_name || '', ar: p.location_name || '' },
                    desc: { en: p.content || '', ar: p.content || '' },
                    combatants: { en: (p as any).combatants || '', ar: (p as any).combatants || '' },
                    leaders: { en: (p as any).leaders || '', ar: (p as any).leaders || '' },
                    outcome: { en: (p as any).outcome || '', ar: (p as any).outcome || '' },
                    tactics: { en: (p as any).tactics || '', ar: (p as any).tactics || '' },
                    impact: { en: (p as any).impact || '', ar: (p as any).impact || '' },
                    imageUrl: p.image_url || undefined
                }));
                setBattles(mappedBattles);
            } catch (err) {
                console.error('BATTLE_FETCH_FAILED:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchBattles();
    }, []);

    const handleBattleClick = (b: Battle) => {
        const item: HeritageItem = {
            id: b.id,
            slug: b.slug,
            name: b.name,
            city: b.location,
            history: b.desc,
            imageUrl: b.imageUrl,
            type: 'battle',
            stats: {
                year: b.year,
                era: b.era,
                combatants: b.combatants,
                leaders: b.leaders,
                outcome: b.outcome,
                tactics: b.tactics,
                impact: b.impact
            }
        };
        setSelectedHeritageItem(item);
    };

    const displayBattles = useMemo(() => {
        return battles.filter(b => {
            const matchesFilter = filter === 'All' || b.era.includes(filter);
            const matchesSearch =
                b.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.name.ar.includes(searchQuery) ||
                b.location.en.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [battles, filter, searchQuery]);

    const isRTL = lang === 'ar';

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">
                    {isRTL ? 'جاري استحضار سجلات البسالة...' : 'Summoning Records of Valor...'}
                </p>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-7xl mx-auto py-12 px-4 mb-20 space-y-12">
            <div className="max-w-2xl mx-auto relative group w-full flex items-center">
                <Search className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary z-10`} />
                <input
                    type="text"
                    dir={isRTL ? 'rtl' : 'ltr'}
                    placeholder={isRTL ? 'بحث عن معركة أو عصر تاريخي...' : 'Search for a battle or historical era...'}
                    className={`w-full ${isRTL ? 'pr-14 pl-12' : 'pl-14 pr-12'} py-5 rounded-[32px] bg-black/40 border border-[#c5a059]/20 focus:border-primary focus:bg-black/60 outline-none transition-all text-sm font-medium text-white placeholder-white/30 backdrop-blur-sm`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-primary/10 rounded-3xl border border-primary/20">
                        <Swords className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h2 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-widest font-black font-arabic">
                            {isRTL ? 'سجلات البسالة والفتح' : 'ENCYCLOPEDIA OF VALOR'}
                        </h2>
                        <p className="text-white/30 text-[11px] tracking-[0.6em] uppercase mt-3 font-black">
                            {isRTL ? 'الأرشيف الإمبراطوري العظيم' : 'THE GRAND IMPERIAL ARCHIVES'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    {eras.map(e => (
                        <button
                            key={e.id}
                            onClick={() => setFilter(e.id)}
                            className={`px-6 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${filter === e.id ? 'bg-primary text-white border-primary shadow-2xl' : 'bg-white/5 text-white/40 border-white/10 hover:border-primary/40'}`}
                        >
                            {isRTL ? e.ar : e.en}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {displayBattles.map((b, idx) => (
                        <motion.div
                            key={b.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleBattleClick(b)}
                            className="group relative h-[480px] rounded-xl overflow-hidden bg-black border border-primary/30 hover:border-primary transition-all duration-500 cursor-pointer shadow-xl"
                        >
                            <img
                                src={b.imageUrl || 'https://images.unsplash.com/photo-1549733059-d81615d862e?q=80&w=1080&auto=format&fit=crop'}
                                alt={b.name.en}
                                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity"
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            
                            <div className="absolute inset-0 p-10 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="px-5 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 tracking-widest">
                                                {b.year}
                                            </span>
                                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest font-arabic">{b.era}</span>
                                        </div>
                                        <ShareButton id={b.id} title={isRTL ? b.name.ar : b.name.en} description={isRTL ? b.desc.ar : b.desc.en} imageUrl={b.imageUrl} />
                                    </div>
                                    <h4 className="text-3xl font-black text-primary uppercase leading-tight font-arabic drop-shadow-lg">
                                        {isRTL ? b.name.ar : b.name.en}
                                    </h4>
                                    <div className="flex items-center gap-2 text-white/60">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="text-[9px] uppercase font-black tracking-widest">{isRTL ? b.location.ar : b.location.en}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-sm text-white/80 line-clamp-2 italic font-arabic">
                                        "{isRTL ? b.desc.ar : b.desc.en}"
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{isRTL ? 'رحلة عبر التاريخ' : 'Journey into History'}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 text-primary group-hover:translate-x-2 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
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
