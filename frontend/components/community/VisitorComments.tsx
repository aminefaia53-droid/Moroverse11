"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Heart, Share2, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface Comment {
    id: string;
    user: { name: string; avatar: string };
    content: string;
    likes: number;
    time: string;
    image?: string;
    isHighlyRecommended?: boolean;
}

export default function VisitorComments({ entityId, entityName }: { entityId: string, entityName: string }) {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';

    // Placeholder data
    const [comments] = useState<Comment[]>([
        {
            id: "1",
            user: { name: "Youssef Alaoui", avatar: "https://i.pravatar.cc/150?img=11" },
            content: isAr ? "تجربة لا تنسى! المكان يجعلك تسافر عبر الزمن." : "An unforgettable experience! The place makes you travel through time.",
            likes: 124,
            time: "2 hours ago",
            isHighlyRecommended: true,
            image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=600&h=400",
        },
        {
            id: "2",
            user: { name: "Maria Garcia", avatar: "https://i.pravatar.cc/150?img=5" },
            content: isAr ? "أنصح بزيارته في الصباح الباكر لتجنب الازدحام." : "I recommend visiting early in the morning to avoid crowds. The light is perfect for photos.",
            likes: 89,
            time: "5 hours ago",
        }
    ]);

    return (
        <section className="py-16 max-w-4xl mx-auto w-full px-4">
            <div className="flex items-center gap-3 mb-10 border-b border-[#C5A059]/20 pb-4">
                <MessageSquare className="w-8 h-8 text-[#C5A059]" />
                <h3 className="text-3xl font-serif text-[#C5A059] font-bold">
                    {isAr ? 'ماذا يقول الزوار الآن؟' : 'What Visitors Say Now?'}
                </h3>
            </div>

            <div className="space-y-8">
                {comments.map((comment) => (
                    <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden"
                    >
                        {comment.isHighlyRecommended && (
                            <div className={`absolute top-0 ${isAr ? 'left-8' : 'right-8'} bg-green-500/20 text-green-400 text-[10px] font-bold uppercase py-1 px-3 rounded-b-lg border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center gap-1`}>
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                {isAr ? 'ينصح به بشدة' : 'Highly Recommended'}
                            </div>
                        )}

                        <div className="flex items-start gap-4">
                            <img src={comment.user.avatar} alt={comment.user.name} className="w-12 h-12 rounded-full border-2 border-[#C5A059]/50" />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-white text-lg">{comment.user.name}</h4>
                                    <span className="text-xs text-white/50">{comment.time}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#C5A059]/70 text-xs mb-3">
                                    <MapPin className="w-3 h-3" />
                                    <span>{entityName}</span>
                                </div>
                                <p className="text-white/80 leading-relaxed mb-4">{comment.content}</p>

                                {comment.image && (
                                    <div className="mb-4 rounded-xl overflow-hidden max-h-[300px] border border-white/10">
                                        <img src={comment.image} alt="User experience" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                    </div>
                                )}

                                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
                                    <button className="flex items-center gap-2 text-white/60 hover:text-[#C5A059] transition-colors group">
                                        <Heart className="w-5 h-5 group-hover:fill-[#C5A059]/20" />
                                        <span className="text-sm font-medium">{comment.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                        <span className="text-sm font-medium">{isAr ? 'تعليق' : 'Comment'}</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors ml-auto">
                                        <Share2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">{isAr ? 'مشاركة' : 'Share'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button className="px-8 py-3 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 text-[#C5A059] rounded-xl font-bold tracking-wider uppercase transition-all">
                    {isAr ? 'اكتب تجربتك هنا' : 'Share your experience here'}
                </button>
            </div>
        </section>
    );
}
