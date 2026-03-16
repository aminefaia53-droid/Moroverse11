"use client";

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, useProgress, Preload } from '@react-three/drei';
import DracoModel from './DracoModel';
import ErrorBoundary from '../common/ErrorBoundary';

interface Monument3DViewerProps {
    modelUrl: string;
    onClose: () => void;
    locationName: string;
    previewImageUrl?: string; // Blurred preview for anti-black-screen
    onLoaded?: () => void;
    onStall?: () => void;
}

/** Shows loading progress while the Draco model downloads */
function Loader({ onFallback }: { onFallback: () => void }) {
    const { progress } = useProgress();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (progress < 100) {
                console.warn(`[Fail-Safe] DRACO stalled at ${progress}%. Triggering fallback.`);
                onFallback();
            }
        }, 12000);
        return () => clearTimeout(timer);
    }, [progress, onFallback]);

    return (
        <Html center>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div className="relative">
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: 'rgba(197,160,89,0.1)',
                        border: '2px solid rgba(197,160,89,0.4)',
                        boxShadow: '0 0 24px rgba(197,160,89,0.5)',
                        animation: 'pulse-glow 1.5s ease-out infinite',
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span style={{ color: '#C5A059', fontSize: '11px', fontWeight: 900, letterSpacing: '0.05em' }}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
                <style>{`
                    @keyframes pulse-glow {
                        0% { transform: scale(0.95); opacity: 0.5; }
                        50% { transform: scale(1.1); opacity: 1; }
                        100% { transform: scale(0.95); opacity: 0.5; }
                    }
                `}</style>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                    Loading Elite 3D Archive...
                </span>
            </div>
        </Html>
    );
}

/** Signals that the Suspense boundary has resolved */
function SceneInitializer({ onReady }: { onReady?: () => void }) {
    useEffect(() => {
        if (onReady) onReady();
    }, [onReady]);
    return null;
}

export default function Monument3DViewer({ modelUrl, onClose, locationName, previewImageUrl, onLoaded, onStall }: Monument3DViewerProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleModelLoaded = useCallback(() => {
        setModelLoaded(true);
        if (onLoaded) onLoaded();
    }, [onLoaded]);

    return (
        <div className="fixed inset-0 w-full h-screen z-[999] flex flex-col items-center justify-center bg-gradient-to-br from-[#050B14] via-[#0A1128] to-[#1F0935]">

            {/* ─── ANTI-BLACK-SCREEN: Blurred Preview Image ─── */}
            {/* Shows instantly from the landmark image, fades only when 3D is ready */}
            {previewImageUrl && (
                <div
                    className={`absolute inset-0 z-[5] transition-opacity duration-1200 pointer-events-none ${modelLoaded ? 'opacity-0' : 'opacity-100'}`}
                    style={{
                        backgroundImage: `url(${previewImageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(24px) brightness(0.3) saturate(1.5)',
                        transform: 'scale(1.15)',
                    }}
                />
            )}

            {/* Header / Controls */}
            <div className="absolute top-0 inset-x-0 p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
                <div className="flex flex-col">
                    <span className="text-[#C5A059] text-[9px] md:text-xs font-black uppercase tracking-[0.3em] drop-shadow-md">
                        Royal Archives: Elite 3D Stage
                    </span>
                    <h2 className="text-white text-lg md:text-2xl font-bold leading-tight drop-shadow-md">{locationName}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="px-4 md:px-6 py-2 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-colors text-[10px] md:text-xs font-bold uppercase tracking-widest shrink-0 ml-4 shadow-lg backdrop-blur-md"
                >
                    ✕ Close
                </button>
            </div>

            {/* 3D Canvas */}
            <div className="w-full h-full relative z-10 flex items-center justify-center pointer-events-auto">
                <ErrorBoundary componentName="Elite 3D Engine">
                    <Canvas
                        shadows={false}
                        dpr={isMobile ? 1 : [1, 1.5]}
                        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
                    >
                        <Suspense fallback={<Loader onFallback={() => onStall ? onStall() : onClose()} />}>
                            <PerspectiveCamera makeDefault position={[0, 8, 28]} fov={45} />

                            <ambientLight intensity={1.5} />
                            <hemisphereLight color="#ffffff" groundColor="#c5a059" intensity={1.0} />
                            <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
                            <directionalLight position={[-10, 5, -10]} intensity={1.0} color="#c5a059" />

                            <DracoModel
                                url={modelUrl}
                                wireframe={false}
                                onLoad={handleModelLoaded}
                            />

                            <SceneInitializer onReady={handleModelLoaded} />

                            <OrbitControls
                                makeDefault
                                enablePan={true}
                                enableZoom={true}
                                enableRotate={true}
                                minDistance={3}
                                maxDistance={100}
                                autoRotate
                                autoRotateSpeed={0.8}
                            />
                            <Preload all />
                        </Suspense>
                    </Canvas>
                </ErrorBoundary>
            </div>

            {/* Bottom hint */}
            <div className="absolute bottom-4 md:bottom-6 inset-x-0 flex justify-center pointer-events-none z-10">
                <div className="bg-black/40 backdrop-blur-md border border-[#C5A059]/30 px-6 py-2.5 rounded-full text-white/40 text-[9px] uppercase font-black tracking-[0.3em]">
                    Drag · Zoom · Pan
                </div>
            </div>
        </div>
    );
}
