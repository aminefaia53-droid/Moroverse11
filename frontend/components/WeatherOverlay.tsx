'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';

// ──────────────────────────────────────────
//  Pure CSS weather particles — zero JS load
// ──────────────────────────────────────────

const RAIN_COUNT = 80;
const LEAF_COUNT = 18;

interface Particle {
    id: number;
    left: string;
    duration: string;
    delay: string;
    height?: string;
    size?: string;
    color?: string;
}

function useParticles(count: number): Particle[] {
    return useMemo(() =>
        Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            duration: `${0.6 + Math.random() * 0.8}s`,
            delay: `${Math.random() * 3}s`,
            height: `${10 + Math.random() * 15}px`,
            size: `${10 + Math.random() * 8}px`,
            color: '',
        })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [count]);
}

// ── AMBIENT AUDIO ──────────────────────────

const AUDIO_URLS: Record<string, string> = {
    winter: 'https://www.soundjay.com/nature/sounds/rain-01.mp3',
    spring: 'https://www.soundjay.com/nature/sounds/birds-singing-1.mp3',
    autumn: 'https://www.soundjay.com/nature/sounds/wind-1.mp3',
    summer: '',
    dark: '',
};

function useAmbientAudio(theme: string | undefined) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const url = AUDIO_URLS[theme ?? ''];

        // Stop previous
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }

        if (!url) return;

        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0.18;
        // Only play after a user interaction (browser policy)
        const tryPlay = () => {
            audio.play().catch(() => {/* silently ignore if not allowed yet */ });
        };
        tryPlay();
        window.addEventListener('click', tryPlay, { once: true });
        audioRef.current = audio;

        return () => {
            audio.pause();
            window.removeEventListener('click', tryPlay);
        };
    }, [theme]);
}

// ── MAIN COMPONENT ──────────────────────────

export default function WeatherOverlay() {
    const { resolvedTheme } = useTheme();
    const rainParticles = useParticles(RAIN_COUNT);
    const leafParticles = useParticles(LEAF_COUNT);

    useAmbientAudio(resolvedTheme);

    if (!resolvedTheme) return null;

    // ── WINTER: rain + lightning ──
    if (resolvedTheme === 'winter') {
        return (
            <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
                {/* Lightning */}
                <div className="lightning-overlay" />
                {/* Rain drops */}
                {rainParticles.map(p => (
                    <div
                        key={p.id}
                        className="rain-particle"
                        style={{
                            left: p.left,
                            top: '-15px',
                            height: p.height,
                            animationDuration: p.duration,
                            animationDelay: p.delay,
                        }}
                    />
                ))}
            </div>
        );
    }

    // ── SPRING: cherry blossom petals ──
    if (resolvedTheme === 'spring') {
        const petalColors = ['#f9a8d4', '#fbcfe8', '#fce7f3', '#d9f99d', '#bbf7d0'];
        return (
            <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
                {leafParticles.map(p => {
                    const color = petalColors[p.id % petalColors.length];
                    return (
                        <div
                            key={p.id}
                            className="leaf-particle"
                            style={{
                                left: p.left,
                                top: '-20px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50% 0 50% 0',
                                backgroundColor: color,
                                animationDuration: `${3 + Math.random() * 4}s`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: 0.7,
                            }}
                        />
                    );
                })}
            </div>
        );
    }

    // ── AUTUMN: golden falling leaves ──
    if (resolvedTheme === 'autumn') {
        const leafColors = ['#e8a045', '#d97706', '#b45309', '#d4691e', '#f59e0b'];
        const leafShapes = ['🍂', '🍁', '🍃'];
        return (
            <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
                {leafParticles.map(p => (
                    <div
                        key={p.id}
                        className="leaf-particle text-xl select-none"
                        style={{
                            left: p.left,
                            top: '-30px',
                            fontSize: `${14 + (p.id % 4) * 5}px`,
                            color: leafColors[p.id % leafColors.length],
                            animationDuration: `${4 + Math.random() * 5}s`,
                            animationDelay: `${Math.random() * 6}s`,
                        }}
                    >
                        {leafShapes[p.id % leafShapes.length]}
                    </div>
                ))}
            </div>
        );
    }

    // Dark/Summer → no overlay
    return null;
}
