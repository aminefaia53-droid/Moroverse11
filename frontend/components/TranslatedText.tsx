'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Loader2 } from 'lucide-react';

interface TranslatedTextProps {
    arabicText: string;
    className?: string;
    as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'div';
}

export default function TranslatedText({ arabicText, className, as: Component = 'span' }: TranslatedTextProps) {
    const { lang, translateContent } = useLanguage();
    const [translated, setTranslated] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lang === 'ar' || !arabicText) {
            setTranslated(arabicText);
            return;
        }

        let isMounted = true;
        setLoading(true);

        translateContent(arabicText)
            .then(res => {
                if (isMounted) {
                    setTranslated(res);
                }
            })
            .catch(() => {
                if (isMounted) setTranslated(arabicText);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [arabicText, lang, translateContent]);

    if (loading && !translated) {
        return (
            <span className="inline-flex items-center gap-2 opacity-50">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="italic text-xs">Translating...</span>
            </span>
        );
    }

    return <Component className={className}>{translated || arabicText}</Component>;
}
