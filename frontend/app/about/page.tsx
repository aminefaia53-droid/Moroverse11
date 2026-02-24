import React from 'react';
import Link from 'next/link';
import { Crown, Shield, Globe, Landmark, ArrowRight, History, Heart } from 'lucide-react';

export const metadata = {
    title: 'حول MoroVerse | الموسوعة الرقمية للسيادة المغربية',
    description: 'تعرف على مشروع MoroVerse، المبادرة الرقمية الرائدة لتوثيق تاريخ وجغرافيا المملكة المغربية الشريفة بأحدث التقنيات.',
};

export default function AboutPage() {
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
            <section className="relative py-24 px-8 overflow-hidden bg-slate-900 text-white text-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-10" />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <span className="text-gold-royal text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Our Sovereign Mission</span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 font-arabic leading-tight">
                        عن مورو فيرس: آفاق المجد الرقمي
                    </h1>
                    <p className="text-xl text-white/60 leading-relaxed font-arabic italic">
                        "لسنا مجرد منصة، نحن أرشيف حي لروح المملكة المغربية، نربط بين عبق الماضي وابتكارات المستقبل."
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="max-w-4xl mx-auto py-24 px-8 space-y-24 text-right" dir="rtl">
                <section className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 font-arabic">الرؤية والهدف</h2>
                    </div>
                    <p className="text-xl text-slate-600 leading-loose font-arabic">
                        MoroVerse هو مشروع طموح يهدف إلى إعادة صياغة الوجود الرقمي للتراث المغربي. نسعى من خلال هذه المنصة إلى تقديم المحتوى التاريخي والجغرافي المغربي بطريقة تليق بهيبة المملكة، مستخدمين أحدث تقنيات الويب والذكاء الاصطناعي لضمان تجربة مستخدم فريدة ودقة تاريخية لا تشوبها شائبة.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-4">
                        <History className="text-gold-royal w-10 h-10 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 font-arabic">توثيق البطولات</h3>
                        <p className="text-slate-500 font-arabic leading-relaxed">
                            نؤرخ للمعارك الكبرى التي شكلت سيادة المغرب، من الزلاقة إلى المسيرة الخضراء، بأسلوب سردي رفيع.
                        </p>
                    </div>
                    <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 space-y-4">
                        <Landmark className="text-gold-royal w-10 h-10 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 font-arabic">إحياء المعالم</h3>
                        <p className="text-slate-500 font-arabic leading-relaxed">
                            نستعرض تفاصيل العمارة والجغرافيا المغربية، محولين البيانات إلى قصص بصرية تغرس الفخر في نفوس الأجيال.
                        </p>
                    </div>
                </div>

                <section className="p-12 bg-primary rounded-[60px] text-white text-center space-y-8 shadow-2xl shadow-primary/20">
                    <Globe className="w-16 h-16 mx-auto opacity-50" />
                    <h2 className="text-4xl font-bold font-arabic leading-tight">بوابة نحو العالمية</h2>
                    <p className="text-xl text-white/80 font-arabic leading-relaxed max-w-2xl mx-auto">
                        نهدف لأن ترتقي MoroVerse إلى صدارة نتائج البحث العالمية، لتكون المرجع الأول لكل باحث عن الحقيقة والمجد المغربي في الفضاء الرقمي.
                    </p>
                    <div className="pt-8 flex justify-center gap-4">
                        <div className="h-px w-12 bg-white/20 self-center" />
                        <Crown className="text-gold-royal" />
                        <div className="h-px w-12 bg-white/20 self-center" />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 bg-slate-50 text-center border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">MoroVerse Royal Infrastructure © 2026</p>
            </footer>
        </div>
    );
}
