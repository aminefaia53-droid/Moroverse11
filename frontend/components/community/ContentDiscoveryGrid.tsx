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
    hideHeader?: boolean;
}

export default function ContentDiscoveryGrid({ posts, isLoading, onCardClick, hideHeader = false }: ContentDiscoveryGridProps) {
    const handleView3D = (e: React.MouseEvent, post: Post) => {
        e.stopPropagation();
        if (post.model_url) {
            // New 3D Independent Route Architecture
            // Pass modelUrl via query params to a generic 3D viewer engine
            const urlEncoded = encodeURIComponent(post.model_url);
            window.open(`/3d/viewer?model=${urlEncoded}&name=${encodeURIComponent(post.location_name || 'Monument')}`, '_blank');
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

    const ResultGrid = ({ data }: { data: Post[] }) => (
        <div className="space-y-4">
            {!hideHeader && (
                <div className="flex items-center gap-2 text-[#C5A059]">
                    <LucideHistory size={20} />
                    <h2 className="text-lg font-bold uppercase tracking-wider">Discovery Results</h2>
                    <span className="text-xs bg-[#C5A059]/10 px-2 py-0.5 rounded-full">{data.length}</span>
                </div>
            )}
            <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 pb-6 snap-x snap-mandatory hide-scrollbar">
                {data.map(post => (
                    <div 
                        key={post.id}
                        onClick={() => onCardClick(post)}
                        className="group relative h-72 w-[85vw] md:w-auto shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] cursor-pointer hover:border-[#C5A059]/40 transition-all duration-300 shadow-lg"
                    >
                        {post.image_url ? (
                            <img src={post.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
                                <LucideCompass className="text-white/10" size={48} />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-2 relative z-10">
                            <div>
                                <h3 className="text-white font-bold mb-1 truncate">{post.location_name}</h3>
                                <div className="flex items-center justify-between text-[10px] text-white/60">
                                    <span>{post.profiles?.username || 'Moroverse'}</span>
                                    <span className="text-[#C5A059]">Score: {post.profiles?.trust_score || 0}</span>
                                </div>
                            </div>
                            
                            {/* Action Buttons restored and updated */}
                            <div className="flex flex-col gap-1 mt-2">
                                {/* Gatekeeper Logic: View 3D Button routes to independent page */}
                                {post.model_url && (
                                    <button
                                        onClick={(e) => handleView3D(e, post)}
                                        className="w-full py-2 flex items-center justify-center gap-2 bg-[#C5A059]/20 hover:bg-[#C5A059] text-[#C5A059] hover:text-black border border-[#C5A059]/40 rounded-xl transition-all uppercase text-[10px] font-black tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                                    >
                                        <LucideBox size={14} className="animate-pulse" />
                                        <span>View Elite 3D</span>
                                    </button>
                                )}
                                {/* Restore Watch Video capability */}
                                {post.video_url && (
                                    <button
                                        onClick={(e) => {
                                             // Let card open modal to play video
                                             // Event propagation will handle triggering the parent's click 
                                             // or we can just let it fall through to the fact sheet.
                                             // We leave normal event propagation to let the modal open the video
                                        }}
                                        className="w-full py-1.5 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all uppercase text-[9px] font-bold tracking-widest backdrop-blur-sm"
                                    >
                                        <span>Watch Documentary</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {data.length === 0 && (
                <p className="text-white/30 text-xs italic">No discoveries found for this category yet.</p>
            )}
        </div>
    );

    return (
        <div className={`space-y-12 ${!hideHeader ? 'pb-12' : ''}`}>
            <ResultGrid data={posts} />
        </div>
    );
}
