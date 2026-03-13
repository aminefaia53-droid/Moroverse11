"use client";

import React from "react";
import { Post } from "../../types/social";
import { LucideCompass, LucideHistory, LucideGem, LucideBox } from "lucide-react";
import dynamic from "next/dynamic";

const Monument3DViewer = dynamic(() => import("./Monument3DViewer"), { ssr: false });

interface ContentDiscoveryGridProps {
    posts: Post[];
    isLoading: boolean;
    onCardClick: (post: Post) => void;
}

export default function ContentDiscoveryGrid({ posts, isLoading, onCardClick }: ContentDiscoveryGridProps) {
    const [active3DModel, setActive3DModel] = React.useState<{ url: string, name: string } | null>(null);

    const handleView3D = (e: React.MouseEvent, post: Post) => {
        e.stopPropagation();
        if (post.model_url) {
            setActive3DModel({ url: post.model_url, name: post.location_name || 'Monument' });
            
            // Dispatch event for AI Concierge sync
            window.dispatchEvent(new CustomEvent('moroverse-3d-view-active', {
                detail: { locationName: post.location_name, modelUrl: post.model_url }
            }));
        }
    };

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
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-2">
                            <div>
                                <h3 className="text-white font-bold mb-1 truncate">{post.location_name}</h3>
                                <div className="flex items-center justify-between text-[10px] text-white/60">
                                    <span>{post.profiles?.username}</span>
                                    <span className="text-[#C5A059]">Score: {post.profiles?.trust_score || 0}</span>
                                </div>
                            </div>
                            
                            {/* Gatekeeper Logic: Only show 3D button if monument AND has a model_url */}
                            {post.location_type === 'monument' && post.model_url && (
                                <button
                                    onClick={(e) => handleView3D(e, post)}
                                    className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-black border border-[#C5A059]/40 rounded-xl transition-all uppercase text-[10px] font-black tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                                >
                                    <LucideBox size={14} className="animate-pulse" />
                                    <span>View Elite 3D</span>
                                </button>
                            )}
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
            
            {/* 3D Viewer Overlay */}
            {active3DModel && (
                <Monument3DViewer 
                    modelUrl={active3DModel.url} 
                    locationName={active3DModel.name}
                    onClose={() => {
                        setActive3DModel(null);
                        window.dispatchEvent(new CustomEvent('moroverse-3d-view-closed'));
                    }} 
                />
            )}
        </div>
    );
}
