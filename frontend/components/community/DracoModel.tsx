"use client";

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Box3, Vector3, Object3D } from 'three';

interface DracoModelProps {
    url: string;
    wireframe?: boolean;
}

export default function DracoModel({ url, wireframe = false }: DracoModelProps) {
    const group = useRef<Group>(null);
    const { scene } = useGLTF(url);
    const { camera } = useThree();
    const [floatOffset, setFloatOffset] = useState(0);

    // Auto-center and normalize the model scale so ANY model renders visibly
    const { normalizedScene, center } = useMemo(() => {
        const cloned = scene.clone();

        // Compute bounding box
        const box = new Box3().setFromObject(cloned);
        const size = box.getSize(new Vector3());
        const boxCenter = box.getCenter(new Vector3());

        // Normalize: target a height of 10 units
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 10 / maxDim : 1;
        cloned.scale.setScalar(scale);

        // Re-center after scaling
        const scaledBox = new Box3().setFromObject(cloned);
        const scaledCenter = scaledBox.getCenter(new Vector3());
        cloned.position.sub(scaledCenter);

        return { normalizedScene: cloned, center: scaledCenter };
    }, [scene]);

    // Subtle floating animation
    useFrame((state) => {
        if (group.current) {
            group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
        }
    });

    // Apply wireframe to all materials
    useEffect(() => {
        if (normalizedScene) {
            normalizedScene.traverse((child: any) => {
                if (child.isMesh && child.material) {
                    // It can be a multi-material array
                    if (Array.isArray(child.material)) {
                        child.material.forEach((mat: any) => mat.wireframe = wireframe);
                    } else {
                        child.material.wireframe = wireframe;
                    }
                }
            });
        }
    }, [normalizedScene, wireframe]);

    return (
        <group ref={group} dispose={null}>
            <primitive object={normalizedScene} castShadow receiveShadow />
        </group>
    );
}
