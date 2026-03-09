"use client";

import React, { useState } from "react";
import { Camera, MapPin, Send } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SmartPostBox() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';

    const [content, setContent] = useState("");
    const [location, setLocation] = useState("");

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl mb-8">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#C5A059]/50">
                    <img src="https://i.pravatar.cc/150?img=68" alt="Current User" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={isAr ? "شارك تجربتك، نصيحة، أو صورة من زيارتك..." : "Share your experience, tip, or photo..."}
                        className="w-full bg-transparent text-white/90 placeholder-white/30 resize-none outline-none min-h-[80px] text-lg"
                    />

                    {/* Tagging and Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 text-white/50 hover:text-[#C5A059] transition-colors py-1.5 px-3 rounded-xl hover:bg-white/5">
                                <Camera className="w-5 h-5" />
                                <span className="text-sm font-medium">{isAr ? 'صورة/فيديو' : 'Photo/Video'}</span>
                            </button>
                            <button className="flex items-center gap-2 text-[#C5A059] transition-colors py-1.5 px-3 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/20">
                                <MapPin className="w-5 h-5" />
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder={isAr ? "اربط بالمعلم..." : "Tag landmark..."}
                                    className="bg-transparent outline-none text-sm text-white placeholder-[#C5A059]/50 w-24 md:w-32"
                                />
                            </button>
                        </div>

                        <button
                            disabled={!content.trim()}
                            className="flex items-center gap-2 bg-[#C5A059] hover:bg-[#A38347] text-black font-bold py-2 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                            {isAr ? 'نشر' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
