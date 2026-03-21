"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Mic, MicOff, Send, X, Loader2, Camera, CameraOff } from 'lucide-react';

type Emotion = 'neutral' | 'happy' | 'concerned' | 'impressed' | 'listening' | 'thinking';
type HistoryEntry = { role: 'user' | 'model'; text: string };

// Utility: Speak text aloud using Web Speech API
function speakText(text: string, lang: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    // Prefer Arabic voice, then French, then any available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => lang === 'ar' ? v.lang.startsWith('ar') : lang === 'fr' ? v.lang.startsWith('fr') : v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
}

export default function MoroVerseAssistant() {
    const { lang, t } = useLanguage();
    const [message, setMessage] = useState<string>("");
    const [emotion, setEmotion] = useState<Emotion>('happy');
    const [isHovered, setIsHovered] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isSendingVoice, setIsSendingVoice] = useState(false); // Visual 'Sending...' state for mobile
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<any>(null);
    // Stable ref so voice onresult always calls the latest sendToConcierge (fixes stale closure bug)
    const sendToConciergeRef = useRef<(msg: string, isVoice?: boolean) => void>(() => { });
    // Mobile safety net: stores last transcript so onend can submit if onresult didn't
    const pendingTranscriptRef = useRef<string>('');
    const submittedRef = useRef<boolean>(false); // Prevents double-submit
    const containerControls = useAnimation();

    // ── Google Lens Camera Mode ──────────────────────────────────────────────
    const [cameraMode, setCameraMode] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isVisionAnalyzing, setIsVisionAnalyzing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const lensIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isVisionAnalyzingRef = useRef(false);
    useEffect(() => { isVisionAnalyzingRef.current = isVisionAnalyzing; }, [isVisionAnalyzing]);
    // Stable ref so lens interval always has latest submitWithVision
    const submitWithVisionRef = useRef<(speech: string) => void>(() => {});
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const eyeX = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-3, 3]);
    const eyeY = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [-3, 3]);
    const headRotateX = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [-10, 10]);
    const headRotateY = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-15, 15]);

    // Set welcome message
    useEffect(() => {
        if (!message) setMessage(t('assistant.welcome'));
    }, [lang, t]);

    // Auto-hide initial bubble
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!showChat) {
                setShowBubble(false);
                setEmotion('neutral');
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    // Listen for moroverse-action events (city/landmark clicks from map)
    useEffect(() => {
        const handleAction = (e: Event) => {
            const { type, payload } = (e as CustomEvent).detail;
            setShowBubble(true);
            switch (type) {
                case 'city_click':
                    setEmotion('happy');
                    setMessage(t('assistant.cityClick')(payload));
                    break;
                case 'landmark_click':
                    setEmotion('impressed');
                    setMessage(t('assistant.landmarkClick')(payload));
                    break;
                case 'figure_click':
                    setEmotion('impressed');
                    setMessage(t('assistant.figureClick')(payload));
                    break;
            }
            setTimeout(() => { setShowBubble(false); setEmotion('neutral'); }, 6000);
        };

        const handle3DViewActive = (e: Event) => {
            const { locationName } = (e as CustomEvent).detail;
            setShowBubble(true);
            setEmotion('impressed');
            
            // Contextual AI message for 3D View
            const msg = lang === 'ar' 
                ? `أنت الآن في وضع العرض الثلاثي الأبعاد النخبوي لـ ${locationName}. يمكنك تدوير المجسم وتكبيره لاستكشاف أدق التفاصيل المعمارية.`
                : `You have entered the Elite 3D Stage for ${locationName}. You can rotate and zoom to explore its architectural details.`;
            
            setMessage(msg);
            // Optionally, we could also send a hidden prompt to the concierge to prime its context here
            // sendToConcierge(`The user is now looking at a 3D model of ${locationName}. Acknowledge this briefly.`, false);
        };

        const handle3DViewClosed = () => {
            setShowBubble(true);
            setEmotion('happy');
            setMessage(lang === 'ar' ? 'تم الخروج من وضع العرض الثلاثي الأبعاد.' : 'Exited 3D view. How else can I help?');
            setTimeout(() => { setShowBubble(false); setEmotion('neutral'); }, 4000);
        };

        window.addEventListener('moroverse-action', handleAction);
        window.addEventListener('moroverse-3d-view-active', handle3DViewActive);
        window.addEventListener('moroverse-3d-view-closed', handle3DViewClosed);
        
        return () => {
            window.removeEventListener('moroverse-action', handleAction);
            window.removeEventListener('moroverse-3d-view-active', handle3DViewActive);
            window.removeEventListener('moroverse-3d-view-closed', handle3DViewClosed);
        };
    }, [lang, t]);

    // Scroll speed emotion detector
    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const delta = Math.abs(window.scrollY - lastY);
            if (delta > 150) {
                setEmotion('concerned');
                setShowBubble(true);
                setMessage(t('assistant.slowDown'));
                setTimeout(() => { setShowBubble(false); setEmotion('neutral'); }, 4000);
            }
            lastY = window.scrollY;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Pointer tracking
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const isNear = e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50 && e.clientY >= rect.top - 50 && e.clientY <= rect.bottom + 50;
            containerRef.current.style.pointerEvents = 'none';
            const under = document.elementFromPoint(e.clientX, e.clientY);
            containerRef.current.style.pointerEvents = 'auto';
            const clickable = under?.tagName === 'BUTTON' || under?.tagName === 'A' || under?.closest('button') || under?.closest('a') || under?.closest('.cursor-pointer');
            setIsHovered(!!(isNear && clickable));
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, [mouseX, mouseY]);

    // =========================================================
    // GOOGLE LENS: capture current frame as base64
    // =========================================================
    const captureFrame = useCallback((): string | null => {
        if (!videoRef.current || !canvasRef.current) return null;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
    }, []);

    // =========================================================
    // GOOGLE LENS: Submit voice + camera frame → /api/vision
    // =========================================================
    const submitWithVision = useCallback(async (userMessage: string) => {
        const frame = captureFrame();
        if (!frame) return; // No frame, skip
        console.log('LENS_DEBUG: Submitting vision call, userMessage:', userMessage || '(proactive)');
        setIsVisionAnalyzing(true);
        setEmotion('thinking');
        const userEntry: HistoryEntry = { role: 'user', text: userMessage || '🔍 [Visual Analysis]' };
        const newHistory = [...history, userEntry];
        if (userMessage) setHistory(newHistory);

        try {
            const res = await fetch('/api/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: frame,
                    language: lang === 'ar' ? 'Arabic (Moroccan Darija mixing MSA)' : lang === 'fr' ? 'French' : 'English',
                    contextMemory: { hasSeenWorkspace: false, conversationCount: history.length, lastTopics: [] },
                    previousNarrative: history.filter(h => h.role === 'model').slice(-1)[0]?.text || '',
                    userSpeech: userMessage,
                    isProactive: !userMessage
                })
            });
            const data = await res.json();
            if (!res.ok || !data.result) throw new Error(data.error || 'Vision API error');

            const aiText: string = data.result;
            if (userMessage) setHistory([...newHistory, { role: 'model', text: aiText }]);
            setMessage(aiText);
            setEmotion('impressed');
            setShowBubble(true);
            speakText(aiText, lang);
            setTimeout(() => { if (!showChat) { setShowBubble(false); setEmotion('neutral'); } }, 15000);
        } catch (err: any) {
            console.error('LENS_ERROR:', err);
            setMessage(lang === 'ar' ? 'ما قدرتش نشوف مزيان — جرب مرة أخرى.' : 'Could not analyze the image. Try again.');
            setEmotion('concerned');
            setShowBubble(true);
        } finally {
            setIsVisionAnalyzing(false);
        }
    }, [captureFrame, history, lang, showChat]);

    // Keep stable ref
    useEffect(() => { submitWithVisionRef.current = submitWithVision; }, [submitWithVision]);

    // =========================================================
    // GOOGLE LENS: Toggle camera on/off
    // =========================================================
    const toggleCamera = useCallback(async () => {
        if (cameraMode) {
            // Turn off
            if (lensIntervalRef.current) clearInterval(lensIntervalRef.current);
            if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
            setCameraStream(null);
            setCameraMode(false);
            setMessage(lang === 'ar' ? 'أُغلقت الكاميرا.' : 'Camera closed.');
            setShowBubble(true);
            setTimeout(() => { setShowBubble(false); setEmotion('neutral'); }, 3000);
        } else {
            // Turn on
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1280 } }
                });
                setCameraStream(stream);
                setCameraMode(true);
                if (videoRef.current) videoRef.current.srcObject = stream;
                setEmotion('impressed');
                setMessage(lang === 'ar' ? '👁️ العين السيادية مفتوحة — كنشوف معك!' : '👁️ Sovereign eye is open!');
                setShowBubble(true);

                // Google Lens Proactive Loop: analyze every 12 seconds silently
                if (lensIntervalRef.current) clearInterval(lensIntervalRef.current);
                lensIntervalRef.current = setInterval(() => {
                    if (!isVisionAnalyzingRef.current) {
                        submitWithVisionRef.current(''); // Proactive, no speech
                    }
                }, 12000);
            } catch (err) {
                console.error('CAMERA_ERROR:', err);
                setMessage(lang === 'ar' ? 'تم رفض إذن الكاميرا.' : 'Camera permission denied.');
                setEmotion('concerned');
                setShowBubble(true);
            }
        }
    }, [cameraMode, cameraStream, lang]);

    // Sync video element when stream changes
    useEffect(() => {
        if (cameraStream && videoRef.current) videoRef.current.srcObject = cameraStream;
    }, [cameraStream]);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (lensIntervalRef.current) clearInterval(lensIntervalRef.current);
            if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =========================================================
    // AI CONCIERGE — Send message to /api/concierge
    // =========================================================
    const sendToConcierge = useCallback(async (userMessage: string, isVoice = false) => {
        if (!userMessage.trim()) {
            console.warn('VOICE_DEBUG: sendToConcierge called with empty message — ignoring.');
            return;
        }
        console.log(`CONCIERGE_UI_DEBUG: [${isVoice ? 'VOICE' : 'TEXT'}] Sending:`, userMessage);
        setIsThinking(true);
        setEmotion('thinking');
        setInputText('');

        const userEntry: HistoryEntry = { role: 'user', text: userMessage };
        const newHistory = [...history, userEntry];
        setHistory(newHistory);
        console.log("CONCIERGE_UI_DEBUG: History updated locally.");

        try {
            console.log("CONCIERGE_UI_DEBUG: Starting fetch /api/concierge...");
            const res = await fetch('/api/concierge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, history, isVoice })
            });

            console.log("CONCIERGE_UI_DEBUG: Response status:", res.status);
            const data = await res.json();
            console.log("CONCIERGE_UI_DEBUG: Response data received:", data);

            if (!res.ok) {
                const errorText = data.error || "AI Service Error";
                console.error("CONCIERGE_UI_DEBUG: Server returned error:", errorText);
                throw new Error(errorText);
            }

            const aiText: string = data.text;
            if (!aiText) {
                console.error("CONCIERGE_UI_DEBUG: data.text is null or undefined.");
                throw new Error("Empty response from AI");
            }

            const cities: string[] = data.cities ?? [];

            setHistory([...newHistory, { role: 'model', text: aiText }]);
            setMessage(aiText);
            setEmotion('happy');
            setShowBubble(true);

            // Speak the response
            speakText(aiText, lang);

            // Dispatch map sync event with detected cities
            if (cities.length > 0 || data.dynamicLocation) {
                console.log("CONCIERGE_UI_DEBUG: Triggering map sync for cities:", cities, "Is itinerary:", data.isItinerary, "Dynamic:", data.dynamicLocation);
                window.dispatchEvent(new CustomEvent('concierge-map-command', {
                    detail: { cities, primaryCity: cities[0], isItinerary: data.isItinerary, dynamicLocation: data.dynamicLocation }
                }));
            }

            setTimeout(() => { if (!showChat) { setShowBubble(false); setEmotion('neutral'); } }, 12000);
        } catch (err: any) {
            console.error("CONCIERGE_UI_CRITICAL_ERROR:", err);
            const errorMsg = lang === 'ar'
                ? `خطأ: ${err.message || 'فشل الاتصال بمحمد أمين'}`
                : `Error: ${err.message || 'Failed to connect to Mohamed Amine'}`;

            setHistory([...newHistory, { role: 'model', text: errorMsg }]);
            setMessage(errorMsg);
            setEmotion('concerned');
            setShowBubble(true);
        } finally {
            setIsThinking(false);
            console.log("CONCIERGE_UI_DEBUG: Thinking state finished.");
        }
    }, [history, lang, showChat]);

    // Keep the ref in sync so voice handler always has the latest version
    useEffect(() => {
        sendToConciergeRef.current = sendToConcierge;
    }, [sendToConcierge]);

    // =========================================================
    // VOICE INPUT — Mobile-first Web Speech API
    // =========================================================
    const startListening = useCallback(async () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            const msg = lang === 'ar'
                ? 'متصفحك لا يدعم الأوامر الصوتية. استخدم Chrome أو Safari.'
                : lang === 'fr'
                    ? "Votre navigateur ne supporte pas la commande vocale. Utilisez Chrome."
                    : "Your browser doesn't support voice commands. Please use Chrome or Safari.";
            setMessage(msg);
            setShowBubble(true);
            return;
        }

        // On mobile Safari, calling getUserMedia before SpeechRecognition can block it.
        // Only do explicit permission check on desktop (non-touch) devices.
        const isTouchDevice = navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
            } catch (permErr) {
                const msg = lang === 'ar'
                    ? 'تم رفض إذن الميكروفون. يرجى السماح بالوصول إليه في إعدادات المتصفح.'
                    : lang === 'fr'
                        ? "Permission micro refusée. Autorisez l'accès dans les paramètres du navigateur."
                        : "Microphone access denied. Please allow it in your browser settings.";
                setMessage(msg);
                setEmotion('concerned');
                setShowBubble(true);
                return;
            }
        }

        // Reset submission state for this session
        pendingTranscriptRef.current = '';
        submittedRef.current = false;

        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'ar' ? 'ar-MA' : lang === 'fr' ? 'fr-FR' : 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false; // false = only final results, more reliable on mobile
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            // Iterate all result sets (mobile sometimes batches them)
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcript = result[0].transcript.trim();
                console.log(`VOICE_DEBUG: result[${i}] isFinal=${result.isFinal} transcript=${JSON.stringify(transcript)}`);

                // Always store the latest non-empty transcript as the pending one
                if (transcript) {
                    pendingTranscriptRef.current = transcript;
                    setInputText(transcript);
                }

                // Submit immediately on final result
                // KEY: if camera is open → route to vision API (Google Lens mode)
                if (result.isFinal && transcript && !submittedRef.current) {
                    submittedRef.current = true;
                    setIsSendingVoice(true);
                    console.log('VOICE_DEBUG: Submitting transcript:', JSON.stringify(transcript), 'cameraMode:', cameraMode);
                    if (cameraMode) {
                        submitWithVisionRef.current(transcript);
                    } else {
                        sendToConciergeRef.current(transcript, true);
                    }
                    setTimeout(() => setIsSendingVoice(false), 3000);
                }
            }
        };

        recognition.onerror = (event: any) => {
            setIsListening(false);
            setIsSendingVoice(false);
            setEmotion('concerned');
            console.error('VOICE_DEBUG: onerror fired:', event.error);
            let errMsg = lang === 'ar'
                ? `خطأ في التعرف على الصوت: ${event.error}`
                : lang === 'fr'
                    ? `Erreur vocale: ${event.error}`
                    : `Voice error: ${event.error}`;

            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                errMsg = lang === 'ar'
                    ? '🎙️ تم حجب الميكروفون. اسمح بالوصول في إعدادات المتصفح.'
                    : lang === 'fr'
                        ? "🎙️ Micro bloqué. Autorisez l'accès dans les paramètres."
                        : "🎙️ Microphone blocked. Allow access in browser Settings > Site Settings.";
            } else if (event.error === 'no-speech') {
                errMsg = lang === 'ar' ? '🎙️ لم أسمع شيئاً، حاول مرة أخرى.' : lang === 'fr' ? "🎙️ Aucun son. Réessayez." : "🎙️ No speech detected. Tap mic and try again.";
            } else if (event.error === 'network') {
                errMsg = lang === 'ar' ? '🌐 مشكلة في الشبكة.' : lang === 'fr' ? "🌐 Erreur réseau." : "🌐 Network error. Check your connection.";
            }

            setMessage(errMsg);
            setShowBubble(true);
        };

        // onend safety net (mirrored from MoroVerseAssistant proven pattern)
        recognition.onend = () => {
            setIsListening(false);
            console.log(`VOICE_DEBUG: onend fired. pending="${pendingTranscriptRef.current}" submitted=${submittedRef.current}`);
            if (pendingTranscriptRef.current && !submittedRef.current) {
                const transcript = pendingTranscriptRef.current;
                submittedRef.current = true;
                setIsSendingVoice(true);
                console.log('VOICE_DEBUG: onend fallback. cameraMode:', cameraMode, 'transcript:', JSON.stringify(transcript));
                if (cameraMode) {
                    submitWithVisionRef.current(transcript);
                } else {
                    sendToConciergeRef.current(transcript, true);
                }
                setTimeout(() => setIsSendingVoice(false), 3000);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsListening(true);
        setEmotion('listening');
        setShowBubble(true);
        setMessage(lang === 'ar' ? '🎤 أنا أسمعك... تكلم!' : lang === 'fr' ? "🎤 Je vous écoute..." : "🎤 I'm listening... speak now!");
    }, [lang]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
        setIsListening(false);
    }, []);

    const handleRobotClick = useCallback(() => {
        setShowChat(prev => !prev);
        setShowBubble(true);
        if (!showChat) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [showChat]);

    // =========================================================
    // SVG RENDERING: Emotions & Outfit
    // =========================================================
    const renderEmotionEyes = () => {
        switch (emotion) {
            case 'happy': case 'impressed':
                return (
                    <g>
                        <path d="M 35 48 Q 40 43 45 48" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                        <path d="M 55 48 Q 60 43 65 48" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </g>
                );
            case 'concerned':
                return (
                    <g>
                        <circle cx="40" cy="46" r="3" fill="#1e293b" />
                        <circle cx="60" cy="46" r="3" fill="#1e293b" />
                        <path d="M 35 38 L 45 42" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 65 38 L 55 42" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    </g>
                );
            case 'listening':
                return (
                    <g>
                        <circle cx="40" cy="46" r="4" fill="#006233" />
                        <circle cx="60" cy="46" r="4" fill="#006233" />
                        <circle cx="40" cy="46" r="2" fill="#fff" opacity={0.6} />
                        <circle cx="60" cy="46" r="2" fill="#fff" opacity={0.6} />
                    </g>
                );
            case 'thinking':
                return (
                    <g>
                        <circle cx="40" cy="46" r="3" fill="#C5A059" />
                        <circle cx="60" cy="46" r="3" fill="#C5A059" />
                        <path d="M 35 40 Q 40 36 45 40" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M 55 40 Q 60 36 65 40" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                );
            default:
                return (
                    <g>
                        <motion.circle cx="40" cy="46" r="3" fill="#1e293b" style={{ x: eyeX, y: eyeY }} />
                        <motion.circle cx="60" cy="46" r="3" fill="#1e293b" style={{ x: eyeX, y: eyeY }} />
                        <path d="M 35 40 Q 40 38 45 40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                        <path d="M 55 40 Q 60 38 65 40" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                    </g>
                );
        }
    };

    const renderMouth = () => {
        if (emotion === 'happy' || emotion === 'impressed' || emotion === 'listening')
            return <path d="M 40 65 Q 50 75 60 65" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />;
        if (emotion === 'concerned')
            return <path d="M 45 68 Q 50 65 55 68" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />;
        if (emotion === 'thinking')
            return <path d="M 42 66 Q 50 70 58 66" stroke="#C5A059" strokeWidth="2" fill="none" strokeLinecap="round" />;
        return <path d="M 45 65 L 55 65" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />;
    };

    return (
        <motion.div
            ref={containerRef}
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: isHovered ? 0.3 : 1, scale: isHovered ? 0.5 : 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed top-1.5 right-1 md:top-auto md:bottom-6 md:right-6 z-[9999] flex items-start md:items-end gap-2 md:gap-4 origin-top-right md:origin-bottom-right scale-50 md:scale-100 ${isHovered ? 'pointer-events-none' : 'pointer-events-auto cursor-grab active:cursor-grabbing'}`}
        >
            <AnimatePresence>
                {/* ===== CHAT PANEL ===== */}
                {showChat && !isHovered && (
                    <motion.div
                        key="chat-panel"
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 20 }}
                        className="bg-[#0a0a0a]/95 border border-[#C5A059]/30 rounded-3xl rounded-br-none p-4 w-[280px] md:w-[320px] mb-2 flex flex-col gap-3"
                    >
                        {/* Hidden canvas for frame capture */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#C5A059] font-bold text-sm tracking-wide">محمد أمين — المستشار الملكي</p>
                                <p className="text-white/40 text-[10px]">
                                    {cameraMode ? '👁️ وضع Google Lens · نشط' : 'Imperial Concierge · Mohamed Amine'}
                                </p>
                            </div>
                            <button onClick={() => setShowChat(false)} className="text-white/30 hover:text-white transition-colors p-1">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Google Lens Camera Preview */}
                        {cameraMode && (
                            <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-[#C5A059]/40" style={{ aspectRatio: '16/9' }}>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                                {isVisionAnalyzing && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
                                            <span className="text-[#C5A059] text-xs font-bold">
                                                {lang === 'ar' ? 'يحلل المشهد...' : 'Analyzing...'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {/* Scanning line animation */}
                                {!isVisionAnalyzing && (
                                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent animate-[scan_2s_ease-in-out_infinite] top-1/3 opacity-70" />
                                )}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-white text-[9px] font-bold uppercase tracking-wider">LIVE</span>
                                </div>
                            </div>
                        )}

                        {/* Conversation History */}
                        {history.length > 0 && (
                            <div className="max-h-40 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                                {history.slice(-6).map((h, i) => (
                                    <div key={i} className={`text-xs leading-relaxed px-3 py-2 rounded-2xl ${h.role === 'user' ? 'bg-[#C5A059]/15 text-[#C5A059] text-right ml-4' : 'bg-white/5 text-white/80 mr-4'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                                        {h.text}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Thinking / Sending Voice indicator */}
                        {(isThinking || isSendingVoice) && (
                            <div className="flex items-center gap-2 text-[#C5A059]/60 text-xs px-2">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>
                                    {isSendingVoice && !isThinking
                                        ? (lang === 'ar' ? '🎤 إرسال...' : lang === 'fr' ? '🎤 Envoi...' : '🎤 Sending...')
                                        : (lang === 'ar' ? 'محمد أمين يفكر...' : 'Mohamed Amine is thinking...')
                                    }
                                </span>
                            </div>
                        )}

                        {/* Input Row */}
                        <div className="flex gap-2 items-center">
                            {/* Mic Button */}
                            <button
                                onClick={isListening ? stopListening : startListening}
                                disabled={isSendingVoice || isVisionAnalyzing}
                                title={cameraMode ? (lang === 'ar' ? 'تكلم + الكاميرا تحلل' : 'Speak + Camera analyzes') : (lang === 'ar' ? 'تكلم' : 'Speak')}
                                className={`p-2.5 rounded-full border transition-all flex-shrink-0 ${isSendingVoice || isVisionAnalyzing
                                    ? 'bg-[#C5A059]/40 border-[#C5A059] text-white animate-pulse cursor-wait'
                                    : isListening
                                        ? 'bg-red-600 border-red-500 text-white animate-pulse'
                                        : cameraMode
                                            ? 'bg-[#C5A059] border-[#C5A059] text-black shadow-[0_0_15px_rgba(197,160,89,0.5)]'
                                            : 'bg-[#C5A059]/10 border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/20'
                                    }`}
                            >
                                {isSendingVoice || isVisionAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>

                            {/* Camera / Google Lens Button */}
                            <button
                                onClick={toggleCamera}
                                title={cameraMode ? (lang === 'ar' ? 'أغلق الكاميرا' : 'Close camera') : (lang === 'ar' ? 'فتح الكاميرا (Google Lens)' : 'Open camera (Google Lens)')}
                                className={`p-2.5 rounded-full border transition-all flex-shrink-0 ${
                                    cameraMode
                                        ? 'bg-red-600/80 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                                        : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {cameraMode ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                            </button>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && inputText.trim()) sendToConcierge(inputText); }}
                                placeholder={lang === 'ar' ? 'اسألني عن المغرب...' : lang === 'fr' ? 'Poseز votre question...' : 'Ask about Morocco...'}
                                dir={lang === 'ar' ? 'rtl' : 'ltr'}
                                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-[#C5A059]/50 transition-colors"
                                disabled={isThinking}
                            />
                            <button
                                onClick={() => inputText.trim() && sendToConcierge(inputText)}
                                disabled={!inputText.trim() || isThinking}
                                className="p-2.5 rounded-full bg-[#C5A059] text-black disabled:opacity-30 hover:bg-[#D4AF37] transition-all flex-shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ===== SPEECH BUBBLE (passive mode) ===== */}
                {showBubble && !showChat && !isHovered && (
                    <motion.div
                        key="speech-bubble"
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="assistant-bubble bg-white border-2 border-[#c5a059] p-5 rounded-3xl rounded-tr-none md:rounded-tr-3xl md:rounded-br-none max-w-[200px] md:max-w-xs mt-10 md:mt-0 md:mb-10 mr-[-10px] md:mr-[-20px]"
                    >
                        <p className={`text-sm font-bold text-black leading-relaxed ${lang === 'ar' ? 'font-arabic text-right' : 'text-left'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                            {message}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===== AVATAR — click to open/close chat ===== */}
            <motion.div
                onClick={handleRobotClick}
                className="w-28 h-28 relative rounded-full bg-slate-900 border-2 border-transparent hover:border-white/10 overflow-hidden cursor-pointer select-none"
                style={{ rotateX: headRotateX, rotateY: headRotateY, transformPerspective: 800 }}
                whileTap={{ scale: 0.92 }}
                title={lang === 'ar' ? 'انقر للتحدث مع محمد أمين' : 'Click to talk to Mohamed Amine'}
            >
                {/* Clean Indicator — No Halo */}
                {isListening && (
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 animate-pulse z-20" />
                )}
                {isThinking && (
                    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#C5A059] animate-pulse z-20" />
                )}

                <svg viewBox="0 0 100 100" className="w-full h-full transform scale-125 pt-4 drop-shadow-md">
                    {/* Djellaba */}
                    <path d="M 20 100 Q 50 65 80 100" fill="#6d4c41" />
                    {/* Face */}
                    <circle cx="50" cy="50" r="25" fill="#e0ac69" />
                    {/* Tarbouche */}
                    <path d="M 32 25 L 34 5 L 66 5 L 68 25 Z" fill="#c1272d" />
                    <path d="M 50 5 Q 55 -2 65 12 L 67 15" fill="none" stroke="#111827" strokeWidth="1.5" />
                    <circle cx="67" cy="15" r="2" fill="#111827" />
                    {/* Ears */}
                    <circle cx="28" cy="48" r="4" fill="#fbd38d" />
                    <circle cx="72" cy="48" r="4" fill="#fbd38d" />
                    {/* Mustache */}
                    <path d="M 42 62 Q 50 68 58 62 Q 50 72 42 62" fill="#3e2723" />
                    {/* Dynamic emotion eyes + mouth */}
                    {renderEmotionEyes()}
                    {renderMouth()}
                </svg>
            </motion.div>
        </motion.div>
    );
}
