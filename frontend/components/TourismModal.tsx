'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { LangCode } from '../types/language';
import { TourismType, fetchTourismDestinations, Destination } from '../utils/wp-api';

interface TourismModalProps {
    isOpen: boolean;
    onClose: () => void;
    lang: LangCode;
    type: TourismType;
    icon: React.ReactNode;
    title: { en: string; ar: string };
    definition: { en: string; ar: string };
}

export default function TourismModal({ isOpen, onClose, lang, type, icon, title, definition }: TourismModalProps) {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedDest, setExpandedDest] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchTourismDestinations(type).then(data => {
                setDestinations(data);
                setLoading(false);
            });
        }
    }, [isOpen, type]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Content - Glassmorphism */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-[#c5a059]/30 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] overflow-hidden"
                    >
                        {/* Header Gradient */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#c5a059]/30 to-transparent pointer-events-none" />

                        <div className="p-8 pb-10">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className={`absolute top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10 grid place-items-center`}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header Section */}
                            <div className="flex flex-col items-center text-center mt-4 mb-10">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c5a059] to-[#8b0000] p-[2px] mb-6 shadow-lg shadow-[#c5a059]/30">
                                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                                        <div className="text-[#c5a059] child-svg-w-10 child-svg-h-10">
                                            {icon}
                                        </div>
                                    </div>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-white font-cinzel mb-4 drop-shadow-md">
                                    {lang === 'ar' ? title.ar : title.en}
                                </h2>
                                <p className={`text-base md:text-lg text-white/80 max-w-xl leading-relaxed ${lang === 'ar' ? 'font-arabic' : 'font-outfit'}`}>
                                    {lang === 'ar' ? definition.ar : definition.en}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent my-8" />

                            {/* Destinations Dropdown List */}
                            <div>
                                <h3 className={`text-sm font-black uppercase tracking-[0.2em] text-[#c5a059] mb-6 flex items-center gap-2 ${lang === 'ar' ? 'font-arabic justify-start flex-row-reverse' : ''}`}>
                                    <MapPin className="w-4 h-4" />
                                    {lang === 'ar' ? 'أبرز الوجهات المقترحة' : 'Top Suggested Destinations'}
                                </h3>

                                <div className="space-y-4">
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-10 opacity-70">
                                            <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin mb-4" />
                                            <p className="text-sm text-[#c5a059] tracking-widest uppercase">
                                                {lang === 'ar' ? 'جاري السجل من السجلات الملكية...' : 'Loading from Royal Archives...'}
                                            </p>
                                        </div>
                                    ) : (
                                        destinations.map((dest) => (
                                            <div
                                                key={dest.id}
                                                className="bg-black/30 border border-[#c5a059]/20 hover:border-[#c5a059]/60 rounded-2xl overflow-hidden transition-all duration-300"
                                            >
                                                <button
                                                    onClick={() => setExpandedDest(expandedDest === dest.id ? null : dest.id)}
                                                    className="w-full px-6 py-4 flex items-center justify-between text-left group"
                                                >
                                                    <span className={`text-lg font-bold text-white group-hover:text-[#c5a059] transition-colors ${lang === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
                                                        {lang === 'ar' ? dest.name.ar : dest.name.en}
                                                    </span>
                                                    {expandedDest === dest.id ? (
                                                        <ChevronUp className="w-5 h-5 text-[#c5a059]" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-white/50 group-hover:text-[#c5a059]" />
                                                    )}
                                                </button>
                                                <AnimatePresence>
                                                    {expandedDest === dest.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className={`px-6 pb-5 pt-1 text-sm text-white/70 leading-relaxed ${lang === 'ar' ? 'font-arabic text-right' : 'font-outfit'}`}>
                                                                <div className="pl-4 md:pl-0 md:pr-4 border-l-2 md:border-l-0 md:border-r-2 border-[#c5a059]/40 ml-2 md:mr-2">
                                                                    {lang === 'ar' ? dest.description.ar : dest.description.en}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))
                                    )}
                                    {!loading && destinations.length === 0 && (
                                        <div className="text-center py-8 text-white/50 bg-black/20 rounded-xl border border-dashed border-white/20">
                                            {lang === 'ar' ? 'لا توجد وجهات مقترحة حالياً.' : 'No destinations currently suggested.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
