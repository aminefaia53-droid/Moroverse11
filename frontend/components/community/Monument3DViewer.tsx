"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Html, useProgress } from '@react-three/drei';
import DracoModel from './DracoModel';

interface Monument3DViewerProps {
    modelUrl: string;
    onClose: () => void;
    locationName: string;
}

/** Professional CSS loading spinner shown while the 3D model downloads */
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    border: '3px solid rgba(197,160,89,0.2)',
                    borderTopColor: '#C5A059',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <span style={{ color: '#C5A059', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em' }}>
                    {Math.round(progress)}%
                </span>
            </div>
        </Html>
    );
}

export default function Monument3DViewer({ modelUrl, onClose, locationName }: Monument3DViewerProps) {
    return (
        <div className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center">
            {/* Header / Controls — z-index fixed for mobile overlap */}
            <div className="absolute top-0 inset-x-0 p-4 md:p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
                <div className="flex flex-col">
                    <span className="text-[#C5A059] text-[9px] md:text-xs font-black uppercase tracking-[0.3em]">Royal Archives: Elite 3D Stage</span>
                    <h2 className="text-white text-lg md:text-2xl font-bold font-arabic leading-tight">{locationName}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="px-4 md:px-6 py-2 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-colors text-[10px] md:text-xs font-bold uppercase tracking-widest shrink-0 ml-4"
                >
                    ✕ Close
                </button>
            </div>

            {/* 3D Canvas */}
            <div className="w-full h-full relative">
                <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
                    <Suspense fallback={<Loader />}>
                        {/* Camera: positioned higher and further back so any model is in frame */}
                        <PerspectiveCamera makeDefault position={[0, 8, 28]} fov={45} />

                        {/* Lighting: much brighter studio setup to eliminate black screen */}
                        <ambientLight intensity={2.5} />
                        <hemisphereLight
                            color="#ffffff"
                            groundColor="#c5a059"
                            intensity={1.5}
                        />
                        <directionalLight
                            position={[10, 15, 10]}
                            intensity={3}
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                        />
                        <directionalLight
                            position={[-10, 5, -10]}
                            intensity={1.5}
                            color="#c5a059"
                        />
                        <pointLight position={[0, 20, 0]} intensity={2} color="#ffffff" />

                        {/* Well-lit neutral environment */}
                        <Environment preset="warehouse" />

                        {/* Model */}
                        <DracoModel url={modelUrl} />

                        {/* Controls */}
                        <OrbitControls
                            makeDefault
                            enablePan={true}
                            enableZoom={true}
                            enableRotate={true}
                            minDistance={3}
                            maxDistance={80}
                            autoRotate
                            autoRotateSpeed={0.8}
                        />
                    </Suspense>
                </Canvas>
            </div>

            {/* Overlay Hint */}
            <div className="absolute bottom-4 md:bottom-6 inset-x-0 flex justify-center pointer-events-none z-10">
                <div className="bg-black/60 backdrop-blur-md border border-[#C5A059]/20 px-6 py-2.5 rounded-full text-white/50 text-[9px] uppercase font-black tracking-[0.3em] shadow-lg">
                    Drag to Rotate · Scroll to Zoom · Two Fingers to Pan
                </div>
            </div>
        </div>
    );
}
