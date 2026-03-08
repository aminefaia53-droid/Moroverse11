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
    const isRtl = document.dir === 'rtl'; // A simple check, though x-pos of buttons might vary

    // Combining gradients to exclude mouse area and top-right area
    // 'source-in' compositing makes the visible (black) parts of each gradient intersect.
    const exclusionMaskStyle: React.CSSProperties = {
        WebkitMaskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, transparent 20%, black 80%), radial-gradient(circle 200px at 90% 40px, transparent 20%, black 80%)`,
        maskImage: `radial-gradient(circle 120px at ${mousePos.x}px ${mousePos.y}px, transparent 20%, black 80%), radial-gradient(circle 200px at 90% 40px, transparent 20%, black 80%)`,
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in'
    };

    const SVGFilters = () => (
        <svg className="hidden">
            <defs>
                <filter id="heathaze">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.05" numOctaves="2" seed="2">
                        <animate attributeName="seed" from="1" to="100" dur="10s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" scale="10" />
                </filter>
            </defs>
        </svg>
    );

    // ── WINTER: Rain Threads + Glass Drip + Lightning ──
    if (resolvedTheme === 'winter') {
        return (
            <>
                <SVGFilters />
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden glass-overlay" style={exclusionMaskStyle}>
                    <div className="lightning-overlay" />
                    {/* Screen edge drips */}
                    {Array.from({ length: 25 }).map((_, i) => (
                        <div key={`drip-${i}`} className="drip-particle" style={{
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${4 + Math.random() * 8}s`,
                            animationDelay: `${Math.random() * 15}s`,
                            opacity: 0.8
                        }} />
                    ))}
                    {/* Rain threads */}
                    {rainParticles.map(p => (
                        <div key={p.id} className="rain-particle" style={{
                            left: p.left,
                            height: '120px',
                            animationDuration: p.duration,
                            animationDelay: p.delay,
                            opacity: 0.6 + Math.random() * 0.4
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
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={exclusionMaskStyle}>
                    {/* Heat Haze at bottom */}
                    <div className="absolute bottom-0 w-full h-[40vh] heat-haze opacity-40 bg-gradient-to-t from-[#c5a059]/10 to-transparent" />
                    {/* Lens Flare */}
                    <div className="absolute w-[400px] h-[400px] bg-yellow-300/10 rounded-full blur-[100px]"
                        style={{
                            left: mousePos.x,
                            top: mousePos.y,
                            transform: 'translate(-50%, -50%)',
                            transition: 'left 0.4s ease-out, top 0.4s ease-out'
                        }}
                    />
                </div>
            </>
        );
    }

    // ── SPRING: Interactive Petals ──
    if (resolvedTheme === 'spring') {
        const petalColors = ['#fbcfe8', '#fce7f3', '#fdf2f8', '#fda4af'];
        return (
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={exclusionMaskStyle}>
                {leafParticles.map(p => {
                    // Wind direction based on mouse x position relative to screen center
                    const windForce = (mousePos.x / window.innerWidth - 0.5) * 200;
                    return (
                        <div key={p.id} className="leaf-particle absolute" style={{
                            left: `calc(${p.left} + ${windForce}px)`,
                            width: '14px', height: '14px',
                            borderRadius: '50% 0 50% 0',
                            backgroundColor: petalColors[p.id % petalColors.length],
                            animationDuration: `${5 + Math.random() * 5}s`,
                            animationDelay: p.delay,
                            animationName: 'petal-flutter',
                            opacity: 0.8,
                            transition: 'left 2s ease-out'
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
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={exclusionMaskStyle}>
                {/* Fog layer */}
                <div className="absolute bottom-0 w-full h-[45vh] fog-layer" />
                {leafParticles.map(p => {
                    // Reverse scroll physics: aggressively lift when scrolling down
                    const scrollLift = scrollPos * 0.8;
                    return (
                        <div key={p.id} className="leaf-particle text-2xl select-none absolute" style={{
                            left: p.left,
                            // Moving top position UP when user scrolls DOWN
                            top: `calc(-40px - ${scrollLift % 200}px)`,
                            color: leafColors[p.id % leafColors.length],
                            animationDuration: `${5 + Math.random() * 6}s`,
                            animationDelay: p.delay,
                            transform: `rotate(${scrollPos * 0.5}deg)`,
                            transition: 'top 0.1s ease-out, transform 0.1s ease-out'
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
