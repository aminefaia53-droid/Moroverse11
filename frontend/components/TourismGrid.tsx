'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Tent, Palmtree, Film, History, ChevronRight } from 'lucide-react';
import { LangCode } from '../types/language';
import { TourismType } from '../utils/wp-api';
import TourismModal from './TourismModal';

interface TourismCardProps {
    type: TourismType;
    icon: React.ReactNode;
    title: { en: string; ar: string };
    shortDesc: { en: string; ar: string };
    definition: { en: string; ar: string };
    imageBg: string;
    lang: LangCode;
}

const TOURISM_TYPES: TourismCardProps[] = [
    {
        type: 'cultural',
        icon: <History className="w-8 h-8" />,
        title: { en: 'Cultural Tourism', ar: 'السياحة الثقافية' },
        shortDesc: { en: 'Echoes of the Ancients', ar: 'أصداء الماضي' },
        definition: {
            en: 'Journey through centuries of authentic Moroccan heritage. From the intricate zellij of ancient medinas to the grand ruins of bygone empires.',
            ar: 'رحلة عبر قرون من التراث المغربي الأصيل؛ من الزليج الدقيق في المدن العتيقة إلى الأطلال الشامخة للإمبراطوريات البائدة.'
        },
        imageBg: '/images/t-cultural.jpg',
        lang: 'en' // Placeholder, overridden on render
    },
    {
        type: 'cinematic',
        icon: <Film className="w-8 h-8" />,
        title: { en: 'Cinematic Tourism', ar: 'السياحة السينمائية' },
        shortDesc: { en: 'The Moroccan Studio', ar: 'استوديو المغرب' },
        definition: {
            en: 'Step into the frames of the world\'s greatest epics. Explore the legendary Ait Ben Haddou and the vast landscapes that birthed Hollywood blockbusters.',
            ar: 'ادخل إلى كواليس أعظم الأعمال الملحمية العالمية. استكشف قصبة آيت بن حدو الأسطورية والمناظر الشاسعة التي أنجبت أضخم أفلام هوليوود.'
        },
        imageBg: '/images/t-cinematic.jpg',
        lang: 'en'
    },
    {
        type: 'adventure',
        icon: <Tent className="w-8 h-8" />,
        title: { en: 'Adventure Tourism', ar: 'سياحة المغامرات' },
        shortDesc: { en: 'Conquer the Atlas', ar: 'قهر الأطلس' },
        definition: {
            en: 'For those who seek the thrill of the unknown. Trek the towering peaks of the High Atlas or surf the endless golden dunes of the Sahara.',
            ar: 'لعشاق إثارة المجهول. تسلق القمم الشاهقة في جبال الأطلس الكبير أو انطلق في رحلة عبر الكثبان الذهبية اللامتناهية للصحراء الكبرى.'
        },
        imageBg: '/images/t-adventure.jpg',
        lang: 'en'
    },
    {
        type: 'beach',
        icon: <Palmtree className="w-8 h-8" />,
        title: { en: 'Beach Tourism', ar: 'السياحة الشاطئية' },
        shortDesc: { en: 'Tales of Two Coasts', ar: 'حكايات الساحلين' },
        definition: {
            en: 'Embrace the dual coastal majesty of Morocco. From the turquoise Mediterranean shores to the wild, surfing waves of the Atlantic Ocean.',
            ar: 'عانق السحر المزدوج لسواحل المغرب الممتدة. من شواطئ البحر الأبيض المتوسط الفيروزية إلى أمواج المحيط الأطلسي البرية المثالية لركوب الأمواج.'
        },
        imageBg: '/images/t-beach.jpg',
        lang: 'en'
    },
    {
        type: 'dark',
        icon: <Compass className="w-8 h-8" />, // Can use Skull/Ghost if appropriate, but compass/history is safer for prestige
        title: { en: 'Dark Tourism', ar: 'السياحة المظلمة' },
        shortDesc: { en: 'Shadows of History', ar: 'ظلال التاريخ' },
        definition: {
            en: 'Explore sites connected to tragic or mysterious historical events that left an indelible mark on the Kingdom\'s memory.',
            ar: 'استكشاف الأماكن المرتبطة بالأحداث التاريخية المأساوية أو الغامضة التي تركت أثراً لا يمحى في ذاكرة المملكة.'
        },
        imageBg: '/images/t-dark.jpg',
        lang: 'en'
    }
];

export default function TourismGrid({ lang }: { lang: LangCode }) {
    const [selectedType, setSelectedType] = useState<TourismCardProps | null>(null);

    return (
        <section className="relative z-20 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-2 max-w-7xl mx-auto">
                <AnimatePresence>
                    {TOURISM_TYPES.map((tInfo, idx) => (
                        <motion.div
                            key={tInfo.type}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className={`group cursor-pointer relative aspect-square w-full rounded-2xl overflow-hidden glass-card-elite shadow-2xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(197,160,89,0.3)] hover:-translate-y-2 ${idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                            onClick={() => setSelectedType(tInfo)}
                        >
                            {/* Abstract/Cinematic Background Placeholder */}
                            <div className="absolute inset-0 z-0 bg-black/80">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
                                {/* Soft pulsing color gradient based on type */}
                                <div className={`absolute inset-0 opacity-40 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-70 bg-gradient-to-tr ${tInfo.type === 'dark' ? 'from-slate-900 to-[#1a1a1a]' :
                                        tInfo.type === 'cultural' ? 'from-[#8b0000] to-orange-900' :
                                            tInfo.type === 'beach' ? 'from-cyan-900 to-blue-900' :
                                                tInfo.type === 'cinematic' ? 'from-amber-900 to-yellow-900' :
                                                    'from-emerald-900 to-green-900'
                                    }`} />
                            </div>

                            {/* Content */}
                            <div className={`relative z-10 p-8 h-full flex flex-col justify-between ${lang === 'ar' ? 'items-end text-right' : 'items-start text-left'}`}>

                                {/* Top Icon */}
                                <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-[#c5a059]/30 text-[#c5a059] group-hover:scale-110 group-hover:bg-[#c5a059] group-hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                                    {tInfo.icon}
                                </div>

                                {/* Bottom Texts */}
                                <div className="space-y-3 w-full">
                                    <h4 className={`text-xs font-black uppercase tracking-[0.3em] text-[#c5a059] ${lang === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
                                        {lang === 'ar' ? tInfo.shortDesc.ar : tInfo.shortDesc.en}
                                    </h4>
                                    <h3 className={`text-3xl font-black text-white drop-shadow-lg ${lang === 'ar' ? 'font-arabic' : 'font-cinzel'} leading-tight`}>
                                        {lang === 'ar' ? tInfo.title.ar : tInfo.title.en}
                                    </h3>

                                    {/* Reveal Button on Hover */}
                                    <div className={`overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mt-6`}>
                                        <button className={`w-full py-4 rounded-xl border border-[#c5a059]/40 bg-black/60 text-[#c5a059] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#c5a059] hover:text-black transition-colors ${lang === 'ar' ? 'flex-row-reverse font-arabic' : 'font-outfit'}`}>
                                            {lang === 'ar' ? 'استكشاف الوجهات' : 'Explore Destinations'}
                                            <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {selectedType && (
                <TourismModal
                    isOpen={!!selectedType}
                    onClose={() => setSelectedType(null)}
                    lang={lang}
                    type={selectedType.type}
                    icon={selectedType.icon}
                    title={selectedType.title}
                    definition={selectedType.definition}
                />
            )}
        </section>
    );
}
