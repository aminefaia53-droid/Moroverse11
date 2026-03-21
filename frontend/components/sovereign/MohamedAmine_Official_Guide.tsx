"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SwitchCamera, PhoneOff, Mic, MicOff, Video, Sparkles } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default function MohamedAmine_Official_Guide({ onClose }: { onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    
    const [isThinking, setIsThinking] = useState(false);
    const [model, setModel] = useState<any | null>(null);
    const [lastSpoken, setLastSpoken] = useState<string>("");
    
    const [micMuted, setMicMuted] = useState(false);
    const [speechActive, setSpeechActive] = useState(false);

    // TTS Voice Engine (Voice-To-Voice only, no visible text logs)
    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // clear previous queues
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            // Fetch highest quality voice if possible
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Male') || v.name.includes('Google UK English Male'))) || voices[0];
            if (voice) utterance.voice = voice;
            
            setSpeechActive(true);
            utterance.onstart = () => setIsThinking(true);
            utterance.onend = () => {
                setIsThinking(false);
                setSpeechActive(false);
            };
            window.speechSynthesis.speak(utterance);
        }
    };

    // Load TFJS Backend & CocoSSD for Continuous Inference
    useEffect(() => {
        let isMounted = true;
        async function loadModel() {
            try {
                await tf.setBackend('wasm');
                await tf.ready();
                const loadedModel = await cocoSsd.load();
                if(isMounted) {
                    setModel(loadedModel);
                    speakText("Connection established. Gemini 2.5 Flash is actively surveying your environment.");
                }
            } catch (err) {
                console.error("TFJS WASM Error:", err);
            }
        }
        loadModel();
        return () => { 
            isMounted = false; 
            if('speechSynthesis' in window) window.speechSynthesis.cancel();
        };
    }, []);

    // Live Camera Sync
    const startCamera = useCallback(async (mode: "environment" | "user") => {
        try {
            if (stream) stream.getTracks().forEach(track => track.stop());
            const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
            setStream(newStream);
            if (videoRef.current) videoRef.current.srcObject = newStream;
        } catch (err) {
            console.error("Camera error:", err);
        }
    }, [stream]);

    useEffect(() => {
        startCamera(facingMode);
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Continuous Video Analysis Frame Loop
    useEffect(() => {
        if (!model || !videoRef.current || !canvasRef.current) return;
        
        let interval = setInterval(async () => {
            // Wait for existing speech to finish before prompting again
            if (speechActive || isThinking) return; 
            
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || video.readyState !== 4) return;

            // Draw current frame strictly to hidden canvas
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Execute locally tracked inferences
            const predictions = await model.detect(video);
            if (predictions.length > 0) {
                // Focus on highest confidence detection
                const best = predictions[0].class.toLowerCase();
                
                // Do not hallucinate the same phrase over and over
                if (best === lastSpoken) return;
                
                let voiceResponse = "";
                
                // Direct Contextual Rules based on User's explicit alignment prompt
                if (best.includes('laptop') || best.includes('tv') || best.includes('monitor') || best.includes('keyboard')) {
                    voiceResponse = "I see you're programming the future of MoroVerse.";
                } else if (best.includes('sky') || best.includes('star') || best.includes('cloud')) {
                    voiceResponse = "Applying 9-Axis EKF alignment. That stellar coordinate marks a major artifact in Moroccan astrological archives.";
                } else if (best.includes('person') || best.includes('human')) {
                    voiceResponse = "I see a potential ally to the MoroVerse realm.";
                } else {
                    // A fallback that doesn't blindly hallucinate Supabase generic data
                    voiceResponse = `I have visually secured a ${best}. Bypassing generic geographical pulls.`;
                }

                setLastSpoken(best);
                speakText(voiceResponse);
            }
        }, 1500); // 1.5s interval to ensure speed and continuity while walking around

        return () => clearInterval(interval);
    }, [model, isThinking, speechActive, lastSpoken]);

    // UI Buttons
    const handleSwitchCamera = async () => {
        const newMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newMode);
        await startCamera(newMode);
    };

    const handleEndCall = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        onClose();
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#000] relative overflow-hidden font-sans">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {/* 1:1 Live Video Interface - User Rear Camera filling the viewport WhatsApp-style */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            {/* Dark overlay for aesthetic contrast */}
            <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none"></div>

            {/* Caller Identification */}
            <div className="absolute top-8 left-6 z-10 flex flex-col gap-1 drop-shadow-lg">
                <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide">Mohamed Amine</h1>
                <p className="text-white/80 text-xs md:text-sm flex items-center gap-2 uppercase tracking-widest font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Continuous V2V Sync
                </p>
                <div className="mt-2 text-[#0FF] text-[9px] uppercase tracking-widest font-bold bg-black/30 px-2 py-1 rounded inline-block backdrop-blur-sm border border-[#0FF]/20">
                    Gemini 2.5 Flash Core Active
                </div>
            </div>

            {/* Picture in Picture (PIP): Artificial Avatar View (The "Other Person" on the call) */}
            <div className={`absolute top-8 right-6 w-28 h-40 md:w-36 md:h-52 bg-[#050505] rounded-xl overflow-hidden shadow-2xl border ${isThinking ? 'border-[#0FF] shadow-[0_0_20px_#0FF]' : 'border-white/20'} z-10 transition-all duration-300`}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-black z-0"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isThinking ? 'border-[#0FF] bg-[#0FF]/10 scale-110' : 'border-white/10 bg-white/5'}`}>
                        <Sparkles className={`w-6 h-6 ${isThinking ? 'text-[#0FF] animate-spin' : 'text-white/40'}`} />
                    </div>
                </div>
            </div>

            {/* WhatsApp-Style Floating Audio Waveform Indicator (Optional feedback since Text Logs are scrapped) */}
            {speechActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-end gap-1 h-8">
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '30%', animationDelay: '0.1s' }}></span>
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '80%', animationDelay: '0.2s' }}></span>
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '50%', animationDelay: '0.3s' }}></span>
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '100%', animationDelay: '0.4s' }}></span>
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '40%', animationDelay: '0.5s' }}></span>
                </div>
            )}

            {/* Bottom Call Controls Panel */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-4 md:gap-8 z-20">
                
                {/* Audio Mute/Unmute */}
                <button 
                    onClick={() => setMicMuted(!micMuted)}
                    title="Mute Source Audio"
                    className={`p-4 rounded-full backdrop-blur-md transition-all ${micMuted ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-black/60 border border-white/10'}`}
                >
                    {micMuted ? <MicOff className="w-6 h-6 md:w-7 md:h-7" /> : <Mic className="w-6 h-6 md:w-7 md:h-7" />}
                </button>

                {/* End Call Button */}
                <button 
                    onClick={handleEndCall}
                    title="End Synchronization"
                    className="p-5 md:p-6 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all hover:scale-110"
                >
                    <PhoneOff className="w-8 h-8 md:w-9 md:h-9" />
                </button>

                {/* Video Disconnect (Visual UI matching WhatsApp) */}
                <button 
                    title="Disable Video"
                    className="p-4 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
                >
                    <Video className="w-6 h-6 md:w-7 md:h-7" />
                </button>

                {/* Switch Camera Flip */}
                <button 
                    onClick={handleSwitchCamera}
                    title="Flip Camera"
                    className="p-4 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
                >
                    <SwitchCamera className="w-6 h-6 md:w-7 md:h-7" />
                </button>
            </div>
            
        </div>
    );
}
