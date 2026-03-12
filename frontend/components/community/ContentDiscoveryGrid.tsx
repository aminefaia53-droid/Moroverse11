"use client";

import React from "react";
import { Post } from "../../types/social";
import { LucideCompass, LucideHistory, LucideGem } from "lucide-react";

interface ContentDiscoveryGridProps {
    posts: Post[];
    isLoading: boolean;
    onCardClick: (post: Post) => void;
}

export default function ContentDiscoveryGrid({ posts, isLoading, onCardClick }: ContentDiscoveryGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-white/5 rounded-2xl border border-white/10" />
                ))}
            </div>
        );
    }

    const categories = {
        monument: posts.filter(p => p.location_type === 'monument'),
        city: posts.filter(p => p.location_type === 'city'),
        hidden_gem: posts.filter(p => p.location_type === 'hidden_gem')
    };

    const CategorySection = ({ title, icon: Icon, data }: { title: string, icon: any, data: Post[] }) => (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#C5A059]">
                <Icon size={20} />
                <h2 className="text-lg font-bold uppercase tracking-wider">{title}</h2>
                <span className="text-xs bg-[#C5A059]/10 px-2 py-0.5 rounded-full">{data.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map(post => (
                    <div 
                        key={post.id}
                        onClick={() => onCardClick(post)}
                        className="group relative h-72 rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] cursor-pointer hover:border-[#C5A059]/40 transition-all duration-300 shadow-lg"
                    >
                        {post.image_url ? (
                            <img src={post.image_url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
                                <LucideCompass className="text-white/10" size={48} />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                            <h3 className="text-white font-bold mb-1 truncate">{post.location_name}</h3>
                            <div className="flex items-center justify-between text-[10px] text-white/60">
                                <span>{post.profiles?.username}</span>
                                <span className="text-[#C5A059]">Score: {post.profiles?.trust_score || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {data.length === 0 && (
                <p className="text-white/30 text-xs italic">No discoveries in this category yet.</p>
            )}
        </div>
    );

    return (
        <div className="space-y-12 pb-12">
            <CategorySection title="Historical Landmarks" icon={LucideHistory} data={categories.monument} />
            <CategorySection title="Urban Stories" icon={LucideCompass} data={categories.city} />
            <CategorySection title="Hidden Gems" icon={LucideGem} data={categories.hidden_gem} />
        </div>
    );
}
