"use client";

import React, { useState } from 'react';
import { Search, Mic, MicOff, X } from 'lucide-react';

interface OmniSearchBarProps {
    isRTL: boolean;
    onSearchSubmit?: (query: string) => void;
}

export default function OmniSearchBar({ isRTL, onSearchSubmit }: OmniSearchBarProps) {
    const [query, setQuery] = useState("");
    const [isListening, setIsListening] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && onSearchSubmit) {
            onSearchSubmit(query);
        }
    };

    const toggleListening = () => {
        // Fallback if SpeechRecognition is not supported natively by the browser
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert(isRTL ? "البحث الصوتي غير مدعوم في متصفحك." : "Voice search is not supported in your browser.");
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = isRTL ? 'ar-MA' : 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            if (onSearchSubmit) {
                onSearchSubmit(transcript);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = () => {
             setIsListening(false);
        };

        recognition.start();
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-[#c5a059]/0 via-[#c5a059]/20 to-[#c5a059]/0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            <div className={`relative flex items-center bg-black/60 backdrop-blur-md border border-[#c5a059]/30 rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="p-3 text-[#c5a059]">
                    <Search size={22} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={isRTL ? "ابحث في الأرشيف السيادي أو تحدث..." : "Search the Imperial Archive or speak..."}
                    className={`flex-1 bg-transparent text-white focus:outline-none placeholder:text-white/30 text-sm md:text-base py-3 px-2 ${isRTL ? 'text-right font-arabic' : 'text-left'}`}
                />
                
                {query && (
                    <button type="button" onClick={() => setQuery("")} className="p-3 text-white/40 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                )}

                <button 
                    type="button" 
                    onClick={toggleListening}
                    className={`p-3 border-l border-[#c5a059]/20 transition-all ${isListening ? 'text-red-500 bg-red-500/10' : 'text-[#c5a059] hover:bg-[#c5a059]/10'}`}
                    title={isRTL ? "بحث صوتي" : "Voice Search"}
                >
                    {isListening ? <Mic size={22} className="animate-pulse" /> : <MicOff size={22} className="opacity-70" />}
                </button>
            </div>
        </form>
    );
}
