import React from 'react';

export default function MoroVerseLogo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Glow */}
            <circle cx="50" cy="50" r="45" fill="url(#core-glow)" opacity="0.3" />

            {/* Moroccan Arch (Keyhole) */}
            <path d="M50 15 C35 15 25 25 25 40 C25 55 35 60 35 85 L65 85 C65 60 75 55 75 40 C75 25 65 15 50 15 Z"
                stroke="#C5A059" strokeWidth="2" fill="rgba(139, 0, 0, 0.2)" className="drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]" />

            {/* Arch Inner Detail */}
            <path d="M50 25 C42 25 35 32 35 40 C35 50 42 55 42 75 L58 75 C58 55 65 50 65 40 C65 32 58 25 50 25 Z"
                stroke="#C5A059" strokeWidth="1" strokeDasharray="4 2" />

            {/* AI Circuitry / Central Node */}
            <circle cx="50" cy="40" r="4" fill="#ffffff" className="animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <circle cx="50" cy="40" r="8" stroke="#C5A059" strokeWidth="1" fill="none" opacity="0.8" />

            {/* Circuit Lines */}
            <path d="M50 48 L50 60 L40 70 M50 60 L60 70 M35 40 L20 40 M65 40 L80 40"
                stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />

            {/* Circuit End Nodes */}
            <circle cx="20" cy="40" r="2" fill="#C5A059" />
            <circle cx="80" cy="40" r="2" fill="#C5A059" />
            <circle cx="40" cy="70" r="1.5" fill="#C5A059" />
            <circle cx="60" cy="70" r="1.5" fill="#C5A059" />

            <defs>
                <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8b0000" />
                    <stop offset="100%" stopColor="#1a0404" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
}
