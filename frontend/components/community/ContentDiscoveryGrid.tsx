"use client";

import React from "react";
import { Post } from "../../types/social";
import { LucideCompass, LucideBox, LucideMapPin, LucideHistory } from "lucide-react";
import dynamic from "next/dynamic";

const Monument3DViewer = dynamic(() => import("./Monument3DViewer"), { ssr: false });

interface ContentDiscoveryGridProps {
    posts: Post[];
    isLoading: boolean;
    onCardClick: (post: Post) => void;
    hideHeader?: boolean;
}

export default function ContentDiscoveryGrid({ posts, isLoading, onCardClick, hideHeader = false }: ContentDiscoveryGridProps) {
    const [userLoc, setUserLoc] = React.useState<{lat: number, lng: number} | null>(null);

    React.useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            });
        }
    }, []);

    // Haversine formula
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.floor(R * c);
    };

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
                        className="group relative h-72 w-[85vw] md:w-auto shrink-0 snap-center rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] cursor-pointer hover:border-[#FFD700] hover:scale-[1.05] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                    >
                        {post.image_url ? (
                            <img src={post.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                        ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center">
                                <LucideCompass className="text-white/10" size={48} />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col gap-2 relative z-10 transition-all duration-300">
                            <div>
                                <h3 className="text-white font-bold mb-1 truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">{post.location_name}</h3>
                                <div className="flex items-center justify-between text-[10px] drop-shadow-md">
                                    <span className="text-white/80 font-medium">{post.profiles?.username || 'Moroverse'}</span>
                                    {userLoc && post.lat && post.lng ? (
                                        <span className="text-[#FFD700] bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm border border-[#FFD700]/20 flex items-center gap-1">
                                            <LucideMapPin size={10} />
                                            {getDistance(userLoc.lat, userLoc.lng, post.lat, post.lng)} km
                                        </span>
                                    ) : (
                                        <span className="text-[#C5A059]">Score: {post.profiles?.trust_score || 0}</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 mt-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                {/* Gatekeeper Logic: View 3D Button routes to independent page */}
                                {post.model_url && (
                                    <button
                                        onClick={(e) => handleView3D(e, post)}
                                        className="w-full py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B0000]/40 to-[#FFD700]/10 hover:from-[#c5a059] hover:to-[#FFD700] text-[#FFD700] hover:text-black border border-[#FFD700]/30 rounded-xl transition-all uppercase text-[10px] font-black tracking-widest backdrop-blur-sm shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                                    >
                                        <LucideBox size={14} className="animate-pulse" />
                                        <span>View Elite 3D</span>
                                    </button>
                                )}
                                
                                <div className="flex gap-1">
                                    {/* Restore Watch Video capability */}
                                    {post.video_url && (
                                        <button
                                            className="flex-1 py-1.5 flex items-center justify-center gap-2 bg-black/40 hover:bg-white/10 text-white/90 border border-white/20 rounded-xl transition-all uppercase text-[9px] font-bold tracking-wider backdrop-blur-sm"
                                        >
                                            <span>Documentary</span>
                                        </button>
                                    )}
                                    {/* Navigate Button */}
                                    {post.lat && post.lng && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${post.lat},${post.lng}`, '_blank');
                                            }}
                                            className="flex-1 py-1.5 flex items-center justify-center gap-1 bg-[#1a237e]/40 hover:bg-[#1a237e]/80 text-blue-200 border border-blue-500/30 rounded-xl transition-all uppercase text-[9px] font-bold tracking-wider backdrop-blur-sm"
                                        >
                                            <LucideCompass size={12} />
                                            <span>Navigate</span>
                                        </button>
                                    )}
                                </div>
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
