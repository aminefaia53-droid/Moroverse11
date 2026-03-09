"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "../../context/LanguageContext";
import SmartPostBox from "../../components/community/SmartPostBox";
import Post from "../../components/community/Post";
import SmartSidebar from "../../components/SmartSidebar";
import MoroVerseLogo from "../../components/MoroVerseLogo";

// Dynamically import map to avoid SSR issues with Leaflet
const FeedMap = dynamic(() => import("../../components/community/FeedMap"), { ssr: false });

// Mock Database
const MOCK_POSTS = [
    {
        id: "1",
        user: { name: "Ahmed M.", avatar: "https://i.pravatar.cc/150?img=11" },
        content: "Just witnessed the most breathtaking sunset over the Hassan Tower. The blend of history and nature is perfectly preserved here.",
        contentAr: "شهدت للتو غروب شمس يحبس الأنفاس فوق صومعة حسان. مزيج التاريخ والطبيعة محفوظ بشكل مثالي هنا.",
        location: "Rabat",
        cityId: "rabat",
        time: "2 hours ago",
        likes: 342,
        comments: 24,
        image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&q=80",
        isHighlyRecommended: true,
    },
    {
        id: "2",
        user: { name: "Sarah K.", avatar: "https://i.pravatar.cc/150?img=5" },
        content: "Wandering through the blue alleys of Chefchaouen feels like walking in a dream. Pro tip: Wake up before 8 AM for photos without tourists!",
        contentAr: "التجول في أزقة شفشاون الزرقاء يبدو وكأنه المشي في حلم. نصيحة للمحترفين: استيقظ قبل الثامنة صباحاً لالتقاط الصور بدون سياح!",
        location: "Chefchaouen",
        cityId: "chefchaouen",
        time: "5 hours ago",
        likes: 512,
        comments: 89,
        image: "https://images.unsplash.com/photo-1552604617-eea98aa27234?auto=format&fit=crop&q=80",
        isHighlyRecommended: true,
    },
    {
        id: "3",
        user: { name: "Youssef T.", avatar: "https://i.pravatar.cc/150?img=33" },
        content: "The Jemaa el-Fnaa square at night is an absolute sensory overload in the best way possible. The food, the music, the energy!",
        contentAr: "ساحة جامع الفنا ليلاً هي عبارة عن جرعة زائدة للحواس بأفضل طريقة ممكنة. الطعام، الموسيقى، الطاقة!",
        location: "Marrakech",
        cityId: "marrakech",
        time: "1 day ago",
        likes: 89,
        comments: 12,
    }
];

export default function CommunityPage() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';

    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

    // Filter posts based on selected city on the map
    const activePosts = selectedCityId
        ? MOCK_POSTS.filter(post => post.cityId === selectedCityId)
        : MOCK_POSTS;

    return (
        <div className={`min-h-screen bg-[#050505] text-white ${isAr ? 'font-arabic' : 'font-sans'}`} dir={isAr ? 'rtl' : 'ltr'}>
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/az-subtle.png')" }} />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center bg-black/80 backdrop-blur-xl border-b border-[#C5A059]/10">
                <a href={`/?lang=${lang}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <MoroVerseLogo className="w-6 h-6" />
                    <h1 className="font-display text-xs tracking-[0.6em] text-white/70 font-medium uppercase" style={{ letterSpacing: '0.6em' }}>MOROVERSE</h1>
                </a>
                <SmartSidebar isHeaderTrigger={true} />
            </header>
            <SmartSidebar isHeaderTrigger={false} />

            <main className="pt-24 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                    {/* Feed Column (Left on LTR, Right on RTL) */}
                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col order-2 lg:order-none">
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold tracking-wider mb-2">
                                {isAr ? 'الساحة الكبرى' : 'The Grand Plaza'}
                            </h1>
                            <p className="text-white/50 text-sm md:text-base">
                                {isAr ? 'شارك تجربتك مع العالم واكتشف وجهات جديدة' : 'Share your journey with the world and discover new horizons'}
                            </p>
                        </div>

                        <SmartPostBox />

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold uppercase tracking-widest text-[#C5A059]/80">
                                {selectedCityId ? (isAr ? 'مجتمع هذه المدينة' : 'City Community') : (isAr ? 'أحدث التجارب' : 'Latest Experiences')}
                            </h2>
                            {/* Optional Filter Dropdown */}
                        </div>

                        <div className="space-y-6 overflow-y-auto pb-20 custom-scrollbar pr-2" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                            {activePosts.length > 0 ? (
                                activePosts.map(post => (
                                    <Post
                                        key={post.id}
                                        post={{
                                            ...post,
                                            content: isAr ? post.contentAr : post.content
                                        }}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-white/40 mb-4">{isAr ? 'لا توجد منشورات لهذه المدينة بعد.' : 'No posts for this city yet.'}</p>
                                    <button onClick={() => setSelectedCityId(null)} className="text-[#C5A059] hover:underline text-sm font-bold uppercase tracking-wider">
                                        {isAr ? 'عرض الكل' : 'View All'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map Column (Right on LTR, Left on RTL) */}
                    <div className="lg:col-span-6 xl:col-span-7 h-[50vh] lg:h-[calc(100vh-120px)] sticky top-24 order-1 lg:order-none">
                        <div className="w-full h-full rounded-2xl overflow-hidden relative group shadow-[0_0_50px_rgba(197,160,89,0.1)] border border-[#C5A059]/20">
                            <FeedMap
                                selectedCityId={selectedCityId}
                                onCitySelect={setSelectedCityId}
                            />

                            {/* Grandiose decorative corners */}
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#C5A059]/50 pointer-events-none rounded-tl-xl z-20 m-2 opacity-50"></div>
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#C5A059]/50 pointer-events-none rounded-tr-xl z-20 m-2 opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#C5A059]/50 pointer-events-none rounded-bl-xl z-20 m-2 opacity-50"></div>
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#C5A059]/50 pointer-events-none rounded-br-xl z-20 m-2 opacity-50"></div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
