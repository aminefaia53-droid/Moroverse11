"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, SwitchCamera, PhoneOff, Sparkles, Mic, Code2, AlertCircle } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export default function MohamedAmine_Flash_Guide({ onClose }: { onClose: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"environment" | "user">("environment"); // default Rear
    
    const [status, setStatus] = useState<string>("Initializing Flash Core...");
    const [transcription, setTranscription] = useState<string>("...");
    const [isThinking, setIsThinking] = useState<boolean>(false);
    
    const [devMode, setDevMode] = useState(false);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

    // Load Local TFJS Object Detection Model
    useEffect(() => {
        let isMounted = true;
        
        async function loadModel() {
            try {
                // Ensure backend is ready
                await tf.ready();
                setStatus("Loading TF.js CocoSSD locally...");
                const loadedModel = await cocoSsd.load();
                if(isMounted) {
                    setModel(loadedModel);
                    setStatus("Flash Vision Online");
                    setTranscription("I am Mohamed Amine Flash. Point the camera at any object. I see it through local computation, and understand it through the Gemini Core.");
                }
            } catch (err) {
                console.error("TFJS Load Error:", err);
                if (isMounted) setStatus("TFJS Load Error. Ensure packages are installed.");
            }
        }
        
        loadModel();
        return () => { isMounted = false; };
    }, []);

    // Camera setup
    const startCamera = useCallback(async (mode: "environment" | "user") => {
        try {
            if (stream) stream.getTracks().forEach(track => track.stop());
            const newStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: mode }
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setStatus("Camera Access Denied or Unavailable");
        }
    }, [stream]);

    useEffect(() => {
        startCamera(facingMode);
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once to prevent loops, stream handled directly

    const handleSwitchCamera = async () => {
        const newMode = facingMode === "environment" ? "user" : "environment";
        setFacingMode(newMode);
        await startCamera(newMode);
    };

    const handleEndCall = () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        onClose();
    };

    const captureAndAnalyze = async () => {
        if (!videoRef.current || !model || !canvasRef.current) return;
        setIsThinking(true);
        setStatus("TFJS Extracting Context...");

        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext('2d');
            if(!ctx) throw new Error("Canvas 2D missing");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 1. TFJS Object Detection (LOCAL FAST OPTIMIZATION)
            const predictions = await model.detect(video);
            const bestPrediction = predictions.length > 0 ? predictions[0].class : "unknown or landscape";
            
            setStatus(`Context Locked: [${bestPrediction.toUpperCase()}]. Bridging to Gemini...`);
            
            // 2. Base64 encode for API transport
            const base64Image = canvas.toDataURL('image/jpeg', 0.6); // slight compression for speed
            
            // 3. Call Gemini 2.5 Flash
            const res = await fetch('/api/vision', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64: base64Image,
                    detectedObject: bestPrediction
                })
            });
            
            const data = await res.json();
            if (res.ok) {
                setTranscription(data.result);
                setStatus("Flash Vision Online");
            } else {
                throw new Error(data.error || "Gemini API Failure");
            }
            
        } catch (error: any) {
            console.error("Analysis Error:", error);
            setStatus("Analysis Failed");
            setTranscription(`Visual processing error occurred: ${error.message}`);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#030303] relative overflow-hidden font-sans">
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className="flex-1 flex flex-col md:flex-row h-full">
                
                {/* AI Avatar Section */}
                <div className="flex-1 relative border-b md:border-b-0 md:border-r border-white/5 bg-[#050505] flex flex-col items-center justify-center">
                    
                    <div className="z-10 relative flex flex-col items-center">
                        <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full border-4 ${isThinking ? 'border-[#0FF] animate-pulse shadow-[0_0_30px_#0FF]' : 'border-white/10 shadow-none'} overflow-hidden relative mb-4 transition-all duration-300`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                            <div className="w-full h-full bg-black flex items-center justify-center">
                                <Sparkles className={`w-12 h-12 ${isThinking ? 'animate-spin text-[#0FF]' : 'text-white/20'}`} />
                            </div>
                        </div>
                        <h3 className="text-white text-xl md:text-2xl font-bold tracking-wide">Mohamed Amine</h3>
                        <p className="text-[#0FF] text-xs md:text-sm uppercase tracking-widest mt-1">GEMINI 2.5 FLASH</p>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 bg-black/90 backdrop-blur-xl border border-[#0FF]/20 p-5 rounded-2xl shadow-lg z-20 mx-auto max-w-xl transition-all">
                        <p className={`text-white text-sm md:text-base leading-relaxed font-medium ${isThinking ? 'opacity-50 text-[#0FF]' : ''}`}>
                            "{transcription}"
                        </p>
                    </div>
                </div>

                {/* User Camera Section */}
                <div className="flex-1 relative bg-black overflow-hidden group">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-[1.02]"
                    />
                    
                    {/* Dev Mode Toggle */}
                    <button 
                        onClick={() => setDevMode(!devMode)}
                        className="absolute top-4 right-4 z-50 text-white/20 hover:text-white transition-colors p-2"
                        title="Toggle Technical Logs"
                    >
                        <Code2 className="w-4 h-4" />
                    </button>

                    {/* Developer HUD: Only visible if devMode is true */}
                    {devMode && (
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none transition-opacity">
                            <div className="bg-black/80 backdrop-blur px-3 py-1.5 rounded flex items-center gap-2 border border-[#0FF]/30">
                                <AlertCircle className="w-3 h-3 text-[#0FF]" />
                                <span className="text-[#0FF] text-[10px] font-mono uppercase tracking-widest leading-none">{status}</span>
                            </div>
                        </div>
                    )}

                    {/* Manual Scan Trigger (Overlayed on camera view for explicit interaction in UI) */}
                    <button 
                        onClick={captureAndAnalyze}
                        disabled={isThinking || !model}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-md border border-[#0FF]/50 p-5 rounded-full text-white hover:bg-[#0FF]/20 hover:border-[#0FF] hover:scale-110 transition-all z-20 group-hover:opacity-100 opacity-30 md:opacity-100 flex flex-col items-center gap-2 disabled:opacity-20 disabled:transform-none shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                    >
                        <Camera className="w-6 h-6 text-[#0FF]" />
                    </button>
                    
                    {!isThinking && model && (
                        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-max text-center opacity-70 pointer-events-none text-[#0FF] text-[10px] font-bold uppercase tracking-widest bg-black/60 px-4 py-1.5 rounded-full border border-[#0FF]/20 shadow-[0_0_10px_rgba(0,255,255,0.2)] animate-pulse">
                            Tap Center To Identify Reality
                        </div>
                    )}
                </div>
            </div>

            {/* Global Chat Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 md:gap-8 z-50 bg-black/90 backdrop-blur-xl px-8 md:px-12 py-3 md:py-4 rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                
                <button title="Microphone Mute" className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                    <Mic className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <button 
                    onClick={handleEndCall}
                    title="End Call"
                    className="p-4 bg-red-600 hover:bg-red-500 rounded-full text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all hover:scale-110 cursor-pointer"
                >
                    <PhoneOff className="w-6 h-6 md:w-7 md:h-7" />
                </button>

                <button 
                    onClick={handleSwitchCamera}
                    title="Switch Rear/Front Camera"
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors cursor-pointer"
                >
                    <SwitchCamera className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>
        </div>
    );
}
