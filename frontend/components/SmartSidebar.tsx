'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import {
    Sun, Moon, Leaf, Snowflake, Wind,
    Compass, Map, Swords, Bookmark,
    X, ChevronDown, MapPin, Landmark,
    SlidersHorizontal, Activity, User
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Link from 'next/link';

// ── DATA ────────────────────────────────────────────────────────────────────

const SEASONS = [
    { id: 'summer', icon: <Sun className="w-4 h-4" />, ar: 'صيف', en: 'Summer' },
    { id: 'spring', icon: <Leaf className="w-4 h-4" />, ar: 'ربيع', en: 'Spring' },
    { id: 'autumn', icon: <Wind className="w-4 h-4" />, ar: 'خريف', en: 'Autumn' },
    { id: 'winter', icon: <Snowflake className="w-4 h-4" />, ar: 'شتاء', en: 'Winter' },
    { id: 'dark', icon: <Moon className="w-4 h-4" />, ar: 'ليل', en: 'Night' },
];

const QUICK_LINKS = [
    { id: 'elite-tours', icon: <Compass className="w-4 h-4" />, ar: 'رحلات النخبة', en: 'Elite Tours' },
    { id: 'encyclopedia', icon: <Map className="w-4 h-4" />, ar: 'الموسوعة', en: 'Encyclopedia' },
    { id: 'battles', icon: <Swords className="w-4 h-4" />, ar: 'المعارك', en: 'Battles' },
    { id: 'community-link', href: '/community', icon: <Activity className="w-4 h-4" />, ar: 'نبض المجتمع', en: 'Community' },
    { id: 'profile-link', href: '/profile', icon: <User className="w-4 h-4" />, ar: 'الملف الشخصي', en: 'Profile' },
];

const CITIES = ['مراكش', 'فاس', 'شفشاون', 'الصويرة', 'طنجة', 'أكادير'];
const CITIES_EN = ['Marrakech', 'Fez', 'Chefchaouen', 'Essaouira', 'Tangier', 'Agadir'];
const LANDMARKS = ['الكتبية', 'أيت بن حدو', 'وليلي', 'ساحة 9 أبريل', 'قصبة الوداية'];
const LANDMARKS_EN = ['Koutoubia', 'Ait Benhaddou', 'Volubilis', '9 Avril Square', 'Udayas Kasbah'];

// ── COMPONENT ────────────────────────────────────────────────────────────────

export default function SmartSidebar({ isHeaderTrigger = false }: { isHeaderTrigger?: boolean }) {
    const { theme, setTheme } = useTheme();
    const { lang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [showCities, setShowCities] = useState(false);
    const [showLandmarks, setShowLandmarks] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
        // Sync open state via custom event to allow header trigger to control the main panel
        const handleToggle = () => setIsOpen(v => !v);
        window.addEventListener('toggle-sidebar', handleToggle);
        return () => window.removeEventListener('toggle-sidebar', handleToggle);
    }, []);

    if (!mounted) return null;

    const isRtl = lang === 'ar';
    const lbl = (ar: string, en: string) => isRtl ? ar : en;

    const triggerSidebar = () => {
        window.dispatchEvent(new CustomEvent('toggle-sidebar'));
    };

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
    };

    // Panel slides from the left edge (ltr) or right edge (rtl)
    const panelStyle: React.CSSProperties = {
        transform: isOpen ? 'translateX(0)' : isRtl ? 'translateX(100%)' : 'translateX(-100%)',
        transition: isOpen
            ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'   // spring in
            : 'transform 0.3s ease-in',                              // quick out
    };

    if (isHeaderTrigger) {
        return (
            <button
                onClick={triggerSidebar}
                className="flex items-center justify-center p-1.5 rounded-lg text-primary/60 hover:text-primary hover:bg-primary/10 transition-all"
                title={lbl('القائمة', 'Menu')}
            >
                <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
        );
    }

    return (
        <>
            {/* Always rendered but hidden trigger if not in header-mode - though we use events now */}
            {!isHeaderTrigger && (
                <button
                    onClick={() => setIsOpen(v => !v)}
                    aria-label="Toggle Sidebar"
                    className={`
                        fixed top-[72px] z-[60] opacity-0 pointer-events-none
                        ${isRtl ? 'right-4' : 'left-4'}
                    `}
                />
            )}

            {/* ── DIMPANEL BACKDROP ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-[2px]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* ── SLIDING PANEL ── */}
            <div
                className={`
                    fixed top-0 bottom-0 z-[58] w-56
                    ${isRtl ? 'right-0' : 'left-0'}
                    flex flex-col
                    bg-[var(--glass-bg)] backdrop-blur-sm
                    border-[var(--primary)]/20
                    ${isRtl ? 'border-l' : 'border-r'}
                    shadow-[0_0_60px_rgba(0,0,0,0.9)]
                    overflow-y-auto
                `}
                style={panelStyle}
            >
                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b border-[var(--primary)]/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--primary)] font-black">
                        {lbl('موروفيرس', 'Moroverse')}
                    </span>
                    <button onClick={() => setIsOpen(false)} className="text-[var(--foreground)]/30 hover:text-[var(--primary)] transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Seasons */}
                <div className="p-3 border-b border-[var(--primary)]/10">
                    <p className={`text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40 font-black mb-2 flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Sun className="w-2.5 h-2.5" />{lbl('الفصول', 'Seasons')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {SEASONS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setTheme(s.id)}
                                title={lbl(s.ar, s.en)}
                                className={`
                                    flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] transition-all duration-200
                                    ${theme === s.id
                                        ? 'bg-[var(--primary)] text-[var(--background)] font-bold shadow-[0_0_10px_var(--glow-color)]'
                                        : 'text-[var(--primary)]/60 hover:bg-[var(--primary)]/15 hover:text-[var(--primary)]'}
                                `}
                            >
                                {s.icon}<span>{lbl(s.ar, s.en)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="p-3 border-b border-[var(--primary)]/10">
                    <p className={`text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40 font-black mb-2 flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Bookmark className="w-2.5 h-2.5" />{lbl('روابط سريعة', 'Quick Access')}
                    </p>
                    {QUICK_LINKS.map(link => (
                        link.href ? (
                            <Link
                                key={link.id}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                dir={isRtl ? 'rtl' : 'ltr'}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-[var(--foreground)]/75 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
                            >
                                <span className="text-[var(--primary)]">{link.icon}</span>
                                <span className={isRtl ? 'font-arabic' : 'font-outfit'}>{lbl(link.ar, link.en)}</span>
                            </Link>
                        ) : (
                            <button
                                key={link.id}
                                onClick={() => scrollTo(link.id)}
                                dir={isRtl ? 'rtl' : 'ltr'}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-[var(--foreground)]/75 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
                            >
                                <span className="text-[var(--primary)]">{link.icon}</span>
                                <span className={isRtl ? 'font-arabic' : 'font-outfit'}>{lbl(link.ar, link.en)}</span>
                            </button>
                        )
                    ))}
                </div>

                {/* Cities */}
                <div className="p-3 border-b border-[var(--primary)]/10">
                    <button
                        onClick={() => setShowCities(v => !v)}
                        className={`w-full flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40 font-black mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}
                    >
                        <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{lbl('مدن', 'Cities')}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showCities ? 'rotate-180' : ''}`} />
                    </button>
                    {showCities && (
                        <div className="space-y-0.5 mt-1">
                            {CITIES.map((c, i) => (
                                <button key={c} onClick={() => scrollTo('encyclopedia')}
                                    dir={isRtl ? 'rtl' : 'ltr'}
                                    className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-xs text-[var(--foreground)]/65 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50 flex-shrink-0" />
                                    <span className={isRtl ? 'font-arabic' : 'font-outfit'}>{isRtl ? c : CITIES_EN[i]}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Landmarks */}
                <div className="p-3">
                    <button
                        onClick={() => setShowLandmarks(v => !v)}
                        className={`w-full flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40 font-black mb-1 ${isRtl ? 'flex-row-reverse' : ''}`}
                    >
                        <span className="flex items-center gap-1"><Landmark className="w-2.5 h-2.5" />{lbl('معالم', 'Landmarks')}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showLandmarks ? 'rotate-180' : ''}`} />
                    </button>
                    {showLandmarks && (
                        <div className="space-y-0.5 mt-1">
                            {LANDMARKS.map((lm, i) => (
                                <button key={lm} onClick={() => scrollTo('encyclopedia')}
                                    dir={isRtl ? 'rtl' : 'ltr'}
                                    className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-xs text-[var(--foreground)]/65 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50 flex-shrink-0" />
                                    <span className={isRtl ? 'font-arabic' : 'font-outfit'}>{isRtl ? lm : LANDMARKS_EN[i]}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
