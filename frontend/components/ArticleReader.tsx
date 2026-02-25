"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Share2, Printer, MapPin, Calendar, Shield, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { MoroArticle } from '../data/moroverse-content';
import SmartLink from './SmartLink';
import { useLanguage } from '../context/LanguageContext';

interface ArticleReaderProps {
    article: MoroArticle;
    isOpen: boolean;
    onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article, isOpen, onClose }) => {
    const { lang, t } = useLanguage();
    const [isVideoPlaying, setIsVideoPlaying] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!article) return null;

    const isAr = lang === 'ar';

    const nextImage = () => {
        if (article.gallery) {
            setActiveImageIndex((prev) => (prev + 1) % article.gallery!.length);
        }
    };

    const prevImage = () => {
        if (article.gallery) {
            setActiveImageIndex((prev) => (prev - 1 + article.gallery!.length) % article.gallery!.length);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 overflow-hidden">
                    {/* Cinematic Backdrop with Deep Midnight Green Gradient */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/90 via-black/95 to-[#1a202c]/95 backdrop-blur-xl"
                    />

                    {/* Premium Modal Content - 12px rounded glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl h-[95vh] rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col glass-card-elite border border-gold-royal/20 bg-black/80"
                    >
                        {/* Header Actions Overlay */}
                        <div className="absolute top-0 w-full z-50 p-4 flex justify-between items-start pointer-events-none">
                            <div className={`flex gap-3 pointer-events-auto ${isAr ? 'ml-auto text-right' : 'mr-auto text-left flex-row-reverse'}`}>
                                <div className="bg-black/50 backdrop-blur-md rounded-xl p-2 md:p-3 shadow-lg border border-white/5 flex gap-2">
                                    <button className="p-2 hover:bg-gold-royal/20 rounded-lg transition-colors text-white/80 hover:text-gold-royal">
                                        <Share2 size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-gold-royal/20 rounded-lg transition-colors text-white/80 hover:text-gold-royal">
                                        <Printer size={16} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="pointer-events-auto bg-black/50 backdrop-blur-md p-3 hover:bg-[#8b0000]/80 rounded-xl transition-all text-white border border-white/10 hover:border-red-500/50 hover:scale-105"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                            {/* TOP SECTION: Cinematic Auto-playing Video */}
                            <div className="relative w-full h-[40vh] md:h-[50vh] bg-black shrink-0 overflow-hidden">
                                {article.videoUrl ? (
                                    <>
                                        <video
                                            src={article.videoUrl}
                                            autoPlay
                                            muted={!isVideoPlaying}
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                        <div className="absolute bottom-4 right-4 z-20">
                                            <button
                                                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                                                className="p-3 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 text-white hover:text-gold-royal hover:bg-black/60 transition-all"
                                            >
                                                {isVideoPlaying ? <Pause size={16} /> : <Play size={16} />}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#064e3b] to-black">
                                        <Crown size={64} className="text-gold-royal/20 animate-pulse" />
                                    </div>
                                )}

                                {/* Royal Overlay Gradients */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/90 via-transparent to-black/40" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

                                {/* Title Positioning over Video */}
                                <div className={`absolute bottom-0 w-full p-8 md:p-12 z-10 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="max-w-4xl"
                                    >
                                        <div className="flex items-center gap-3 mb-4 opacity-80">
                                            <Shield size={16} className="text-gold-royal" />
                                            <span className="text-xs font-bold tracking-[0.2em] text-gold-royal uppercase">
                                                {t('ui.royalArchive')}
                                            </span>
                                        </div>
                                        <h1 className={`text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                            {article.title[lang]}
                                        </h1>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Deep Dive Article Content */}
                            <div className="bg-[#064e3b]/40 backdrop-blur-3xl relative">
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />

                                <div className={`px-6 md:px-16 py-12 relative z-10 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>

                                    {/* Meta Bar */}
                                    <div className={`flex flex-wrap gap-6 mb-12 py-4 border-y border-gold-royal/10`}>
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <Crown size={16} className="text-gold-royal" />
                                            <span>{article.category.toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <Calendar size={16} className="text-gold-royal" />
                                            <span>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'en-US')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <MapPin size={16} className="text-gold-royal" />
                                            <span>{isAr ? 'المملكة المغربية الشريفة' : 'Kingdom of Morocco'}</span>
                                        </div>
                                    </div>

                                    {/* Intro */}
                                    <p className={`text-xl md:text-2xl text-white/90 leading-relaxed mb-16 font-medium drop-shadow-sm ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                        <SmartLink text={article.intro[lang]} />
                                    </p>

                                    {/* MIDDLE SECTION: High-Definition Image Gallery */}
                                    {article.gallery && article.gallery.length > 0 && (
                                        <div className="mb-16 rounded-xl overflow-hidden bg-black/40 border border-white/5 relative group shadow-2xl">
                                            <div className="aspect-[21/9] w-full relative">
                                                <AnimatePresence mode="wait">
                                                    <motion.img
                                                        key={activeImageIndex}
                                                        src={article.gallery[activeImageIndex]}
                                                        initial={{ opacity: 0, scale: 1.05 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.5 }}
                                                        className="w-full h-full object-cover"
                                                        alt="Gallery Image"
                                                    />
                                                </AnimatePresence>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                                {/* Gallery Controls */}
                                                <div className="absolute inset-x-0 bottom-6 px-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex gap-2">
                                                        <button onClick={prevImage} className="p-2 rounded-xl bg-black/50 backdrop-blur text-white hover:text-gold-royal transition-colors border border-white/10">
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        <button onClick={nextImage} className="p-2 rounded-xl bg-black/50 backdrop-blur text-white hover:text-gold-royal transition-colors border border-white/10">
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </div>
                                                    <div className="text-white/80 text-xs tracking-widest uppercase font-bold bg-black/50 px-4 py-2 rounded-xl backdrop-blur border border-white/10">
                                                        {activeImageIndex + 1} / {article.gallery.length}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Deep-Dive Sections */}
                                    <div className="space-y-16">
                                        {article.sections.map((section, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-100px" }}
                                                className="group"
                                            >
                                                <h2 className={`text-2xl md:text-3xl font-bold text-gold-royal mb-6 flex items-center gap-4 ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                                    <span className={`w-8 h-[2px] bg-gold-royal/50 group-hover:w-16 group-hover:bg-gold-royal transition-all duration-500 ${!isAr && 'order-2'}`} />
                                                    <span className={!isAr ? 'order-1' : ''}>{section.title[lang]}</span>
                                                </h2>
                                                <div className={`text-lg md:text-xl text-white/80 leading-loose tracking-wide ${isAr ? 'font-arabic' : 'font-sans font-light'}`}>
                                                    <SmartLink text={section.content[lang]} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Legacy / Conclusion */}
                                    <div className="mt-20 p-8 md:p-12 relative overflow-hidden group rounded-xl bg-gradient-to-br from-[#064e3b]/30 to-black/30 border border-gold-royal/10 shadow-inner">
                                        <div className={`absolute top-0 w-32 h-32 bg-gold-royal/5 rounded-full blur-2xl -mt-16 transition-transform group-hover:scale-150 ${isAr ? 'right-0 -mr-16' : 'left-0 -ml-16'}`} />
                                        <p className={`relative z-10 text-white/90 text-xl md:text-2xl leading-relaxed text-center font-medium italic ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                            "{article.conclusion[lang]}"
                                        </p>
                                        <div className="mt-12 flex justify-center opacity-40 items-center gap-4">
                                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-royal to-transparent" />
                                            <Crown size={20} className="text-gold-royal" />
                                            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-royal to-transparent" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Premium Footer */}
                        <div className={`px-8 py-5 bg-black/95 border-t border-gold-royal/10 flex justify-between items-center text-[10px] text-white/40 font-black tracking-[0.2em] uppercase shrink-0 ${!isAr && 'flex-row-reverse'}`}>
                            <span>{t('ui.digitalSovereignty')}</span>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span>{t('ui.authenticRecord')}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ArticleReader;

