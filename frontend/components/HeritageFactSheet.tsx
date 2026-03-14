"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MapPin, Compass, Info, Sparkles, Building2, Crown,
    History, Shield, Mountain, Waves, ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import TranslatedText from './TranslatedText';
import ShareButton from './ShareButton';
import { LangCode } from '../types/language';

export interface HeritageItem {
    id: string;
    slug?: string;
    name: { en: string; ar: string };
    city: { en: string; ar: string };
    history?: { en: string; ar: string } | string;
    foundation?: { en: string; ar: string };
    visualSoul?: string;
    imageUrl?: string;
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

    if (!item) return null;

    const historyText = typeof item.history === 'object'
        ? item.history.ar
        : (item.history || item.content || '');

    const slug = item.slug || item.id;

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
                        className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        onClick={e => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-[#080808] rounded-2xl shadow-[0_30px_90px_-15px_rgba(0,0,0,1),0_0_50px_rgba(197,160,89,0.1)] border border-[#c5a059]/30 overflow-y-auto max-h-[90vh]"
                    >
                        {/* ── Header Image ─────────────────────────────────────── */}
                        <div className="h-[450px] bg-black flex flex-col items-center justify-start relative overflow-hidden">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={item.imageUrl || FALLBACK_IMG}
                                    alt={item.name.en}
                                    className="w-full h-full object-cover object-center opacity-60"
                                    style={{ filter: 'sepia(0.2) contrast(1.1) brightness(0.7) saturate(1.2)' }}
                                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent z-10" />
                            </div>

                            {/* Close + Share */}
                            <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="p-4 rounded-2xl bg-black/80 border border-[#c5a059]/50 text-[#c5a059] hover:bg-[#c5a059] hover:text-black transition-all shadow-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]"
                                >
                                    <X className="w-5 h-5" />
                                    <span className="hidden md:inline">{lang === 'ar' ? 'إغلاق' : 'Close'}</span>
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

                            {/* Title */}
                            <div className="relative z-20 text-center pt-24 px-8">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="inline-block p-6 rounded-full bg-black shadow-[0_0_40px_rgba(197,160,89,0.4)] border border-[#c5a059] mb-8"
                                >
                                    <SoulIcon soul={item.visualSoul} className="w-12 h-12 text-[#c5a059]" />
                                </motion.div>
                                <h2 className="text-5xl md:text-6xl font-black text-white font-arabic drop-shadow-2xl mb-4">
                                    <TranslatedText arabicText={item.name.ar} />
                                </h2>
                                <div className="flex items-center justify-center gap-4 text-[#c5a059]">
                                    <MapPin className="w-4 h-4" />
                                    <p className="text-sm font-black uppercase tracking-[0.4em]">
                                        <TranslatedText arabicText={item.city.ar} />
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Body ─────────────────────────────────────────────── */}
                        <div className="p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16">

                            {/* Left column */}
                            <div className="space-y-12">

                                {/* Stats card */}
                                <div>
                                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-8">
                                        {item.type === 'battle' ? <Shield className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                                        {lang === 'ar'
                                            ? (item.type === 'battle' ? 'التوثيق العسكري' : 'التوثيق الزمني والسيادي')
                                            : (item.type === 'battle' ? 'MILITARY DOCUMENTATION' : 'TEMPORAL DOCUMENTATION')}
                                    </h4>
                                    <div className="p-8 rounded-[40px] bg-black/40 border border-[#c5a059]/20 shadow-inner">
                                        {/* Founded / Year */}
                                        <div className="flex justify-between items-center pb-6 border-b border-[#c5a059]/10">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                                    {lang === 'ar'
                                                        ? (item.type === 'battle' ? 'السنة' : 'تاريخ التأسيس')
                                                        : (item.type === 'battle' ? 'YEAR' : 'FOUNDED')}
                                                </span>
                                                <span className="text-lg font-black text-white mt-1">
                                                    {item.type === 'battle'
                                                        ? item.stats?.year
                                                        : (lang === 'en' ? (item.foundation?.en || 'Ancient Era') : (item.foundation?.ar || 'عصور قديمة'))}
                                                </span>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20">
                                                {item.type === 'battle' ? <History className="w-6 h-6 text-[#c5a059]" /> : <Sparkles className="w-6 h-6 text-[#c5a059]" />}
                                            </div>
                                        </div>

                                        {/* Battle-specific stats */}
                                        {item.type === 'battle' ? (
                                            <>
                                                <div className="flex justify-between items-center py-6 border-b border-[#c5a059]/10">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{lang === 'ar' ? 'القيادة' : 'COMMAND'}</span>
                                                        <span className="text-lg font-black text-primary mt-1">
                                                            {lang === 'ar' ? item.stats?.leaders?.ar : item.stats?.leaders?.en}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center pt-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{lang === 'ar' ? 'القوات' : 'FORCES'}</span>
                                                        <span className="text-sm font-bold text-white/70 mt-1">
                                                            {lang === 'ar' ? item.stats?.combatants?.ar : item.stats?.combatants?.en}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            /* Landmark-specific: architectural style */
                                            <div className="flex justify-between items-center pt-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{lang === 'ar' ? 'نمط العمارة' : 'ARCHITECTURAL STYLE'}</span>
                                                    <span className="text-lg font-black text-white mt-1">{item.visualSoul || 'Classic'}</span>
                                                </div>
                                                <div className="p-3 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20">
                                                    <Building2 className="w-6 h-6 text-[#c5a059]" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* History narrative */}
                                <div>
                                    <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-[#c5a059] mb-8">
                                        <Info className="w-4 h-4" />
                                        {lang === 'ar'
                                            ? (item.type === 'battle' ? 'سير المعركة' : 'النبذة الملحمية')
                                            : (item.type === 'battle' ? 'BATTLE COURSE' : 'EPIC NARRATIVE')}
                                    </h4>
                                    <div className="space-y-6">
                                        <p className="text-xl text-white/90 leading-relaxed font-serif italic text-justify first-letter:text-5xl first-letter:font-bold first-letter:text-[#c5a059] first-letter:mr-3">
                                            <TranslatedText arabicText={historyText || (lang === 'ar' ? 'معلمة تاريخية مغربية أصيلة.' : 'An authentic Moroccan heritage landmark.')} />
                                        </p>
                                        {item.type === 'battle' && item.stats?.tactics && (
                                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 italic text-primary/80">
                                                <span className="text-[10px] font-black uppercase block mb-2">{lang === 'ar' ? 'التكتيك الحربي' : 'MILITARY TACTICS'}</span>
                                                {lang === 'ar' ? item.stats.tactics.ar : item.stats.tactics.en}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right column */}
                            <div className="flex flex-col justify-start space-y-8">
                                {/* Quote card */}
                                <div className="p-10 rounded-[50px] bg-black/60 border border-[#c5a059]/20 relative overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] group-hover:opacity-[0.05] transition-opacity" />
                                    <Crown className="absolute -right-8 -top-8 w-40 h-40 text-[#c5a059] opacity-[0.08]" />
                                    <div className="relative z-10">
                                        <p className="text-sm md:text-base text-white/80 font-medium leading-relaxed italic border-l-4 border-[#c5a059] pl-6 py-2">
                                            {lang === 'ar'
                                                ? 'تُعد هذه المعلمة جزءاً أصيلاً من الذاكرة الجماعية المغربية. يوثق مشروع MoroVerse إبداع الصانع المغربي وعظمة الدول التي تعاقبت على حكم المملكة.'
                                                : 'This heritage item is an integral part of Moroccan collective memory. MoroVerse documents the creativity and grandeur of the Kingdom.'}
                                        </p>
                                        <div className="mt-10 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                                                <ShieldCheck className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#c5a059]">Certified Metadata</span>
                                                <span className="text-[9px] font-bold text-white/40">Sovereign Archive Unit-7v</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA button */}
                                <div className="space-y-4">
                                    <button
                                        onClick={() => router.push(`/posts/${slug}?lang=${lang}`)}
                                        className="w-full py-6 rounded-[35px] bg-primary text-white shadow-[0_15px_35px_rgba(139,0,0,0.5)] hover:scale-[1.02] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 border border-white/10 group"
                                    >
                                        <Compass className="w-6 h-6 group-hover:rotate-[360deg] transition-transform duration-1000" />
                                        {lang === 'ar' ? `ولوج الأرشيف الكامل: ${item.name.ar}` : `Access Deep Archive: ${item.name.en}`}
                                    </button>
                                    <p className="text-[9px] text-center text-white/30 uppercase tracking-[0.5em] font-bold">Encrypted Sovereign Connection</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
