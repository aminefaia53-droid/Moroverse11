"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "../../context/LanguageContext";
import SmartPostBox from "../../components/community/SmartPostBox";
import Post from "../../components/community/Post";
import SmartSidebar from "../../components/SmartSidebar";
import MoroVerseLogo from "../../components/MoroVerseLogo";
import LogoutBtn from "../../components/auth/LogoutBtn";
import { ALL_CITIES } from "../../components/community/FeedMap";

// Dynamically import map to avoid SSR issues with Leaflet
const FeedMap = dynamic(() => import("../../components/community/FeedMap"), { ssr: false });

const MOCK_POSTS = [
    {
        id: "1",
        user: { name: "Ahmed M.", avatar: "https://i.pravatar.cc/150?img=11" },
        content: "Just witnessed the most breathtaking sunset over the Hassan Tower. The blend of history and nature is perfectly preserved here.",
        contentAr: "شهدت للتو غروب شمس يحبس الأنفاس فوق صومعة حسان. مزيج التاريخ والطبيعة محفوظ بشكل مثالي هنا.",
        location: "Rabat",
        cityId: "rabat",
        landmarkId: "hassan",
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
        landmarkId: "badii_palace",
        time: "1 day ago",
        likes: 189,
        comments: 32,
        image: "https://images.unsplash.com/photo-1597212720133-9e79af6e9e29?auto=format&fit=crop&q=80",
    },
    {
        id: "4",
        user: { name: "Fatima Z.", avatar: "https://i.pravatar.cc/150?img=25" },
        content: "Aït Ben Haddou is like stepping into a dream from another century. The golden clay walls glow at sunrise — pure magic!",
        contentAr: "أيت بنحدو كأنك تدخل إلى حلم من قرن آخر. الجدران الطينية الذهبية تتوهج عند الشروق — سحر خالص!",
        location: "Ouarzazate",
        cityId: "ouarzazate",
        landmarkId: "ait_benhaddou",
        time: "2 days ago",
        likes: 423,
        comments: 67,
        image: "https://images.unsplash.com/photo-1490648785906-2a78e1d6f5c0?auto=format&fit=crop&q=80",
        isHighlyRecommended: true,
    },
    {
        id: "5",
        user: { name: "Karim A.", avatar: "https://i.pravatar.cc/150?img=39" },
        content: "The ancient Roman ruins at Volubilis are absolutely breathtaking. Don't miss the perfectly preserved mosaics!",
        contentAr: "الآثار الرومانية القديمة في وليلي رائعة تماماً. لا تفوتك الفسيفساء المحفوظة بشكل مثالي!",
        location: "Meknes",
        cityId: "meknes",
        landmarkId: "volubilis",
        time: "3 days ago",
        likes: 156,
        comments: 18,
    }
];

export default function CommunityPage() {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';

    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
    const [selectedLandmarkId, setSelectedLandmarkId] = useState<string | null>(null);

    // Filter posts by city and/or landmark
    const activePosts = MOCK_POSTS.filter(post => {
        if (selectedLandmarkId) return post.landmarkId === selectedLandmarkId;
        if (selectedCityId) return post.cityId === selectedCityId;
        return true;
    });

    const selectedCity = ALL_CITIES.find(c => c.id === selectedCityId);

    return (
        <div className={`min-h-screen bg-[#050505] text-white ${isAr ? 'font-arabic' : 'font-sans'}`} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/az-subtle.png')" }} />

            {/* Header */}
            <header className="fixed top-0 w-full z-50 py-3 px-6 md:px-10 flex justify-between items-center bg-black/80 backdrop-blur-xl border-b border-[#C5A059]/10">
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

                    {/* Feed Column */}
                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col order-2 lg:order-none">
                        <div className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-serif text-[#C5A059] font-bold tracking-wider mb-1">
                                {selectedCity ? (isAr ? selectedCity.nameAr : selectedCity.name) : (isAr ? 'الساحة الكبرى' : 'The Grand Plaza')}
                            </h1>
                            <p className="text-white/50 text-sm">
                                {isAr ? 'شارك تجربتك مع العالم' : 'Share your Moroccan journey with the world'}
                            </p>
                        </div>

                        <SmartPostBox />

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-[#C5A059]/70">
                                {selectedLandmarkId
                                    ? (isAr ? 'منشورات المعلم' : 'Landmark Posts')
                                    : selectedCityId
                                        ? (isAr ? 'مجتمع المدينة' : 'City Community')
                                        : (isAr ? 'أحدث التجارب' : 'Latest Experiences')
                                }
                            </h2>
                            {(selectedCityId || selectedLandmarkId) && (
                                <button
                                    onClick={() => { setSelectedCityId(null); setSelectedLandmarkId(null); }}
                                    className="text-[#C5A059]/60 hover:text-[#C5A059] text-xs font-bold uppercase tracking-wider underline-offset-2 hover:underline"
                                >
                                    {isAr ? 'عرض الكل' : 'View All'}
                                </button>
                            )}
                        </div>

                        <div className="space-y-4 overflow-y-auto pb-20" style={{ maxHeight: 'calc(100vh - 280px)' }}>
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
                                    <p className="text-4xl mb-4">🏔️</p>
                                    <p className="text-white/40 mb-4 font-medium">
                                        {isAr ? 'لا توجد منشورات لهذا الاختيار بعد.' : 'No posts for this selection yet.'}
                                    </p>
                                    <p className="text-white/20 text-sm">
                                        {isAr ? 'كن أول من يشارك تجربته!' : 'Be the first to share your experience!'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map Column */}
                    <div className="lg:col-span-6 xl:col-span-7 h-[55vh] lg:h-[calc(100vh-120px)] sticky top-24 order-1 lg:order-none">
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
