'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { LangCode, SUPPORTED_LANGUAGES } from '../../types/language';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
    const { lang, setLang } = useLanguage();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const select = (code: LangCode) => {
        setLang(code);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative z-50 font-outfit" dir="ltr">
            {/* Trigger */}
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#c5a059]/40 bg-[#0a192f]/80 hover:bg-[#112240] hover:border-[#c5a059]/70 transition-all text-sm font-bold text-white backdrop-blur-sm shadow-md"
                aria-label="Change language"
            >
                <Globe className="w-4 h-4 text-gold-royal" />
                <span className="text-gold-royal">{current.flag}</span>
                <span className="hidden sm:inline text-gray-300 text-xs">{current.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0a192f] border border-[#c5a059]/30 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="py-1 max-h-64 overflow-y-auto">
                        {SUPPORTED_LANGUAGES.map(l => (
                            <button
                                key={l.code}
                                onClick={() => select(l.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${lang === l.code
                                    ? 'bg-gold-royal/20 text-gold-royal font-bold'
                                    : 'text-gray-300 hover:bg-[#112240] hover:text-white'
                                    }`}
                            >
                                <span className="text-base">{l.flag}</span>
                                <span>{l.label}</span>
                                {lang === l.code && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-gold-royal" />
                                )}
                            </button>
                        ))}
                    </div>
                    {/* Footer note */}
                    <div className="border-t border-[#c5a059]/10 px-4 py-2 text-[10px] text-gray-600 text-center">
                        Translated from Arabic via MyMemory
                    </div>
                </div>
            )}
        </div>
    );
}
