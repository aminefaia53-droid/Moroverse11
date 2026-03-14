"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeritageFactSheet, { HeritageItem } from './HeritageFactSheet';
import { LangCode } from '../types/language';
import { Compass, MapPin, Loader2, Info } from 'lucide-react';
import ShareButton from './ShareButton';

interface DynamicEncyclopediaDisplayProps {
    category: 'city' | 'monument' | 'battle' | 'tourism' | 'figure';
    lang: LangCode;
    emptyMessageConfig: {
        en: string;
        ar: string;
    };
}

export default function DynamicEncyclopediaDisplay({ category, lang, emptyMessageConfig }: DynamicEncyclopediaDisplayProps) {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedItem, setSelectedItem] = useState<HeritageItem | null>(null);

    const isRTL = lang === 'ar';

    useEffect(() => {
        let isMounted = true;
        async function fetchDashboardContent() {
            try {
                setIsLoading(true);
                const res = await fetch('/api/admin/content');
                if (!res.ok) throw new Error('Failed to load dashboard data');
                const json = await res.json();
                const db = json.data;

                if (isMounted) {
                    // Map generic categories to Dashboard JSON arrays
                    if (category === 'city') setItems(db.cities || []);
                    else if (category === 'monument') setItems(db.landmarks || []);
                    else if (category === 'battle') setItems(db.battles || []);
                    else if (category === 'figure') setItems(db.figures || []);
                    else if (category === 'tourism') setItems(db.tourism || []);
                }
            } catch (err) {
                if (isMounted) setError(err as Error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        fetchDashboardContent();
        return () => { isMounted = false; };
    }, [category]);

    const handleCardClick = (item: any) => {
        const heritageItem: HeritageItem = {
            id: item.id,
            slug: item.id,
            name: {
                en: item.name?.en || item.name || '',
                ar: item.name?.ar || item.name || ''
            },
            city: {
                en: item.city?.en || item.city || item.regionName?.en || item.regionName || '',
                ar: item.city?.ar || item.city || item.regionName?.ar || item.regionName || ''
            },
            history: {
                en: item.history?.en || item.desc?.en || '',
                ar: item.history?.ar || item.desc?.ar || ''
            },
            foundation: item.foundation,
            visualSoul: item.visualSoul,
            imageUrl: item.imageUrl || undefined,
            video_url: item.videoUrl || undefined,
            model_url: item.modelUrl || undefined,
            gallery: item.gallery || undefined,
            summary: typeof item.desc === 'string' ? item.desc : (item.desc?.en || item.desc?.ar),
            type: category === 'monument' ? 'landmark' : category,
            stats: {
                year: item.foundation?.en || item.year,
                era: item.era,
                dynasty: item.dynasty,
                field: item.field,
                notable_works: item.notable_works,
                combatants: item.combatants,
                leaders: item.leaders,
                outcome: item.outcome,
                tactics: item.tactics,
                impact: item.impact,
                activities: item.activities,
                best_time: item.best_time
            }
        };

        if (item.modelUrl) {
            (heritageItem as any).modelInfo = { url: item.modelUrl };
        }

        setSelectedItem(heritageItem);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-primary font-black uppercase tracking-[0.3em] text-xs">
                    {isRTL ? 'جاري استحضار السجلات الإمبراطورية...' : 'Summoning Imperial Records...'}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500/80 bg-red-500/10 rounded-2xl border border-red-500/20">
                <p>{isRTL ? 'تعذر النفاذ إلى الأرشيف السري' : 'Failed to access the sacred archives'}</p>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-white/5 rounded-3xl bg-black/20 backdrop-blur-sm">
                <Info className="w-8 h-8 text-white/20 mb-4" />
                <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] font-black">
                    {isRTL ? emptyMessageConfig.ar : emptyMessageConfig.en}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {items.map((item, idx) => {
                        const title = item.name?.[lang] || item.name?.ar || item.name?.en || item.name || '';
                        const desc = item.desc?.[lang] || item.desc?.ar || item.desc?.en || (typeof item.desc === 'string' ? item.desc : '');
                        const cityName = item.city?.[lang] || item.city?.ar || item.city?.en || item.city || item.regionName?.[lang] || item.regionName?.ar || '';
                        
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleCardClick(item)}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 hover:border-[#c5a059]/50 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_10px_40px_rgba(197,160,89,0.2)]"
                            >
                                {/* Card Image Background */}
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
                                        <Compass className="w-16 h-16 text-white/5" />
                                    </div>
                                )}

                                {/* Cinematic Gradient Overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-60" />

                                {/* Content Overlays */}
                                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                    {/* Header (Share + Badges) */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col gap-2">
                                            {item.era && (
                                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-[#c5a059]/30 text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em] rounded-full fit-content w-max">
                                                    {item.era}
                                                </span>
                                            )}
                                            {item.field && (
                                                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-[#c5a059]/30 text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em] rounded-full fit-content w-max">
                                                    {item.field}
                                                </span>
                                            )}
                                        </div>
                                        <div className="z-20" onClick={e => e.stopPropagation()}>
                                            <ShareButton id={item.id} title={title} description={desc} imageUrl={item.imageUrl} />
                                        </div>
                                    </div>

                                    {/* Bottom Info */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-[#c5a059] leading-tight font-arabic drop-shadow-lg transform group-hover:translate-x-2 transition-transform duration-500">
                                                {title}
                                            </h3>
                                            {(cityName || item.year || item.foundation?.en) && (
                                                <div className="flex items-center gap-3 text-white/60">
                                                    {cityName && (
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span className="text-[9px] uppercase font-black tracking-widest">{cityName}</span>
                                                        </div>
                                                    )}
                                                    {cityName && (item.year || item.foundation?.en) && <span className="w-1 h-1 rounded-full bg-white/20" />}
                                                    {(item.year || item.foundation?.en) && (
                                                        <span className="text-[9px] uppercase font-black tracking-widest text-primary">{item.year || item.foundation?.en}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Excerpt */}
                                        <p className="text-sm text-white/70 line-clamp-2 italic font-arabic opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            {typeof desc === 'string' ? desc : ''}
                                        </p>

                                        {/* Quick visual attributes */}
                                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                                            {item.modelUrl && <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse shadow-[0_0_10px_#c5a059]" title="3D Elite Available" />}
                                            {item.videoUrl && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" title="Cinematic Media Hub" />}
                                            {item.gallery && item.gallery.length > 0 && <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" title="Gallery Available" />}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Smart Fact Sheet Modal */}
            <HeritageFactSheet
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                lang={lang}
            />
        </div>
    );
}
