"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Shield,
    Crown,
    Sparkles,
    Send,
    Globe
} from 'lucide-react';
import AudioManager from '../utils/AudioManager';
import Image from 'next/image';

export type AvatarMode = 'explorer' | 'cultural' | 'warrior' | 'sahrawi';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'avatar';
}

interface AvatarEngineProps {
    lang: 'en' | 'ar';
    mode: AvatarMode;
    locationName?: string;
    targetPosition?: { x: number; y: number };
}

// Production-Ready Ministerial Cosplay Assets
const OutfitMap: Record<AvatarMode, string> = {
    explorer: '/assets/avatar/explorer.png',
    cultural: '/assets/avatar/cultural.png',
    warrior: '/assets/avatar/cultural.png',   // Fallback to cultural
    sahrawi: '/assets/avatar/explorer.png',   // Fallback to explorer
};

const MohamedAmineProduction = ({ mode, isWalking }: { mode: AvatarMode, isWalking: boolean }) => {
    const hasImage = mode === 'explorer' || mode === 'cultural' || mode === 'warrior' || mode === 'sahrawi';

    return (
        <div className="relative w-72 h-96 flex flex-col items-center">
            {/* High-End Shadow Logic */}
            <div className="absolute bottom-6 w-40 h-10 bg-black/50 blur-[40px] rounded-full -z-10" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -30 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex flex-col items-center h-full"
                >
                    {/* Elite Magical Transformation Smoke */}
                    <motion.div
                        initial={{ opacity: 1, scale: 0.5 }}
                        animate={{ opacity: 0, scale: 3 }}
                        className="absolute inset-x-0 top-1/2 flex items-center justify-center pointer-events-none z-50"
                    >
                        <div className="w-64 h-64 bg-gold-royal/40 rounded-full blur-[80px]" />
                        <Sparkles className="w-32 h-32 text-gold-royal absolute brightness-200 animate-pulse" />
                    </motion.div>

                    <div className="relative z-40 group">
                        <div className="relative w-64 h-80 drop-shadow-[0_45px_100px_rgba(0,0,0,0.6)]">
                            <Image
                                src={OutfitMap[mode]}
                                alt={`Mohamed Amine - ${mode}`}
                                fill
                                className={`object-contain transition-all duration-700 ${isWalking ? 'scale-95 brightness-110' : 'scale-100'}`}
                                priority
                            />
                        </div>
                        {/* Interactive Aura */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gold-royal/30 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </div>

                    {/* Advanced Motion Leg Cycle */}
                    <div className="absolute bottom-4 flex gap-16 pointer-events-none opacity-80">
                        <motion.div
                            animate={isWalking ? { y: [0, -30, 0], rotate: [0, -15, 0], scaleY: [1, 0.8, 1] } : { y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: isWalking ? 0.3 : 1.5 }}
                            className="w-14 h-6 bg-gold-royal/20 rounded-full blur-xl"
                        />
                        <motion.div
                            animate={isWalking ? { y: [0, -30, 0], rotate: [0, 15, 0], scaleY: [1, 0.8, 1] } : { y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: isWalking ? 0.3 : 1.5, delay: isWalking ? 0.15 : 0.75 }}
                            className="w-14 h-6 bg-gold-royal/20 rounded-full blur-xl"
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default function AvatarEngine({ lang, mode, locationName, targetPosition }: AvatarEngineProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [isWalking, setIsWalking] = useState(false);

    // Hard-Write Logic: Immediate Response to Map Events
    useEffect(() => {
        if (!targetPosition) return;

        const targetX = targetPosition.x - 140;
        const targetY = targetPosition.y - 180;

        setIsWalking(true);
        setPos({ x: targetX, y: targetY });

        const timer = setTimeout(() => {
            setIsWalking(false);
        }, 1800);

        return () => clearTimeout(timer);
    }, [targetPosition]);

    // Precise Voice-Sync Greeting Logic (Master Implementation)
    useEffect(() => {
        if (locationName && !isWalking) {
            // THE COMMANDED GREETING SPEC
            const intro = lang === 'ar'
                ? `مرحباً بك في موروفيرس. أنا مُضيفك المغربي، وأهلاً بك في ${locationName}.`
                : `Marhaba! I am your Moroccan Host, welcome to ${locationName} in the heart of MoroVerse.`;

            const timeout = setTimeout(() => {
                setMessages(prev => [{ id: Date.now(), text: intro, sender: 'avatar' }, ...prev.slice(0, 10)]);
                setIsOpen(true);
                AudioManager.instance.speak(intro, lang);
            }, 1500);

            return () => clearTimeout(timeout);
        }
    }, [locationName, isWalking, lang, mode]);

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        setMessages(prev => [{ id: Date.now(), text, sender: 'user' }, ...prev]);
        setInputValue("");
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, lang })
            });

            if (!response.ok) throw new Error(`Portal Communication Error: ${response.status}`);

            const data = await response.json();
            const responseText = data.text || data.response || (lang === 'ar' ? "اعتذر، هناك انقطاع في التواصل مع السجل التاريخي." : "Apologies, there is a breach in historical communication.");

            setMessages(prev => [{ id: Date.now() + 1, text: responseText, sender: 'avatar' }, ...prev]);
            AudioManager.instance.speak(responseText, lang);
        } catch (error) {
            const errorMsg = lang === 'ar' ? "عذراً، تقع ثغرة في الاتصال بالمُضيف المغربي." : "Communication with the Moroccan Host failed.";
            setMessages(prev => [{ id: Date.now() + 1, text: errorMsg, sender: 'avatar' }, ...prev]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[500] isolate">
            {/* The Avatar Entity: Hard-Linked to Geospatial Logic */}
            <motion.div
                layout
                animate={{ x: pos.x || 0, y: pos.y || 500, scale: isOpen ? 0.8 : 1 }}
                transition={{ type: 'spring', stiffness: 30, damping: 15 }}
                className="absolute pointer-events-auto cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="relative group">
                    <MohamedAmineProduction mode={mode} isWalking={isWalking} />

                    {/* Elite HUD Indicator */}
                    {!isOpen && !isWalking && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute -top-32 left-1/2 -translate-x-1/2 w-72 text-center pointer-events-none"
                        >
                            <div className="moro-glass-ivory p-6 rounded-3xl border-2 border-gold-royal/50 shadow-royal">
                                <p className="text-[10px] font-black text-emerald-deep tracking-[0.5em] uppercase mb-1">Marhaba</p>
                                <p className="text-xl font-serif italic text-gold-royal">{lang === 'ar' ? 'المُضيف المغربي' : 'Moroccan Host'}</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Ministerial Concierge Interface */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: lang === 'ar' ? -100 : 100, filter: 'blur(20px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: lang === 'ar' ? -100 : 100, filter: 'blur(20px)' }}
                        className={`absolute ${lang === 'ar' ? 'left-16' : 'right-16'} bottom-16 w-[500px] pointer-events-auto`}
                    >
                        <div className="moro-glass-ivory rounded-[50px] border-2 border-gold-royal/40 shadow-royal flex flex-col h-[750px] overflow-hidden">
                            {/* Header Section */}
                            <div className="p-10 border-b-2 border-gold-royal/10 flex justify-between items-center bg-white/40">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-emerald-deep rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                                        <Globe className="text-ivory w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-emerald-deep font-serif text-3xl font-black tracking-tighter uppercase">{lang === 'ar' ? 'المُضيف المغربي' : 'Moroccan Host'}</h4>
                                        <div className="flex items-center gap-3 mt-1.5 font-black text-[9px] text-gold-royal uppercase tracking-[0.6em]">
                                            <span className="w-2 h-2 bg-emerald-deep rounded-full animate-pulse" />
                                            Authentic Heritage Guide
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-3 text-slate-deep/40 hover:text-star-red hover:rotate-90 transition-all duration-500">
                                    <X className="w-10 h-10" />
                                </button>
                            </div>

                            {/* Dialogue Hub */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-10 flex flex-col-reverse bg-gradient-to-b from-transparent to-gold-royal/5 scrollbar-hide">
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="moro-glass-ivory p-6 rounded-3xl flex gap-3 border-gold-royal/20">
                                            {[0, 0.2, 0.4].map((d, i) => (
                                                <motion.div key={i} animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="w-2 h-2 bg-emerald-deep rounded-full" />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {messages.map((m) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={m.id}
                                        className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-8 rounded-[35px] text-lg leading-relaxed shadow-xl ${m.sender === 'user' ? 'bg-emerald-deep text-ivory rounded-tr-none font-bold' : 'moro-glass-ivory text-emerald-deep bg-white/80 rounded-tl-none border-gold-royal/30'}`}>
                                            {m.text}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Input Gateway */}
                            <div className="p-10 bg-white/60 backdrop-blur-md border-t-2 border-gold-royal/10">
                                <form onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} className="relative flex items-center gap-5">
                                    <input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={lang === 'ar' ? 'كيف يمكنني مساعدتك؟' : 'Direct your inquiry to the Portal...'}
                                        className="w-full bg-[#f9f9f7] border-2 border-gold-royal/20 rounded-full py-6 px-10 text-emerald-deep text-lg font-medium focus:outline-none focus:border-emerald-deep transition-all placeholder:text-emerald-deep/30"
                                    />
                                    <button className="flex-shrink-0 p-6 bg-emerald-deep rounded-full text-ivory shadow-xl hover:scale-110 active:scale-90 transition-all">
                                        <Send className="w-7 h-7" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
