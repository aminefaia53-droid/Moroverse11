"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SwitchCamera, PhoneOff, Mic, MicOff, Globe2, Loader2, Sparkles, BrainCircuit } from 'lucide-react';

type SupportedLanguage = "English" | "French" | "Arabic (Moroccan Darija mixing MSA)";
type AgentState = "IDLE" | "LISTENING" | "ANALYZING_FRAME" | "SPEAKING";

export default function MohamedAmine_Official_Guide({ onClose }: { onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
    
    // The Supreme 3-State Machine
    const [agentState, setAgentState] = useState<AgentState>("IDLE");
    
    const [micMuted, setMicMuted] = useState(false);
    const [language, setLanguage] = useState<SupportedLanguage>("Arabic (Moroccan Darija mixing MSA)");
    const [memory, setMemory] = useState<{ hasSeenWorkspace: boolean }>({ hasSeenWorkspace: false });

    // Core Voice/Context Refs
    const recognitionRef = useRef<any>(null);
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);
    const previousNarrative = useRef<string>("");

    // Refs to prevent stale closures
    const micMutedRef = useRef(micMuted);
    const agentStateRef = useRef(agentState);
    
    useEffect(() => { micMutedRef.current = micMuted; }, [micMuted]);
    useEffect(() => { agentStateRef.current = agentState; }, [agentState]);

    // Memory Initialization
    useEffect(() => {
        try {
            const stored = localStorage.getItem("moroVerseWorkspaceMemory");
            if (stored) setMemory(JSON.parse(stored));
        } catch (e) {}
    }, []);

    // Sequenced Sentence Execution for better browser TTS naturality
    const playSequencedAudio = useCallback((text: string, forceLang: SupportedLanguage) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); 
        
        let bcp47 = 'en-US';
        if (forceLang.includes("French")) bcp47 = 'fr-FR';
        if (forceLang.includes("Arabic")) bcp47 = 'ar-SA';
        
        // Smart Splitting to insert natural pauses and reduce "robot rush"
        // Splitting by typical sentence enders (, . ?)
        const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
        
        let i = 0;
        const playNext = () => {
            if (i >= sentences.length) {
                setAgentState("IDLE");
                restartListening();
                return;
            }
            
            const chunk = sentences[i].trim();
            if(!chunk) { i++; playNext(); return; }
            
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.lang = bcp47;
            utterance.rate = 0.95; // Slightly slower feels more poetic
            utterance.pitch = 0.9;
            
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v => v.lang.startsWith(bcp47.split('-')[0]) && (v.name.includes('Male') || v.name.includes('Google') || v.name.includes('Tarik'))) 
                       || voices.find(v => v.lang.startsWith(bcp47.split('-')[0])) || voices[0];
            if (voice) utterance.voice = voice;
            
            utterance.onend = () => {
                i++;
                // Small explicit pause between sentences
                setTimeout(playNext, 200);
            };
            
            utterance.onerror = () => {
                i++;
                playNext();
            };
            
            window.speechSynthesis.speak(utterance);
        };
        
        setAgentState("SPEAKING");
        playNext();
    }, []);

    // Deep Intelligence Vision Pulse
    const triggerIntelligencePulse = async (userSpeechText: string = "", isProactive: boolean = false) => {
        if (!videoRef.current || !canvasRef.current || agentStateRef.current === "ANALYZING_FRAME" || agentStateRef.current === "SPEAKING") return;
        
        setAgentState("ANALYZING_FRAME"); 
        pauseListening(); // Shut off mic so AI doesn't hear itself
        
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const base64Image = canvas.toDataURL('image/jpeg', 0.85); // High quality frame
            
            const res = await fetch('/api/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: base64Image,
                    language,
                    contextMemory: memory,
                    previousNarrative: previousNarrative.current,
                    userSpeech: userSpeechText,
                    isProactive
                })
            });
            
            const data = await res.json();
            if (res.ok) {
                previousNarrative.current = data.result; 
                
                // Super basic memory heuristic without TFJS
                if (data.result.toLowerCase().includes('workspace') || data.result.toLowerCase().includes('command center')) {
                    const newMemory = { hasSeenWorkspace: true };
                    setMemory(newMemory);
                    localStorage.setItem("moroVerseWorkspaceMemory", JSON.stringify(newMemory));
                }
                
                playSequencedAudio(data.result, language);
            } else {
                setAgentState("IDLE");
                restartListening();
            }
        } catch (error) {
            console.error("Vision Overdrive Error:", error);
            setAgentState("IDLE");
            restartListening();
        } finally {
            resetSilenceTimer();
        }
    };

    // Robust Speech Recognition
    const setupSpeech = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true; 
        recognition.interimResults = true; 
        
        recognition.onstart = () => {
            if (agentStateRef.current === "IDLE") setAgentState("LISTENING");
        };

        recognition.onend = () => {
             // Restart strictly if IDLE (didn't go into ANALYZING or SPEAKING)
             if (!micMutedRef.current && agentStateRef.current === "IDLE") {
                 setTimeout(() => { try { recognition.start(); } catch(e){} }, 300);
             } else if (agentStateRef.current === "LISTENING") {
                 setAgentState("IDLE");
                 setTimeout(() => { try { recognition.start(); } catch(e){} }, 300);
             }
        };
        
        recognition.onresult = (event: any) => {
            if (agentStateRef.current === "ANALYZING_FRAME" || agentStateRef.current === "SPEAKING") return;
            
            setAgentState("LISTENING");
            resetSilenceTimer();
            
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            
            if (finalTranscript.trim().length > 2) {
                triggerIntelligencePulse(finalTranscript.trim(), false);
            }
        };
        
        recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, memory]);

    useEffect(() => {
        setupSpeech();
    }, [setupSpeech]);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language.includes("Arabic") ? "ar-MA" : language.includes("French") ? "fr-FR" : "en-US";
            restartListening();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, micMuted]);

    const pauseListening = () => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e){}
        }
    };

    const restartListening = () => {
        if (!micMutedRef.current && recognitionRef.current && agentStateRef.current !== "ANALYZING_FRAME" && agentStateRef.current !== "SPEAKING") {
            try { recognitionRef.current.start(); } catch(e) {}
        }
    };

    // Proactive Silence Management (Deep Analysis, no rapid polling)
    const resetSilenceTimer = useCallback(() => {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
        silenceTimer.current = setTimeout(() => {
            if (agentStateRef.current === "IDLE" || agentStateRef.current === "LISTENING") {
                triggerIntelligencePulse("", true);
            }
        }, 12000); // 12 quiet seconds triggers a deep philosophical hallucination 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => { resetSilenceTimer(); }, [resetSilenceTimer]);

    // Live Camera Sync
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
        
        // Initial Startup Audio
        playSequencedAudio("The sovereign eye is open. Unbound visual architecture loaded.", "English");
        
        return () => { 
            if (stream) stream.getTracks().forEach(track => track.stop());
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            if (recognitionRef.current) { try{ recognitionRef.current.stop(); }catch(e){} }
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const toggleLanguage = () => {
        setLanguage(prev => {
            if (prev === "English") return "French";
            if (prev === "French") return "Arabic (Moroccan Darija mixing MSA)";
            return "English";
        });
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#000] relative overflow-hidden font-sans">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {/* Live Visual Input (Clean, no filters blocking reality) */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${agentState === "ANALYZING_FRAME" ? "opacity-70 blur-sm grayscale-[0.3]" : "opacity-100"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-0 pointer-events-none"></div>

            {/* Caller Identification */}
            <div className="absolute top-10 left-6 z-10 flex flex-col gap-1 drop-shadow-2xl pointer-events-none">
                <h1 className="text-white text-3xl font-extrabold tracking-wide uppercase font-serif italic">Amine Core</h1>
                <p className="text-[#0FF] text-xs font-bold tracking-[0.2em] uppercase font-mono shadow-black drop-shadow-md">
                    Sovereign Machine
                </p>
                {memory.hasSeenWorkspace && (
                    <div className="mt-2 text-yellow-400 text-[9px] uppercase tracking-widest font-bold bg-black/50 px-2 py-1 rounded inline-block backdrop-blur-md border border-yellow-400/30">
                        Sacred Workspace Identified
                    </div>
                )}
            </div>

            {/* The Artificial 'Wijdan' Soul Orb (State Visualization) */}
            <div className={`absolute top-10 right-6 w-20 h-20 md:w-28 md:h-28 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] border z-10 transition-all duration-700 pointer-events-none flex items-center justify-center overflow-hidden
                ${agentState === "IDLE" ? 'border-white/20 bg-black/40 scale-100' : ''}
                ${agentState === "LISTENING" ? 'border-[#FAFF00] shadow-[0_0_40px_#FAFF00] bg-black/60 scale-110' : ''}
                ${agentState === "ANALYZING_FRAME" ? 'border-[#0FF] shadow-[0_0_80px_#0FF] bg-[#0FF]/20 scale-125 animate-pulse' : ''}
                ${agentState === "SPEAKING" ? 'border-[#FF00AA] shadow-[0_0_60px_#FF00AA] bg-black/80 scale-100' : ''}
            `}>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 opacity-50"></div>
                
                {agentState === "IDLE" && <BrainCircuit className="w-8 h-8 text-white/50 animate-pulse" />}
                {agentState === "LISTENING" && <Mic className="w-8 h-8 text-[#FAFF00] animate-bounce" />}
                {agentState === "ANALYZING_FRAME" && <Loader2 className="w-10 h-10 text-[#0FF] animate-spin" />}
                {agentState === "SPEAKING" && <Sparkles className="w-10 h-10 text-[#FF00AA] animate-ping" />}
            </div>

            {/* State Announcement Tape */}
            <div className="absolute top-[8.5rem] right-6 z-10 flex justify-end">
                <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-md border transition-colors
                    ${agentState === "IDLE" ? 'text-white/50 border-white/10 bg-black/30' : ''}
                    ${agentState === "LISTENING" ? 'text-yellow-400 border-yellow-400/30 bg-black/60' : ''}
                    ${agentState === "ANALYZING_FRAME" ? 'text-[#0FF] border-[#0FF]/50 bg-[#0FF]/10' : ''}
                    ${agentState === "SPEAKING" ? 'text-[#FF00AA] border-[#FF00AA]/50 bg-black/80' : ''}
                `}>
                    {agentState === "IDLE" ? "STANDING BY" : 
                     agentState === "LISTENING" ? "HEARING VOCALS..." : 
                     agentState === "ANALYZING_FRAME" ? "SENSORY OVERDRIVE" : "SOVEREIGN ENUNCIATION"}
                </span>
            </div>

            {/* WhatsApp-Style Floating Audio Waveform Indicator (only on speaking) */}
            {agentState === "SPEAKING" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-end gap-1.5 h-16 pointer-events-none">
                    <span className="w-3 bg-[#FF00AA] rounded-full animate-bounce shadow-[0_0_20px_#FF00AA]" style={{ height: '30%', animationDelay: '0.1s' }}></span>
                    <span className="w-3 bg-[#FF00AA] rounded-full animate-bounce shadow-[0_0_20px_#FF00AA]" style={{ height: '80%', animationDelay: '0.2s' }}></span>
                    <span className="w-3 bg-[#FF00AA] rounded-full animate-bounce shadow-[0_0_20px_#FF00AA]" style={{ height: '60%', animationDelay: '0.3s' }}></span>
                    <span className="w-3 bg-[#FF00AA] rounded-full animate-bounce shadow-[0_0_20px_#FF00AA]" style={{ height: '100%', animationDelay: '0.4s' }}></span>
                    <span className="w-3 bg-[#FF00AA] rounded-full animate-bounce shadow-[0_0_20px_#FF00AA]" style={{ height: '40%', animationDelay: '0.5s' }}></span>
                </div>
            )}

            {/* Bottom Call Controls Panel */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 md:gap-8 z-20">
                
                {/* Language Sphere */}
                <button 
                    onClick={toggleLanguage}
                    title="Change Language"
                    className="p-4 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all border border-white/20 flex flex-col items-center relative group"
                >
                    <Globe2 className="w-6 h-6 text-[#0FF]" />
                    <span className="absolute -top-7 text-[10px] font-bold uppercase tracking-widest text-[#0FF] bg-black/90 px-3 py-1 rounded-full border border-white/10 shadow-lg">
                        {language.includes("Arabic") ? "ARABIC" : language.includes("French") ? "FRENCH" : "ENGLISH"}
                    </span>
                </button>

                {/* Instant Feedback Microphone */}
                <button 
                    onClick={() => setMicMuted(!micMuted)}
                    className={`p-5 rounded-full backdrop-blur-sm transition-all border relative 
                        ${micMuted ? 'bg-red-500/80 border-red-500 text-white' : 'bg-black/60 border-white/20 text-white hover:bg-black/80'} 
                        ${agentState === "LISTENING" && !micMuted ? 'shadow-[0_0_30px_#FAFF00] scale-110 border-yellow-400 text-yellow-400' : ''}
                    `}
                >
                    {micMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                </button>

                <button 
                    onClick={handleEndCall}
                    className="p-6 md:p-7 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-[0_0_40px_rgba(220,38,38,0.7)] transition-all hover:scale-110"
                >
                    <PhoneOff className="w-8 h-8" />
                </button>

                <button 
                    onClick={handleSwitchCamera}
                    className="p-4 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all border border-white/10"
                >
                    <SwitchCamera className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
