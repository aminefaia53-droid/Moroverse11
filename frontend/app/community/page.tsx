"use client";

// Prevent Next.js static prerendering — Leaflet requires `window` which is browser-only
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import nextDynamic from "next/dynamic";
import { useLanguage } from "../../context/LanguageContext";
import SmartPostBox from "../../components/community/SmartPostBox";
import Post from "../../components/community/Post";
import SmartSidebar from "../../components/SmartSidebar";
import MoroVerseLogo from "../../components/MoroVerseLogo";
import LogoutBtn from "../../components/auth/LogoutBtn";
import { ALL_CITIES } from "../../data/morocco-geo";
import { createClient } from "../../utils/supabase/client";

// Dynamically import map to avoid SSR issues with Leaflet
const FeedMap = nextDynamic(() => import("../../components/community/FeedMap"), { ssr: false });

export default function CommunityPage() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const supabase = createClient();

    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
    const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('posts')
                .select('*, profiles(full_name, avatar_url)')
                .order('created_at', { ascending: false });

            if (selectedLandmarkId) {
                query = query.eq('landmark_id', selectedLandmarkId);
            } else if (selectedCityId) {
                query = query.eq('city_id', selectedCityId);
            }

            const { data, error } = await query;
            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedCityId, selectedLandmarkId, supabase]);

    useEffect(() => {
        fetchPosts();

        // Real-time subscription
        const channel = supabase
            .channel('public:posts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
                // If it matches content filters, refresh or add
                fetchPosts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchPosts, supabase]);

    const selectedCity = ALL_CITIES.find(c => c.id === selectedCityId);

    return (
        <div className={`min-h-screen bg-[#050505] text-white ${isAr ? 'font-arabic' : 'font-sans'}`} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/az-subtle.png')" }} />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center bg-black/80 backdrop-blur-sm border-b border-[#C5A059]/10">
                <a href={`/?lang=${lang}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <MoroVerseLogo className="w-6 h-6" />
                    <h1 className="font-display text-xs tracking-[0.6em] text-white/70 font-medium uppercase hidden md:block" style={{ letterSpacing: '0.6em' }}>MOROVERSE</h1>
                </a>
                <div className="flex items-center gap-3">
                    <LogoutBtn />
                    <SmartSidebar isHeaderTrigger={true} />
                </div>
            </header>
            <SmartSidebar isHeaderTrigger={false} />

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Feed Column (Shows second on mobile) */}
                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col order-2">
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold tracking-wider mb-1">
                                {selectedCity ? (isAr ? selectedCity.nameAr : selectedCity.name) : (isAr ? 'الساحة الكبرى' : 'The Grand Plaza')}
                            </h1>
                            <p className="text-white/50 text-sm">
                                {isAr ? 'شارك تجربتك مع العالم' : 'Share your Moroccan journey with the world'}
                            </p>
                        </div>

                        <SmartPostBox onPostCreated={fetchPosts} selectedCityId={selectedCityId} />

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059]/70">
                                {selectedLandmarkId
                                    ? (isAr ? 'منشورات المعلم' : 'Landmark Posts')
                                    : selectedCityId
                                        ? (isAr ? 'مجتمع المدينة' : 'City Community')
                                        : (isAr ? 'أحدث التجارب' : 'Latest Experiences')
                                }
                            </h2>
                            {(selectedCityId || selectedLandmarkId) && (
                                <button
                                    onClick={() => { setSelectedCityId(null); setSelectedLandmarkId(null); }}
                                    className="text-[#C5A059]/60 hover:text-[#C5A059] text-xs font-bold uppercase tracking-wider underline-offset-2 hover:underline"
                                >
                                    {isAr ? 'عرض الكل' : 'View All'}
                                </button>
                            )}
                        </div>

                        <div className="space-y-4 overflow-y-auto pb-20" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059]"></div>
                                </div>
                            ) : posts.length > 0 ? (
                                posts.map(post => (
                                    <Post
                                        key={post.id}
                                        post={{
                                            id: post.id,
                                            user: {
                                                name: post.profiles?.full_name || "Unknown Traveler",
                                                avatar: post.profiles?.avatar_url || "https://i.pravatar.cc/150?img=68"
                                            },
                                            content: post.content,
                                            location: post.city_id ? (ALL_CITIES.find(c => c.id === post.city_id)?.name || post.city_id) : "Morocco",
                                            time: new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                                            likes: post.likes_count || 0,
                                            comments: post.comments_count || 0,
                                            image: post.image_url,
                                            isHighlyRecommended: post.is_highly_recommended
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-4xl mb-4">🏔️</p>
                                    <p className="text-white/40 mb-4 font-medium">
                                        {isAr ? 'لا توجد منشورات لهذا الاختيار بعد.' : 'No posts for this selection yet.'}
                                    </p>
                                    <p className="text-white/20 text-sm">
                                        {isAr ? 'كن أول من يشارك تجربته!' : 'Be the first to share your experience!'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map Column (Shows first on mobile) */}
                    <div className="lg:col-span-6 xl:col-span-7 h-[40vh] md:h-[55vh] lg:h-[calc(100vh-120px)] sticky top-24 order-1">
                        <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-[0_0_50px_rgba(197,160,89,0.1)] border border-[#C5A059]/20">
                            <FeedMap
                                selectedCityId={selectedCityId}
                                onCitySelect={(id) => { setSelectedCityId(id); setSelectedLandmarkId(null); }}
                                onLandmarkSelect={(id) => { setSelectedLandmarkId(id); setSelectedCityId(null); }}
                                selectedLandmarkId={selectedLandmarkId}
                                showLandmarks={true}
                            />
                            {/* Gold corners */}
                            <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#C5A059]/60 pointer-events-none rounded-tl-xl z-20 m-2" />
                            <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#C5A059]/60 pointer-events-none rounded-tr-xl z-20 m-2" />
                            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#C5A059]/60 pointer-events-none rounded-bl-xl z-20 m-2" />
                            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#C5A059]/60 pointer-events-none rounded-br-xl z-20 m-2" />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
