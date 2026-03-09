"use client";

import React from "react";
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
    const isAr = lang === 'ar';

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-xl mb-6 relative hover:border-white/10 transition-colors">
            {post.isHighlyRecommended && (
                <div className={`absolute top-0 ${isAr ? 'left-8' : 'right-8'} bg-green-500/10 text-green-400 text-[10px] font-bold uppercase py-1 px-3 rounded-b-lg border border-green-500/20 flex items-center gap-1.5 backdrop-blur-md`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {isAr ? 'نصيحة قيمة' : 'Valuable Tip'}
                </div>
            )}

            <div className="flex items-start gap-4">
                <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full border border-[#C5A059]/30" />
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-white text-base">{post.user.name}</h4>
                        <span className="text-xs text-white/40">{post.time}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#C5A059]/80 text-[11px] mb-3 font-medium uppercase tracking-wider">
                        <MapPin className="w-3 h-3" />
                        <span>{post.location}</span>
                    </div>

                    <p className="text-white/80 leading-relaxed mb-4 text-sm md:text-base">{post.content}</p>

                    {post.image && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-white/5 bg-black/50">
                            <img src={post.image} alt="User experience" className="w-full max-h-[400px] object-cover" />
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] transition-colors group">
                                <Heart className="w-5 h-5 group-hover:fill-[#C5A059]/20" />
                                <span className="text-sm font-medium">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                                <MessageSquare className="w-5 h-5" />
                                <span className="text-sm font-medium">{post.comments}</span>
                            </button>
                        </div>

                        <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                            <Share2 className="w-5 h-5" />
                            <span className="text-sm font-medium hidden sm:inline">{isAr ? 'مشاركة' : 'Share'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
