"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
    en: {
        assistant: {
            welcome: "Hello, I'm Mohamed Amine El Amiri! Did you notice the new update? You can now scroll cards horizontally smoothly on your phone.",
            cityClick: (name: string) => `Welcome to ${name}, one of the jewels of Great Morocco!`,
            landmarkClick: (name: string) => `You are now admiring ${name}, a living witness to Moroccan architectural genius.`,
            figureClick: (name: string) => name === 'Ibn Battuta' ? "Well done! You are in the presence of the greatest traveler history has known." : `A great figure! ${name} left an eternal mark on our nation's history.`,
            imageLoaded: (name: string) => `I see the heritage image for ${name} is now complete. Moroccan beauty is unmatched.`,
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
            welcome: "مرحبا معاك محمد أمين العميري! هل لاحظت التحديث الجديد؟ أصبح بإمكانك الآن تمرير البطاقات أفقياً بكل سلاسة على هاتفك.",
            cityClick: (name: string) => `أهلاً بك في ${name}، إحدى درر المغرب العظيم!`,
            landmarkClick: (name: string) => `أنت الآن تتأمل ${name}، شاهدٌ حي على عبقرية المعمار المغربي.`,
            figureClick: (name: string) => name === 'ابن بطوطة' ? "أحسنت صنعاً! أنت الآن في حضرة أعظم رحالة عرفه التاريخ." : `شخصية عظيمة! ${name} ترك بصمة خالدة في تاريخ أمتنا.`,
            imageLoaded: (name: string) => `أرى أن الصورة التراثية لـ ${name} قد اكتملت الآن، الجمال المغربي لا يُضاهى.`,
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
    }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLangState] = useState<Language>('ar');

    // Persistence
    useEffect(() => {
        const savedLang = localStorage.getItem('moroverse-lang') as Language;
        if (savedLang) setLangState(savedLang);
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('moroverse-lang', newLang);
        // Sync with HTML for CSS rules
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };

    const t = (path: string) => {
        const keys = path.split('.');
        let current: any = translations[lang];
        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
