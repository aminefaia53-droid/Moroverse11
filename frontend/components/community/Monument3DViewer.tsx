"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import DracoModel from './DracoModel';

interface Monument3DViewerProps {
    modelUrl: string;
    onClose: () => void;
    locationName: string;
}

export default function Monument3DViewer({ modelUrl, onClose, locationName }: Monument3DViewerProps) {
    return (
        <div className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center">
            {/* Header / Controls */}
            <div className="absolute top-0 inset-x-0 p-6 z-10 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex flex-col">
                    <span className="text-[#C5A059] text-xs font-black uppercase tracking-[0.3em]">Royal Archives: 3D Visualization</span>
                    <h2 className="text-white text-2xl font-bold font-arabic">{locationName}</h2>
                </div>
                <button 
                    onClick={onClose}
                    className="px-6 py-2 rounded-full border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    Close Viewer
                </button>
            </div>

            {/* 3D Canvas */}
            <div className="w-full h-full relative">
                <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center text-[#C5A059] animate-pulse">
                        <span className="text-sm font-black tracking-widest uppercase">Loading Secure Assets...</span>
                    </div>
                }>
                    <Canvas shadows dpr={[1, 2]}>
                        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={50} />
                        
                        {/* Lighting: Studio Setup */}
                        <ambientLight intensity={0.5} />
                        <directionalLight 
                            position={[10, 10, 5]} 
                            intensity={1.5} 
                            castShadow 
                            shadow-mapSize-width={2048} 
                            shadow-mapSize-height={2048}
                        />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#C5A059" />
                        
                        {/* Environment for reflections */}
                        <Environment preset="night" />

                        {/* Model */}
                        <DracoModel url={modelUrl} />

                        {/* Controls */}
                        <OrbitControls 
                            makeDefault 
                            enablePan={true} 
                            enableZoom={true} 
                            enableRotate={true}
                            minDistance={5}
                            maxDistance={50}
                            autoRotate
                            autoRotateSpeed={0.5}
                        />
                    </Canvas>
                </Suspense>
            </div>
            
            {/* Overlay Info */}
             <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md border border-[#C5A059]/20 px-8 py-3 rounded-full text-white/50 text-[10px] uppercase font-black tracking-[0.4em] shadow-lg">
                    Drag to Rotate • Scroll to Zoom
                </div>
            </div>
        </div>
    );
}
