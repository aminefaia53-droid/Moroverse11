"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Crown, Share2, Printer, MapPin, Calendar, Shield } from 'lucide-react';
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
    if (!article) return null;

    const isAr = lang === 'ar';

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
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] bg-black/95 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.2)] overflow-hidden flex flex-col border border-gold-royal/30"
                    >
                        {/* Royal Header Bar */}
                        <div className="h-2 bg-gradient-to-r from-royal-red via-gold-royal to-star-green" />

                        {/* Header */}
                        <div className={`px-6 py-4 border-b border-gold-royal/20 flex items-center justify-between bg-black/40 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`flex items-center gap-2 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors text-slate-400"
                                >
                                    <X size={24} />
                                </button>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 hover:bg-gold-royal/20 rounded-full transition-colors text-white/60 hover:text-white">
                                        <Share2 size={18} />
                                    </button>
                                    <button className="p-2 hover:bg-gold-royal/20 rounded-full transition-colors text-white/60 hover:text-white">
                                        <Printer size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className={`flex items-center gap-3 ${isAr ? 'text-right' : 'text-left flex-row-reverse'}`}>
                                <div className={`${isAr ? 'order-2' : 'order-1'}`}>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-gold-royal uppercase">
                                        {t('ui.royalArchive')}
                                    </span>
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        {article.category === 'battle'
                                            ? (isAr ? 'سجل البطولات' : 'Records of Valor')
                                            : article.category === 'landmark'
                                                ? (isAr ? 'سجل المعالم' : 'Landmark Records')
                                                : (isAr ? 'سجل الحواضر' : 'City Chronicles')}
                                    </h3>
                                </div>
                                <div className={`w-10 h-10 rounded-full bg-gold-royal/10 flex items-center justify-center text-gold-royal ${isAr ? 'order-1' : 'order-2'}`}>
                                    <Crown size={20} />
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/10 relative">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />

                            <div className={`px-8 md:px-16 py-12 relative z-10 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
                                {/* Article Title */}
                                <h1 className={`text-4xl md:text-5xl font-black text-gold-royal mb-6 leading-tight drop-shadow-md ${isAr ? 'font-arabic' : 'font-serif'}`}>
                                    {article.title[lang]}
                                </h1>

                                {/* Meta Summary */}
                                <div className={`flex flex-wrap gap-4 mb-10 py-2 bg-gold-royal/5 ${isAr ? 'border-r-4 border-gold-royal pr-6' : 'border-l-4 border-gold-royal pl-6'}`}>
                                    <div className="flex items-center gap-2 text-white/50 text-sm">
                                        <Shield size={16} className="text-gold-royal" />
                                        <span>{t('ui.officialDocumentation')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50 text-sm">
                                        <Calendar size={16} className="text-gold-royal" />
                                        <span>{new Date().toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'en-US')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/50 text-sm">
                                        <MapPin size={16} className="text-gold-royal" />
                                        <span>{isAr ? 'المملكة المغربية الشريفة' : 'Kingdom of Morocco'}</span>
                                    </div>
                                </div>

                                {/* Intro */}
                                <p className={`text-xl text-white/90 leading-relaxed mb-12 italic bg-white/5 p-6 rounded-xl border-y border-gold-royal/20 ${isAr ? 'font-arabic' : ''}`}>
                                    <SmartLink text={article.intro[lang]} />
                                </p>

                                {/* Sections */}
                                <div className="space-y-12">
                                    {article.sections.map((section, idx) => (
                                        <div key={idx} className="group bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-gold-royal/30 transition-all duration-500 hover:bg-white/[0.08]">
                                            <h2 className="text-2xl font-black text-gold-royal mb-6 flex items-center gap-3">
                                                <span className={`w-8 h-[2px] bg-gold-royal group-hover:w-16 transition-all duration-500 ${!isAr && 'order-2'}`} />
                                                <span className={!isAr ? 'order-1' : ''}>{section.title[lang]}</span>
                                            </h2>
                                            <div className={`text-lg text-white/80 leading-loose ${isAr ? 'font-arabic' : 'font-sans'}`}>
                                                <SmartLink text={section.content[lang]} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Conclusion */}
                                <div className="mt-16 p-10 bg-gradient-to-br from-slate-900 to-black rounded-3xl border border-gold-royal/20 relative overflow-hidden group">
                                    <div className={`absolute top-0 w-24 h-24 bg-gold-royal/10 rounded-full -mt-12 transition-transform group-hover:scale-150 ${isAr ? 'right-0 -mr-12' : 'left-0 -ml-12'}`} />
                                    <p className={`relative z-10 text-white/90 text-xl leading-relaxed text-center font-medium ${isAr ? 'font-arabic' : ''}`}>
                                        {article.conclusion[lang]}
                                    </p>
                                    <div className="mt-10 flex justify-center opacity-30 items-center gap-4">
                                        <div className="w-16 h-px bg-gold-royal" />
                                        <Crown size={24} className="text-gold-royal" />
                                        <div className="w-16 h-px bg-gold-royal" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className={`px-8 py-5 bg-black/80 border-t border-gold-royal/20 flex justify-between items-center text-[10px] text-white/40 font-black tracking-[0.2em] uppercase ${!isAr && 'flex-row-reverse'}`}>
                            <span>{t('ui.digitalSovereignty')}</span>
                            <div className="flex items-center gap-2 text-gold-royal bg-gold-royal/10 px-4 py-2 rounded-full border border-gold-royal/30 hover:bg-gold-royal/20 transition-colors">
                                <Shield size={12} />
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
