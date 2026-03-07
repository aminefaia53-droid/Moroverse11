"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// ——— UI Languages (for static interface strings) ———
type UILang = 'ar' | 'en' | 'fr' | 'es' | 'de';

import { LangCode, SUPPORTED_LANGUAGES } from '../types/language';

export { type LangCode, SUPPORTED_LANGUAGES };

// ——— Translation cache (sessionStorage-backed) ———
function getCacheKey(text: string, targetLang: string) {
    return `mv-tr-${targetLang}-${text.substring(0, 40)}`;
}

// ——— MyMemory API translator ———
export async function translateText(text: string, targetLang: string): Promise<string> {
    if (!text || targetLang === 'ar') return text;

    const cacheKey = getCacheKey(text, targetLang);
    try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) return cached;
    } catch { /* ignore */ }

    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|${targetLang}`;
        const res = await fetch(url);
        const data = await res.json();

        const translated: string = data?.responseData?.translatedText || text;

        try { sessionStorage.setItem(cacheKey, translated); } catch { /* ignore */ }
        return translated;
    } catch {
        return text; // fallback: return original Arabic
    }
}

// ——— Static UI translations ———
export const translations = {
    en: {
        assistant: {
            welcome: "Hello, I'm Mohamed Amine El Amiri! You can now scroll cards horizontally on your phone.",
            cityClick: (name: string) => `Welcome to ${name}, one of the jewels of Great Morocco!`,
            landmarkClick: (name: string) => `You are now admiring ${name}, a living witness to Moroccan architectural genius.`,
            figureClick: (name: string) => `A great figure! ${name} left an eternal mark on Morocco's history.`,
            imageLoaded: (name: string) => `The heritage image for ${name} is now complete.`,
            slowDown: "Slow down, my friend. The greatness of Morocco is only realized through careful observation."
        },
        ui: {
            backToMoroverse: "← Back to MoroVerse",
            royalArchive: "MoroVerse Royal Archive",
            articleNotFound: "Sorry, article not found",
            officialDocumentation: "Official Documentation",
            authenticRecord: "Authentic Record",
            digitalSovereignty: "MoroVerse Digital Sovereignty © 2026",
            valorRecords: "ENCYCLOPEDIA OF VALOR",
            landmarks: "MAJESTIC LANDMARKS",
            figures: "HISTORICAL FIGURES",
            cities: "ENCYCLOPEDIA OF CITIES",
            searchPlaceholder: "Search...",
            readMore: "Journey to..."
        }
    },
    ar: {
        assistant: {
            welcome: "مرحبا معاك محمد أمين العميري! أصبح بإمكانك الآن تمرير البطاقات أفقياً على هاتفك.",
            cityClick: (name: string) => `أهلاً بك في ${name}، إحدى درر المغرب العظيم!`,
            landmarkClick: (name: string) => `أنت الآن تتأمل ${name}، شاهدٌ حي على عبقرية المعمار المغربي.`,
            figureClick: (name: string) => `شخصية عظيمة! ${name} ترك بصمة خالدة في تاريخ أمتنا.`,
            imageLoaded: (name: string) => `الصورة التراثية لـ ${name} اكتملت، الجمال المغربي لا يُضاهى.`,
            slowDown: "تمهل يا صديقي، عظمة المغرب لا تُدرك إلا بالتدقيق."
        },
        ui: {
            backToMoroverse: "← العودة إلى MoroVerse",
            royalArchive: "MoroVerse Royal Archive",
            articleNotFound: "عذراً، المقال غير موجود",
            officialDocumentation: "توثيق رسمي",
            authenticRecord: "سجل أصيل",
            digitalSovereignty: "MoroVerse Digital Sovereignty © 2026",
            valorRecords: "سجلات البسالة والفتح",
            landmarks: "معالم مغربية",
            figures: "شخصيات تاريخية",
            cities: "موسوعة المدن والقرى",
            searchPlaceholder: "بحث...",
            readMore: "سافر إلى..."
        }
    },
    fr: {
        assistant: {
            welcome: "Bonjour! Je suis Mohamed Amine El Amiri. Bienvenue dans l'archive royale MoroVerse.",
            cityClick: (name: string) => `Bienvenue à ${name}, l'un des joyaux du Maroc!`,
            landmarkClick: (name: string) => `Vous admirez maintenant ${name}, témoin du génie architectural marocain.`,
            figureClick: (name: string) => `${name} a laissé une marque éternelle dans l'histoire.`,
            imageLoaded: (name: string) => `L'image patrimoniale de ${name} est maintenant chargée.`,
            slowDown: "Doucement, mon ami. La grandeur du Maroc n'est appréciée qu'avec soin."
        },
        ui: {
            backToMoroverse: "← Retour à MoroVerse",
            royalArchive: "MoroVerse Archive Royale",
            articleNotFound: "Désolé, article introuvable",
            officialDocumentation: "Documentation officielle",
            authenticRecord: "Archive authentique",
            digitalSovereignty: "MoroVerse Souveraineté Numérique © 2026",
            valorRecords: "ENCYCLOPÉDIE DES BATAILLES",
            landmarks: "MONUMENTS MAJESTUEUX",
            figures: "FIGURES HISTORIQUES",
            cities: "ENCYCLOPÉDIE DES VILLES",
            searchPlaceholder: "Rechercher...",
            readMore: "Voyage vers..."
        }
    }
};

// ——— Context ———
interface LanguageContextType {
    lang: LangCode;
    setLang: (lang: LangCode) => void;
    t: (key: string) => any;
    translateContent: (arabicText: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// ——— Detect browser language ———
function detectBrowserLang(): LangCode {
    if (typeof navigator === 'undefined') return 'ar';
    const nav = navigator.language || 'ar';
    const code = nav.split('-')[0].toLowerCase() as LangCode;
    const supported = SUPPORTED_LANGUAGES.map(l => l.code);
    return supported.includes(code) ? code : 'en';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<LangCode>('ar');
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const saved = (localStorage.getItem('moroverse-lang') as LangCode) || null;
        const detected = detectBrowserLang();
        // Use saved preference, else browser language, else Arabic
        const initial = saved || detected || 'ar';
        setLangState(initial);
        applyLangToDOM(initial);
    }, []);

    const applyLangToDOM = (l: LangCode) => {
        const langInfo = SUPPORTED_LANGUAGES.find(x => x.code === l);
        if (typeof document !== 'undefined') {
            document.documentElement.lang = l;
            document.documentElement.dir = langInfo?.dir || 'ltr';
        }
    };

    const setLang = (newLang: LangCode) => {
        setLangState(newLang);
        localStorage.setItem('moroverse-lang', newLang);
        applyLangToDOM(newLang);
    };

    // Static UI translation
    const t = (path: string): any => {
        const uiLang: UILang = ['ar', 'en', 'fr'].includes(lang) ? (lang as UILang) : 'en';
        const keys = path.split('.');
        let current: any = (translations as any)[uiLang] || translations['en'];
        for (const key of keys) {
            if (current?.[key] === undefined) return path;
            current = current[key];
        }
        return current;
    };

    // Dynamic article content translation via MyMemory
    const translateContent = useCallback((arabicText: string): Promise<string> => {
        return translateText(arabicText, lang);
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t, translateContent }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
