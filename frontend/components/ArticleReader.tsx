"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Crown, Share2, Printer, MapPin, Calendar, Shield } from 'lucide-react';
import { MoroArticle } from '../data/moroverse-content';
import SmartLink from './SmartLink';

interface ArticleReaderProps {
    article: MoroArticle;
    isOpen: boolean;
    onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article, isOpen, onClose }) => {
    if (!article) return null;

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
                        className="relative w-full max-w-4xl max-h-[90vh] bg-black/90 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(197,160,89,0.2)] overflow-hidden flex flex-col border border-gold-royal/30"
                    >
                        {/* Royal Header Bar */}
                        <div className="h-2 bg-gradient-to-r from-royal-red via-gold-royal to-star-green" />

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gold-royal/20 flex items-center justify-between bg-black/40">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gold-royal/10 flex items-center justify-center text-gold-royal">
                                    <Crown size={20} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold tracking-[0.2em] text-gold-royal uppercase">
                                        MoroVerse Royal Archive
                                    </span>
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        {article.category === 'battle' ? 'سجل البطولات' : article.category === 'landmark' ? 'سجل المعالم' : 'سجل الحواضر'}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gold-royal/20 rounded-full transition-colors text-white/60 hover:text-white">
                                    <Printer size={18} />
                                </button>
                                <button className="p-2 hover:bg-gold-royal/20 rounded-full transition-colors text-white/60 hover:text-white">
                                    <Share2 size={18} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-slate-400 ml-2"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/10 relative">
                            {/* Texture overlay for royal feel */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }} />

                            <div className="px-8 md:px-16 py-12 text-right relative z-10" dir="rtl">
                                {/* Article Title */}
                                <h1 className="text-4xl md:text-5xl font-black text-gold-royal mb-6 font-arabic leading-tight drop-shadow-md">
                                    {article.title}
                                </h1>

                                {/* Meta Summary */}
                                <div className="flex flex-wrap gap-4 mb-10 border-r-4 border-gold-royal pr-6 py-2 bg-gold-royal/5">
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <Shield size={16} className="text-gold-royal" />
                                        <span>توثيق رسمي</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <Calendar size={16} className="text-gold-royal" />
                                        <span>{new Date().toLocaleDateString('ar-MA')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <MapPin size={16} className="text-gold-royal" />
                                        <span>المملكة المغربية الشريفة</span>
                                    </div>
                                </div>

                                {/* Intro */}
                                <p className="text-xl text-white/90 leading-relaxed mb-12 font-arabic italic border-r-2 border-gold-royal/50 pr-6 pl-2">
                                    <SmartLink text={article.intro} />
                                </p>

                                {/* Sections */}
                                <div className="space-y-12">
                                    {article.sections.map((section, idx) => (
                                        <div key={idx} className="group bg-black/40 p-8 rounded-3xl border border-gold-royal/10 hover:border-gold-royal/30 transition-colors">
                                            <h2 className="text-2xl font-black text-gold-royal mb-6 flex items-center gap-3">
                                                <span className="w-8 h-[2px] bg-gold-royal group-hover:w-16 transition-all duration-500" />
                                                {section.title}
                                            </h2>
                                            <p className="text-lg text-white/80 leading-loose font-arabic">
                                                <SmartLink text={section.content} />
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Conclusion */}
                                <div className="mt-16 p-8 bg-slate-900 rounded-xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold-royal/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                                    <p className="relative z-10 text-white/90 text-lg leading-relaxed font-arabic text-center">
                                        {article.conclusion}
                                    </p>
                                    <div className="mt-6 flex justify-center opacity-50">
                                        <div className="w-12 h-px bg-gold-royal" />
                                        <Crown size={20} className="mx-4 text-gold-royal" />
                                        <div className="w-12 h-px bg-gold-royal" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 bg-black/80 border-t border-gold-royal/20 flex justify-between items-center text-[10px] text-white/40 font-bold tracking-widest uppercase">
                            <span>MoroVerse Digital Sovereignty © 2026</span>
                            <div className="flex items-center gap-2 text-gold-royal bg-gold-royal/10 px-3 py-1.5 rounded-full border border-gold-royal/30">
                                <Crown size={12} />
                                <span>Authentic Record</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ArticleReader;
