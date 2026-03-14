"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEncyclopedia } from '../hooks/useEncyclopedia';
import HeritageFactSheet, { HeritageItem } from './HeritageFactSheet';
import { LangCode } from '../types/language';
import { Post } from '../types/social';
import { Compass, LucideIcon, MapPin, Loader2, Info } from 'lucide-react';
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
    const { posts, isLoading, error } = useEncyclopedia(category, undefined);
    const [selectedItem, setSelectedItem] = useState<HeritageItem | null>(null);

    const isRTL = lang === 'ar';

    const handleCardClick = (post: Post) => {
        // Map Post to HeritageItem
        const item: HeritageItem = {
            id: post.id,
            slug: post.slug,
            name: {
                en: post.location_name || '',
                ar: post.location_name || ''
            },
            city: {
                en: post.city || '',
                ar: post.city || ''
            },
            history: {
                en: post.content || '',
                ar: post.content || ''
            },
            imageUrl: post.image_url || undefined,
            video_url: post.video_url || undefined,
            gallery: post.gallery || undefined,
            summary: post.summary || undefined,
            type: post.location_type as any,
            // Pass all dynamic metadata into stats
            stats: {
                year: post.year,
                era: post.era,
                dynasty: post.dynasty,
                field: post.field,
                notable_works: post.notable_works,
                combatants: { en: post.combatants || '', ar: post.combatants || '' },
                leaders: { en: post.leaders || '', ar: post.leaders || '' },
                outcome: { en: post.outcome || '', ar: post.outcome || '' },
                tactics: { en: post.tactics || '', ar: post.tactics || '' },
                impact: { en: post.impact || '', ar: post.impact || '' },
                activities: post.activities,
                best_time: post.best_time
            }
        };
        
        // Ensure 3D model passes properly to FactSheet
        if (post.model_url) {
            (item as any).modelInfo = { url: post.model_url };
        }

        setSelectedItem(item);
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

    if (!posts || posts.length === 0) {
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
                    {posts.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleCardClick(post)}
                            className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0A0A0A] border border-white/10 hover:border-[#c5a059]/50 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_10px_40px_rgba(197,160,89,0.2)]"
                        >
                            {/* Card Image Background */}
                            {post.image_url ? (
                                <img
                                    src={post.image_url}
                                    alt={post.location_name || 'Moroverse Entity'}
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
                                        {post.era && (
                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-[#c5a059]/30 text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em] rounded-full fit-content w-max">
                                                {post.era}
                                            </span>
                                        )}
                                        {post.field && (
                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-[#c5a059]/30 text-[#c5a059] text-[9px] font-black uppercase tracking-[0.2em] rounded-full fit-content w-max">
                                                {post.field}
                                            </span>
                                        )}
                                    </div>
                                    <div className="z-20" onClick={e => e.stopPropagation()}>
                                        <ShareButton id={post.id} title={post.location_name || ''} description={post.summary || post.content || ''} imageUrl={post.image_url} />
                                    </div>
                                </div>

                                {/* Bottom Info */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-[#c5a059] leading-tight font-arabic drop-shadow-lg transform group-hover:translate-x-2 transition-transform duration-500">
                                            {post.location_name}
                                        </h3>
                                        {(post.city || post.year) && (
                                            <div className="flex items-center gap-3 text-white/60">
                                                {post.city && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="text-[9px] uppercase font-black tracking-widest">{post.city}</span>
                                                    </div>
                                                )}
                                                {post.city && post.year && <span className="w-1 h-1 rounded-full bg-white/20" />}
                                                {post.year && (
                                                    <span className="text-[9px] uppercase font-black tracking-widest text-primary">{post.year}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Excerpt */}
                                    <p className="text-sm text-white/70 line-clamp-2 italic font-arabic opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        {post.summary || post.content}
                                    </p>

                                    {/* Quick visual attributes */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                                        {post.model_url && <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse shadow-[0_0_10px_#c5a059]" title="3D Elite Available" />}
                                        {post.video_url && <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" title="Cinematic Media Hub" />}
                                        {post.gallery && post.gallery.length > 0 && <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" title="Gallery Available" />}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
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
