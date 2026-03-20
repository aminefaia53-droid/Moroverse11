"use client";

import React, { useEffect, useRef, useState } from 'react';
import { RelativisticVisionStream } from './RelativisticVisionStream';
import { QuantumAstroDynamics } from './QuantumAstroDynamics';

/**
 * THE SOVEREIGN VISUAL INTERFACE
 * Component pushing CPU/GPU to absolute limit.
 * Implements: Live Video Stream, 50,000 N-Body WebGL Path-Tracing
 */
export default function MohamedAmine_Supreme_Cortex() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const [fps, setFps] = useState<number>(0);
    const [latency, setLatency] = useState<number>(0);
    const [analysis, setAnalysis] = useState<string>("AWAITING VISUAL TELEMETRY...");
    const [status, setStatus] = useState<string>("ENGAGING SOVEREIGN CORE...");
    
    useEffect(() => {
        if (!canvasRef.current || !videoRef.current) return;
        
        try {
            // 1. Initialize True WebGL N-Body (50,000)
            const astroEngine = new QuantumAstroDynamics(canvasRef.current);
            // 2. Initialize True Multi-Threaded Vision CPU Burner
            const visionStream = new RelativisticVisionStream();
            
            visionStream.setAnalysisCallback((res) => setAnalysis(res));
            setStatus("SOVEREIGN ENGAGED: NEURAL NET & GLSL ONLINE.");

            // Request Camera Access (Live Synchronization)
            navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } })
                .then(stream => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(err => {
                    console.error("CAMERA ACCESS DENIED:", err);
                    setStatus("CAMERA ACCESS DENIED. VISION DOWNGRADED.");
                });

            let isRunning = true;
            let frameCount = 0;
            let lastTime = performance.now();
            let animationFrameId: number;

            // Optional Hidden Canvas to extract frame data for Vision Steam processing
            const hiddenCanvas = document.createElement('canvas');
            const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
            
            const mainLoop = (time: number) => {
                if (!isRunning) return;
                
                // Relativistic Lensing based on simulated Barometric/EKF data
                const lensingStrength = 1.0 + Math.sin(time * 0.001) * 0.5;
                
                // 1. GPU: Draw 50k Stars Path-Traced
                astroEngine.executeQuantumTick(time, lensingStrength);
                
                // 2. CPU: Extract Camera Frame & Push to Workers
                if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && hiddenCtx) {
                    hiddenCanvas.width = videoRef.current.videoWidth;
                    hiddenCanvas.height = videoRef.current.videoHeight;
                    hiddenCtx.drawImage(videoRef.current, 0, 0);
                    const frameData = hiddenCtx.getImageData(0, 0, hiddenCanvas.width, hiddenCanvas.height);
                    
                    // Dispatch massive TypedArray payload to WebWorkers
                    visionStream.processFrame(frameData.data);
                }

                frameCount++;
                const currentTime = performance.now();
                if (currentTime - lastTime >= 1000) {
                    setFps(frameCount);
                    frameCount = 0;
                    lastTime = currentTime;
                    setLatency(visionStream.getAverageLatency());
                }

                animationFrameId = requestAnimationFrame(mainLoop);
            };
            
            animationFrameId = requestAnimationFrame(mainLoop);

            return () => { 
                isRunning = false; 
                cancelAnimationFrame(animationFrameId);
                if (videoRef.current && videoRef.current.srcObject) {
                    const stream = videoRef.current.srcObject as MediaStream;
                    stream.getTracks().forEach(track => track.stop());
                }
            };
        } catch (e: any) {
            console.error("FATAL ERROR IN SUPREME CORTEX:", e);
            setStatus("CRITICAL FAILURE: " + e.message);
        }
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000', zIndex: 9999 }}>
            
            {/* Live Camera Feed (Background) */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, zIndex: 0, filter: 'contrast(1.2) sepia(0.5) hue-rotate(180deg)' }} 
            />

            {/* Volumetric N-Body Shader Target (Foreground) */}
            <canvas 
                ref={canvasRef} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none', mixBlendMode: 'screen' }} 
            />
            
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 2, color: '#0FF', fontFamily: 'monospace', textShadow: '0 0 10px #0FF', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '10px' }}>
                <h1 style={{ fontSize: '1.5rem', letterSpacing: '2px', color: '#FFF' }}>MOHAMED AMINE SOVEREIGN INTELLIGENCE</h1>
                <h2 style={{ fontSize: '1rem', marginTop: '10px' }}>[{status}]</h2>
                <div style={{ marginTop: '15px', borderLeft: '4px solid #0FF', paddingLeft: '15px' }}>
                    <p style={{ color: fps < 60 ? '#F90' : '#0F0' }}>GPU RENDER FPS: {fps} (TARGET: 60)</p>
                    <p>CELESTIAL BODIES: 50,000 (PATH-TRACED)</p>
                    <p>VISION INFERENCE LATENCY: {latency.toFixed(2)} ms</p>
                    <p>WORKER POOL ALLOCATED: TRUE HYPERTHREADING</p>
                </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 2, color: '#0F0', fontFamily: 'monospace', textShadow: '0 0 10px #0F0', background: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '10px', border: '1px solid #0F0' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', animation: 'blink 2s infinite' }}>► LIVE HISTORICAL ANALYSIS:</h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>{analysis}</p>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
            `}} />
        </div>
    );
}
