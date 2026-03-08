'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useSpatialAudio } from '../hooks/useSpatialAudio';

const RAIN_COUNT = 100;
const LEAF_COUNT = 20;

interface Particle {
    id: number;
    left: string;
    duration: string;
    delay: string;
    size?: string;
}

function useParticles(count: number): Particle[] {
    return useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: `${0.8 + Math.random() * 1.2}s`,
            delay: `${Math.random() * 5}s`,
            size: `${10 + Math.random() * 10}px`,
        })), [count]);
}

export default function WeatherOverlay() {
    const { resolvedTheme } = useTheme();
    const rainParticles = useParticles(RAIN_COUNT);
    const leafParticles = useParticles(LEAF_COUNT);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollPos, setScrollPos] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // 3D Audio hook
    useSpatialAudio(resolvedTheme);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        const handleScroll = () => setScrollPos(window.scrollY);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!resolvedTheme) return null;

    // ── COMMON FILTERS ──────────────────────────
    const maskStyle: React.CSSProperties = {
        WebkitMaskImage: 'radial-gradient(circle at 50% 15%, transparent 100px, black 300px), radial-gradient(circle at 50% 50%, transparent 150px, black 400px)',
        maskImage: 'radial-gradient(circle at 50% 15%, transparent 100px, black 300px), radial-gradient(circle at 50% 50%, transparent 150px, black 400px)',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'destination-in'
    };

    const SVGFilters = () => (
        <svg className="hidden">
            <defs>
                <filter id="heathaze">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="2" seed="2">
                        <animate attributeName="seed" from="1" to="100" dur="10s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="15" />
                </filter>
            </defs>
        </svg>
    );

    // ── WINTER: Rain Threads + Glass Drip + Lightning ──
    if (resolvedTheme === 'winter') {
        return (
            <>
                <SVGFilters />
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden glass-overlay" style={maskStyle}>
                    <div className="lightning-overlay" />
                    {/* Screen edge drips */}
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={`drip-${i}`} className="drip-particle" style={{
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${3 + Math.random() * 5}s`,
                            animationDelay: `${Math.random() * 10}s`
                        }} />
                    ))}
                    {/* Rain threads */}
                    {rainParticles.map(p => (
                        <div key={p.id} className="rain-particle" style={{
                            left: p.left,
                            height: '80px',
                            animationDuration: p.duration,
                            animationDelay: p.delay,
                            opacity: 0.4
                        }} />
                    ))}
                </div>
            </>
        );
    }

    // ── SUMMER: Heat Haze + Lens Flare ──
    if (resolvedTheme === 'summer') {
        return (
            <>
                <SVGFilters />
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={maskStyle}>
                    {/* Heat Haze at bottom */}
                    <div className="absolute bottom-0 w-full h-[30vh] heat-haze opacity-30 bg-gradient-to-t from-white/10 to-transparent" />
                    {/* Lens Flare */}
                    <div className="absolute w-[400px] h-[400px] bg-yellow-400/5 rounded-full blur-[100px]"
                        style={{
                            left: mousePos.x,
                            top: mousePos.y,
                            transform: 'translate(-50%, -50%)',
                            transition: 'left 0.8s ease-out, top 0.8s ease-out'
                        }}
                    />
                </div>
            </>
        );
    }

    // ── SPRING: Interactive Petals ──
    if (resolvedTheme === 'spring') {
        const petalColors = ['#fbcfe8', '#fce7f3', '#d9f99d', '#bbf7d0'];
        return (
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={maskStyle}>
                {leafParticles.map(p => {
                    const dx = (mousePos.x / window.innerWidth - 0.5) * 40;
                    return (
                        <div key={p.id} className="leaf-particle" style={{
                            left: `calc(${p.left} + ${dx}px)`,
                            top: '-20px',
                            width: '10px', height: '10px',
                            borderRadius: '50% 0 50% 0',
                            backgroundColor: petalColors[p.id % petalColors.length],
                            animationDuration: `${4 + Math.random() * 4}s`,
                            animationDelay: p.delay,
                            opacity: 0.6,
                            transition: 'left 1s ease-out'
                        }} />
                    );
                })}
            </div>
        );
    }

    // ── AUTUMN: Scroll-Reactive Leaves + Fog ──
    if (resolvedTheme === 'autumn') {
        const leafColors = ['#e8a045', '#d97706', '#b45309', '#f59e0b'];
        const leafShapes = ['🍂', '🍁'];
        return (
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={maskStyle}>
                {/* Fog layer */}
                <div className="absolute bottom-0 w-full h-[40vh] fog-layer" />
                {leafParticles.map(p => {
                    // Reverse scroll physics: faster fall when scrolling up, lift when scrolling down
                    const scrollLift = scrollPos * 0.1;
                    return (
                        <div key={p.id} className="leaf-particle text-2xl select-none" style={{
                            left: p.left,
                            top: `calc(-40px - ${scrollLift % 150}px)`,
                            color: leafColors[p.id % leafColors.length],
                            animationDuration: `${5 + Math.random() * 6}s`,
                            animationDelay: p.delay,
                            transform: `rotate(${scrollPos * 0.2}deg)`,
                            transition: 'top 0.4s ease-out'
                        }}>
                            {leafShapes[p.id % leafShapes.length]}
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
}
