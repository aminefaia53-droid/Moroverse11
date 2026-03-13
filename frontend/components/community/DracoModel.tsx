"use client";

import React, { useRef, useMemo } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { Group } from 'three';

interface DracoModelProps {
    url: string;
}

export default function DracoModel({ url }: DracoModelProps) {
    const group = useRef<Group>(null);
    
    // useGLTF inherently handles Draco compression if the file is compressed
    // Note: To be fully indestructible, we might need a custom draco config path if public/draco is meant to be used, 
    // but default CDN works for standard cases.
    const { scene } = useGLTF(url);
    
    // Basic auto-centering and scaling (since models from DB might vary wildly in size)
    const normalizedScene = useMemo(() => {
        const cloned = scene.clone();
        // Calculate bounding box here if needed for exact centering
        return cloned;
    }, [scene]);

    return (
        <group ref={group} dispose={null}>
            <primitive object={normalizedScene} castShadow receiveShadow />
            
            {/* Example POI Tag - in a real scenario, this coordinates would come from DB */}
            <Html position={[0, 10, 0]} center distanceFactor={15}>
                <div className="bg-black/80 backdrop-blur-sm border border-[#C5A059]/40 text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity translate-y-4 hover:translate-y-0 cursor-pointer pointer-events-auto">
                    <span className="text-[#C5A059] font-bold mr-2">POI:</span> Main Structure
                </div>
            </Html>
        </group>
    );
}

// Preload the specific model if possible
// useGLTF.preload('/models/sample.glb');
