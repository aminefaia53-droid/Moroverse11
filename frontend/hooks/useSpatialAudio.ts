'use client';

import { useEffect, useRef, useCallback } from 'react';

export function useSpatialAudio(theme: string | undefined) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourcesRef = useRef<Record<string, { source: AudioBufferSourceNode; panner: PannerNode }>>({});
    const buffersRef = useRef<Record<string, AudioBuffer>>({});

    const AUDIO_URLS: Record<string, string> = {
        winter: '/audio/rain-thunder.mp3', // Base rain
        thunder: '/audio/rain-thunder.mp3', // Spatial thunder
        spring: '/audio/andalusi-city.mp3', // Reusing placeholder for now
        autumn: '/audio/mysterious-merchich.mp3', // Reusing placeholder for now
        summer: '/audio/epic-war.mp3', // Reusing placeholder for now
    };

    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        return audioContextRef.current;
    }, []);

    const loadBuffer = async (url: string) => {
        if (buffersRef.current[url]) return buffersRef.current[url];
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const ctx = initAudioContext();
        const buffer = await ctx.decodeAudioData(arrayBuffer);
        buffersRef.current[url] = buffer;
        return buffer;
    };

    const playSpatialSound = useCallback(async (key: string, loop = true, volume = 0.2, pannerModel: PanningModelType = 'HRTF') => {
        const url = AUDIO_URLS[key];
        if (!url) return;

        const ctx = initAudioContext();
        const buffer = await loadBuffer(url);

        // Cleanup existing if any
        if (sourcesRef.current[key]) {
            sourcesRef.current[key].source.stop();
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;

        const panner = ctx.createPanner();
        panner.panningModel = pannerModel;
        panner.distanceModel = 'inverse';

        const gainNode = ctx.createGain();
        gainNode.gain.value = volume;

        source.connect(panner);
        panner.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start();
        sourcesRef.current[key] = { source, panner };
        return panner;
    }, [initAudioContext]);

    // Handle random 3D thunder
    useEffect(() => {
        if (theme !== 'winter') return;

        let thunderTimeout: NodeJS.Timeout;
        const triggerThunder = async () => {
            const panner = await playSpatialSound('thunder', false, 0.5, 'HRTF');
            if (panner) {
                // Sweep from right to left
                const startX = 15;
                const endX = -15;
                const duration = 6;
                const now = audioContextRef.current!.currentTime;

                panner.positionX.setValueAtTime(startX, now);
                panner.positionY.setValueAtTime(5, now);
                panner.positionZ.setValueAtTime(-5, now);

                panner.positionX.linearRampToValueAtTime(endX, now + duration);
            }
            thunderTimeout = setTimeout(triggerThunder, 12000 + Math.random() * 20000);
        };

        const timeout = setTimeout(triggerThunder, 4000);
        return () => {
            clearTimeout(timeout);
            clearTimeout(thunderTimeout);
        };
    }, [theme, playSpatialSound]);

    // Handle background loop
    useEffect(() => {
        if (!theme || !AUDIO_URLS[theme]) {
            // Stop everything
            Object.values(sourcesRef.current).forEach(s => s.source.stop());
            sourcesRef.current = {};
            return;
        }

        const startLoop = async () => {
            // Adjust volumes per season
            let volume = 0.15;
            if (theme === 'summer') volume = 0.05; // Quiet cicadas
            if (theme === 'spring') volume = 0.12; // Soft birds
            if (theme === 'autumn') volume = 0.18; // Present wind
            if (theme === 'winter') volume = 0.12; // Base rain

            await playSpatialSound(theme, true, volume, 'equalpower');
        };

        const handleClick = () => {
            startLoop();
            window.removeEventListener('click', handleClick);
        };

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
            if (sourcesRef.current[theme]) {
                sourcesRef.current[theme].source.stop();
                delete sourcesRef.current[theme];
            }
        };
    }, [theme, playSpatialSound]);

    return { playSpatialSound };
}
