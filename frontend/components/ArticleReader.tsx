"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Compass, History, Crown, Waves, Shield, Mountain, X, BookOpen, Clock, MapPin, Share2, Printer, ChevronLeft, ChevronRight, Lock, Sparkles, Globe, Play, Pause } from 'lucide-react';
import { MoroArticle } from '../data/moroverse-content';
import SmartLink from './SmartLink';
import { useLanguage, type LangCode } from '../context/LanguageContext';
import TranslatedText from './TranslatedText';

interface ArticleReaderProps {
    article: MoroArticle;
    isOpen: boolean;
    onClose: () => void;
}

const FaqAccordionItem = ({ faq, isAr, lang }: { faq: any; isAr: boolean; lang: LangCode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const question = faq.question ? (faq.question[lang] || faq.question['ar']) : (faq.q?.[lang] || faq.q?.['ar']);
    const answer = faq.answer ? (faq.answer[lang] || faq.answer['ar']) : (faq.a?.[lang] || faq.a?.['ar']);

    return (
        <div className="bg-black/30 border border-[#c5a059]/10 rounded-xl overflow-hidden hover:border-[#c5a059]/30 transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-6 flex items-center justify-between transition-colors ${isOpen ? 'bg-[#c5a059]/5' : ''}`}
            >
                <h3 className={`text-lg font-bold text-white/90 text-left ${isAr ? 'font-arabic text-right' : 'font-serif'} ${isAr && 'flex-1'}`}>
                    {question}
                </h3>
                <ChevronRight className={`w-5 h-5 text-[#c5a059] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90' : isAr ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6"
                    >
                        <div className="h-px w-full bg-[#c5a059]/10 mb-4" />
                        <p className={`text-white/70 leading-relaxed ${isAr ? 'font-arabic text-right' : 'font-sans text-left'}`}>
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function ArticleReader({ article, isOpen, onClose }: ArticleReaderProps) {
    const { lang } = useLanguage();
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/90 via-black/95 to-[#1a202c]/95 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-5xl h-[95vh] rounded-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(197,160,89,0.15)] overflow-hidden flex flex-col glass-card-elite border border-[#c5a059]/20 bg-black/80"
                    >
                        <div className="absolute top-0 w-full z-50 p-4 flex justify-between items-start pointer-events-none">
                            <div className={`flex gap-3 pointer-events-auto ${isAr ? 'ml-auto text-right' : 'mr-auto text-left flex-row-reverse'}`}>
                                <div className="bg-black/50 backdrop-blur-md rounded-xl p-2 md:p-3 shadow-lg border border-white/5 flex gap-2">
                                    <button className="p-2 hover:bg-[#c5a059]/20 rounded-lg transition-colors text-white/80 hover:text-[#c5a059]">
                                        <Share2 size={16} />
                                    </button>
                                    <button className="p-2 hover:bg-[#c5a059]/20 rounded-lg transition-colors text-white/80 hover:text-[#c5a059]">
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
                            <div className="relative w-full h-[40vh] md:h-[50vh] bg-black shrink-0 overflow-hidden">
                                {article.generatedImage ? (
                                    <img
                                        src={article.generatedImage}
                                        alt={article.title.ar}
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                ) : article.videoUrl ? (
                                    <>
                                        {article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
                                            <iframe
                                                src={(() => {
                                                    let videoId = '';
                                                    if (article.videoUrl!.includes('youtu.be/')) videoId = article.videoUrl!.split('youtu.be/')[1].split('?')[0];
                                                    else if (article.videoUrl!.includes('watch?v=')) videoId = article.videoUrl!.split('v=')[1].split('&')[0];
                                                    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`;
                                                })()}
                                                title="Royal Cinematic Archive"
                                                className="w-full h-full absolute top-0 left-0 object-cover opacity-80 pointer-events-none"
                                            />
                                        ) : (
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
                                                    <button onClick={() => setIsVideoPlaying(!isVideoPlaying)} className="p-3 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 text-white hover:text-[#c5a059]">
                                                        {isVideoPlaying ? <Pause size={16} /> : <Play size={16} />}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#064e3b] to-black">
                                        <Crown size={64} className="text-[#c5a059]/20 animate-pulse" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/90 via-transparent to-black/40" />
                                <div className={`absolute bottom-0 w-full p-8 md:p-12 z-10 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 text-[#c5a059]">
                                            <div className="h-[2px] w-12 bg-[#c5a059]/40" />
                                            <span className="text-xs font-black uppercase tracking-[0.3em] font-sans">Royal Archive No. {article.id.split('-')[1]}</span>
                                        </div>
                                        <h1 className={`text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                            <TranslatedText arabicText={article.title.ar} />
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-6 pt-4">
                                            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                                <Globe className="w-4 h-4 text-[#c5a059]" />
                                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{lang.toUpperCase()} Version</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#064e3b]/40 backdrop-blur-3xl relative">
                                <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />
                                <div className={`px-6 md:px-16 py-12 relative z-10 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
                                    <div className="flex flex-wrap gap-6 mb-12 py-4 border-y border-[#c5a059]/10">
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <Crown size={16} className="text-[#c5a059]" />
                                            <span>{article.category.toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 text-sm">
                                            <MapPin size={16} className="text-[#c5a059]" />
                                            <span>{isAr ? 'المملكة المغربية الشريفة' : 'Kingdom of Morocco'}</span>
                                        </div>
                                    </div>
                                    <p className={`text-xl md:text-2xl text-white/90 leading-relaxed mb-16 font-medium drop-shadow-sm ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                        <TranslatedText arabicText={article.intro.ar} />
                                    </p>

                                    {article.gallery && article.gallery.length > 0 && (
                                        <div className="mb-16 rounded-xl overflow-hidden bg-black/40 border border-white/5 relative group shadow-2xl">
                                            <div className="aspect-[21/9] w-full relative">
                                                <img src={article.gallery[activeImageIndex]} className="w-full h-full object-cover" alt="Gallery View" />
                                                <div className="absolute inset-x-0 bottom-6 px-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="flex gap-2">
                                                        <button onClick={prevImage} className="p-2 rounded-xl bg-black/50 backdrop-blur text-white border border-white/10 hover:text-[#c5a059]">
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        <button onClick={nextImage} className="p-2 rounded-xl bg-black/50 backdrop-blur text-white border border-white/10 hover:text-[#c5a059]">
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-16">
                                        {article.sections.map((section, idx) => (
                                            <div key={idx} className="group">
                                                <h2 className={`text-2xl md:text-3xl font-bold text-[#c5a059] mb-6 flex items-center gap-4 ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                                    <span className={`w-8 h-[2px] bg-[#c5a059]/50 group-hover:w-16 transition-all duration-500 ${!isAr && 'order-2'}`} />
                                                    <span className={!isAr ? 'order-1' : ''}>
                                                        <TranslatedText arabicText={section.title.ar} />
                                                    </span>
                                                </h2>
                                                <div className={`text-lg md:text-xl text-white/80 leading-loose tracking-wide ${isAr ? 'font-arabic' : 'font-sans font-light'}`}>
                                                    <TranslatedText arabicText={section.content.ar} as="div" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {article.faqs && article.faqs.length > 0 && (
                                        <div className="mt-20 group relative">
                                            <h2 className={`text-2xl md:text-3xl font-bold text-[#c5a059] mb-8 flex items-center gap-4 ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                                <span className={`w-8 h-[2px] bg-[#c5a059]/50 group-hover:w-16 transition-all duration-500 ${!isAr && 'order-2'}`} />
                                                <span className={!isAr ? 'order-1' : ''}>{isAr ? 'الأسئلة الشائعة (FAQs)' : 'Frequently Asked Questions'}</span>
                                            </h2>
                                            <div className="space-y-4">
                                                {article.faqs.map((faq, idx) => (
                                                    <FaqAccordionItem key={idx} faq={faq} isAr={isAr} lang={lang} />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-20 p-8 md:p-12 relative overflow-hidden group rounded-xl bg-gradient-to-br from-[#064e3b]/30 to-black/30 border border-[#c5a059]/10 shadow-inner text-center">
                                        <p className={`relative z-10 text-white/90 text-xl md:text-2xl leading-relaxed italic ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                            <TranslatedText arabicText={article.conclusion.ar} />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`px-8 py-5 bg-black/95 border-t border-[#c5a059]/10 flex justify-between items-center text-[10px] text-white/40 font-black tracking-[0.2em] uppercase shrink-0 ${!isAr && 'flex-row-reverse'}`}>
                            <span>Digital Sovereignty Authorized</span>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span>Authentic Royal Record</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
