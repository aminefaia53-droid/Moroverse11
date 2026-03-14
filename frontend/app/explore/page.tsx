"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import ContentDiscoveryGrid from "@/components/community/ContentDiscoveryGrid";
import HeritageFactSheet, { HeritageItem } from "@/components/HeritageFactSheet";
import { useLanguage } from "@/context/LanguageContext";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import { Post } from "@/types/social";
import { 
    LucideSearch, LucideMapPin, Map, Landmark, Swords, Users, Compass 
} from "lucide-react";

const ExploreMap = dynamic(() => import("@/components/community/ExploreMap"), { ssr: false });

const PILLARS = [
    { id: 'heritage', icon: Landmark, en: 'Architectural Heritage', ar: 'التراث المعماري' },
    { id: 'geography', icon: Map, en: 'Geography & Regions', ar: 'الجغرافيا والمدن' },
    { id: 'chronicles', icon: Swords, en: 'Chronicles of Valor', ar: 'عصور البسالة' },
    { id: 'biographies', icon: Users, en: 'Historical Figures', ar: 'شخصيات تاريخية' },
    { id: 'tourism', icon: Compass, en: 'Elite Tourism', ar: 'رحلات النخبة' }
];

export default function ExploreBlogPage() {
    const { lang } = useLanguage();
    const isRTL = lang === 'ar';
    
    const [activePillar, setActivePillar] = useState<string>('heritage');
    const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
    const [activeLocation, setActiveLocation] = useState<HeritageItem | null>(null);

    // Unified 5-Pillar Data Fetching Hook (Dashboard API)
    const { posts, isLoading } = useEncyclopedia(activePillar, selectedCity);

    const handleLocationSelect = (loc: Post | string) => {
        if (typeof loc === 'string') {
            setSelectedCity(loc === selectedCity ? undefined : loc);
        } else {
            // Map Post (from Dashboard API) directly to HeritageItem — no Supabase needed
            const item: HeritageItem = {
                id: loc.id,
                name: { ar: loc.location_name || '', en: loc.location_name || '' },
                city: { ar: loc.city || '', en: loc.city || '' },
                history: loc.content || '',
                summary: loc.summary || '',
                imageUrl: loc.image_url || undefined,
                model_url: loc.model_url || undefined,
                video_url: loc.video_url || undefined,
                gallery: loc.gallery || undefined,
                type: loc.location_type || 'post',
                slug: loc.slug,
                stats: {
                    year: loc.year,
                    era: loc.era,
                    combatants: loc.combatants ? { ar: loc.combatants, en: loc.combatants } : undefined,
                    leaders: loc.leaders ? { ar: loc.leaders, en: loc.leaders } : undefined,
                    outcome: loc.outcome ? { ar: loc.outcome, en: loc.outcome } : undefined,
                    tactics: loc.tactics ? { ar: loc.tactics, en: loc.tactics } : undefined,
                    impact: loc.impact ? { ar: loc.impact, en: loc.impact } : undefined
                }
            };
            setActiveLocation(item);
            
            // Auto-Pan map to location if coordinates exist
            if (loc.lat && loc.lng) {
                window.dispatchEvent(new CustomEvent('map-fly-to-target', { 
                    detail: { target: [loc.lat, loc.lng], zoom: 15 } 
                }));
            }
        }
    };


    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 space-y-12">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto space-y-4">
                <div className={`flex items-center gap-3 text-[#C5A059] ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <LucideSearch size={32} />
                    <h1 className={`text-4xl md:text-5xl font-black italic tracking-tighter ${isRTL ? 'font-arabic' : ''}`}>
                        {isRTL ? 'استكشاف الأرشيف السيادي' : 'EXPLORE MOROVERSE'}
                    </h1>
                </div>
                <p className={`text-white/60 text-lg max-w-2xl ${isRTL ? 'text-right ml-auto font-arabic' : ''}`}>
                    {isRTL 
                        ? 'اكتشف التاريخ البصري للمملكة. تنقل عبر معالم التراث، الأساطير الحضرية، والكنوز الجغرافية المخفية في المغرب الموثقة عبر لوحة التحكم الخاصة.'
                        : 'Discover the visual history of the Kingdom. Filter through heritage sites, chronicles, biographies, and specialized tourism documented via the Custom Dashboard.'}
                </p>
            </div>

            {/* 5 Pillars Navigation */}
            <div className="max-w-7xl mx-auto overflow-x-auto pb-4 hide-scrollbar">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {PILLARS.map(pillar => {
                        const Icon = pillar.icon;
                        const isActive = activePillar === pillar.id;
                        return (
                            <button
                                key={pillar.id}
                                onClick={() => { setActivePillar(pillar.id); setSelectedCity(undefined); }}
                                className={`flex items-center gap-3 px-6 py-4 rounded-3xl border whitespace-nowrap transition-all duration-300 ${isRTL ? 'flex-row-reverse font-arabic' : ''} ${
                                    isActive 
                                    ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.3)] scale-105' 
                                    : 'bg-black/40 text-white/50 border-white/10 hover:border-[#c5a059]/50 hover:text-white'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-black' : 'text-[#c5a059]'} />
                                <span className={`text-sm font-black uppercase tracking-widest ${isRTL ? 'font-arabic tracking-normal' : ''}`}>
                                    {isRTL ? pillar.ar : pillar.en}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Discovery Engine: Map Section */}
            <div className="max-w-7xl mx-auto space-y-6">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase text-[#C5A059] bg-[#C5A059]/5 px-4 py-2 rounded-full border border-[#C5A059]/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <LucideMapPin size={14} />
                        <span className={isRTL ? 'font-arabic tracking-normal' : ''}>
                            {isRTL 
                                ? `ترشيح الأرشيف: ${PILLARS.find(p => p.id === activePillar)?.ar}` 
                                : `Visual Filtering: ${PILLARS.find(p => p.id === activePillar)?.en} Active`}
                        </span>
                    </div>
                    {selectedCity && (
                        <div className={`flex items-center gap-2 text-xs font-bold uppercase text-white/60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span>{isRTL ? 'المدينة النشطة:' : 'Active City:'}</span>
                            <span className="text-white">{selectedCity}</span>
                            <button onClick={() => setSelectedCity(undefined)} className="ml-2 hover:text-red-400">✕</button>
                        </div>
                    )}
                </div>
                <ExploreMap 
                    onLocationSelect={handleLocationSelect} 
                    activeCategory={activePillar} 
                    selectedLocationId={activeLocation?.id}
                />
            </div>

            {/* Content Grid Section */}
            <div className="max-w-7xl mx-auto">
                <ContentDiscoveryGrid 
                    posts={posts} 
                    isLoading={isLoading} 
                    onCardClick={handleLocationSelect} 
                />
            </div>

            <HeritageFactSheet 
                item={activeLocation} 
                isOpen={!!activeLocation} 
                onClose={() => setActiveLocation(null)} 
                lang={lang}
            />
        </div>
    );
}
