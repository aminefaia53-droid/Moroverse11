"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeritageFactSheet, { HeritageItem } from './HeritageFactSheet';
import { LangCode } from '../types/language';
import { Compass, MapPin, Loader2, Info, Box, Play, Swords, User, Building2, Globe } from 'lucide-react';
import ShareButton from './ShareButton';

interface DynamicEncyclopediaDisplayProps {
    category: 'city' | 'monument' | 'battle' | 'tourism' | 'figure';
    lang: LangCode;
    emptyMessageConfig: { en: string; ar: string; };
}

/** Derives the human-readable sub-category label for a card */
function getSubCategoryLabel(item: any, category: string): { ar: string; en: string } | null {
    if (category === 'city') {
        const type = item.type?.toLowerCase?.() || '';
        if (type.includes('douar') || type.includes('دوار')) return { ar: 'دوار', en: 'Douar' };
        if (type.includes('province') || type.includes('region') || type.includes('إقليم')) return { ar: 'إقليم', en: 'Province' };
        if (type.includes('commune') || type.includes('جماعة')) return { ar: 'جماعة', en: 'Commune' };
        return { ar: 'مدينة', en: 'City' };
    }
    if (category === 'battle') {
        const era = item.era || '';
        return { ar: era, en: era };
    }
    if (category === 'figure') {
        const field = item.field || '';
        return { ar: field, en: field };
    }
    if (category === 'tourism') {
        const type = item.type || '';
        return { ar: type, en: type };
    }
    return null;
}

/** Returns the category icon component */
function CategoryIcon({ category }: { category: string }) {
    if (category === 'battle') return <Swords className="w-12 h-12 text-white/5" />;
    if (category === 'figure') return <User className="w-12 h-12 text-white/5" />;
    if (category === 'monument') return <Building2 className="w-12 h-12 text-white/5" />;
    if (category === 'tourism') return <Globe className="w-12 h-12 text-white/5" />;
    return <Compass className="w-12 h-12 text-white/5" />;
}

/** Whether 3D button should be shown (landmark/monument only) */
function should3DButtonShow(category: string): boolean {
    return category === 'monument';
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
                    console.log(`[MOROVERSE DEBUG] Fetched content for ${category}. Landmarks found: ${db?.landmarks?.length || 0}`);
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

    const handleCardClick = (item: any, triggerTab?: 'video' | '3d') => {
        // Defensive mapping for the FactSheet to prevent crashes on legacy data
        const getName = (n: any, l: string) => {
            if (typeof n === 'string') return n;
            const target = l as 'ar' | 'en';
            return n?.[target] || n?.ar || n?.en || '';
        };

        const heritageItem: HeritageItem = {
            id: item.id || Math.random().toString(),
            slug: item.id,
            name: {
                en: getName(item.name, 'en'),
                ar: getName(item.name, 'ar')
            },
            city: {
                en: getName(item.city || item.regionName, 'en'),
                ar: getName(item.city || item.regionName, 'ar')
            },
            history: {
                en: item.history?.en || (typeof item.desc === 'string' ? item.desc : item.desc?.en) || '',
                ar: item.history?.ar || (typeof item.desc === 'string' ? item.desc : item.desc?.ar) || ''
            },
            foundation: item.foundation,
            visualSoul: item.visualSoul,
            imageUrl: item.imageUrl || undefined,
            video_url: item.videoUrl || undefined,
            model_url: item.modelUrl || undefined,
            gallery: item.gallery || undefined,
            summary: typeof item.desc === 'string' ? item.desc : (item.desc?.ar || item.desc?.en || ''),
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

        // If triggered from 3D button, we'll auto-open 3D viewer on the factsheet
        if (triggerTab === '3d') {
            (heritageItem as any)._autoOpen3D = true;
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

    const show3D = false; // Always false as monument category returns null above
    if (category === ('monument' as any)) return null;

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {items.map((item, idx) => {
                        const getName = (n: any, l: string) => {
                            if (typeof n === 'string') return n;
                            const target = l as 'ar' | 'en';
                            return n?.[target] || n?.ar || n?.en || '';
                        };

                        const title = getName(item.name, lang);
                        const desc = typeof item.desc === 'string' ? item.desc : (item.desc?.[lang] || item.desc?.ar || item.desc?.en || '');
                        const cityName = getName(item.city || item.regionName, lang);
                        const subLabel = getSubCategoryLabel(item, category);
                        const hasVideo = !!item.videoUrl;
                        const has3DModel = !!item.modelUrl;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.04 }}
                                onClick={() => handleCardClick(item)}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-[#c5a059]/50 transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-[0_20px_60px_rgba(197,160,89,0.15)]"
                            >
                                {/* Card Image Background */}
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-700 z-[2]"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                const fallback = parent.querySelector('.image-fallback');
                                                if (fallback) fallback.classList.remove('hidden');
                                            }
                                        }}
                                    />
                                ) : null}

                                {/* Fallback/Loading State - Using light gold gradient for visibility */}
                                <div className={`image-fallback absolute inset-0 bg-gradient-to-br from-[#c5a059]/20 to-transparent flex items-center justify-center z-[2] ${item.imageUrl ? 'hidden' : ''}`}>
                                    <CategoryIcon category={category} />
                                </div>

                                {/* Subtle Glow Overlays - Lightened and lowered z-index */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-[1]" />

                                {/* Content Layer */}
                                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                    {/* Header: sub-category tag + share */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col gap-1.5">
                                            {/* Sub-Category Classification Label */}
                                            {subLabel && (subLabel.ar || subLabel.en) && (
                                                <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-[#c5a059]/40 text-[#c5a059] text-[8px] font-black uppercase tracking-[0.25em] rounded-full w-max">
                                                    {isRTL ? subLabel.ar : subLabel.en}
                                                </span>
                                            )}
                                            {/* Era or Field badge */}
                                            {item.era && category !== 'city' && (
                                                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white/50 text-[8px] font-black uppercase tracking-[0.2em] rounded-full w-max">
                                                    {item.era}
                                                </span>
                                            )}
                                        </div>
                                        <div className="z-20" onClick={e => e.stopPropagation()}>
                                            <ShareButton id={item.id} title={title} description={desc} imageUrl={item.imageUrl} />
                                        </div>
                                    </div>

                                    {/* Bottom Info */}
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <h3 className="text-xl font-black text-[#c5a059] leading-tight font-arabic drop-shadow-lg transform group-hover:translate-x-1 transition-transform duration-500">
                                                {title}
                                            </h3>
                                            {(cityName || item.year || item.foundation?.en) && (
                                                <div className="flex items-center gap-2 text-white/60">
                                                    {cityName && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            <span className="text-[8px] uppercase font-black tracking-widest">{cityName}</span>
                                                        </div>
                                                    )}
                                                    {cityName && (item.year || item.foundation?.en) && <span className="w-1 h-1 rounded-full bg-white/20" />}
                                                    {(item.year || item.foundation?.en) && (
                                                        <span className="text-[8px] uppercase font-black tracking-widest text-primary">
                                                            {item.year || item.foundation?.en}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Description excerpt */}
                                        <p className="text-xs text-white/70 line-clamp-2 italic font-arabic opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                            {typeof desc === 'string' ? desc : ''}
                                        </p>

                                        {/* ──── SOVEREIGN ACTION BUTTONS ──── */}
                                        <div
                                            className="flex items-center gap-2 pt-3 border-t border-white/10"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {/* Watch Video — ALWAYS visible on ALL cards */}
                                            <button
                                                onClick={() => handleCardClick(item, 'video')}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
                                                    hasVideo
                                                        ? 'bg-red-900/60 border-red-500/50 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                                                        : 'bg-white/5 border-white/10 text-white/30 cursor-default opacity-60'
                                                }`}
                                                title={hasVideo ? (isRTL ? 'مشاهدة الفيلم الوثائقي' : 'Watch Documentary') : (isRTL ? 'لا يوجد فيديو بعد' : 'No video yet')}
                                            >
                                                <Play className="w-2.5 h-2.5" />
                                                {isRTL ? 'الفيديو' : 'Video'}
                                            </button>

                                            {/* Elite 3D — ONLY for Architectural Heritage (monument) category */}
                                            {show3D && (
                                                <button
                                                    onClick={() => handleCardClick(item, '3d')}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.15em] transition-all duration-300 border ${
                                                        has3DModel
                                                            ? 'bg-[#c5a059]/20 border-[#c5a059]/50 text-[#c5a059] hover:bg-[#c5a059] hover:text-black shadow-[0_0_10px_rgba(197,160,89,0.3)]'
                                                            : 'bg-white/5 border-white/10 text-white/30 cursor-default opacity-60'
                                                    }`}
                                                    title={has3DModel ? (isRTL ? 'العرض الثلاثي الأبعاد' : 'Elite 3D Viewer') : (isRTL ? 'لا يوجد نموذج ثلاثي الأبعاد بعد' : 'No 3D model yet')}
                                                >
                                                    <Box className="w-2.5 h-2.5" />
                                                    {isRTL ? 'ثلاثي الأبعاد' : '3D View'}
                                                </button>
                                            )}

                                            {/* Activity label for tourism */}
                                            {category === 'tourism' && item.best_time && (
                                                <span className="text-[7px] text-white/30 uppercase tracking-widest font-black ml-auto">
                                                    {item.best_time}
                                                </span>
                                            )}
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
