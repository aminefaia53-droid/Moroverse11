"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ContentDiscoveryGrid from "@/components/community/ContentDiscoveryGrid";
import HeritageFactSheet, { HeritageItem } from "@/components/HeritageFactSheet";
import { useLanguage } from "@/context/LanguageContext";
import { SocialService } from "@/services/SocialService";
import { Post } from "@/types/social";
import { LucideSearch, LucideMapPin } from "lucide-react";

const ExploreMap = dynamic(() => import("@/components/community/ExploreMap"), { ssr: false });

export default function ExploreBlogPage() {
    const { lang } = useLanguage();
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
    const [activeLocation, setActiveLocation] = useState<HeritageItem | null>(null);

    // Initial Load & SWR Pattern
    useEffect(() => {
        fetchDiscoveryContent();
    }, [selectedCity]);

    const fetchDiscoveryContent = async () => {
        setIsLoading(true);
        try {
            // Discovery Logic: Fetch across all heritage types
            const monuments = await SocialService.getPostsByCategory('monument', selectedCity);
            const cities = await SocialService.getPostsByCategory('city', selectedCity);
            const gems = await SocialService.getPostsByCategory('hidden_gem', selectedCity);
            
            setPosts([...monuments, ...cities, ...gems]);
        } catch (err) {
            console.error('DISCOVERY_ENGINE_ERROR:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocationSelect = async (loc: Post | string) => {
        if (typeof loc === 'string') {
            setSelectedCity(loc);
        } else {
            // Fetch fresh full record by slug/id to ensure we have model_url and full content
            const fullPost = await SocialService.getPostBySlug(loc.id);
            const target = fullPost || loc;

            // Map Post to HeritageItem with slug support for Deep Linking
            const item: HeritageItem = {
                id: target.id,
                name: { ar: target.location_name || '', en: target.location_name || '' },
                city: { ar: target.location_name || '', en: target.location_name || '' },
                history: target.content || '',
                imageUrl: target.image_url || '',
                model_url: target.model_url || undefined,
                type: 'post',
                slug: (target as any).slug
            };
            setActiveLocation(item);
            
            // Auto-Pan logic is handled via Global Events in ExploreMap
            window.dispatchEvent(new CustomEvent('map-fly-to-target', { 
                detail: { target: [target.lat, target.lng], zoom: 15 } 
            }));
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 space-y-12">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex items-center gap-3 text-[#C5A059]">
                    <LucideSearch size={32} />
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter">EXPLORE MOROVERSE</h1>
                </div>
                <p className="text-white/60 text-lg max-w-2xl">
                    Discover the visual history of the Kingdom. Filter through community-sourced heritage sites, 
                    urban legends, and the hidden geographical gems of Morocco.
                </p>
            </div>

            {/* Discovery Engine: Map Section */}
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#C5A059] bg-[#C5A059]/5 px-4 py-2 rounded-full border border-[#C5A059]/20">
                        <LucideMapPin size={14} />
                        <span>Visual Filtering: Satellite Mode Active</span>
                    </div>
                </div>
                <ExploreMap 
                    onLocationSelect={handleLocationSelect} 
                    activeCategory="monument" 
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
