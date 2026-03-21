"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SwitchCamera, PhoneOff, Mic, MicOff, Globe2, Loader2, Sparkles, BrainCircuit } from 'lucide-react';

type SupportedLanguage = "English" | "French" | "Arabic (Moroccan Darija mixing MSA)";
type AgentState = "IDLE" | "LISTENING" | "ANALYZING_FRAME" | "SPEAKING";

// ── Mirrored from MoroVerseAssistant: the reliable TTS function ──────────────
function speakText(text: string, lang: string, onEnd: () => void) {
    if (typeof window === 'undefined' || !window.speechSynthesis) { onEnd(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92;
    utterance.pitch = 0.9;

    const trySpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const bcp47Base = lang.split('-')[0];
        const voice = voices.find(v => v.lang.startsWith(bcp47Base) && (v.name.includes('Tarik') || v.name.includes('Google') || v.name.includes('Male')))
                   || voices.find(v => v.lang.startsWith(bcp47Base))
                   || voices[0];
        if (voice) utterance.voice = voice;
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
        window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = trySpeak;
    } else {
        trySpeak();
    }
}

export default function MohamedAmine_Official_Guide({ onClose }: { onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

    const [agentState, setAgentState] = useState<AgentState>("IDLE");
    const [language, setLanguage] = useState<SupportedLanguage>("Arabic (Moroccan Darija mixing MSA)");
    const [memory, setMemory] = useState<{ hasSeenWorkspace: boolean; conversationCount: number; lastTopics: string[] }>(
        { hasSeenWorkspace: false, conversationCount: 0, lastTopics: [] }
    );
    const [statusText, setStatusText] = useState("اضغط المايك للكلام");

    // ── Refs to mirror MoroVerseAssistant's reliable pattern ─────────────────
    const recognitionRef = useRef<any>(null);
    const previousNarrative = useRef<string>("");
    const languageRef = useRef(language);
    const memoryRef = useRef(memory);
    const agentStateRef = useRef(agentState);
    // Mobile safety net (mirrored from MoroVerseAssistant)
    const pendingTranscriptRef = useRef<string>('');
    const submittedRef = useRef<boolean>(false);
    // Stable ref so voice onresult always calls the latest analyzeAndSpeak
    const analyzeAndSpeakRef = useRef<(speech: string) => void>(() => {});

    useEffect(() => { languageRef.current = language; }, [language]);
    useEffect(() => { memoryRef.current = memory; }, [memory]);
    useEffect(() => { agentStateRef.current = agentState; }, [agentState]);

    // Memory init (backward-compatible)
    useEffect(() => {
        try {
            const stored = localStorage.getItem("moroVerseWorkspaceMemory");
            if (stored) {
                const parsed = JSON.parse(stored);
                setMemory({ hasSeenWorkspace: false, conversationCount: 0, lastTopics: [], ...parsed });
            }
        } catch (e) {}
    }, []);

    // ── Core function: capture frame + send to API + speak ──────────────────
    const analyzeAndSpeak = useCallback(async (userSpeech: string) => {
        if (!videoRef.current || !canvasRef.current) return;
        if (agentStateRef.current === "ANALYZING_FRAME" || agentStateRef.current === "SPEAKING") return;

        setAgentState("ANALYZING_FRAME");
        setStatusText("يحلل المشهد...");

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("No canvas context");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64Image = canvas.toDataURL('image/jpeg', 0.85);

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
                    userSpeech,
                    isProactive: !userSpeech
                })
            });

            const data = await res.json();
            if (!res.ok || !data.result) throw new Error(data.error || "Empty response");

            previousNarrative.current = data.result;

            // Progressive memory update
            const result = data.result.toLowerCase();
            const isWorkspace = ['مكتب','حاسوب','بيسي','لابتوب','workspace','laptop','computer'].some(w => result.includes(w));
            let activeTopic = '';
            if (['أطلس','صحراء','طنجة'].some(w => result.includes(w))) activeTopic = 'جغرافيا الروح';
            else if (['قرويين','موحد','مرينيين','فاس','مراكش'].some(w => result.includes(w))) activeTopic = 'العمق التاريخي';
            else if (['زليج','قفطان','طاجن','كسكس'].some(w => result.includes(w))) activeTopic = 'الوجدان الثقافي';
            else if (['موروڤيرس','2030','سيادة','نور'].some(w => result.includes(w))) activeTopic = 'MoroVerse 2030';

            const newMem = {
                ...currentMemory,
                hasSeenWorkspace: currentMemory.hasSeenWorkspace || isWorkspace,
                conversationCount: (currentMemory.conversationCount || 0) + 1,
                lastTopics: activeTopic ? [activeTopic, ...(currentMemory.lastTopics || [])].slice(0, 3) : currentMemory.lastTopics || []
            };
            setMemory(newMem);
            localStorage.setItem("moroVerseWorkspaceMemory", JSON.stringify(newMem));

            setAgentState("SPEAKING");
            setStatusText("يتكلم...");

            const bcp47 = currentLang.includes("Arabic") ? 'ar-SA' : currentLang.includes("French") ? 'fr-FR' : 'en-US';
            speakText(data.result, bcp47, () => {
                setAgentState("IDLE");
                setStatusText("اضغط المايك للكلام");
            });

        } catch (err) {
            console.error("Vision Error:", err);
            setAgentState("IDLE");
            setStatusText("حدث خطأ، حاول مرة أخرى");
        }
    }, []);

    // Keep ref in sync (mirrored from MoroVerseAssistant pattern)
    useEffect(() => {
        analyzeAndSpeakRef.current = analyzeAndSpeak;
    }, [analyzeAndSpeak]);

    // ── Voice Input: Mirrored exactly from MoroVerseAssistant ───────────────
    const [isListening, setIsListening] = useState(false);

    const startListening = useCallback(async () => {
        if (agentStateRef.current === "ANALYZING_FRAME" || agentStateRef.current === "SPEAKING") return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setStatusText("المتصفح لا يدعم الصوت — استخدم Chrome");
            return;
        }

        // Reset submission state (mirrored from MoroVerseAssistant)
        pendingTranscriptRef.current = '';
        submittedRef.current = false;

        const currentLang = languageRef.current;
        const recognition = new SpeechRecognition();
        recognition.lang = currentLang.includes("Arabic") ? 'ar-MA' : currentLang.includes("French") ? 'fr-FR' : 'en-US';
        recognition.continuous = false; // KEY FIX: false = reliable on mobile (mirrored from MoroVerseAssistant)
        recognition.interimResults = false; // Final results only = more reliable
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = result[0].transcript.trim();
                if (transcript) pendingTranscriptRef.current = transcript;

                if (result.isFinal && transcript && !submittedRef.current) {
                    submittedRef.current = true;
                    setIsListening(false);
                    setStatusText("سمعتك، كنحلل...");
                    analyzeAndSpeakRef.current(transcript);
                }
            }
        };

        // Mobile safety net: submit pending transcript if onresult didn't fire (mirrored from MoroVerseAssistant)
        recognition.onend = () => {
            setIsListening(false);
            if (pendingTranscriptRef.current && !submittedRef.current) {
                submittedRef.current = true;
                setStatusText("سمعتك، كنحلل...");
                analyzeAndSpeakRef.current(pendingTranscriptRef.current);
            } else if (!submittedRef.current) {
                setStatusText("ما سمعتش — ضغط مرة أخرى");
                setTimeout(() => setStatusText("اضغط المايك للكلام"), 2000);
            }
        };

        recognition.onerror = (event: any) => {
            setIsListening(false);
            if (event.error === 'no-speech') {
                setStatusText("ما سمعتش — ضغط مرة أخرى");
            } else if (event.error === 'not-allowed') {
                setStatusText("المايك محظور — السمح في الإعدادات");
            } else {
                setStatusText(`خطأ: ${event.error}`);
            }
            setTimeout(() => {
                if (agentStateRef.current === "IDLE") setStatusText("اضغط المايك للكلام");
            }, 3000);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
        setAgentState("LISTENING");
        setStatusText("يسمعك... تكلم!");
    }, []);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
        if (agentStateRef.current === "LISTENING") {
            setAgentState("IDLE");
            setStatusText("اضغط المايك للكلام");
        }
    }, []);

    // ── Camera ───────────────────────────────────────────────────────────────
    useEffect(() => {
        let currentStream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                if (stream) stream.getTracks().forEach(t => t.stop());
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
                });
                currentStream = s;
                setStream(s);
                if (videoRef.current) videoRef.current.srcObject = s;
            } catch (err) { console.error("Camera error:", err); }
        };
        startCamera();

        return () => {
            if (currentStream) currentStream.getTracks().forEach(t => t.stop());
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode]);

    // First proactive analysis when camera is ready
    useEffect(() => {
        if (stream) {
            setTimeout(() => {
                if (agentStateRef.current === "IDLE") {
                    analyzeAndSpeakRef.current(""); // proactive opening
                }
            }, 2500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stream]);

    const handleEndCall = () => {
        if (stream) stream.getTracks().forEach(t => t.stop());
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
        onClose();
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === "English" ? "French" : prev === "French" ? "Arabic (Moroccan Darija mixing MSA)" : "English");
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };

    const lastTopic = memory.lastTopics?.[0] || null;

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#000] relative overflow-hidden font-sans">
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Live Video */}
            <video
                ref={videoRef}
                autoPlay playsInline muted
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 ${agentState === "ANALYZING_FRAME" ? "opacity-50 blur-sm" : "opacity-100"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85 z-0 pointer-events-none" />

            {/* Header */}
            <div className="absolute top-10 left-6 z-10 flex flex-col gap-1 pointer-events-none drop-shadow-2xl">
                <h1 className="text-white text-3xl font-extrabold tracking-wide uppercase font-serif italic">محمد أمين</h1>
                <p className="text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase font-mono">المهندس السيادي · MoroVerse</p>
                {memory.conversationCount > 0 && (
                    <div className="mt-1 text-white/40 text-[9px] font-mono">
                        {memory.conversationCount} تحليل · {lastTopic || 'الوجدان نشط'}
                    </div>
                )}
                {memory.hasSeenWorkspace && (
                    <div className="mt-1 text-[#C5A059] text-[9px] uppercase tracking-widest font-bold bg-black/50 px-2 py-1 rounded inline-block border border-[#C5A059]/30">
                        غرفة العمليات المقدسة · مُعرَّفة
                    </div>
                )}
            </div>

            {/* Wijdan Soul Orb */}
            <div className={`absolute top-10 right-6 w-20 h-20 md:w-28 md:h-28 rounded-full border z-10 transition-all duration-500 pointer-events-none flex items-center justify-center
                ${agentState === "IDLE" ? 'border-white/20 bg-black/40' : ''}
                ${agentState === "LISTENING" ? 'border-[#FAFF00] shadow-[0_0_40px_#FAFF00] bg-black/60 scale-110' : ''}
                ${agentState === "ANALYZING_FRAME" ? 'border-[#0FF] shadow-[0_0_80px_#0FF] bg-[#0FF]/10 scale-125 animate-pulse' : ''}
                ${agentState === "SPEAKING" ? 'border-[#C5A059] shadow-[0_0_60px_#C5A059] bg-black/80 scale-110' : ''}
            `}>
                {agentState === "IDLE" && <BrainCircuit className="w-8 h-8 text-white/30 animate-pulse" />}
                {agentState === "LISTENING" && <Mic className="w-8 h-8 text-[#FAFF00] animate-bounce" />}
                {agentState === "ANALYZING_FRAME" && <Loader2 className="w-10 h-10 text-[#0FF] animate-spin" />}
                {agentState === "SPEAKING" && <Sparkles className="w-10 h-10 text-[#C5A059] animate-ping" />}
            </div>

            {/* Status Badge */}
            <div className="absolute top-[8.5rem] right-6 z-10">
                <span className={`text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-md border transition-colors
                    ${agentState === "IDLE" ? 'text-white/30 border-white/10 bg-black/20' : ''}
                    ${agentState === "LISTENING" ? 'text-yellow-400 border-yellow-400/30 bg-black/60' : ''}
                    ${agentState === "ANALYZING_FRAME" ? 'text-[#0FF] border-[#0FF]/50 bg-[#0FF]/10' : ''}
                    ${agentState === "SPEAKING" ? 'text-[#C5A059] border-[#C5A059]/50 bg-black/80' : ''}
                `}>
                    {statusText}
                </span>
            </div>

            {/* Speaking Waveform */}
            {agentState === "SPEAKING" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-end gap-1.5 h-16 pointer-events-none">
                    {[30, 80, 60, 100, 40, 70, 50].map((h, i) => (
                        <span key={i} className="w-2.5 bg-[#C5A059] rounded-full animate-bounce shadow-[0_0_15px_#C5A059]"
                            style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 md:gap-8 z-20">

                {/* Language */}
                <button onClick={toggleLanguage}
                    className="p-4 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-md border border-white/20 relative transition-all">
                    <Globe2 className="w-6 h-6 text-[#0FF]" />
                    <span className="absolute -top-7 text-[10px] font-bold uppercase tracking-widest text-[#0FF] bg-black/90 px-3 py-1 rounded-full border border-white/10">
                        {language.includes("Arabic") ? "عربية" : language.includes("French") ? "FR" : "EN"}
                    </span>
                </button>

                {/* Push-to-Talk — Mirrored from MoroVerseAssistant */}
                <button
                    onPointerDown={startListening}
                    onPointerUp={isListening ? stopListening : undefined}
                    disabled={agentState === "ANALYZING_FRAME" || agentState === "SPEAKING"}
                    className={`p-6 rounded-full transition-all border-2 select-none touch-none
                        ${agentState === "ANALYZING_FRAME" || agentState === "SPEAKING"
                            ? 'opacity-40 cursor-not-allowed bg-gray-800 border-gray-600'
                            : isListening
                                ? 'bg-red-600 border-red-400 scale-125 shadow-[0_0_40px_rgba(220,38,38,0.9)] animate-pulse'
                                : 'bg-[#C5A059] border-[#D4AF37] shadow-[0_0_30px_rgba(197,160,89,0.6)] hover:scale-110 hover:shadow-[0_0_50px_rgba(197,160,89,0.9)]'
                        }`}
                    title="اضغط للكلام"
                >
                    {isListening
                        ? <MicOff className="w-8 h-8 text-white" />
                        : <Mic className="w-8 h-8 text-black" />
                    }
                </button>

                {/* End Call */}
                <button onClick={handleEndCall}
                    className="p-5 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all hover:scale-110">
                    <PhoneOff className="w-7 h-7" />
                </button>

                {/* Switch Camera */}
                <button onClick={() => setFacingMode(p => p === "environment" ? "user" : "environment")}
                    className="p-4 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md border border-white/10 transition-all">
                    <SwitchCamera className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
