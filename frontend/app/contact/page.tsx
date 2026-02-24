import React from 'react';
import Link from 'next/link';
import { Crown, Mail, MessageSquare, MapPin, ArrowRight, Share2, Compass, Shield } from 'lucide-react';

export const metadata = {
    title: 'اتصل بنا | أرشيف MoroVerse الملكي',
    description: 'تواصل مع فريق MoroVerse للاستفسارات، المساهمات التاريخية، أو التعاون التقني في مشروع الموسوعة المغربية.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold-royal/10 px-8 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <Crown size={24} className="text-gold-royal" />
                    <span className="font-display font-black tracking-widest text-slate-900 uppercase">MOROVERSE</span>
                </Link>
                <Link
                    href="/"
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                >
                    العودة للمنصة <ArrowRight size={14} className="rotate-180" />
                </Link>
            </nav>

            {/* Hero */}
            <section className="relative py-24 px-8 overflow-hidden bg-slate-50 text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Direct Communication</span>
                    <h1 className="text-5xl md:text-6xl font-bold mb-8 font-arabic text-slate-900 leading-tight">
                        تواصل مع الأرشيف السيادي
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed font-arabic italic">
                        "بابنا مفتوح لكل غيور على تاريخ الوطن، والباحثين عن توثيق الأمجاد المغربية."
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto py-24 px-8" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Form Placeholder Design */}
                    <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100 space-y-8">
                        <h2 className="text-3xl font-bold text-slate-900 font-arabic">أرسل رسالتك</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">اسمك الكريم</label>
                                <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="محمد المغربي" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">البريد الإلكتروني</label>
                                <input type="email" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="contact@domain.ma" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-4">موضوع الرسالة</label>
                                <textarea rows={4} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" placeholder="كيف يمكننا خدمتك؟" />
                            </div>
                            <button className="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-primary/20">
                                إرسال إلى الأرشيف
                            </button>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-16 text-right pt-8">
                        <div className="space-y-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 font-arabic mb-1">البريد الرسمي</h3>
                                    <p className="text-slate-500">sovereign@moroverse.ma</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-gold-royal/5 flex items-center justify-center text-gold-royal shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 font-arabic mb-1">المقر الرقمي</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        المملكة المغربية الشريفة <br />
                                        الرباط - العاصمة الإدارية
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-star-green/5 flex items-center justify-center text-star-green shrink-0">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 font-arabic mb-1">الدعم التقني</h3>
                                    <p className="text-slate-500">متاح 24/7 لخدمة الباحثين في تاريخ المملكة.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-900 rounded-[48px] text-white relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-br-full -ml-16 -mt-16 transition-transform group-hover:scale-120" />
                            <Compass className="text-gold-royal w-12 h-12 mb-6" />
                            <h4 className="text-2xl font-bold font-arabic mb-4">انضم لفريق البحث</h4>
                            <p className="text-white/60 text-sm leading-relaxed font-arabic">
                                نحن نرحب دائماً بالباحثين والمؤرخين والمهتمين بتطوير المحتوى الرقمي الموثوق عن المغرب.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-12 bg-slate-50 text-center border-t border-slate-100 px-8">
                <div className="flex justify-center gap-8 mb-8">
                    <Share2 className="text-slate-300 hover:text-primary transition-colors cursor-pointer" size={20} />
                    <MessageSquare className="text-slate-300 hover:text-primary transition-colors cursor-pointer" size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 italic">MoroVerse Royal Infrastructure — Sovereignty Documented</p>
            </footer>
        </div>
    );
}
