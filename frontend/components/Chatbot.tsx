"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader2, Crown } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    text: string;
}

interface ChatbotProps {
    lang: 'en' | 'ar';
    externalTrigger?: { text: string; id: number };
}

export default function Chatbot({ lang, externalTrigger }: ChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            text: lang === 'ar'
                ? "مرحباً! أنا دليلك الذكي. كيف يمكنني مساعدتك في رحلتك عبر موروفيرس اليوم؟"
                : "Marhaba! I am your Smart Guide. How can I assist you in your journey through MoroVerse today?"
        }
    ]);

    // Handle external triggers (e.g., city clicks)
    useEffect(() => {
        if (externalTrigger) {
            setIsOpen(true);
            handleExternalSend(externalTrigger.text);
        }
    }, [externalTrigger]);

    const handleExternalSend = async (text: string) => {
        setMessages(prev => [...prev, { role: 'user', text }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: messages.slice(1),
                    lang
                }),
            });

            const data = await response.json();
            const responseText = data.text || data.msg || data.response;
            if (responseText) {
                setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: lang === 'ar'
                    ? "عذراً، هناك عطل في الاتصال بالبوابة."
                    : "Apologies, there is a connection issue with the portal."
            }]);
        } finally {
            setIsLoading(false);
        }
    };
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Update initial message when language changes if no conversation started
    useEffect(() => {
        if (messages.length === 1) {
            setMessages([{
                role: 'assistant',
                text: lang === 'ar'
                    ? "مرحباً بكم في موروفيرس. كيف يمكنني إرشادكم اليوم؟"
                    : "Welcome to MoroVerse. How may I guide you today?"
            }]);
        }
    }, [lang]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim() || isLoading) return;

        const userMsg = message;
        setMessage("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages.slice(1),
                    lang
                }),
            });

            const data = await response.json();
            const responseText = data.text || data.msg || data.response;
            if (responseText) {
                setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: lang === 'ar'
                    ? "عذراً، هناك عطل في الاتصال بالبوابة."
                    : "Apologies, there is a connection issue with the portal."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`fixed bottom-8 ${lang === 'ar' ? 'left-8' : 'right-8'} z-[100] font-sans`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <AnimatePresence mode='wait'>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="moro-glass-ivory mb-4 w-[350px] sm:w-[380px] h-[500px] rounded-[32px] flex flex-col overflow-hidden shadow-2xl border border-gold-royal/10"
                    >
                        {/* Header */}
                        <div className="bg-ivory px-6 py-5 flex items-center justify-between border-b border-gold-royal/10">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-deep w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                                    <Crown className="w-5 h-5 text-ivory" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-emerald-deep font-serif font-bold text-sm tracking-wide">
                                        {lang === 'ar' ? 'المُضيف المغربي' : 'MOROCCAN HOST'}
                                    </h3>
                                    <span className="text-[8px] text-gold-royal uppercase font-bold tracking-[0.3em]">
                                        {lang === 'ar' ? 'في الخدمة' : 'Online'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-deep/20 hover:text-emerald-deep transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-[#fdfaf5]/50"
                        >
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${msg.role === 'user'
                                        ? 'bg-emerald-deep text-ivory rounded-tr-none shadow-sm'
                                        : 'bg-white text-slate-deep border border-gold-royal/10 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none flex items-center gap-3 border border-gold-royal/5">
                                        <Loader2 className="w-3 h-3 text-gold-royal animate-spin" />
                                        <span className="text-[9px] text-slate-deep/40 italic font-serif">
                                            {lang === 'ar' ? 'جاري البحث...' : 'Searching...'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-5 border-t border-gold-royal/10 bg-ivory">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={lang === 'ar' ? 'اسأل شيئاً...' : 'Ask anything...'}
                                    className="w-full bg-[#f9f7f2] border border-gold-royal/10 rounded-full px-6 py-3 text-xs focus:outline-none focus:border-gold-royal transition-all text-slate-deep"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !message.trim()}
                                    className="p-3 bg-emerald-deep rounded-full text-ivory hover:bg-emerald-light transition-all disabled:opacity-50 shadow-md"
                                >
                                    <Send className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="h-16 w-16 bg-ivory border border-gold-royal/20 rounded-full flex items-center justify-center shadow-xl relative"
            >
                <AnimatePresence mode='wait'>
                    {isOpen ? (
                        <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <X className="w-6 h-6 text-emerald-deep" />
                        </motion.div>
                    ) : (
                        <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <MessageSquare className="w-6 h-6 text-emerald-deep" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
