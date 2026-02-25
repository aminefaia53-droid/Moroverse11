"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

import { useLanguage } from '../context/LanguageContext';

// Types for Assistant State
type Emotion = 'neutral' | 'happy' | 'concerned' | 'impressed';
type Outfit = 'modern' | 'traditional';

export default function MoroVerseAssistant() {
    const { lang, t } = useLanguage();
    // Use an effect to set initial message once lang is available
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (!message) {
            setMessage(t('assistant.welcome'));
        }
    }, [lang, t]);
    const [emotion, setEmotion] = useState<Emotion>('happy');
    const [outfit, setOutfit] = useState<Outfit>('traditional');
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
        }, 12000);

        // Custom Event Listener for Morocco Actions
        const handleAction = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { type, payload } = customEvent.detail;

            setShowBubble(true);

            switch (type) {
                case 'city_click':
                    setEmotion('happy');
                    setOutfit('traditional');
                    setMessage(t('assistant.cityClick')(payload));
                    break;
                case 'landmark_click':
                    setEmotion('impressed');
                    setOutfit('traditional');
                    setMessage(t('assistant.landmarkClick')(payload));
                    break;
                case 'figure_click':
                    setEmotion('impressed');
                    setMessage(t('assistant.figureClick')(payload));
                    break;
                case 'image_loaded':
                    setEmotion('happy');
                    setMessage(t('assistant.imageLoaded')(payload));
                    break;
            }

            // Auto-hide after 6 seconds
            setTimeout(() => {
                setShowBubble(false);
                setEmotion('neutral');
            }, 6000);
        };

        window.addEventListener('moroverse-action', handleAction);

        // Listen to the specific image loaded event from the hook
        const handleImageLoaded = (e: Event) => {
            const customEvent = e as CustomEvent;
            const { entity } = customEvent.detail;

            // Re-use the handleAction logic but with new type
            handleAction(new CustomEvent('moroverse-action', {
                detail: { type: 'image_loaded', payload: entity }
            }) as Event);
        };
        window.addEventListener('moroverse-image-loaded', handleImageLoaded);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('moroverse-action', handleAction);
            window.removeEventListener('moroverse-image-loaded', handleImageLoaded);
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
                        setMessage(t('assistant.slowDown'));

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
            // Moroccan Jellaba (Default)
            return (
                <g>
                    <path d="M 15 100 Q 50 70 85 100 L 95 150 L 5 150 Z" fill="#f8f9fa" />
                    <path d="M 40 100 L 50 150 L 60 100 Z" fill="none" stroke="#c5a059" strokeWidth="2" />
                </g>
            );
        } else {
            // Traditional Selham (Cloak)
            return (
                <g>
                    <path d="M 15 100 Q 50 70 85 100 L 100 150 L 0 150 Z" fill="#006233" />
                    <path d="M 40 100 L 50 150 L 60 100 Z" fill="#c1272d" opacity="0.8" />
                    <path d="M 35 100 L 50 150 L 65 100 Z" fill="none" stroke="#c5a059" strokeWidth="1.5" />
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
            className={`fixed top-1.5 right-1 md:top-auto md:bottom-6 md:right-6 z-[9999] flex items-start md:items-end gap-2 md:gap-4 origin-top-right md:origin-bottom-right scale-50 md:scale-100 ${isHovered ? 'pointer-events-none' : 'pointer-events-auto cursor-grab active:cursor-grabbing'}`}
        >
            <AnimatePresence>
                {showBubble && !isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="assistant-bubble bg-white border-2 border-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.5)] p-5 rounded-3xl rounded-tr-none md:rounded-tr-3xl md:rounded-br-none max-w-[200px] md:max-w-xs mt-10 md:mt-0 md:mb-10 mr-[-10px] md:mr-[-20px]"
                    >
                        <p className={`text-base font-extrabold text-black leading-relaxed ${lang === 'ar' ? 'font-arabic text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            {message}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Avatar Container */}
            <motion.div
                className="w-28 h-28 relative rounded-full bg-slate-900 shadow-[0_0_30px_rgba(197,160,89,0.5)] border-4 border-[#c5a059] overflow-hidden"
                style={{
                    rotateX: headRotateX,
                    rotateY: headRotateY,
                    transformPerspective: 800
                }}
            >
                {/* SVG Avatar Engine: Moroccan Guide */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform scale-125 pt-4 drop-shadow-md">
                    {/* Djellaba shoulders */}
                    <path d="M 20 100 Q 50 65 80 100" fill="#6d4c41" />
                    {/* Face */}
                    <circle cx="50" cy="50" r="25" fill="#e0ac69" />
                    {/* Tarboush (Red Fez) */}
                    <path d="M 32 30 L 68 30 L 62 10 L 38 10 Z" fill="#b71c1c" />
                    <rect x="48" y="5" width="4" height="5" fill="#000000" />
                    <path d="M 50 10 Q 60 15 65 25" stroke="#000000" strokeWidth="1.5" fill="none" />

                    {/* Eyebrows */}
                    <path d="M 38 48 Q 42 45 46 48" stroke="#3e2723" strokeWidth="2" fill="none" />
                    <path d="M 54 48 Q 58 45 62 48" stroke="#3e2723" strokeWidth="2" fill="none" />

                    {/* Eyes - Dynamic tracking */}
                    <g style={{ transform: `translate(${eyeX}px, ${eyeY}px)` }}>
                        <circle cx="42" cy="52" r="2.5" fill="#3e2723" />
                        <circle cx="58" cy="52" r="2.5" fill="#3e2723" />
                    </g>

                    {/* Mustache/Beard */}
                    <path d="M 42 62 Q 50 68 58 62 Q 50 72 42 62" fill="#3e2723" />


                    {/* Tarbouche (Red Fez) */}
                    <path d="M 32 25 L 34 5 L 66 5 L 68 25 Z" fill="#c1272d" />
                    {/* Tarbouche Tassel */}
                    <path d="M 50 5 Q 55 -2 65 12 L 67 15" fill="none" stroke="#111827" strokeWidth="1.5" />
                    <circle cx="67" cy="15" r="2" fill="#111827" />

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
