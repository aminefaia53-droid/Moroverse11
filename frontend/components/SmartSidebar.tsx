'use client';

import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import {
    Sun, Moon, Leaf, Snowflake, Wind,
    Compass, Map, Swords, Bookmark,
    ChevronLeft, ChevronRight,
    MapPin, Landmark, ChevronDown,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ── DATA ───────────────────────────────────

const SEASONS = [
    { id: 'summer', icon: <Sun className="w-4 h-4" />, labelAr: 'صيف', labelEn: 'Summer' },
    { id: 'spring', icon: <Leaf className="w-4 h-4" />, labelAr: 'ربيع', labelEn: 'Spring' },
    { id: 'autumn', icon: <Wind className="w-4 h-4" />, labelAr: 'خريف', labelEn: 'Autumn' },
    { id: 'winter', icon: <Snowflake className="w-4 h-4" />, labelAr: 'شتاء', labelEn: 'Winter' },
    { id: 'dark', icon: <Moon className="w-4 h-4" />, labelAr: 'ليل', labelEn: 'Night' },
];

const QUICK_LINKS = [
    { id: 'elite-tours', icon: <Compass className="w-4 h-4" />, labelAr: 'رحلات النخبة', labelEn: 'Elite Tours' },
    { id: 'encyclopedia', icon: <Map className="w-4 h-4" />, labelAr: 'الموسوعة', labelEn: 'Encyclopedia' },
    { id: 'battles', icon: <Swords className="w-4 h-4" />, labelAr: 'المعارك', labelEn: 'Battles' },
];

const CITIES = [
    { labelAr: 'مراكش', labelEn: 'Marrakech' },
    { labelAr: 'فاس', labelEn: 'Fez' },
    { labelAr: 'شفشاون', labelEn: 'Chefchaouen' },
    { labelAr: 'الصويرة', labelEn: 'Essaouira' },
    { labelAr: 'طنجة', labelEn: 'Tangier' },
    { labelAr: 'أكادير', labelEn: 'Agadir' },
];

const LANDMARKS = [
    { labelAr: 'الكتبية', labelEn: 'Koutoubia' },
    { labelAr: 'أيت بن حدو', labelEn: 'Ait Benhaddou' },
    { labelAr: 'وليلي', labelEn: 'Volubilis' },
    { labelAr: 'ساحة 9 أبريل', labelEn: '9 Avril Square' },
    { labelAr: 'قصبة الوداية', labelEn: 'Udayas Kasbah' },
];

// ── COMPONENT ──────────────────────────────

export default function SmartSidebar() {
    const { theme, setTheme } = useTheme();
    const { lang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [showCities, setShowCities] = useState(false);
    const [showLandmarks, setShowLandmarks] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isRtl = lang === 'ar';

    // ── Spring cubic-bezier for entry; no bounce on exit ──
    const transition = isOpen
        ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)'
        : 'transform 0.35s ease-in';

    // ── Hide completely when closed (tab still visible) ──
    const offset = isOpen
        ? 'translateX(0)'
        : isRtl
            ? 'translateX(calc(100% - 0px))' // hidden right, only tab shows
            : 'translateX(calc(-100% + 0px))'; // hidden left, only tab shows

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false); // close after navigation
    };

    const label = (ar: string, en: string) => lang === 'ar' ? ar : en;

    return (
        <div
            className={`fixed top-[30vh] ${isRtl ? 'right-0' : 'left-0'} z-50 flex`}
            dir={isRtl ? 'rtl' : 'ltr'}
            style={{ transform: offset, transition }}
        >
            {/* ── PANEL ── */}
            <div className={`
                flex flex-col w-52 max-h-[60vh] overflow-y-auto
                bg-[var(--glass-bg)] backdrop-blur-xl
                border border-[var(--primary)]/20
                shadow-[0_10px_50px_rgba(0,0,0,0.9)]
                ${isRtl ? 'rounded-tl-2xl rounded-bl-2xl border-r-0' : 'rounded-tr-2xl rounded-br-2xl border-l-0'}
                scrollbar-thin
            `}>
                {/* Season switcher */}
                <div className="p-3 border-b border-[var(--primary)]/10">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40 font-black mb-2 flex items-center gap-1">
                        <Sun className="w-2.5 h-2.5" /> {label('الفصول', 'Seasons')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {SEASONS.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setTheme(s.id)}
                                title={label(s.labelAr, s.labelEn)}
                                className={`p-1.5 rounded-lg transition-all duration-300 flex items-center gap-1 text-[11px]
                                    ${theme === s.id
                                        ? 'bg-[var(--primary)] text-[var(--background)] shadow-[0_0_12px_var(--glow-color)] font-bold'
                                        : 'text-[var(--primary)]/60 hover:bg-[var(--primary)]/15 hover:text-[var(--primary)]'
                                    }`}
                            >
                                {s.icon}
                                <span>{label(s.labelAr, s.labelEn)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="p-3 border-b border-[var(--primary)]/10">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40 font-black mb-2 flex items-center gap-1">
                        <Bookmark className="w-2.5 h-2.5" /> {label('روابط سريعة', 'Quick Access')}
                    </p>
                    {QUICK_LINKS.map(link => (
                        <button
                            key={link.id}
                            onClick={() => scrollTo(link.id)}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-[var(--foreground)]/75 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
                        >
                            <span className="text-[var(--primary)]">{link.icon}</span>
                            <span className={lang === 'ar' ? 'font-arabic' : 'font-outfit'}>{label(link.labelAr, link.labelEn)}</span>
                        </button>
                    ))}
                </div>

                {/* Cities */}
                <div className="p-3 border-b border-[var(--primary)]/10">
                    <button
                        onClick={() => setShowCities(v => !v)}
                        className="w-full flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40 font-black mb-1"
                    >
                        <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {label('مدن', 'Cities')}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showCities ? 'rotate-180' : ''}`} />
                    </button>
                    {showCities && (
                        <div className="mt-1 space-y-0.5">
                            {CITIES.map(city => (
                                <button
                                    key={city.labelEn}
                                    onClick={() => scrollTo('encyclopedia')}
                                    className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-xs text-[var(--foreground)]/65 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50 flex-shrink-0"></span>
                                    <span className={lang === 'ar' ? 'font-arabic' : 'font-outfit'}>{label(city.labelAr, city.labelEn)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Landmarks */}
                <div className="p-3">
                    <button
                        onClick={() => setShowLandmarks(v => !v)}
                        className="w-full flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[var(--foreground)]/40 font-black mb-1"
                    >
                        <span className="flex items-center gap-1"><Landmark className="w-2.5 h-2.5" /> {label('معالم', 'Landmarks')}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showLandmarks ? 'rotate-180' : ''}`} />
                    </button>
                    {showLandmarks && (
                        <div className="mt-1 space-y-0.5">
                            {LANDMARKS.map(lm => (
                                <button
                                    key={lm.labelEn}
                                    onClick={() => scrollTo('encyclopedia')}
                                    className="w-full flex items-center gap-2 px-2 py-1 rounded-lg text-xs text-[var(--foreground)]/65 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/50 flex-shrink-0"></span>
                                    <span className={lang === 'ar' ? 'font-arabic' : 'font-outfit'}>{label(lm.labelAr, lm.labelEn)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── TOGGLE TAB ── */}
            <button
                onClick={() => setIsOpen(v => !v)}
                className={`
                    self-start mt-4 w-10 flex-shrink-0
                    flex items-center justify-center h-14
                    bg-[var(--glass-bg)] backdrop-blur-md
                    border border-[var(--primary)]/30
                    text-[var(--primary)]
                    hover:bg-[var(--primary)] hover:text-[var(--background)]
                    transition-colors shadow-lg
                    ${isRtl ? 'rounded-l-xl border-r-0 -mr-px order-first' : 'rounded-r-xl border-l-0 -ml-px order-last'}
                `}
            >
                {isRtl
                    ? (isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
                    : (isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
                }
            </button>
        </div>
    );
}
