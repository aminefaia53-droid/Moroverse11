"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

const FixedSizeList = dynamic<any>(
  () => import("react-window").then((mod: any) => mod.FixedSizeList || mod.default?.FixedSizeList),
  { ssr: false }
);
import { useLanguage } from "../../context/LanguageContext";
import { ALL_CITIES } from "../../data/morocco-geo";
import { SocialService } from "../../services/SocialService";
import { Post as PostType } from "../../types/social";
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [listHeight, setListHeight] = useState(600);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            // Filtering logic moved locally for now, 
            // In a future step, this will use SocialService with ViewportBounds for map-syncing
            let data = await SocialService.getPosts();

            if (selectedCityId) {
                const city = ALL_CITIES.find(c => c.id === selectedCityId);
                if (city) {
                    const nameAr = city.nameAr;
                    const nameEn = city.name;
                    data = data.filter(p => p.location_name === nameEn || p.location_name === nameAr);
                }
            }
            setPosts(data);
        } catch (error) {
            console.error("Error fetching community posts:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedCityId]);

    useEffect(() => {
        fetchPosts();
        const subscription = SocialService.subscribeToPosts(() => fetchPosts());

        // Handle height responsiveness for virtualization
        const updateHeight = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setListHeight(window.innerHeight - rect.top - 100);
            }
        };

        window.addEventListener('resize', updateHeight);
        updateHeight();

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('resize', updateHeight);
        };
    }, [fetchPosts]);

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const post = posts[index];
        return (
            <div style={style} className="pr-2">
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
                        comments: 0, // Simplified for performance audit phase
                        image: post.image_url,
                        isHighlyRecommended: post.likes_count > 10
                    }}
                />
            </div>
        );
    };

    const selectedCity = ALL_CITIES.find(c => c.id === selectedCityId);

    return (
        <div className="flex flex-col w-full h-full" ref={containerRef}>
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

            <div className="flex-1">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059]"></div>
                    </div>
                ) : posts.length > 0 ? (
                    <FixedSizeList
                        height={listHeight}
                        itemCount={posts.length}
                        itemSize={380} // Estimated post height, improved performance over variable list
                        width="100%"
                        className="scrollbar-hide"
                    >
                        {Row}
                    </FixedSizeList>
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

