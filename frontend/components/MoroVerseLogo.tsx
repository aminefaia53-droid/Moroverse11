import React from 'react';

export default function MoroVerseLogo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="crown-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f7e8a4" />
                    <stop offset="50%" stopColor="#C5A059" />
                    <stop offset="100%" stopColor="#8b6e35" />
                </linearGradient>
            </defs>

            {/* Majestic Crown Path */}
            <path
                d="M15 80 L85 80 L90 50 L75 65 L50 30 L25 65 L10 50 Z"
                fill="url(#gold-gradient)"
                stroke="#C5A059"
                strokeWidth="2"
                filter="url(#crown-glow)"
            />

            {/* Jewels */}
            <circle cx="50" cy="30" r="3" fill="#ffffff" filter="url(#crown-glow)" />
            <circle cx="10" cy="50" r="2.5" fill="#ffffff" />
            <circle cx="90" cy="50" r="2.5" fill="#ffffff" />

            {/* Base Detail */}
            <path d="M15 80 L85 80" stroke="#8b6e35" strokeWidth="3" strokeLinecap="round" />
            <circle cx="35" cy="74" r="1.5" fill="white" opacity="0.4" />
            <circle cx="50" cy="74" r="1.5" fill="white" opacity="0.4" />
            <circle cx="65" cy="74" r="1.5" fill="white" opacity="0.4" />
        </svg>
    );
}
