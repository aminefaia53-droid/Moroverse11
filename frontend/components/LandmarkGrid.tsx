"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Landmark as LandmarkIcon, Crown, History, Mountain, Waves, Shield, X, Compass, Info, MapPin, ChevronRight, TowerControl as Tower, BookOpen, Search, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { Landmark } from '../data/morocco-landmarks';
import generatedContent from '../data/generated-content.json';
import { generateArticleSchema, getMetaTags } from '../utils/seo';
import { getArticle } from '../data/moroverse-content';
import { LangCode } from '../types/language';
import TranslatedText from './TranslatedText';

const fallbackLandmarks = [
    {
        id: "hassan-silo",
        name: { en: "Hassan's Silo", ar: "صومعة حسان" },
        city: { en: "Rabat", ar: "الرباط" },
        region: "Rabat-Salé-Kénitra",
        type: "Landmark",
        foundation: { en: "1195", ar: "1195" },
        visualSoul: "Tower",
        history: {
            en: "An incomplete mosque in Rabat, representing the architectural zenith of the Almohad dynasty.",
            ar: "صومعة مسجد غير مكتمل بالرباط، تمثل أوج العمارة الموحدية المغربية وتعتبر رمزاً سيادياً."
        },
        desc: { en: "", ar: "" },
        isPending: false
    },
    {
        id: "koutoubia",
        name: { en: "Koutoubia Mosque", ar: "مسجد الكتبية" },
        city: { en: "Marrakech", ar: "مراكش" },
        region: "Marrakech-Safi",
        type: "Landmark",
        foundation: { en: "1147", ar: "1147" },
        visualSoul: "Mosque",
        history: {
            en: "The largest mosque in Marrakech, renowned for its distinctive minaret and rich Moroccan-Andalusian history.",
            ar: "أكبر مسجد في مراكش، اشتهر بصومعته المتميزة وتاريخه المرابطي والموحدي العريق."
        },
        desc: { en: "", ar: "" },
        isPending: false
    },
    {
        id: "volubilis",
        name: { en: "Volubilis", ar: "وليلي" },
        city: { en: "Meknes", ar: "مكناس" },
        region: "Fès-Meknès",
        type: "Landmark",
        foundation: { en: "3rd century BC", ar: "القرن 3 قبل الميلاد" },
        visualSoul: "Ruin",
        history: {
            en: "A partly excavated Berber-Roman city near Meknes, showcasing Morocco's ancient history.",
            ar: "مدينة تاريخية وجزء من التراث العالمي، تعكس عراقة الحضارة المغربية منذ العصور المورية القديمة."
        },
        desc: { en: "", ar: "" },
        isPending: false
    }
];

const rawLandmarks = (generatedContent.landmarks && generatedContent.landmarks.length > 0) ? (generatedContent.landmarks as any[]) : fallbackLandmarks;
const dynamicLandmarks: Landmark[] = rawLandmarks.map(l => ({
    ...l,
    foundation: l.foundation || { en: 'Historical', ar: 'تاريخي' },
    history: l.history || l.desc || { en: '', ar: '' },
    visualSoul: l.visualSoul || 'Mosque'
})) as Landmark[];

const LandmarkSoulIcon = ({ soul, className }: { soul: Landmark['visualSoul']; className?: string }) => {
    switch (soul) {
        case 'Mosque': return <LandmarkIcon className={className} />;
        case 'Tower': return <Tower className={className} />;
        case 'Palace': return <Crown className={className} />;
        case 'Ruin': return <History className={className} />;
        case 'Cave': return <Mountain className={className} />;
        case 'Lighthouse': return <Waves className={className} />;
        case 'Fortress': return <Shield className={className} />;
        default: return <LandmarkIcon className={className} />;
    }
};

export default function LandmarkGrid({ lang }: { lang: LangCode }) {
    const router = useRouter();
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);

    const cities = useMemo(() => {
        const allCities = dynamicLandmarks.map(l => l.city);
        const unique = Array.from(new Set(allCities.map(c => c.en))).map(en => allCities.find(c => c.en === en)!);
        // Sort alphabetically but put Major cities first if desired (e.g. Rabat, Casablanca)
        return unique.sort((a, b) => {
            const valA = lang === 'en' ? a.en : a.ar;
            const valB = lang === 'en' ? b.en : b.ar;
            return valA.localeCompare(valB);
        });
    }, [dynamicLandmarks]);

    const filteredLandmarks = useMemo(() => {
        return dynamicLandmarks.filter(l => {
            const matchesCity = !selectedCity || l.city.en === selectedCity;
            const matchesSearch =
                l.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.name.ar.includes(searchQuery) ||
                l.city.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.city.ar.includes(searchQuery);
            return matchesCity && matchesSearch;
        });
    }, [selectedCity, searchQuery]);

    return (
        <div className="space-y-12">
            {/* Search Bar */}
            <div className={`max-w-2xl mx-auto relative group flex items-center`}>
                <Search className={`absolute ${lang === 'ar' ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-primary transition-colors z-10`} />
                <input
                    type="text"
                    dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    placeholder={lang === 'ar' ? 'بحث عن معلم أو مدينة تاريخية...' : 'Search for a landmark or historic city...'}
                    className={`w-full ${lang === 'ar' ? 'pr-14 pl-12' : 'pl-14 pr-12'} py-5 rounded-[32px] bg-black/40 border border-[#c5a059]/20 focus:border-primary focus:bg-black/60 focus:ring-0 outline-none transition-all text-sm font-medium text-white placeholder-white/30 backdrop-blur-xl`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className={`absolute ${lang === 'ar' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors z-10`}
                    >
                        <X className="w-4 h-4 text-white/40" />
                    </button>
                )}
            </div>

            {/* Mini Filter Bar */}
            <div className="flex flex-wrap justify-center gap-3">
                <button
                    onClick={() => setSelectedCity(null)}
                    className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCity ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white hover:bg-black/60'}`}
                >
                    {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                {cities.map(city => (
                    <button
                        key={city.en}
                        onClick={() => setSelectedCity(city.en)}
                        className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedCity === city.en ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(197,160,89,0.4)]' : 'bg-black/30 text-white/50 border-white/5 hover:border-white/20 hover:text-white hover:bg-black/60'}`}
                    >
                        {lang === 'en' ? city.en : city.ar}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2">
                <AnimatePresence mode='popLayout'>
                    {filteredLandmarks.map((landmark, idx) => (
                        <LandmarkCard
                            key={landmark.id}
                            landmark={landmark}
                            idx={idx}
                            lang={lang}
                            onClick={setSelectedLandmark}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Landmark Fact Sheet Modal */}
            <AnimatePresence>
                {selectedLandmark && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedLandmark(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl bg-[#080808] rounded-2xl shadow-[0_30px_90px_-15px_rgba(0,0,0,1),0_0_50px_rgba(197,160,89,0.1)] border border-[#c5a059]/30 overflow-y-auto max-h-[90vh] archive-seal-container"
                        >
                            {selectedLandmark.isPending ? (
                                <div className="p-12 md:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[500px]">
                                    {/* Arabesque Document Background */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none scale-150 rotate-12" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
                                    <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 blur-[100px] rounded-full" />
                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#c5a059]/5 blur-[120px] rounded-full" />

                                    <div className="relative z-10 mb-10">
                                        <div className="inline-block p-8 rounded-full bg-black shadow-[0_0_40px_rgba(197,160,89,0.2)] border border-[#c5a059]/40 mb-8 relative">
                                            <div className="absolute inset-0 bg-[#c5a059]/20 animate-ping rounded-full opacity-20" />
                                            <Lock className="w-16 h-16 text-[#c5a059]" />
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-white font-arabic mb-4 tracking-tight">
                                            <TranslatedText arabicText={selectedLandmark.name.ar} />
                                        </h2>
                                        <div className="flex items-center justify-center gap-3 text-primary text-xs font-black uppercase tracking-[0.4em] mb-8">
                                            <Shield className="w-4 h-4" />
                                            <span>{lang === 'ar' ? 'سجل سيادي محمي' : 'Sovereign Protected Record'}</span>
                                        </div>
                                    </div>

                                    <div className="max-w-xl p-8 rounded-3xl bg-black/60 border border-[#c5a059]/20 backdrop-blur-xl relative z-10">
                                        <p className="text-base md:text-lg text-white/70 leading-relaxed font-serif italic mb-8">
                                            {lang === 'ar'
                                                ? 'يخضع هذا السجل حالياً لعملية التوثيق الملكي لضمان أقصى درجات الدقة التاريخية والجغرافية. سيتم الكشف عن المحتوى الكامل بمجرد اكتمال التدقيق من قبل هيئة الأرشيف السيادي.'
                                                : 'This record is currently undergoing royal documentation to ensure peak historical and geographic accuracy. The full content will be unveiled upon completion of verification by the Sovereign Archive.'}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 text-left">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-1">{lang === 'ar' ? 'المدينة' : 'Location'}</div>
                                                <div className="text-sm font-bold text-white"><TranslatedText arabicText={selectedLandmark.city.ar} /></div>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest mb-1">{lang === 'ar' ? 'الحالة' : 'Status'}</div>
                                                <div className="text-sm font-bold text-primary">{lang === 'ar' ? 'قيد التوثيق' : 'Validating'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedLandmark(null)}
                                        className="mt-12 px-12 py-4 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/40 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all tracking-[0.3em] uppercase text-xs font-black relative z-10 shadow-[0_0_30px_rgba(197,160,89,0.15)]"
                                    >
                                        {lang === 'ar' ? 'إغلاق الملف' : 'Close Document'}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Header Visual */}
                                    <div className="h-[400px] bg-black/50 border-b border-[#c5a059]/30 flex flex-col items-center justify-start relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                                        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                                            <LandmarkSoulIcon soul={selectedLandmark.visualSoul} className="w-[600px] h-[600px] text-primary" />
                                        </div>
                                        <div className="relative z-20 text-center pt-24 px-8">
                                            <script
                                                type="application/ld+json"
                                                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(getArticle(selectedLandmark.id, selectedLandmark.name.ar, selectedLandmark.name.en, 'landmark'), lang)) }}
                                            />
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="inline-block p-6 rounded-full bg-black shadow-[0_0_40px_rgba(197,160,89,0.4)] border border-[#c5a059] mb-8"
                                            >
                                                <LandmarkSoulIcon soul={selectedLandmark?.visualSoul} className="w-12 h-12 text-[#c5a059]" />
                                            </motion.div>
                                            <h2 className="text-5xl md:text-6xl font-black text-white font-arabic drop-shadow-2xl mb-4">
                                                <TranslatedText arabicText={selectedLandmark?.name?.ar || ''} />
                                            </h2>
                                            <div className="flex items-center justify-center gap-4 text-[#c5a059]">
                                                <MapPin className="w-4 h-4" />
                                                <p className="text-sm font-black uppercase tracking-[0.4em]">
                                                    <TranslatedText arabicText={selectedLandmark?.city?.ar || ''} />
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedLandmark(null)}
                                            className="absolute top-8 left-8 z-30 p-4 rounded-2xl bg-black/80 border border-[#c5a059]/50 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]"
                                        >
                                            <X className="w-5 h-5" />
                                            <span className="hidden md:inline">{lang === 'ar' ? 'إغلاق' : 'Close'}</span>
                                        </button>
                                    </div>

                                    {/* Data Content */}
                                    <div className="p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 relative">
                                        <div className="space-y-12">
                                            <div className="relative">
                                                <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-8">
                                                    <Compass className="w-4 h-4" />
                                                    {lang === 'ar' ? 'التوثيق الزمني والسيادي' : 'TEMPORAL DOCUMENTATION'}
                                                </h4>
                                                <div className="p-8 rounded-[40px] bg-black/40 border border-[#c5a059]/20 shadow-inner group">
                                                    <div className="flex justify-between items-center pb-6 border-b border-[#c5a059]/10">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{lang === 'ar' ? 'تاريخ التأسيس' : 'FOUNDED'}</span>
                                                            <span className="text-lg font-black text-white mt-1">
                                                                {lang === 'en' ? (selectedLandmark?.foundation?.en || 'Ancient Era') : (selectedLandmark?.foundation?.ar || 'عصور ضاربة في القدم')}
                                                            </span>
                                                        </div>
                                                        <div className="p-3 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20">
                                                            <Sparkles className="w-6 h-6 text-[#c5a059]" />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{lang === 'ar' ? 'نمط العمارة' : 'ARCHITECTURAL STYLE'}</span>
                                                            <span className="text-lg font-black text-white mt-1">{selectedLandmark?.visualSoul}</span>
                                                        </div>
                                                        <div className="p-3 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20">
                                                            <Building2 className="w-6 h-6 text-[#c5a059]" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-8">
                                                    <Info className="w-4 h-4" />
                                                    {lang === 'ar' ? 'النبذة الملحمية' : 'EPIC NARRATIVE'}
                                                </h4>
                                                <p className="text-xl text-white/90 leading-relaxed font-serif italic text-justify first-letter:text-5xl first-letter:font-bold first-letter:text-[#c5a059] first-letter:mr-3">
                                                    <TranslatedText arabicText={selectedLandmark?.history?.ar || ''} />
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-start space-y-8">
                                            <div className="p-10 rounded-[50px] bg-black/60 border border-[#c5a059]/20 relative overflow-hidden group shadow-2xl">
                                                <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] group-hover:opacity-[0.05] transition-opacity" />
                                                <Crown className="absolute -right-8 -top-8 w-40 h-40 text-[#c5a059] opacity-[0.08] group-hover:scale-110 transition-transform duration-700" />

                                                <div className="relative z-10">
                                                    <p className="text-sm md:text-base text-white/80 font-medium leading-relaxed italic border-l-4 border-[#c5a059] pl-6 py-2">
                                                        {lang === 'ar'
                                                            ? 'تُعد هذه المعلمة جزءاً أصيلاً من الذاكرة الجماعية المغربية. يوثق مشروع MoroVerse إبداع الصانع المغربي وعظمة الدول التي تعاقبت على حكم المملكة، لتبقى منارة للأجيال القادمة.'
                                                            : 'This landmark is an integral part of Moroccan collective memory. The MoroVerse project documents the creativity of Moroccan artisans and the grandeur of the dynasties that ruled the Kingdom.'
                                                        }
                                                    </p>
                                                    <div className="mt-10 flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(139,0,0,0.4)]">
                                                            <ShieldCheck className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059]">Certified Metadata</span>
                                                            <span className="text-[9px] font-bold text-white/40">Sovereign Archive Unit-7v</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <button
                                                    onClick={() => router.push(`/posts/${selectedLandmark.id}?lang=${lang}`)}
                                                    className="w-full py-6 rounded-[35px] bg-primary text-white shadow-[0_15px_35px_rgba(139,0,0,0.5)] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(197,160,89,1)] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 border border-white/10 group"
                                                >
                                                    <Compass className="w-6 h-6 group-hover:rotate-[360deg] transition-transform duration-1000" />
                                                    {lang === 'ar' ? `ولوج الأرشيف الكامل: ${selectedLandmark.name.ar}` : `Access Deep Archive: ${selectedLandmark.name.en}`}
                                                </button>
                                                <p className="text-[9px] text-center text-white/30 uppercase tracking-[0.5em] font-bold">Encrypted Sovereign Connection</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}

function LandmarkCard({
    landmark,
    idx,
    lang,
    onClick
}: {
    landmark: Landmark;
    idx: number;
    lang: LangCode;
    onClick: (landmark: Landmark) => void
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, rotateY: 90, z: -100 }}
            whileInView={{ opacity: 1, rotateY: 0, z: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            onClick={() => {
                onClick(landmark);
                window.dispatchEvent(new CustomEvent('moroverse-action', {
                    detail: { type: 'landmark_click', payload: lang === 'en' ? landmark.name.en : landmark.name.ar }
                }));
            }}
            className="group cursor-pointer relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] w-full weather-card-fx"
        >
            <div className="relative h-full w-full rounded-xl border-2 border-[#c5a059]/20 hover:border-[#c5a059]/80 transition-all duration-700 overflow-hidden shadow-2xl glass-card-elite group-hover:shadow-[0_20px_60px_rgba(197,160,89,0.25)]">

                {/* Cinematic Background Image */}
                <div className="absolute inset-0 z-0">
                    {!landmark.isPending ? (
                        <div className="relative h-full w-full">
                            <img
                                src={`/images/${landmark.id}.jpg`}
                                alt={lang === 'en' ? landmark.name.en : landmark.name.ar}
                                className={`w-full h-full object-cover transition-all duration-1000 transform group-hover:scale-105 opacity-80 group-hover:opacity-100`}
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            {/* Document Texture Overlay */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] scale-150" />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#c5a059]/15 via-transparent to-black/80" />
                            <div className="relative flex flex-col items-center gap-6">
                                <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#c5a059]/30 flex items-center justify-center animate-spin-slow">
                                    <div className="absolute inset-0 bg-[#c5a059]/5 rounded-full animate-pulse" />
                                    <Lock className="w-10 h-10 text-[#c5a059]/40" />
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="text-xs font-black text-[#c5a059] uppercase tracking-[0.5em] opacity-60">Identity Record</div>
                                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Sovereign Archive System</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Multi-layered Cinematic Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-40" />
                </div>

                {/* Top Document Bar */}
                <div className="absolute top-0 inset-x-0 z-20 p-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-[#c5a059]/60" />
                        <span className="text-[8px] font-black text-[#c5a059]/60 uppercase tracking-[0.3em]">Royal Archive Unit-7v</span>
                    </div>
                    <div className="w-6 h-6 border-t border-r border-[#c5a059]/40" />
                </div>

                {/* Card Content Overlay (High Glassmorphism) */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10 flex flex-col justify-end bg-gradient-to-t from-[#080808] via-[#080808]/90 to-transparent pt-32 translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ maskImage: 'linear-gradient(to top, black 40%, transparent)' }} />

                    <div className="relative z-20">
                        <div className="flex justify-between items-end mb-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl font-arabic leading-tight">
                                        <TranslatedText arabicText={landmark.name.ar} />
                                    </h3>
                                    {landmark.isPending && (
                                        <div className="p-1 rounded-md bg-primary/10 border border-primary/20">
                                            <Lock className="w-4 h-4 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-[#c5a059]">
                                    <MapPin className="w-4 h-4 opacity-70" />
                                    <span className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
                                        <TranslatedText arabicText={landmark.city.ar} />
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 rounded-3xl bg-black/40 backdrop-blur-2xl border border-[#c5a059]/40 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                                <LandmarkSoulIcon soul={landmark.visualSoul} className="w-8 h-8 text-[#c5a059]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0">
                            {!landmark.isPending && landmark.foundation && (
                                <div className="flex items-center gap-4 py-3 border-y border-white/5">
                                    <div className="p-2 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20">
                                        <History className="w-4 h-4 text-[#c5a059]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">{lang === 'ar' ? 'عصر التأسيس' : 'FOUNDATION'}</span>
                                        <span className="text-xs font-bold text-white/90">
                                            <TranslatedText arabicText={landmark.foundation.ar} />
                                        </span>
                                    </div>
                                </div>
                            )}

                            <p className="text-base text-white/70 leading-relaxed italic font-medium font-arabic line-clamp-2">
                                {landmark.isPending
                                    ? (lang === 'ar' ? 'لا يزال هذا السجل يخضع لعملية التوثيق والتدقيق الملكي لضمان الدقة الكاملة.' : 'This record is currently undergoing royal documentation to ensure absolute accuracy.')
                                    : <TranslatedText arabicText={landmark.history.ar} />
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interactive Indicator */}
                <div className="absolute bottom-6 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 transform translate-x-4 group-hover:translate-x-0">
                    <div className={`flex items-center gap-4 px-6 py-4 rounded-full ${landmark.isPending ? 'bg-primary/10 text-[#c5a059] border border-[#c5a059]/40' : 'bg-primary text-white shadow-[0_10px_30px_rgba(139,0,0,0.4)]'} text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-transform`}>
                        {landmark.isPending ? <Shield className="w-5 h-5 animate-pulse" /> : <Compass className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />}
                        <span>{landmark.isPending ? (lang === 'ar' ? 'فحص البطاقة' : 'Inspect ID Card') : (lang === 'ar' ? 'فتح الأرشيف' : 'Open Archive')}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
