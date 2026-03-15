"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Free CC0 ambient soundscapes from CDN (short, loopable)
const SOUNDS = {
    rain: 'https://cdn.freesound.org/previews/346/346696_5121236-lq.mp3',
    summer: 'https://cdn.freesound.org/previews/269/269496_4921277-lq.mp3',
    night: 'https://cdn.freesound.org/previews/516/516823_9158568-lq.mp3',
    default: '', // silence
};

type ClimateMode = 'rain' | 'summer' | 'night' | 'default';

export default function AtmosphericAudio() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [currentMode, setCurrentMode] = useState<ClimateMode>('default');
    const [isVisible, setIsVisible] = useState(false);
    const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio();
        audioRef.current.loop = true;
        audioRef.current.volume = 0;
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    // Smooth crossfade helper
    const fadeIn = () => {
        if (!audioRef.current) return;
        if (fadeRef.current) clearInterval(fadeRef.current);
        let vol = 0;
        fadeRef.current = setInterval(() => {
            if (!audioRef.current) return;
            vol = Math.min(vol + 0.05, isMuted ? 0 : 0.35);
            audioRef.current.volume = vol;
            if (vol >= 0.35) clearInterval(fadeRef.current!);
        }, 80);
    };

    const fadeOut = (cb?: () => void) => {
        if (!audioRef.current) return;
        if (fadeRef.current) clearInterval(fadeRef.current);
        let vol = audioRef.current.volume;
        fadeRef.current = setInterval(() => {
            if (!audioRef.current) return;
            vol = Math.max(vol - 0.05, 0);
            audioRef.current.volume = vol;
            if (vol <= 0) {
                clearInterval(fadeRef.current!);
                cb?.();
            }
        }, 80);
    };

    // Listen for climate toggle events from the rest of the app
    useEffect(() => {
        const handleClimate = (e: Event) => {
            const { mode } = (e as CustomEvent).detail as { mode: ClimateMode };
            if (mode === currentMode) return;

            fadeOut(() => {
                const url = SOUNDS[mode] || SOUNDS.default;
                if (!url || !audioRef.current) {
                    setCurrentMode('default');
                    setIsVisible(false);
                    return;
                }
                audioRef.current.src = url;
                audioRef.current.play().then(() => {
                    setCurrentMode(mode);
                    setIsVisible(true);
                    fadeIn();
                }).catch(() => { /* autoplay blocked, silently ignore */ });
            });
        };

        window.addEventListener('moroverse-climate-change', handleClimate);
        return () => window.removeEventListener('moroverse-climate-change', handleClimate);
    }, [currentMode, isMuted]);

    const toggleMute = () => {
        setIsMuted(prev => {
            const next = !prev;
            if (audioRef.current) {
                audioRef.current.volume = next ? 0 : 0.35;
            }
            return next;
        });
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed bottom-24 left-4 z-[9998] flex items-center gap-2 px-3 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10 shadow-lg transition-all duration-500"
            title={isMuted ? 'Unmute atmosphere' : 'Mute atmosphere'}
        >
            <button onClick={toggleMute} className="text-white/60 hover:text-[#C5A059] transition-colors">
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="text-[9px] text-white/40 uppercase font-black tracking-widest hidden sm:block">
                {currentMode === 'rain' ? 'Rain Ambiance' : currentMode === 'summer' ? 'Summer Breeze' : 'Night Calm'}
            </span>
            {/* Audio wave animation */}
            {!isMuted && (
                <div className="flex items-end gap-0.5 h-4">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className="w-0.5 bg-[#C5A059] rounded-full"
                            style={{
                                height: `${40 + i * 15}%`,
                                animation: `audioWave 0.${6 + i}s ease-in-out infinite alternate`,
                            }}
                        />
                    ))}
                    <style>{`
                        @keyframes audioWave {
                            from { transform: scaleY(0.4); }
                            to { transform: scaleY(1); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
