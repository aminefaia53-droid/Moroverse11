"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, SwitchCamera, PhoneOff, Sparkles, Mic, History, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

/**
 * MOHAMED AMINE - THE OFFICIAL HUMAN-CENTRIC GUIDE
 * Powered by: Gemini 1.5 Pro Vision & Supabase Encyclopedia RAG
 */
export default function MohamedAmine_Official_Guide({ onClose }: { onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    
    const [status, setStatus] = useState<string>("Initializing Neural Link...");
    const [transcription, setTranscription] = useState<string>("...");
    const [isThinking, setIsThinking] = useState<boolean>(false);

    // Camera setup
    const startCamera = useCallback(async (mode: "user" | "environment") => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            const newStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: mode }
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
            setStatus(`Vision Active (${mode === 'environment' ? 'Rear' : 'Front'} Camera)`);
        } catch (err) {
            console.error("Camera error:", err);
            setStatus("Camera Access Denied or Unavailable");
        }
    }, [stream]);

    // Initial mount and cleanup
    useEffect(() => {
        startCamera(facingMode);
        
        // Mock Gemini Identity BootSequence
        setTimeout(() => {
            setTranscription("Welcome my friend. I am Mohamed Amine. Show me a landmark, and I will unveil its history using the MoroVerse Encyclopedia.");
        }, 2000);

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once to avoid loop on stream dependency, stream managed manually

    const handleSwitchCamera = async () => {
        const newMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newMode);
        await startCamera(newMode);
    };

    const handleEndCall = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        onClose();
    };

    const triggerGeminiVisionRAG = () => {
        setIsThinking(true);
        setStatus("Gemini Vision processing frame & searching Supabase...");
        
        // Mocking the visual-to-RAG pipeline delay
        setTimeout(() => {
            setIsThinking(false);
            setStatus(`Vision Active (${facingMode === 'environment' ? 'Rear' : 'Front'} Camera)`);
            setTranscription(
                "I see you are looking at an architectural structure. " +
                "According to my Supabase Vector Search, this matches the styling of the Hassan II Mosque. " +
                "Did you know it houses the tallest minaret in the world at 210 meters?"
            );
        }, 4000);
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#050505] relative overflow-hidden font-sans">
            
            {/* Split Screen Container */}
            <div className="flex-1 flex flex-col md:flex-row h-full">
                
                {/* PART 1: The AI Avatar (Top/Left) */}
                <div className="flex-1 relative border-b md:border-b-0 md:border-r border-[#0FF]/20 bg-black flex flex-col items-center justify-center">
                    {/* Simulated Avatar / LiveKit Video Stream placeholder */}
                    <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen scale-110">
                        {/* We use a static placeholder or WebGL for Avatar */}
                        <Image src="/hero-bg.png" alt="Avatar Background Context" fill className="object-cover blur-sm" />
                    </div>
                    
                    <div className="z-10 relative flex flex-col items-center">
                        <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full border-4 ${isThinking ? 'border-[#0FF] animate-pulse shadow-[0_0_30px_#0FF]' : 'border-[var(--primary)] shadow-[0_0_20px_var(--primary)]'} overflow-hidden relative mb-4 transition-all duration-500`}>
                            {/* Realistic placeholder for Avatar Face */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                            <div className="w-full h-full bg-[#111] flex items-center justify-center text-white/50">
                                <Sparkles className={`w-12 h-12 ${isThinking ? 'animate-spin text-[#0FF]' : 'text-[var(--primary)]'}`} />
                            </div>
                        </div>
                        <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide">Mohamed Amine</h3>
                        <p className="text-white/60 text-xs md:text-sm uppercase tracking-widest mt-1">Sovereign Guide | Gemini Pro</p>
                    </div>

                    {/* Subtitles / Transcription */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg z-20 mx-auto max-w-xl">
                        <p className={`text-white text-sm md:text-base leading-relaxed font-medium ${isThinking ? 'animate-pulse text-[#0FF]' : ''}`}>
                            "{transcription}"
                        </p>
                    </div>
                </div>

                {/* PART 2: The User Camera Feed (Bottom/Right) */}
                <div className="flex-1 relative bg-[#0a0a0a] overflow-hidden group">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                    />
                    
                    {/* Camera HUD Overlays */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded flex items-center gap-2 border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-white text-xs font-mono uppercase tracking-widest">{status}</span>
                        </div>
                        <div className="bg-black/60 backdrop-blur px-3 py-1.5 rounded flex items-center gap-2 border border-[#0FF]/30">
                            <History className="w-3 h-3 text-[#0FF]" />
                            <span className="text-[#0FF] text-[10px] font-mono uppercase tracking-widest">Supabase RAG Sync: Active</span>
                        </div>
                    </div>

                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] z-0"></div>

                    {/* Trigger Manual Scan button to mock pointing at something */}
                    <button 
                        onClick={triggerGeminiVisionRAG}
                        disabled={isThinking}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur border border-white/20 p-4 rounded-full text-white hover:bg-white/10 hover:border-white hover:scale-110 transition-all z-20 group-hover:opacity-100 opacity-0 md:opacity-100 flex flex-col items-center gap-2"
                    >
                        <Camera className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Identify Context</span>
                    </button>
                </div>
            </div>

            {/* Global Controls Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8 z-50 bg-black/80 backdrop-blur-xl px-6 md:px-10 py-3 md:py-4 rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                
                <button title="Microphone Mute" className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                    <Mic className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <button 
                    onClick={handleEndCall}
                    title="End Call" 
                    className="p-4 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all hover:scale-110"
                >
                    <PhoneOff className="w-6 h-6 md:w-7 md:h-7" />
                </button>

                <button 
                    onClick={handleSwitchCamera}
                    title="Switch Camera" 
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                    <SwitchCamera className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>

            {/* Identity Lockdown Warning */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-[#0FF]/10 border border-[#0FF]/30 text-[#0FF] px-3 py-1 rounded-full backdrop-blur-md">
                <ShieldAlert className="w-3 h-3" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Identity Locked: Gemini Core</span>
            </div>

        </div>
    );
}
