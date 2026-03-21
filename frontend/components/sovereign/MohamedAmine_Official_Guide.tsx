"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SwitchCamera, PhoneOff, Mic, MicOff, Video, Sparkles, Globe2, Ear } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

type SupportedLanguage = "English" | "French" | "Arabic (Moroccan Darija mixing MSA)";

export default function MohamedAmine_Official_Guide({ onClose }: { onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    
    const [isThinking, setIsThinking] = useState(false);
    const [model, setModel] = useState<any | null>(null);
    
    // Core Vision States
    const frameBuffer = useRef<string[]>([]);
    const lastSpoken = useRef<string>("");
    const previousNarrative = useRef<string>("");
    
    // Audio & Interaction States
    const [micMuted, setMicMuted] = useState(false);
    const [speechActive, setSpeechActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    
    // V2.0+ Ultimate Context
    const [language, setLanguage] = useState<SupportedLanguage>("English");
    const [memory, setMemory] = useState<{ hasSeenWorkspace: boolean }>({ hasSeenWorkspace: false });
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);
    const recognitionRef = useRef<any>(null); // To hold SpeechRecognition instance

    // Initialize Long-Term Memory
    useEffect(() => {
        try {
            const stored = localStorage.getItem("moroVerseWorkspaceMemory");
            if (stored) setMemory(JSON.parse(stored));
        } catch (e) { console.error("Memory access denied", e); }
    }, []);

    // Speech Recognition Setup
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            
            // Adjust lang based on current GUI but fallback to English to capture general sound
            recognition.lang = language.includes("Arabic") ? "ar-MA" : language.includes("French") ? "fr-FR" : "en-US";

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                if (transcript.length > 2) {
                    // Trigger proactive API call exactly when user speaks
                    triggerIntelligencePulse(null, transcript, false);
                }
            };
            
            recognitionRef.current = recognition;
        }
    }, [language]);

    // Handle Mic Toggle manually parsing speech
    useEffect(() => {
        if (!micMuted && recognitionRef.current && !isListening && !speechActive && !isThinking) {
            try { recognitionRef.current.start(); } catch(e){}
        } else if (micMuted && recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e){}
        }
    });

    const toggleLanguage = () => {
        setLanguage(prev => {
            if (prev === "English") return "French";
            if (prev === "French") return "Arabic (Moroccan Darija mixing MSA)";
            return "English";
        });
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };

    const speakText = (text: string, forceLang: SupportedLanguage) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); 
            const utterance = new SpeechSynthesisUtterance(text);
            
            let bcp47 = 'en-US';
            if (forceLang.includes("French")) bcp47 = 'fr-FR';
            if (forceLang.includes("Arabic")) bcp47 = 'ar-SA';
            
            utterance.lang = bcp47;
            utterance.rate = 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang.startsWith(bcp47.split('-')[0]) && (v.name.includes('Male') || v.name.includes('Google'))) || voices.find(v => v.lang.startsWith(bcp47.split('-')[0])) || voices[0];
            if (voice) utterance.voice = voice;
            
            setSpeechActive(true);
            utterance.onstart = () => setIsThinking(true);
            utterance.onend = () => {
                setIsThinking(false);
                setSpeechActive(false);
                // Restart listening after speaking
                if (!micMuted && recognitionRef.current) try{ recognitionRef.current.start(); }catch(e){}
            };
            window.speechSynthesis.speak(utterance);
        }
    };

    // Load TFJS Backend
    useEffect(() => {
        let isMounted = true;
        async function loadModel() {
            try {
                await tf.setBackend('wasm');
                await tf.ready();
                const loadedModel = await cocoSsd.load();
                if(isMounted) {
                    setModel(loadedModel);
                    speakText("Supreme Intelligence Online. My senses are fully liberated. Show me, speak to me, or let the silence teach us.", "English");
                }
            } catch (err) { console.error("TFJS WASM Error:", err); }
        }
        loadModel();
        return () => { 
            isMounted = false; 
            if('speechSynthesis' in window) window.speechSynthesis.cancel();
            if(recognitionRef.current) { try{ recognitionRef.current.stop(); } catch(e){} }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Live Camera
    const startCamera = useCallback(async (mode: "environment" | "user") => {
        try {
            if (stream) stream.getTracks().forEach(track => track.stop());
            const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
            setStream(newStream);
            if (videoRef.current) videoRef.current.srcObject = newStream;
        } catch (err) { console.error("Camera error:", err); }
    }, [stream]);

    useEffect(() => {
        startCamera(facingMode);
        return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Environmental Lighting Calculus
    const evaluateLighting = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        const imageData = ctx.getImageData(0, 0, width, height).data;
        let sum = 0;
        // Sample every 10th pixel for speed
        for (let i = 0; i < imageData.length; i += 40) {
            sum += (0.299 * imageData[i] + 0.587 * imageData[i + 1] + 0.114 * imageData[i + 2]); // Perceived luminance
        }
        const avg = sum / (imageData.length / 40);
        if (avg < 50) return "Dark/Low-Light";
        if (avg > 200) return "Very Bright/Over-exposed";
        return "Normal Daylight/Office Lighting";
    };

    // The Master Intelligence Pulse
    const triggerIntelligencePulse = async (detectedObject: string | null, userSpeechText: string = "", isProactive: boolean = false) => {
        if (!videoRef.current || !canvasRef.current || isThinking || speechActive) return;
        
        setIsThinking(true);
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const lighting = evaluateLighting(ctx, canvas.width, canvas.height);
            const base64Image = canvas.toDataURL('image/jpeg', 0.8);
            
            const res = await fetch('/api/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: base64Image,
                    detectedObject,
                    language,
                    contextMemory: memory,
                    previousNarrative: previousNarrative.current,
                    userSpeech: userSpeechText,
                    lightingCondition: lighting,
                    isProactive
                })
            });
            
            const data = await res.json();
            if (res.ok) {
                speakText(data.result, language);
                if (detectedObject) lastSpoken.current = detectedObject; 
                previousNarrative.current = data.result; 
                
                if (detectedObject && (detectedObject.includes('laptop') || detectedObject.includes('tv') || detectedObject.includes('monitor') || detectedObject.includes('keyboard'))) {
                    const newMemory = { hasSeenWorkspace: true };
                    setMemory(newMemory);
                    localStorage.setItem("moroVerseWorkspaceMemory", JSON.stringify(newMemory));
                }
            }
        } catch (error) {
            console.error("Gemini Vision Error:", error);
        } finally {
            if (!speechActive) setIsThinking(false);
            resetSilenceTimer();
        }
    };

    // Proactive Silence Management
    const resetSilenceTimer = () => {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
        silenceTimer.current = setTimeout(() => {
            if (!isThinking && !speechActive) {
                // User has been completely quiet for 15 seconds. Lead the conversation!
                triggerIntelligencePulse(null, "", true);
            }
        }, 15000); // 15 seconds of silence
    };

    // Continuous Frame Analysis Loop
    useEffect(() => {
        if (!model) return;
        
        resetSilenceTimer();

        let pollingInterval = setInterval(async () => {
            if (speechActive || isThinking) return; 
            
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || video.readyState !== 4) return;

            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const predictions = await model.detect(video);
            const currentObject = predictions.length > 0 ? predictions[0].class.toLowerCase() : "background";
            
            frameBuffer.current.push(currentObject);
            if (frameBuffer.current.length > 3) frameBuffer.current.shift();

            const isStabilized = frameBuffer.current.length === 3 && frameBuffer.current.every(val => val === frameBuffer.current[0]);

            if (isStabilized && currentObject !== 'background' && currentObject !== lastSpoken.current) {
                // Object visually changed and stabilized. Stop silence timer, trigger intel.
                triggerIntelligencePulse(currentObject, "", false);
            }
        }, 800); 

        return () => {
            clearInterval(pollingInterval);
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [model, isThinking, speechActive, language, memory, micMuted]);

    const handleSwitchCamera = async () => {
        const newMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newMode);
        await startCamera(newMode);
    };

    const handleEndCall = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (recognitionRef.current) { try{ recognitionRef.current.stop(); }catch(e){} }
        onClose();
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#000] relative overflow-hidden font-sans">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {/* 1:1 Live Video Interface */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none"></div>

            {/* Caller Identification */}
            <div className="absolute top-8 left-6 z-10 flex flex-col gap-1 drop-shadow-lg pointer-events-none">
                <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide">Mohamed Amine</h1>
                <p className="text-white/80 text-xs md:text-sm flex items-center gap-2 uppercase tracking-widest font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#0FF] animate-pulse"></span>
                    Unbound Sovereign Pulse
                </p>
                
                {/* Visualizing Sensory Overdrive */}
                <div className="flex flex-col gap-1 mt-2 items-start">
                    <div className={`text-[#0FF] text-[9px] uppercase tracking-widest font-bold bg-black/50 px-2 py-1 rounded inline-block backdrop-blur-md border ${isListening ? 'border-[#0FF] shadow-[0_0_10px_#0FF]' : 'border-[#0FF]/30'}`}>
                        {isListening ? 'Ambient Mic Active (Listening...)' : 'Mic Standby'}
                    </div>
                    {memory.hasSeenWorkspace && (
                        <div className="text-yellow-400 text-[9px] uppercase tracking-widest font-bold bg-black/50 px-2 py-1 rounded inline-block backdrop-blur-md border border-yellow-400/30 shadow-[0_0_10px_rgba(250,204,21,0.2)]">
                            Workspace Bond Verified
                        </div>
                    )}
                </div>
            </div>

            {/* Picture in Picture (PIP): Artificial Avatar View */}
            <div className={`absolute top-8 right-6 w-28 h-40 md:w-36 md:h-52 bg-[#050505] rounded-xl overflow-hidden shadow-2xl border ${isThinking ? 'border-[#0FF] shadow-[0_0_30px_#0FF]' : 'border-white/20'} z-10 transition-all duration-300 pointer-events-none`}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-black z-0"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isThinking ? 'border-[#0FF] bg-[#0FF]/10 scale-110 animate-pulse' : 'border-white/10 bg-white/5'}`}>
                        <Sparkles className={`w-6 h-6 ${isThinking ? 'text-[#0FF]' : 'text-white/40'}`} />
                    </div>
                </div>
            </div>

            {/* WhatsApp-Style Floating Audio Waveform Indicator */}
            {speechActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-end gap-1 h-8 pointer-events-none">
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '30%', animationDelay: '0.1s' }}></span>
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '80%', animationDelay: '0.2s' }}></span>
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '50%', animationDelay: '0.3s' }}></span>
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '100%', animationDelay: '0.4s' }}></span>
                    <span className="w-2 bg-[#0FF] rounded-full animate-bounce" style={{ height: '40%', animationDelay: '0.5s' }}></span>
                </div>
            )}

            {/* Bottom Call Controls Panel */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-3 md:gap-8 z-20">
                
                {/* Multilingual Selector */}
                <button 
                    onClick={toggleLanguage}
                    title="Change Language"
                    className="p-4 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all border border-white/20 flex flex-col items-center relative group"
                >
                    <Globe2 className="w-5 h-5 md:w-6 md:h-6 text-[#0FF]" />
                    <span className="absolute -top-6 text-[9px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors bg-black/80 px-2 py-0.5 rounded border border-white/10">
                        {language.includes("Arabic") ? "AR" : language.includes("French") ? "FR" : "EN"}
                    </span>
                </button>

                <button 
                    onClick={() => setMicMuted(!micMuted)}
                    className={`p-4 rounded-full backdrop-blur-md transition-all border border-white/10 ${micMuted ? 'bg-white text-black' : 'bg-black/40 text-white hover:bg-black/60'} relative`}
                >
                    {micMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
                    {!micMuted && isListening && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-black" />}
                </button>

                <button 
                    onClick={handleEndCall}
                    className="p-5 md:p-6 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all hover:scale-110"
                >
                    <PhoneOff className="w-7 h-7 md:w-9 md:h-9" />
                </button>

                <button className="p-4 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all border border-white/10 cursor-default">
                    <Video className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <button 
                    onClick={handleSwitchCamera}
                    className="p-4 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
                >
                    <SwitchCamera className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>
        </div>
    );
}
