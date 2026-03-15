"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, useProgress, Preload } from '@react-three/drei';
import DracoModel from './DracoModel';

interface Monument3DViewerProps {
    modelUrl: string;
    onClose: () => void;
    locationName: string;
}

/** Professional CSS loading pulse shown while the 3D model downloads */
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    backgroundColor: 'rgba(197,160,89,0.3)',
                    boxShadow: '0 0 20px rgba(197,160,89,0.8)',
                    animation: 'pulse-glow 1.5s ease-out infinite',
                }} />
                <style>{`
                    @keyframes pulse-glow {
                        0% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(197,160,89, 0.7); }
                        70% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 20px rgba(197,160,89, 0); }
                        100% { transform: scale(0.8); opacity: 0.5; box-shadow: 0 0 0 0 rgba(197,160,89, 0); }
                    }
                `}</style>
                <span style={{ color: '#C5A059', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                    {Math.round(progress)}%
                </span>
            </div>
        </Html>
    );
}

export default function Monument3DViewer({ modelUrl, onClose, locationName }: Monument3DViewerProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full z-10 flex flex-col items-center justify-center bg-gradient-to-br from-[#050B14] via-[#0A1128] to-[#1F0935]">
            {/* Header / Controls */}
            <div className="absolute top-0 inset-x-0 p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
                <div className="flex flex-col">
                    <span className="text-[#C5A059] text-[9px] md:text-xs font-black uppercase tracking-[0.3em] drop-shadow-md">Royal Archives: Elite 3D Stage</span>
                    <h2 className="text-white text-lg md:text-2xl font-bold font-arabic leading-tight drop-shadow-md">{locationName}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="px-4 md:px-6 py-2 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-colors text-[10px] md:text-xs font-bold uppercase tracking-widest shrink-0 ml-4 shadow-lg backdrop-blur-md"
                >
                    ✕ Close
                </button>
            </div>

            {/* 3D Canvas Heavy Node */}
            <div className="w-full h-full relative z-10 flex items-center justify-center pointer-events-auto">                
                    <Canvas 
                        shadows={false} 
                        dpr={1} 
                        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
                    >
                        <Suspense fallback={<Loader />}>
                            <PerspectiveCamera makeDefault position={[0, 8, 28]} fov={45} />

                            <ambientLight intensity={1.5} />
                            <hemisphereLight
                                color="#ffffff"
                                groundColor="#c5a059"
                                intensity={1.0}
                            />
                            <directionalLight
                                position={[10, 15, 10]}
                                intensity={1.5}
                                color="#ffffff"
                            />
                            <directionalLight
                                position={[-10, 5, -10]}
                                intensity={1.0}
                                color="#c5a059"
                            />

                            <DracoModel url={modelUrl} wireframe={false} />

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
            </div>

            {/* Overlay Hint */}
            <div className="absolute bottom-4 md:bottom-6 inset-x-0 flex justify-center pointer-events-none z-10">
                <div className="bg-black/40 backdrop-blur-md border border-[#C5A059]/30 px-6 py-2.5 rounded-full text-white/50 text-[9px] uppercase font-black tracking-[0.3em] shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                    Drag to Rotate · Scroll to Zoom · Two Fingers to Pan
                </div>
            </div>
        </div>
    );
}
