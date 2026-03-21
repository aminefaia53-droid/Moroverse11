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
    
    const [agentState, setAgentState] = useState<AgentState>("IDLE");
    const [micMuted, setMicMuted] = useState(false);
    // FIX 1: Default language locked to Arabic/Darija from first render
    const [language, setLanguage] = useState<SupportedLanguage>("Arabic (Moroccan Darija mixing MSA)");
    const [memory, setMemory] = useState<{ hasSeenWorkspace: boolean; conversationCount: number; lastTopics: string[] }>({ hasSeenWorkspace: false, conversationCount: 0, lastTopics: [] });

    // FIX 4: All refs so closures always access latest values
    const recognitionRef = useRef<any>(null);
    const silenceTimer = useRef<NodeJS.Timeout | null>(null);
    const previousNarrative = useRef<string>("");
    const micMutedRef = useRef(micMuted);
    const agentStateRef = useRef(agentState);
    const languageRef = useRef(language); // FIX 4: track language in ref
    const memoryRef = useRef(memory);     // FIX 4: track memory in ref
    
    useEffect(() => { micMutedRef.current = micMuted; }, [micMuted]);
    useEffect(() => { agentStateRef.current = agentState; }, [agentState]);
    useEffect(() => { languageRef.current = language; }, [language]);
    useEffect(() => { memoryRef.current = memory; }, [memory]);

    // Memory Initialization
    useEffect(() => {
        try {
            const stored = localStorage.getItem("moroVerseWorkspaceMemory");
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to handle old memory format
                setMemory({ hasSeenWorkspace: false, conversationCount: 0, lastTopics: [], ...parsed });
            }
        } catch (e) {}
    }, []);

    // TTS: Sequential sentences with natural pauses
    const playSequencedAudio = useCallback((text: string, lang: SupportedLanguage) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); 
        
        let bcp47 = 'en-US';
        if (lang.includes("French")) bcp47 = 'fr-FR';
        if (lang.includes("Arabic")) bcp47 = 'ar-SA';
        
        const sentences = text.match(/[^.!?؟،]+[.!?؟،]*/g) || [text];
        
        let i = 0;
        const playNext = () => {
            if (i >= sentences.length) {
                setAgentState("IDLE");
                // FIX 5: Restart listening AFTER speaking finishes — not before
                setTimeout(() => {
                    if (!micMutedRef.current && recognitionRef.current) {
                        try { recognitionRef.current.start(); } catch(e) {}
                    }
                }, 400);
                return;
            }
            
            const chunk = sentences[i].trim();
            if (!chunk) { i++; playNext(); return; }
            
            const utterance = new SpeechSynthesisUtterance(chunk);
            utterance.lang = bcp47;
            utterance.rate = 0.92;
            utterance.pitch = 0.88;
            
            // FIX: Wait for voices to load on mobile
            const trySpeak = () => {
                const voices = window.speechSynthesis.getVoices();
                const voice = voices.find(v => v.lang.startsWith(bcp47.split('-')[0]) && (v.name.includes('Tarik') || v.name.includes('Male') || v.name.includes('Google'))) 
                           || voices.find(v => v.lang.startsWith(bcp47.split('-')[0])) 
                           || voices[0];
                if (voice) utterance.voice = voice;
                utterance.onend = () => { i++; setTimeout(playNext, 250); };
                utterance.onerror = () => { i++; playNext(); };
                window.speechSynthesis.speak(utterance);
            };
            
            if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.onvoiceschanged = trySpeak;
            } else {
                trySpeak();
            }
        };
        
        setAgentState("SPEAKING");
        playNext();
    }, []);

    // FIX 4: Use refs inside async function to avoid stale closure
    const triggerIntelligencePulse = useCallback(async (userSpeechText: string = "", isProactive: boolean = false) => {
        if (!videoRef.current || !canvasRef.current) return;
        if (agentStateRef.current === "ANALYZING_FRAME" || agentStateRef.current === "SPEAKING") return;
        
        setAgentState("ANALYZING_FRAME"); 
        // Stop mic during analysis
        if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
        
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (!ctx) { setAgentState("IDLE"); return; }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const base64Image = canvas.toDataURL('image/jpeg', 0.85);
            
            // FIX 4: Read from refs, never from stale closure
            const currentLang = languageRef.current;
            const currentMemory = memoryRef.current;
            
            const res = await fetch('/api/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: base64Image,
                    language: currentLang,
                    contextMemory: currentMemory,
                    previousNarrative: previousNarrative.current,
                    userSpeech: userSpeechText,
                    isProactive
                })
            });
            
            const data = await res.json();
            if (res.ok && data.result) {
                previousNarrative.current = data.result;
                
                // Progressive Memory: detect workspace, count conversations, track topics
                const result = data.result.toLowerCase();
                const isWorkspace = result.includes('workspace') || result.includes('command center') ||
                    result.includes('مكتب') || result.includes('غرفة العمليات') || result.includes('حاسوب') ||
                    result.includes('بيسي') || result.includes('لابتوب') || result.includes('مركز');
                
                // Detect which Moroccan soul layer was activated
                let activeTopic = '';
                if (result.includes('أطلس') || result.includes('صحراء') || result.includes('طنجة')) activeTopic = 'جغرافيا الروح';
                else if (result.includes('قرويين') || result.includes('موحد') || result.includes('مرينيين')) activeTopic = 'العمق التاريخي';
                else if (result.includes('زليج') || result.includes('قفطان') || result.includes('طاجن')) activeTopic = 'الوجدان الثقافي';
                else if (result.includes('موروڤيرس') || result.includes('2030') || result.includes('سيادة رقمية') || result.includes('نور')) activeTopic = 'MoroVerse 2030';
                
                const newMem = {
                    ...currentMemory,
                    hasSeenWorkspace: currentMemory.hasSeenWorkspace || isWorkspace,
                    conversationCount: (currentMemory.conversationCount || 0) + 1,
                    lastTopics: activeTopic 
                        ? [activeTopic, ...(currentMemory.lastTopics || [])].slice(0, 3)
                        : currentMemory.lastTopics || []
                };
                setMemory(newMem);
                localStorage.setItem("moroVerseWorkspaceMemory", JSON.stringify(newMem));
                
                playSequencedAudio(data.result, currentLang);
            } else {
                setAgentState("IDLE");
                if (!micMutedRef.current && recognitionRef.current) try { recognitionRef.current.start(); } catch(e) {}
            }
        } catch (error) {
            console.error("Vision Error:", error);
            setAgentState("IDLE");
            if (!micMutedRef.current && recognitionRef.current) try { recognitionRef.current.start(); } catch(e) {}
        } finally {
            resetSilenceTimer();
        }
    }, [playSequencedAudio]);

    // FIX 3: Rebuilt Speech Recognition without the onend race condition
    const setupSpeech = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        if (recognitionRef.current) return; // Don't recreate if already exists

        const recognition = new SpeechRecognition();
        recognition.continuous = true; 
        recognition.interimResults = false; // FIX 3: Only fire on definitive final results
        
        recognition.onstart = () => {
            // Only set LISTENING if we are genuinely free
            if (agentStateRef.current === "IDLE") setAgentState("LISTENING");
        };

        recognition.onend = () => {
            // FIX 3: Simpler restart — only restart if not in middle of AI processing
            if (!micMutedRef.current && 
                agentStateRef.current !== "ANALYZING_FRAME" && 
                agentStateRef.current !== "SPEAKING") {
                setTimeout(() => { try { recognition.start(); } catch(e) {} }, 300);
            }
        };
        
        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech') return; // Expected, don't crash
            console.warn("STT Error:", event.error);
        };
        
        recognition.onresult = (event: any) => {
            if (agentStateRef.current === "ANALYZING_FRAME" || agentStateRef.current === "SPEAKING") return;
            
            resetSilenceTimer();
            
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
            }
            
            if (finalTranscript.trim().length > 1) {
                triggerIntelligencePulse(finalTranscript.trim(), false);
            }
        };
        
        recognitionRef.current = recognition;
    }, [triggerIntelligencePulse]);

    // Proactive Silence Management
    const resetSilenceTimer = useCallback(() => {
        if (silenceTimer.current) clearTimeout(silenceTimer.current);
        silenceTimer.current = setTimeout(() => {
            if (agentStateRef.current === "IDLE" || agentStateRef.current === "LISTENING") {
                triggerIntelligencePulse("", true);
            }
        }, 15000);
    }, [triggerIntelligencePulse]);

    useEffect(() => { resetSilenceTimer(); }, [resetSilenceTimer]);

    // Initialize speech once
    useEffect(() => {
        setupSpeech();
    }, [setupSpeech]);

    // React to language or mute changes
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language.includes("Arabic") ? "ar-MA" : language.includes("French") ? "fr-FR" : "en-US";
        }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }, [language]);

    useEffect(() => {
        if (!micMuted && recognitionRef.current && agentStateRef.current === "IDLE") {
            try { recognitionRef.current.start(); } catch(e) {}
        }
        if (micMuted && recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e) {}
        }
    }, [micMuted]);

    // ─── UI: Show last active soul layer ───────────────────────────
    const lastTopic = memory.lastTopics?.[0] || null;

    // Live Camera Sync
    useEffect(() => {
        const startCamera = async () => {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
                setStream(newStream);
                if (videoRef.current) videoRef.current.srcObject = newStream;
            } catch (err) { console.error("Camera error:", err); }
        };

        startCamera();
        
        return () => { 
            if (stream) stream.getTracks().forEach(track => track.stop());
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            if (recognitionRef.current) try { recognitionRef.current.stop(); } catch(e) {}
            if (silenceTimer.current) clearTimeout(silenceTimer.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode]);

    // FIX 1+5: Startup greeting in Arabic only AFTER camera is ready, no blocking SPEAKING state during mic init
    useEffect(() => {
        if (stream) {
            setTimeout(() => {
                // Only greet if mic is already set up and idle
                if (agentStateRef.current === "IDLE") {
                    triggerIntelligencePulse("", true); // Initial proactive analysis
                }
            }, 2000); // Give camera 2 seconds to properly initialize
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream]);

    const handleSwitchCamera = () => {
        setFacingMode(prev => prev === "environment" ? "user" : "environment");
    };

    const handleEndCall = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(e) {} }
        onClose();
    };

    const toggleLanguage = () => {
        setLanguage(prev => {
            if (prev === "English") return "French";
            if (prev === "French") return "Arabic (Moroccan Darija mixing MSA)";
            return "English";
        });
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#000] relative overflow-hidden font-sans">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-1000 ${agentState === "ANALYZING_FRAME" ? "opacity-60 blur-sm" : "opacity-100"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 z-0 pointer-events-none"></div>

            {/* Header */}
            <div className="absolute top-10 left-6 z-10 flex flex-col gap-1 drop-shadow-2xl pointer-events-none">
                <h1 className="text-white text-3xl font-extrabold tracking-wide uppercase font-serif italic">محمد أمين</h1>
                <p className="text-[#0FF] text-xs font-bold tracking-[0.2em] uppercase font-mono">
                    المهندس السيادي · MoroVerse
                </p>
                {memory.conversationCount > 0 && (
                    <div className="mt-1 text-white/50 text-[9px] font-mono">
                        {memory.conversationCount} تحليل · {lastTopic || 'الوجدان نشط'}
                    </div>
                )}
                {memory.hasSeenWorkspace && (
                    <div className="mt-1 text-yellow-400 text-[9px] uppercase tracking-widest font-bold bg-black/50 px-2 py-1 rounded inline-block backdrop-blur-md border border-yellow-400/30">
                        غرفة العمليات المقدسة · مُعرَّفة
                    </div>
                )}
            </div>

            {/* Wijdan Soul Orb */}
            <div className={`absolute top-10 right-6 w-20 h-20 md:w-28 md:h-28 rounded-full border z-10 transition-all duration-700 pointer-events-none flex items-center justify-center
                ${agentState === "IDLE" ? 'border-white/20 bg-black/40 scale-100' : ''}
                ${agentState === "LISTENING" ? 'border-[#FAFF00] shadow-[0_0_40px_#FAFF00] bg-black/60 scale-110' : ''}
                ${agentState === "ANALYZING_FRAME" ? 'border-[#0FF] shadow-[0_0_80px_#0FF] bg-[#0FF]/10 scale-125 animate-pulse' : ''}
                ${agentState === "SPEAKING" ? 'border-[#FF00AA] shadow-[0_0_60px_#FF00AA] bg-black/80 scale-110' : ''}
            `}>
                {agentState === "IDLE" && <BrainCircuit className="w-8 h-8 text-white/40 animate-pulse" />}
                {agentState === "LISTENING" && <Mic className="w-8 h-8 text-[#FAFF00] animate-bounce" />}
                {agentState === "ANALYZING_FRAME" && <Loader2 className="w-10 h-10 text-[#0FF] animate-spin" />}
                {agentState === "SPEAKING" && <Sparkles className="w-10 h-10 text-[#FF00AA] animate-ping" />}
            </div>

            {/* Status Label */}
            <div className="absolute top-[8.5rem] right-6 z-10 flex justify-end">
                <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-md border transition-colors
                    ${agentState === "IDLE" ? 'text-white/40 border-white/10 bg-black/20' : ''}
                    ${agentState === "LISTENING" ? 'text-yellow-400 border-yellow-400/30 bg-black/60' : ''}
                    ${agentState === "ANALYZING_FRAME" ? 'text-[#0FF] border-[#0FF]/50 bg-[#0FF]/10' : ''}
                    ${agentState === "SPEAKING" ? 'text-[#FF00AA] border-[#FF00AA]/50 bg-black/80' : ''}
                `}>
                    {agentState === "IDLE" ? "في انتظارك" : 
                     agentState === "LISTENING" ? "يسمعك..." : 
                     agentState === "ANALYZING_FRAME" ? "يحلل المشهد..." : "يتكلم..."}
                </span>
            </div>

            {/* Speaking Waveform */}
            {agentState === "SPEAKING" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-end gap-1.5 h-16 pointer-events-none">
                    {[30, 80, 60, 100, 40].map((h, i) => (
                        <span key={i} className="w-3 bg-[#FF00AA] rounded-full animate-bounce shadow-[0_0_20px_#FF00AA]" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 md:gap-8 z-20">
                <button 
                    onClick={toggleLanguage}
                    className="p-4 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all border border-white/20 relative"
                >
                    <Globe2 className="w-6 h-6 text-[#0FF]" />
                    <span className="absolute -top-7 text-[10px] font-bold uppercase tracking-widest text-[#0FF] bg-black/90 px-3 py-1 rounded-full border border-white/10">
                        {language.includes("Arabic") ? "عربية" : language.includes("French") ? "FR" : "EN"}
                    </span>
                </button>

                <button 
                    onClick={() => setMicMuted(!micMuted)}
                    className={`p-5 rounded-full backdrop-blur-sm transition-all border 
                        ${micMuted ? 'bg-red-500/80 border-red-500' : 'bg-black/60 border-white/20 hover:bg-black/80'} 
                        ${agentState === "LISTENING" && !micMuted ? 'shadow-[0_0_30px_#FAFF00] scale-110 border-yellow-400' : ''}
                    `}
                >
                    {micMuted ? <MicOff className="w-7 h-7 text-white" /> : <Mic className={`w-7 h-7 ${agentState === "LISTENING" ? 'text-yellow-400' : 'text-white'}`} />}
                </button>

                <button 
                    onClick={handleEndCall}
                    className="p-6 md:p-7 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-[0_0_40px_rgba(220,38,38,0.7)] transition-all hover:scale-110"
                >
                    <PhoneOff className="w-8 h-8" />
                </button>

                <button onClick={handleSwitchCamera} className="p-4 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-all border border-white/10">
                    <SwitchCamera className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
