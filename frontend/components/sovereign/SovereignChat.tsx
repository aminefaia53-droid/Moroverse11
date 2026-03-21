"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const MohamedAmine_Flash_Guide = dynamic(() => import('./MohamedAmine_Flash_Guide'), { ssr: false });

export default function SovereignChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* The Trigger Icon / Star Gateway */}
            <button
                onClick={() => setIsOpen(true)}
                title="Engage Sovereign Intelligence"
                className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[9999] w-14 h-14 md:w-16 md:h-16 bg-[#0a0a0a] border-2 border-[#0FF] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.6)] cursor-pointer hover:scale-110 hover:shadow-[0_0_30px_rgba(0,255,255,1)] transition-all group overflow-hidden"
            >
                {/* Simulated inner star glow */}
                <div className="absolute inset-0 bg-[#0FF] opacity-10 group-hover:opacity-30 rounded-full blur-[10px] transition-opacity"></div>
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#0FF] drop-shadow-[0_0_5px_#0FF] group-hover:animate-pulse relative z-10" />
            </button>

            {/* The Portal Modal */}
            {isOpen && createPortal(
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-lg animate-in fade-in duration-300">
                    {/* Modal Container */}
                    <div className="relative w-[95vw] md:w-[70vw] lg:w-[900px] h-[85vh] md:h-[650px] bg-[#050505] border-2 border-[#0FF] shadow-[0_0_80px_rgba(0,255,255,0.2)] rounded-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                        
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-[#0FF]/30 bg-black/80 backdrop-blur-md z-10 relative shadow-md">
                            <h2 className="text-[#0FF] font-mono text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
                                <Sparkles className="w-5 h-5" />
                                <span>Mohamed Amine | Sovereign Intelligence Node</span>
                            </h2>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="text-white/60 hover:text-red-500 hover:rotate-90 transition-all duration-300"
                            >
                                <X className="w-6 h-6 md:w-7 md:h-7" />
                            </button>
                        </div>
                        
                        {/* Body - Evaluated Flash Component */}
                        <div className="flex-1 relative bg-black">
                            <MohamedAmine_Flash_Guide onClose={() => setIsOpen(false)} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
