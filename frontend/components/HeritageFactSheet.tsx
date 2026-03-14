"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MapPin, Compass, Info, Sparkles, Building2, Crown,
    History, Shield, Mountain, Waves, ShieldCheck, Box
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import TranslatedText from './TranslatedText';
import ShareButton from './ShareButton';
import { LangCode } from '../types/language';

// Dynamic Import for 3D Viewer to save bundle size
const Monument3DViewer = dynamic(() => import('./community/Monument3DViewer'), { ssr: false });

export interface HeritageItem {
    id: string;
    slug?: string;
    name: { en: string; ar: string };
    city: { en: string; ar: string };
    history?: { en: string; ar: string } | string;
    foundation?: { en: string; ar: string };
    visualSoul?: string;
    imageUrl?: string;
    model_url?: string; // New field from Supabase
    isPending?: boolean;
    type?: 'landmark' | 'battle' | 'figure' | 'post';
    content?: string;
    stats?: {
        year?: string;
        era?: string;
        combatants?: { ar: string; en: string };
        leaders?: { ar: string; en: string };
        outcome?: { ar: string; en: string };
        tactics?: { ar: string; en: string };
        impact?: { ar: string; en: string };
        casualties?: { ar: string; en: string };
    };
}

interface HeritageFactSheetProps {
    item: HeritageItem | null;
    isOpen: boolean;
    onClose: () => void;
    lang: LangCode;
}

const SoulIcon = ({ soul, className }: { soul?: string; className?: string }) => {
    switch (soul) {
        case 'Mosque':    return <Compass className={className} />;
        case 'Tower':     return <Building2 className={className} />;
        case 'Palace':    return <Crown className={className} />;
        case 'Ruin':      return <History className={className} />;
        case 'Cave':      return <Mountain className={className} />;
        case 'Lighthouse':return <Waves className={className} />;
        case 'Fortress':  return <Shield className={className} />;
        default:          return <Compass className={className} />;
    }
};

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1080&auto=format&fit=crop';

export default function HeritageFactSheet({ item, isOpen, onClose, lang }: HeritageFactSheetProps) {
    const router = useRouter();
    const [show3D, setShow3D] = useState(false);

    if (!item) return null;

    const historyText = typeof item.history === 'object'
        ? item.history.ar
        : (item.history || item.content || '');

    const slug = item.slug || item.id;
    const isRTL = lang === 'ar';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        onClick={e => e.stopPropagation()}
                        className="relative w-full max-w-5xl bg-[#080808] rounded-3xl shadow-[0_30px_90px_-15px_rgba(0,0,0,1),0_0_50px_rgba(197,160,89,0.1)] border border-[#c5a059]/30 overflow-y-auto max-h-[92vh] archive-seal-container"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* ── Header Image ─────────────────────────────────────── */}
                        <div className="h-[480px] bg-black flex flex-col items-center justify-start relative overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={item.imageUrl || FALLBACK_IMG}
                                    alt={item.name.en}
                                    className="w-full h-full object-cover object-center opacity-70"
                                    style={{ filter: 'sepia(0.2) contrast(1.1) brightness(0.7) saturate(1.2)' }}
                                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent z-10" />
                            </div>

                            {/* Top Controls */}
                            <div className={`absolute top-8 ${isRTL ? 'right-8' : 'left-8'} z-30 flex items-center gap-3`}>
                                <button
                                    onClick={onClose}
                                    className="p-4 rounded-2xl bg-black/80 border border-[#c5a059]/50 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]"
                                >
                                    <X className="w-5 h-5" />
                                    <span className="hidden md:inline">{isRTL ? 'إغلاق' : 'Close'}</span>
                                </button>
                                <ShareButton
                                    id={item.id}
                                    title={item.name.ar}
                                    description={historyText}
                                    imageUrl={item.imageUrl}
                                    slug={slug}
                                    size="md"
                                />
                            </div>

                            {/* Central Title/Hero */}
                            <div className="relative z-20 text-center pt-28 px-8 max-w-4xl mx-auto">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="inline-block p-7 rounded-full bg-black/80 shadow-[0_0_50px_rgba(197,160,89,0.5)] border border-[#c5a059] mb-8"
                                >
                                    <SoulIcon soul={item.visualSoul} className="w-14 h-14 text-[#c5a059]" />
                                </motion.div>
                                <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] leading-[1.1]">
                                    <TranslatedText arabicText={item.name.ar} />
                                </h2>
                                <div className="flex items-center justify-center gap-4 text-[#c5a059] bg-[#c5a059]/10 px-6 py-2 rounded-full border border-[#c5a059]/30 w-fit mx-auto backdrop-blur-md">
                                    <MapPin className="w-5 h-5" />
                                    <p className="text-sm md:text-base font-black uppercase tracking-[0.4em]">
                                        <TranslatedText arabicText={item.city.ar} />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Main Layout Body ─────────────────────────────────── */}
                        <div className="p-10 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">

                            {/* Left Meta-Doc Column */}
                            <div className="space-y-16">

                                {/* Chronological Documentation */}
                                <div className="relative">
                                    <h4 className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-8 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                        {item.type === 'battle' ? <Shield className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                                        {isRTL
                                            ? (item.type === 'battle' ? 'التوثيق العسكري الفائق' : 'التوثيق الزمني والسيادي')
                                            : (item.type === 'battle' ? 'ELITE MILITARY ARCHIVE' : 'SOVEREIGN CHRONICLE')}
                                    </h4>
                                    
                                    <div className="p-10 rounded-[50px] bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm group hover:border-[#c5a059]/30 transition-all duration-500">
                                        <div className="flex justify-between items-center pb-8 border-b border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    {isRTL ? (item.type === 'battle' ? 'التوقيت' : 'التأسيس') : (item.type === 'battle' ? 'TIMELINE' : 'ESTABLISHED')}
                                                </span>
                                                <span className="text-2xl font-black text-white mt-1">
                                                    {item.type === 'battle'
                                                        ? item.stats?.year
                                                        : (lang === 'en' ? (item.foundation?.en || 'Ancient Era') : (item.foundation?.ar || 'عصور ضاربة'))}
                                                </span>
                                            </div>
                                            <div className="p-5 rounded-3xl bg-[#c5a059]/10 border border-[#c5a059]/20 shadow-[0_0_30px_rgba(197,160,89,0.1)] group-hover:scale-110 transition-transform">
                                                {item.type === 'battle' ? <History className="w-8 h-8 text-[#c5a059]" /> : <Sparkles className="w-8 h-8 text-[#c5a059]" />}
                                            </div>
                                        </div>

                                        {item.type === 'battle' ? (
                                            <div className="space-y-8 mt-8">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{isRTL ? 'القيادة العليا' : 'SUPREME COMMAND'}</span>
                                                    <span className="text-xl font-bold text-primary mt-2">
                                                        {isRTL ? item.stats?.leaders?.ar : item.stats?.leaders?.en}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{isRTL ? 'القوى المشاركة' : 'ENGAGED FORCES'}</span>
                                                    <span className="text-base font-medium text-white/70 mt-2">
                                                        {isRTL ? item.stats?.combatants?.ar : item.stats?.combatants?.en}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-8 flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{isRTL ? 'الهوية المعمارية' : 'ARCHITECTURAL DNA'}</span>
                                                    <span className="text-2xl font-black text-white mt-2 italic font-serif">{item.visualSoul || 'Royal Classic'}</span>
                                                </div>
                                                <Building2 className="w-10 h-10 text-white/5" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Narrative Text */}
                                <div>
                                    <h4 className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-8 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                                        <Info className="w-4 h-4" />
                                        {isRTL ? 'السردية التاريخية الملحمية' : 'EPIC HISTORICAL NARRATIVE'}
                                    </h4>
                                    <div className="space-y-8">
                                        <p className="text-2xl md:text-3xl text-white/95 leading-[1.6] font-arabic italic text-justify tracking-tight">
                                            <TranslatedText arabicText={historyText || (isRTL ? 'معلمة ترمز لشموخ المملكة وعراقتها عبر العصور.' : 'A monumental symbol of the Kingdom\'s grandeur.')} />
                                        </p>
                                        
                                        {item.type === 'battle' && item.stats?.tactics && (
                                            <div className="p-8 rounded-[35px] bg-primary/5 border border-primary/20 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={60} /></div>
                                                <span className="text-[10px] font-black uppercase block mb-4 text-primary tracking-[0.2em]">{isRTL ? 'التكتيك العسكري' : 'STRATEGIC TACTICS'}</span>
                                                <p className="text-lg text-primary/90 font-medium leading-relaxed italic">
                                                    {isRTL ? item.stats.tactics.ar : item.stats.tactics.en}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Action/UI Column */}
                            <div className="flex flex-col justify-start space-y-12">
                                
                                {/* Certified Quote Card */}
                                <div className="p-12 rounded-[60px] bg-black/40 border border-[#c5a059]/20 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] transition-opacity" />
                                    <Crown className="absolute -right-6 -top-6 w-48 h-48 text-[#c5a059] opacity-[0.05] group-hover:scale-110 transition-transform duration-1000" />
                                    
                                    <div className="relative z-10 space-y-10">
                                        <p className={`text-lg md:text-xl text-white/80 font-medium leading-relaxed italic border-[#c5a059] py-2 ${isRTL ? 'border-r-4 pr-8 text-right' : 'border-l-4 pl-8 text-left'}`}>
                                            {isRTL
                                                ? 'هذا السجل جزء لا يتجزأ من الأرشيف السيادي للمملكة المغربية. يوثق مشروع MoroVerse الأمجاد والروائع التي تجسد عبقرية الأرض وتاريخها.'
                                                : 'This record is an integral part of the Sovereign Archives of the Kingdom. MoroVerse documents the glories that embody the genius of this land.'}
                                        </p>
                                        
                                        <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(139,0,0,0.4)] border border-white/10">
                                                <ShieldCheck className="w-8 h-8 text-white" />
                                            </div>
                                            <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                                                <span className="text-xs font-black uppercase tracking-[0.3em] text-[#c5a059]">Certified Metadata</span>
                                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">Archive Unit • Moroccan Sovereign Ledger</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons Cluster */}
                                <div className="space-y-6">
                                    {/* Elite 3D Button - Only show if model_url exists */}
                                    {item.model_url && (
                                        <button
                                            onClick={() => setShow3D(true)}
                                            className="w-full py-8 rounded-[40px] bg-[#C5A059] text-black shadow-[0_20px_50px_rgba(197,160,89,0.3)] hover:scale-[1.03] hover:shadow-[0_0_70px_rgba(197,160,89,0.6)] flex items-center justify-center gap-5 transition-all duration-500 group border-4 border-white/10"
                                        >
                                            <Box className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500" />
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Visual Immersion</span>
                                                <span className="text-xl font-black uppercase tracking-tighter">{isRTL ? 'ولوج العرض الثلاثي الأبعاد' : 'Access Elite 3D Viewer'}</span>
                                            </div>
                                        </button>
                                    )}

                                    {/* Primary Archive Connection */}
                                    <button
                                        onClick={() => router.push(`/posts/${slug}?lang=${lang}`)}
                                        className="w-full py-7 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-5 transition-all duration-500 group overflow-hidden relative shadow-2xl"
                                    >
                                        <Compass className="w-7 h-7 group-hover:rotate-[360deg] transition-transform duration-1000 text-primary" />
                                        <span className="text-base font-black uppercase tracking-[0.2em]">
                                            {isRTL ? `ولوج الأرشيف الكامل: ${item.name.ar}` : `Access Deep Archive: ${item.name.en}`}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </button>
                                    
                                    <p className="text-[10px] text-center text-white/20 uppercase tracking-[0.8em] font-black py-4 animate-pulse">
                                        SECURE SOVEREIGN CONNECTION • TUNNEL 7v
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3D Viewer Overlay Component */}
                    {show3D && item.model_url && (
                        <Monument3DViewer 
                            modelUrl={item.model_url}
                            locationName={isRTL ? item.name.ar : item.name.en}
                            onClose={() => setShow3D(false)}
                        />
                    )}
                </div>
            )}
        </AnimatePresence>
    );
}
