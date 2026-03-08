'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Leaf, Compass, Map, Swords, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SmartSidebar() {
    const { theme, setTheme } = useTheme();
    const { lang } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);

    // Prevent hydration mismatch by returning null until mounted if needed, 
    // but typically Sidebar is safe if it doesn't render dark-mode specific text initially.
    const [mounted, setMounted] = useState(false);
    React.useEffect(() => setMounted(true), []);

    const themes = [
        { id: 'summer', icon: <Sun className="w-5 h-5" />, label: lang === 'ar' ? 'صيف' : 'Summer' },
        { id: 'dark', icon: <Moon className="w-5 h-5" />, label: lang === 'ar' ? 'مظلم' : 'Dark' },
        { id: 'spring', icon: <Leaf className="w-5 h-5" />, label: lang === 'ar' ? 'ربيع' : 'Spring' },
    ];

    const quickLinks = [
        { id: 'elite-tours', icon: <Compass className="w-5 h-5" />, label: lang === 'ar' ? 'رحلات النخبة' : 'Elite Tours' },
        { id: 'encyclopedia', icon: <Map className="w-5 h-5" />, label: lang === 'ar' ? 'الموسوعة' : 'Encyclopedia' },
        { id: 'battles', icon: <Swords className="w-5 h-5" />, label: lang === 'ar' ? 'المعارك' : 'Battles' },
    ];

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!mounted) return null;

    return (
        <div
            className={`fixed top-1/4 ${lang === 'ar' ? 'right-0' : 'left-0'} z-50 flex items-start transition-all duration-500`}
            style={{ transform: isExpanded ? 'translateX(0)' : `translateX(${lang === 'ar' ? 'calc(100% - 48px)' : 'calc(-100% + 48px)'})` }}
        >
            {/* Toggle Button for minimal view */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`absolute ${lang === 'ar' ? 'left-[-48px] rounded-l-xl border-l border-y' : 'right-[-48px] rounded-r-xl border-r border-y'} top-0 w-12 h-16 bg-[var(--glass-bg)] backdrop-blur-md border-[var(--primary)]/30 flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)] transition-colors shadow-lg`}
            >
                {lang === 'ar' ? (isExpanded ? <ChevronRight /> : <ChevronLeft />) : (isExpanded ? <ChevronLeft /> : <ChevronRight />)}
            </button>

            {/* Main Sidebar Panel */}
            <div className={`bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--primary)]/20 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col gap-8 ${lang === 'ar' ? 'rounded-tl-2xl rounded-bl-2xl border-r-0 pl-8 pr-4' : 'rounded-tr-2xl rounded-br-2xl border-l-0 pr-8 pl-4'}`}>

                {/* Theme Switcher */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-[10px] uppercase tracking-widest text-[var(--foreground)]/50 font-black mb-2 flex items-center gap-2">
                        <Sun className="w-3 h-3" />
                        {lang === 'ar' ? 'الفصول' : 'Seasons'}
                    </h4>
                    <div className="flex gap-2 bg-[var(--background)]/50 p-1.5 rounded-full border border-[var(--primary)]/10">
                        {themes.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                title={t.label}
                                className={`p-2 rounded-full transition-all duration-300 ${theme === t.id ? 'bg-[var(--primary)] text-[var(--background)] shadow-[0_0_15px_var(--glow-color)]' : 'text-[var(--primary)]/60 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10'}`}
                            >
                                {t.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full h-px bg-[var(--primary)]/10"></div>

                {/* Quick Links */}
                <div className="flex flex-col gap-y-2">
                    <h4 className="text-[10px] uppercase tracking-widest text-[var(--foreground)]/50 font-black mb-2 flex items-center gap-2">
                        <Bookmark className="w-3 h-3" />
                        {lang === 'ar' ? 'روابط سريعة' : 'Quick Access'}
                    </h4>
                    {quickLinks.map(link => (
                        <button
                            key={link.id}
                            onClick={() => scrollTo(link.id)}
                            className="flex items-center gap-3 p-3 rounded-lg text-sm text-[var(--foreground)]/80 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors text-left"
                            dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        >
                            <span className="text-[var(--primary)]">{link.icon}</span>
                            <span className={`font-medium ${lang === 'ar' ? 'font-arabic' : 'font-outfit'}`}>{link.label}</span>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
