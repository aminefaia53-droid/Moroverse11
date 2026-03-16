"use client";

import React, { useRef } from "react";
import { Post } from "../../types/social";
import { LucideCompass, LucideBox, LucideMapPin, LucideHistory, LucideBookOpen, LucideNavigation } from "lucide-react";

interface ContentDiscoveryGridProps {
    posts: Post[];
    isLoading: boolean;
    onCardClick: (post: Post) => void;
    hideHeader?: boolean;
    searchRef?: React.RefObject<HTMLDivElement>;
}

export default function ContentDiscoveryGrid({ posts, isLoading, onCardClick, hideHeader = false, searchRef }: ContentDiscoveryGridProps) {
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
        const R = 6371;
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
            const urlEncoded = encodeURIComponent(post.model_url);
            window.open(`/3d/viewer?model=${urlEncoded}&name=${encodeURIComponent(post.location_name || 'Monument')}&img=${encodeURIComponent(post.image_url || '')}`, '_blank');
        }
    };

    const handleReadArticle = (e: React.MouseEvent, post: Post) => {
        e.stopPropagation();
        if (post.slug) {
            window.open(`/posts/${post.slug}`, '_blank');
        } else {
            onCardClick(post);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[100dvh] snap-y snap-mandatory overflow-y-scroll">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-[100dvh] w-full snap-start shrink-0 bg-gradient-to-b from-[#0f3b57]/60 to-[#1e3b2b]/60 animate-pulse flex items-center justify-center rounded-lg border border-white/5">
                        <LucideCompass className="text-[#C5A059]/20" size={64} />
                    </div>
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-white/30 text-sm italic">
                No discoveries found for this category yet.
            </div>
        );
    }

    return (
        <div ref={searchRef} className="w-full">
            {!hideHeader && (
                <div className="flex items-center gap-2 text-[#C5A059] mb-6 px-2">
                    <LucideHistory size={18} />
                    <h2 className="text-sm font-bold uppercase tracking-widest">
                        Discovery Grid
                    </h2>
                    <span className="text-xs bg-[#C5A059]/10 px-2 py-0.5 rounded-full border border-[#C5A059]/20">{posts.length}</span>
                </div>
            )}

            {/* ───── MOBILE: Full-Screen REELS Vertical Snap Scroll ───── */}
            <div className="md:hidden flex flex-col snap-y snap-mandatory overflow-y-scroll h-[100dvh] rounded-2xl border border-white/10 shadow-lg">
                {posts.map((post, idx) => (
                    <div
                        key={post.id}
                        className="relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden cursor-pointer"
                        onClick={() => onCardClick(post)}
                    >
                        {/* Background Image */}
                        {post.image_url ? (
                            <img
                                src={post.image_url}
                                alt={post.location_name || ''}
                                className="absolute inset-0 w-full h-full object-cover"
                                loading={idx === 0 ? 'eager' : 'lazy'}
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0f3b57] via-[#1e3b2b] to-[#8B0000]/40" />
                        )}

                        {/* Dark gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                        {/* Top badges */}
                        <div className="absolute top-6 left-4 right-4 flex justify-between items-start z-20">
                            <span className="bg-[#8B0000]/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
                                {post.location_type?.replace(/_/g, ' ') || 'Heritage'}
                            </span>
                            {userLoc && post.lat && post.lng && (
                                <span className="bg-black/60 backdrop-blur-md text-[#FFD700] text-[10px] font-bold px-3 py-1 rounded-full border border-[#FFD700]/30 flex items-center gap-1">
                                    <LucideMapPin size={10} />
                                    {getDistance(userLoc.lat, userLoc.lng, post.lat, post.lng)} km
                                </span>
                            )}
                        </div>

                        {/* Bottom content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col gap-4">
                            {/* Title */}
                            <div>
                                <h3 className="text-white text-2xl font-black drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] leading-tight mb-1">
                                    {post.location_name}
                                </h3>
                                {post.city && (
                                    <p className="text-[#C5A059] text-sm font-medium drop-shadow-md">
                                        {post.city}
                                    </p>
                                )}
                                {post.summary && (
                                    <p className="text-white/70 text-xs line-clamp-2 mt-1 drop-shadow-md">
                                        {post.summary}
                                    </p>
                                )}
                            </div>

                            {/* DUAL ACTION buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => handleReadArticle(e, post)}
                                    className="flex-1 py-3 flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-wider active:scale-95"
                                >
                                    <LucideBookOpen size={14} />
                                    <span>Read Article</span>
                                </button>
                                {post.model_url ? (
                                    <button
                                        onClick={(e) => handleView3D(e, post)}
                                        className="flex-1 py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B0000]/60 to-[#FFD700]/20 hover:from-[#C5A059] hover:to-[#FFD700] backdrop-blur-md text-[#FFD700] hover:text-black border border-[#FFD700]/40 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest active:scale-95 shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                                    >
                                        <LucideBox size={14} />
                                        <span>View 3D</span>
                                    </button>
                                ) : (
                                    post.lat && post.lng && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${post.lat},${post.lng}`, '_blank');
                                            }}
                                            className="flex-1 py-3 flex items-center justify-center gap-2 bg-[#1a237e]/50 hover:bg-[#1a237e]/80 backdrop-blur-md text-blue-200 border border-blue-500/30 rounded-2xl transition-all text-[11px] font-bold uppercase tracking-wider active:scale-95"
                                        >
                                            <LucideNavigation size={14} />
                                            <span>Navigate</span>
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Scroll hint */}
                            {idx < posts.length - 1 && (
                                <div className="flex justify-center pb-2">
                                    <span className="text-white/30 text-[10px] animate-bounce">↓ Swipe</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ───── DESKTOP: High-Quality Card Grid ───── */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                    <div
                        key={post.id}
                        onClick={() => onCardClick(post)}
                        className="group relative h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] cursor-pointer hover:border-[#FFD700]/50 hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,215,0,0.12)]"
                    >
                        {post.image_url ? (
                            <img src={post.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-85 transition-opacity duration-300" />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0f3b57] via-[#1e3b2b] to-[#8B0000]/30 flex items-center justify-center">
                                <LucideCompass className="text-white/10" size={48} />
                            </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/98 via-black/75 to-transparent flex flex-col gap-3 z-10">
                            <div>
                                <h3 className="text-white font-bold text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight truncate">
                                    {post.location_name}
                                </h3>
                                <div className="flex items-center justify-between mt-1">
                                    {post.city && <span className="text-[#C5A059] text-[11px]">{post.city}</span>}
                                    {userLoc && post.lat && post.lng ? (
                                        <span className="text-[#FFD700] text-[10px] flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-full border border-[#FFD700]/20">
                                            <LucideMapPin size={9} />
                                            {getDistance(userLoc.lat, userLoc.lng, post.lat, post.lng)} km
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={(e) => handleReadArticle(e, post)}
                                    className="flex-1 py-2 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm"
                                >
                                    <LucideBookOpen size={12} />
                                    <span>Read Article</span>
                                </button>
                                {post.model_url && (
                                    <button
                                        onClick={(e) => handleView3D(e, post)}
                                        className="flex-1 py-2 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#8B0000]/50 to-[#FFD700]/15 hover:from-[#C5A059] hover:to-[#FFD700] text-[#FFD700] hover:text-black border border-[#FFD700]/30 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest backdrop-blur-sm"
                                    >
                                        <LucideBox size={12} />
                                        <span>View 3D</span>
                                    </button>
                                )}
                                {post.lat && post.lng && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${post.lat},${post.lng}`, '_blank');
                                        }}
                                        className="p-2 flex items-center justify-center bg-[#1a237e]/40 hover:bg-[#1a237e]/80 text-blue-200 border border-blue-500/30 rounded-xl transition-all backdrop-blur-sm"
                                        title="Navigate"
                                    >
                                        <LucideNavigation size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
