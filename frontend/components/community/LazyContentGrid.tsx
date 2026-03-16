"use client";

import React, { useState } from "react";
import ContentDiscoveryGrid from "./ContentDiscoveryGrid";
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import HeritageFactSheet, { HeritageItem } from "@/components/HeritageFactSheet";
import { Post } from "@/types/social";

interface LazyContentGridProps {
    category: string;
    lang: 'en' | 'ar';
    searchQuery?: string; // Live filter from OmniSearchBar
}

export default function LazyContentGrid({ category, lang, searchQuery }: LazyContentGridProps) {
    const { posts, isLoading } = useEncyclopedia(category, undefined);
    const [activeLocation, setActiveLocation] = useState<HeritageItem | null>(null);

    // Live search filter: filter posts by searchQuery across name, city, content
    const displayPosts = searchQuery
        ? posts.filter(p => {
            const q = searchQuery.toLowerCase();
            return (
                (p.location_name?.toLowerCase().includes(q)) ||
                (p.city?.toLowerCase().includes(q)) ||
                (p.content?.toLowerCase().includes(q)) ||
                (p.summary?.toLowerCase().includes(q))
            );
        })
        : posts;

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
                posts={displayPosts} 
                isLoading={isLoading} 
                onCardClick={handleCardClick} 
                hideHeader={true}
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
