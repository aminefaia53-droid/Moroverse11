"use client";

import React, { useState } from "react";
import { Heart, MessageSquare, Share2, MapPin, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

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

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [shared, setShared] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
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
                <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full border border-[#C5A059]/30 shrink-0" />
                <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-white text-base truncate">{post.user.name}</h4>
                        <span className="text-xs text-white/40 shrink-0 ml-2">{post.time}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#C5A059]/80 text-[11px] mb-3 font-medium uppercase tracking-wider">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{post.location}</span>
                    </div>

                    <p className="text-white/80 leading-relaxed mb-4 text-sm md:text-base">{post.content}</p>

                    {post.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/5 bg-black/50">
                            <img src={post.image} alt="User experience" className="w-full max-h-[350px] object-cover" />
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-5">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 transition-colors group ${liked ? "text-[#C5A059]" : "text-white/50 hover:text-[#C5A059]"}`}
                            >
                                <Heart className={`w-5 h-5 transition-all ${liked ? "fill-[#C5A059] scale-110" : "group-hover:fill-[#C5A059]/20"}`} />
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
