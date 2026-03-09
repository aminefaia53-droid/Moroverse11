"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";

export default function CommunityPulse() {
    const { lang } = useLanguage();
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        // Placeholder data until Supabase real-time is hooked up
        setPosts([
            { id: 1, user: "Ahmed M.", location: "Hassan Tower", time: "2 min ago", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80&w=200&h=200", tip: "Best time to visit is sunset!" },
            { id: 2, user: "Sarah K.", location: "Chefchaouen", time: "15 min ago", image: "https://images.unsplash.com/photo-1552604617-eea98aa27234?auto=format&fit=crop&q=80&w=200&h=200", tip: "The blue hues are mesmerizing." },
            { id: 3, user: "Youssef T.", location: "Merzouga", time: "1 hr ago", image: "https://images.unsplash.com/photo-1549474776-6d60cda24e93?auto=format&fit=crop&q=80&w=200&h=200", tip: "Incredible camel ride experience." },
        ]);
    }, []);

    const isAr = lang === 'ar';

    return (
        <div className={`fixed top-24 ${isAr ? 'left-6' : 'right-6'} z-40 hidden xl:flex flex-col gap-4 w-72`}>
            <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-2 mb-4 text-[#C5A059]">
                    <Activity className="w-5 h-5 animate-pulse" />
                    <h3 className="font-display tracking-[0.2em] text-xs uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-white">
                        {isAr ? 'نبض المجتمع' : 'Community Pulse'}
                    </h3>
                </div>

                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/5 border border-white/5 rounded-xl p-3 hover:bg-white/10 transition-colors group cursor-pointer"
                        >
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#C5A059]/30">
                                    <img src={post.image} alt={post.location} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] text-white/90 font-bold truncate pr-2">{post.user}</span>
                                        <span className="text-[8px] text-[#C5A059]/70 whitespace-nowrap">{post.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[9px] text-white/50 mb-1.5">
                                        <MapPin className="w-2.5 h-2.5" />
                                        <span className="truncate">{post.location}</span>
                                    </div>
                                    <p className="text-[10px] text-white/70 line-clamp-2 leading-snug">"{post.tip}"</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Link href="/community" className="mt-4 w-full py-2.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] text-[10px] uppercase tracking-widest font-bold rounded-xl flex items-center justify-center gap-2 transition-all group border border-[#C5A059]/20">
                    {isAr ? 'شارك تجربتك' : 'Share Experience'}
                    <ArrowRight className={`w-3 h-3 group-hover:translate-x-1 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`} />
                </Link>
            </div>
        </div>
    );
}
