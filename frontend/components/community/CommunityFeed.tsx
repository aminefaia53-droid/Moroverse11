"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { createClient } from "../../utils/supabase/client";
import { ALL_CITIES } from "../../data/morocco-geo";
import SmartPostBox from "./SmartPostBox";
import Post from "./Post";
import MoroVerseStories from "./MoroVerseStories";

interface CommunityFeedProps {
    selectedCityId?: string | null;
    selectedLandmarkId?: string | null;
    onClearSelection: () => void;
}

export default function CommunityFeed({ selectedCityId, selectedLandmarkId, onClearSelection }: CommunityFeedProps) {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const supabase = createClient();

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('community_posts')
                .select('*, profiles(full_name, avatar_url, username)')
                .order('created_at', { ascending: false });

            // Depending on the logic, you can filter by location Name or Lat/Lng bounding boxes
            if (selectedCityId) {
                const city = ALL_CITIES.find(c => c.id === selectedCityId);
                if (city) {
                    const nameAr = city.nameAr;
                    const nameEn = city.name;
                    query = query.or(`location_name.eq.${nameEn},location_name.eq.${nameAr}`);
                }
            }

            const { data, error } = await query;
            if (error) {
                 // Suppress if the table doesn't exist yet to avoid screen crashes before SQL is run
                 if (error.code !== '42P01') throw error;
            }
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching community posts:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedCityId, selectedLandmarkId, supabase]);

    useEffect(() => {
        fetchPosts();

        // Real-time subscription to community_posts
        const channel = supabase
            .channel('public:community_posts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, () => {
                fetchPosts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchPosts, supabase]);

    const selectedCity = ALL_CITIES.find(c => c.id === selectedCityId);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold tracking-wider mb-1">
                    {selectedCity ? (isAr ? selectedCity.nameAr : selectedCity.name) : (isAr ? 'مجتمع التراث' : 'Heritage Community')}
                </h1>
                <p className="text-white/50 text-sm">
                    {isAr ? 'أحدث القصص والمنشورات من عشاق الموروث المغربي' : 'Latest stories and posts from Moroccan heritage lovers'}
                </p>
            </div>

            <MoroVerseStories />

            <SmartPostBox onPostCreated={fetchPosts} selectedCityId={selectedCityId} />

            <div className="flex justify-between items-center mb-4 mt-2">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059]/70">
                    {selectedLandmarkId
                        ? (isAr ? 'منشورات المعلم' : 'Landmark Posts')
                        : selectedCityId
                            ? (isAr ? 'مجتمع المدينة' : 'City Community')
                            : (isAr ? 'كافة المنشورات' : 'All Posts')
                    }
                </h2>
                {(selectedCityId || selectedLandmarkId) && (
                    <button
                        onClick={onClearSelection}
                        className="text-[#C5A059]/60 hover:text-[#C5A059] text-xs font-bold uppercase tracking-wider underline-offset-2 hover:underline"
                    >
                        {isAr ? 'عرض الكل' : 'View All'}
                    </button>
                )}
            </div>

            <div className="space-y-4 overflow-y-auto pb-20" style={{ maxHeight: 'calc(100vh - 400px)' }}>
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
                                    name: post.profiles?.full_name || post.profiles?.username || "Unknown Traveler",
                                    avatar: post.profiles?.avatar_url || "https://i.pravatar.cc/150?img=68"
                                },
                                content: post.content,
                                location: post.location_name || "Morocco",
                                time: new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                                likes: post.likes_count || 0,
                                comments: post.comments_count || 0,
                                image: post.image_url,
                                isHighlyRecommended: post.likes_count > 10 // Mock recommendation logic based on likes
                            }}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-4xl mb-4">🕌</p>
                        <p className="text-white/40 mb-3 font-medium">
                            {isAr ? 'لا توجد منشورات حتى الآن.' : 'No posts yet.'}
                        </p>
                        <p className="text-white/20 text-sm pb-2">
                            {isAr ? 'كن أول من يشارك قصته في هذا المكان!' : 'Be the first to share your story here!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
