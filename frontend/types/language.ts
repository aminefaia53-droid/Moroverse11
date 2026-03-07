export const SUPPORTED_LANGUAGES = [
    { code: 'ar', label: 'العربية', flag: '🇲🇦', dir: 'rtl' },
    { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
    { code: 'pt', label: 'Português', flag: '🇵🇹', dir: 'ltr' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', dir: 'ltr' },
    { code: 'zh', label: '中文', flag: '🇨🇳', dir: 'ltr' },
    { code: 'ja', label: '日本語', flag: '🇯🇵', dir: 'ltr' },
] as const;

export type LangCode = typeof SUPPORTED_LANGUAGES[number]['code'];
