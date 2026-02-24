"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

// Types for Assistant State
type Emotion = 'neutral' | 'happy' | 'concerned' | 'impressed';
type Outfit = 'modern' | 'traditional';

export default function MoroVerseAssistant() {
    // State References
    const [message, setMessage] = useState<string>("مرحبا معاك محمد أمين العميري مؤسس مدونة MoroVerse، أنا هنا لأرافقك في رحلتك عبر تاريخنا العظيم.");
    const [emotion, setEmotion] = useState<Emotion>('happy');
    const [outfit, setOutfit] = useState<Outfit>('modern');
    const [isHovered, setIsHovered] = useState(false);
    const [showBubble, setShowBubble] = useState(true);

    // Animation Controls
    const containerControls = useAnimation();

    // Mouse Tracking Values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Look-at Constraints (Eye/Head mapping)
    const eyeX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-3, 3]);
    const eyeY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [-3, 3]);
    const headRotateX = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [-10, 10]);
    const headRotateY = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-15, 15]);

    // 1. Context & AI Reasoning (Event Listeners)
    useEffect(() => {
        // Welcome Message Auto-hide
        const timer = setTimeout(() => {
            setShowBubble(false);
            setEmotion('neutral');
        }, 8000);

        // Custom Event Listener for Morocco Actions
        const handleAction = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { type, payload } = customEvent.detail;

            setShowBubble(true);

            switch (type) {
                case 'city_click':
                    setEmotion('happy');
                    setOutfit('modern');
                    setMessage(`أهلاً بك في ${payload}، إحدى درر المغرب العظيم!`);
                    break;
                case 'landmark_click':
                    setEmotion('impressed');
                    setOutfit('traditional'); // Wardrobe Morphing to traditional
                    setMessage(`أنت الآن تتأمل ${payload}، شاهدٌ حي على عبقرية المعمار المغربي.`);
                    break;
                case 'figure_click':
                    setEmotion('impressed');
                    if (payload === 'ابن بطوطة') {
                        setMessage("أحسنت صنعاً! أنت الآن في حضرة أعظم رحالة عرفه التاريخ.");
                    } else {
                        setMessage(`شخصية عظيمة! ${payload} ترك بصمة خالدة في تاريخ أمتنا.`);
                    }
                    break;
            }

            // Auto-hide after 6 seconds
            setTimeout(() => {
                setShowBubble(false);
                setEmotion('neutral');
            }, 6000);
        };

        window.addEventListener('moroverse-action', handleAction);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('moroverse-action', handleAction);
        };
    }, []);

    // 2. Emotion Logic (Scroll Speed Detector)
    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const delta = Math.abs(currentScrollY - lastScrollY);

                    // If scrolling too fast (> 150px per tick)
                    if (delta > 150) {
                        setEmotion('concerned');
                        setShowBubble(true);
                        setMessage("تمهل يا صديقي، عظمة المغرب لا تُدرك إلا بالتدقيق.");

                        setTimeout(() => {
                            setShowBubble(false);
                            setEmotion('neutral');
                        }, 4000);
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. Pointer Tracking
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Smart Collision Avoidance: Check if cursor is over a clickable element underneath
            checkCollision(e.clientX, e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Smart Collision Avoidance Logic
    const checkCollision = (x: number, y: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        // If mouse is near the assistant widget (expanded hitbox)
        const isNear = (
            x >= rect.left - 50 &&
            x <= rect.right + 50 &&
            y >= rect.top - 50 &&
            y <= rect.bottom + 50
        );

        // Temporarily disable pointer events to check what's underneath
        containerRef.current.style.pointerEvents = 'none';
        const elementUnderneath = document.elementFromPoint(x, y);
        containerRef.current.style.pointerEvents = 'auto';

        const isClickableUnderneath = elementUnderneath?.tagName.toLowerCase() === 'button' ||
            elementUnderneath?.tagName.toLowerCase() === 'a' ||
            elementUnderneath?.closest('button') ||
            elementUnderneath?.closest('a') ||
            elementUnderneath?.closest('.cursor-pointer');

        if (isNear && isClickableUnderneath) {
            setIsHovered(true);
        } else if (!isNear) {
            setIsHovered(false);
        }
    };

    // Render Clothing based on state
    const renderOutfitOptions = () => {
        if (outfit === 'modern') {
            // Modern Suit/Jacket
            return (
                <path d="M 20 100 Q 50 80 80 100 L 90 150 L 10 150 Z" fill="#1e293b" />
            );
        } else {
            // Traditional Selham (Cloak)
            return (
                <g>
                    <path d="M 15 100 Q 50 70 85 100 L 100 150 L 0 150 Z" fill="#006233" />
                    <path d="M 40 100 L 50 150 L 60 100 Z" fill="#c1272d" opacity="0.8" />
                </g>
            );
        }
    };

    const renderEmotionEyes = () => {
        switch (emotion) {
            case 'happy':
                return (
                    <g>
                        <path d="M 35 48 Q 40 43 45 48" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <path d="M 55 48 Q 60 43 65 48" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>
                );
            case 'concerned':
                return (
                    <g>
                        <circle cx="40" cy="46" r="3" fill="#1e293b" />
                        <circle cx="60" cy="46" r="3" fill="#1e293b" />
                        {/* Concerned Eyebrows */}
                        <path d="M 35 38 L 45 42" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 65 38 L 55 42" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    </g>
                );
            case 'impressed':
                return (
                    <g>
                        <circle cx="40" cy="46" r="4" fill="#006233" />
                        <circle cx="60" cy="46" r="4" fill="#006233" />
                        {/* Raised Eyebrows */}
                        <path d="M 35 38 Q 40 35 45 38" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 55 38 Q 60 35 65 38" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    </g>
                );
            default: // Neutral
                return (
                    <g>
                        <motion.circle cx="40" cy="46" r="3" fill="#1e293b" style={{ x: eyeX, y: eyeY }} />
                        <motion.circle cx="60" cy="46" r="3" fill="#1e293b" style={{ x: eyeX, y: eyeY }} />
                        {/* Normal Eyebrows */}
                        <path d="M 35 40 Q 40 38 45 40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 55 40 Q 60 38 65 40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    </g>
                );
        }
    };

    const renderMouth = () => {
        switch (emotion) {
            case 'happy':
                return <path d="M 40 65 Q 50 75 60 65" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />;
            case 'concerned':
                return <path d="M 45 68 Q 50 65 55 68" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />;
            case 'impressed':
                return <circle cx="50" cy="68" r="4" stroke="#1e293b" strokeWidth="2" fill="none" />;
            default:
                return <path d="M 45 65 L 55 65" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />;
        }
    };

    return (
        <motion.div
            ref={containerRef}
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 100 }}
            animate={{
                opacity: isHovered ? 0.3 : 1,
                scale: isHovered ? 0.5 : 1,
                y: 0
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed bottom-6 right-6 z-[9999] flex items-end gap-4 origin-bottom-right ${isHovered ? 'pointer-events-none' : 'pointer-events-auto cursor-grab active:cursor-grabbing'}`}
        >
            {/* Speech Bubble */}
            <AnimatePresence>
                {showBubble && !isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="bg-white/90 backdrop-blur-md border border-primary/20 shadow-2xl p-4 rounded-3xl rounded-br-none max-w-xs mb-10 mr-[-20px]"
                    >
                        <p className="text-sm font-arabic font-bold text-foreground text-right leading-relaxed" dir="rtl">
                            {message}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Container */}
            <motion.div
                className="w-28 h-28 relative rounded-full bg-slate-100 shadow-xl border-4 border-white overflow-hidden"
                style={{
                    rotateX: headRotateX,
                    rotateY: headRotateY,
                    transformPerspective: 800
                }}
            >
                {/* SVG Avatar Engine */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                    {/* Neck */}
                    <rect x="42" y="70" width="16" height="20" fill="#fbd38d" />

                    {/* Wardrobe Morphing Group */}
                    <AnimatePresence mode="wait">
                        <motion.g
                            key={outfit}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                        >
                            {renderOutfitOptions()}
                        </motion.g>
                    </AnimatePresence>

                    {/* Head */}
                    <rect x="30" y="20" width="40" height="55" rx="20" fill="#fbd38d" />

                    {/* Hair (Black, elegant fade) */}
                    <path d="M 28 40 Q 30 15 50 15 Q 70 15 72 40 L 72 25 Q 70 10 50 10 Q 30 10 28 25 Z" fill="#1e293b" />

                    {/* Ears */}
                    <circle cx="28" cy="48" r="4" fill="#fbd38d" />
                    <circle cx="72" cy="48" r="4" fill="#fbd38d" />

                    {/* Facial Features (Eyes & Mouth) */}
                    {renderEmotionEyes()}
                    {renderMouth()}
                </svg>
            </motion.div>
        </motion.div>
    );
}
