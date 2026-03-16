"use client";

import React, { useState } from "react";
import ContentDiscoveryGrid from "./ContentDiscoveryGrid";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import HeritageFactSheet, { HeritageItem } from "@/components/HeritageFactSheet";
import { Post } from "@/types/social";

interface LazyContentGridProps {
    category: string;
    lang: 'en' | 'ar';
}

export default function LazyContentGrid({ category, lang }: LazyContentGridProps) {
    const { posts, isLoading } = useEncyclopedia(category, undefined);
    const [activeLocation, setActiveLocation] = useState<HeritageItem | null>(null);

    const handleCardClick = (loc: Post) => {
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
    };

    return (
        <div className="w-full">
            <ContentDiscoveryGrid 
                posts={posts} 
                isLoading={isLoading} 
                onCardClick={handleCardClick} 
                hideHeader={true} // Hide internal header since LazySection handles it
            />

            <HeritageFactSheet 
                item={activeLocation} 
                isOpen={!!activeLocation} 
                onClose={() => setActiveLocation(null)} 
                lang={lang}
            />
        </div>
    );
}
