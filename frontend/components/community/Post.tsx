"use client";

import React, { useState, useEffect } from "react";
import { Heart, MessageSquare, Share2, MapPin, CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { createClient } from "../../utils/supabase/client";

interface PostProps {
    id: string;
    user: { name: string; avatar: string };
    content: string;
    location: string;
    time: string;
    likes: number;
    comments: number;
    image?: string;
    isHighlyRecommended?: boolean;
}

export default function Post({ post }: { post: PostProps }) {
    const { lang } = useLanguage();
    const isAr = lang === "ar";
    const supabase = createClient();

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [shared, setShared] = useState(false);
    const [loadingLike, setLoadingLike] = useState(false);

    useEffect(() => {
        const checkLikeStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('post_likes')
                .select('id')
                .eq('post_id', post.id)
                .eq('user_id', user.id)
                .single();

            if (data) setLiked(true);
        };

        checkLikeStatus();
    }, [post.id, supabase]);

    const handleLike = async () => {
        setLoadingLike(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert(isAr ? "يرجى تسجيل الدخول للإعجاب بالمنشور" : "Please login to like this post");
                setLoadingLike(false);
                return;
            }

            if (liked) {
                // Unlike
                const { error } = await supabase
                    .from('post_likes')
                    .delete()
                    .eq('post_id', post.id)
                    .eq('user_id', user.id);

                if (!error) {
                    setLiked(false);
                    setLikeCount(prev => prev - 1);
                    // Update post count
                    await supabase.from('posts').update({ likes_count: likeCount - 1 }).eq('id', post.id);
                }
            } else {
                // Like
                const { error } = await supabase
                    .from('post_likes')
                    .insert({ post_id: post.id, user_id: user.id });

                if (!error) {
                    setLiked(true);
                    setLikeCount(prev => prev + 1);
                    // Update post count
                    await supabase.from('posts').update({ likes_count: likeCount + 1 }).eq('id', post.id);
                }
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setLoadingLike(false);
        }
    };

    const handleShare = async () => {
        const shareText = `${post.user.name} في ${post.location}:\n"${post.content}"\n\n🇲🇦 MoroVerse — Heritage Hub`;
        const shareUrl = `${window.location.origin}/community`;

        if (navigator.share) {
            try {
                await navigator.share({ title: `MoroVerse — ${post.location}`, text: shareText, url: shareUrl });
            } catch (_) { }
        } else {
            // Fallback: copy to clipboard
            const fullText = `${shareText}\n${shareUrl}`;
            navigator.clipboard.writeText(fullText).then(() => {
                setShared(true);
                setTimeout(() => setShared(false), 2500);
            });
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl mb-4 relative hover:border-white/10 transition-colors">
            {post.isHighlyRecommended && (
                <div className={`absolute top-0 ${isAr ? "left-8" : "right-8"} bg-green-500/10 text-green-400 text-[10px] font-bold uppercase py-1 px-3 rounded-b-lg border border-green-500/20 flex items-center gap-1.5 backdrop-blur-md`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {isAr ? "نصيحة قيمة" : "Highly Recommended"}
                </div>
            )}

            <div className="flex items-start gap-4">
                <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full border border-[#C5A059]/30 shrink-0 object-cover" />
                <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-white text-base truncate">{post.user.name}</h4>
                        <span className="text-xs text-white/40 shrink-0 ml-2">{post.time}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#C5A059]/80 text-[11px] mb-3 font-medium uppercase tracking-wider">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{post.location}</span>
                    </div>

                    <p className="text-white/80 leading-relaxed mb-4 text-sm md:text-base whitespace-pre-wrap">{post.content}</p>

                    {post.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/5 bg-black/50">
                            <img src={post.image} alt="User experience" className="w-full max-h-[400px] object-cover" />
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-5">
                            <button
                                onClick={handleLike}
                                disabled={loadingLike}
                                className={`flex items-center gap-2 transition-colors group ${liked ? "text-[#C5A059]" : "text-white/50 hover:text-[#C5A059]"}`}
                            >
                                {loadingLike ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Heart className={`w-5 h-5 transition-all ${liked ? "fill-[#C5A059] scale-110" : "group-hover:fill-[#C5A059]/20"}`} />
                                )}
                                <span className="text-sm font-medium">{likeCount}</span>
                            </button>
                            <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                                <MessageSquare className="w-5 h-5" />
                                <span className="text-sm font-medium">{post.comments}</span>
                            </button>
                        </div>

                        <button
                            onClick={handleShare}
                            className={`flex items-center gap-2 transition-all px-3 py-1.5 rounded-lg text-sm font-medium ${shared ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-white/50 hover:text-white hover:bg-white/5"}`}
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {shared ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "مشاركة" : "Share")}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
