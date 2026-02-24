"use client";

import React from 'react';
import Link from 'next/link';
import { Crown, ArrowRight, Shield, Calendar, MapPin, Printer, Share2 } from 'lucide-react';
import { MoroArticle } from '../../../data/moroverse-content';
import SmartLink from '../../../components/SmartLink';

const ArticleReaderPage = ({ article }: { article: MoroArticle }) => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold-royal/10 px-8 py-4 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-xs font-black uppercase tracking-widest"
                >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    {article.category === 'battle' ? 'العودة لسجلات البسالة' : article.category === 'landmark' ? 'العودة للمعالم' : 'العودة للمدن'}
                </Link>
                <div className="flex items-center gap-3">
                    <Crown size={20} className="text-gold-royal" />
                    <span className="text-xs font-black tracking-widest text-slate-900 uppercase">MoroVerse Royal Archive</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Printer size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                        <Share2 size={18} />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative h-[40vh] bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="relative z-10 text-center px-4">
                    <span className="text-gold-royal text-[10px] font-black uppercase tracking-[0.5em] mb-4 block animate-pulse">
                        {article.category === 'battle' ? 'Battle Record' : article.category === 'landmark' ? 'Imperial Landmark' : 'Sovereign City'}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white font-arabic leading-tight">
                        {article.title}
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto -mt-20 relative z-20 pb-20 px-4">
                <div className="bg-white rounded-[40px] shadow-2xl border border-gold-royal/10 overflow-hidden shadow-gold-royal/5">
                    <div className="h-2 bg-gradient-to-r from-royal-red via-gold-royal to-star-green" />

                    <div className="p-8 md:p-16 text-right" dir="rtl">
                        {/* Meta Summary */}
                        <div className="flex flex-wrap gap-6 mb-12 border-r-4 border-gold-royal pr-8 py-3 bg-gold-royal/5">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Shield size={18} className="text-gold-royal" />
                                <span className="font-bold">سجل تاريخي موثق</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <Calendar size={18} className="text-gold-royal" />
                                <span className="font-bold">الأرشيف الملكي</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                                <MapPin size={18} className="text-gold-royal" />
                                <span className="font-bold">المملكة المغربية الشريفة</span>
                            </div>
                        </div>

                        {/* Intro */}
                        <p className="text-2xl text-slate-800 leading-relaxed mb-16 font-arabic italic">
                            <SmartLink text={article.intro} />
                        </p>

                        {/* Sections */}
                        <div className="space-y-16">
                            {article.sections.map((section, idx) => (
                                <div key={idx} className="group">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-4">
                                        <span className="w-12 h-[2px] bg-gold-royal group-hover:w-20 transition-all" />
                                        {section.title}
                                    </h2>
                                    <p className="text-xl text-slate-600 leading-loose font-arabic">
                                        <SmartLink text={section.content} />
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Conclusion */}
                        <div className="mt-20 p-12 bg-slate-900 rounded-[48px] relative overflow-hidden group shadow-2xl shadow-slate-900/20 text-center">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-royal/10 rounded-bl-full -mr-24 -mt-24 transition-transform duration-1000 group-hover:scale-120" />
                            <p className="relative z-10 text-white/90 text-xl leading-relaxed font-arabic max-w-2xl mx-auto">
                                {article.conclusion}
                            </p>
                            <div className="mt-8 flex justify-center opacity-30">
                                <div className="w-20 h-px bg-gold-royal" />
                                <Crown size={24} className="mx-6 text-gold-royal" />
                                <div className="w-20 h-px bg-gold-royal" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 bg-slate-900 text-white/20 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="h-px w-12 bg-white/10" />
                    <Crown size={20} />
                    <div className="h-px w-12 bg-white/10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">MoroVerse Sovereign Digital Infrastructure</p>
            </footer>
        </div>
    );
};

export default ArticleReaderPage;
