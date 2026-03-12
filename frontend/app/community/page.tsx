"use client";

// Prevent Next.js static prerendering — Leaflet requires `window` which is browser-only
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import nextDynamic from "next/dynamic";
import { useLanguage } from "../../context/LanguageContext";
import SmartSidebar from "../../components/SmartSidebar";
import MoroVerseLogo from "../../components/MoroVerseLogo";
import LogoutBtn from "../../components/auth/LogoutBtn";
import CommunityFeed from "../../components/community/CommunityFeed";

// Dynamically import map to avoid SSR issues with Leaflet
const FeedMap = nextDynamic(() => import("../../components/community/FeedMap"), { ssr: false });

export default function CommunityPage() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
    const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);

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
                        <CommunityFeed 
                            selectedCityId={selectedCityId}
                            selectedLandmarkId={selectedLandmarkId}
                            onClearSelection={() => {
                                setSelectedCityId(null);
                                setSelectedLandmarkId(null);
                            }}
                        />
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
