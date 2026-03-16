"use client";

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';

const Monument3DViewer = dynamic(() => import('@/components/community/Monument3DViewer'), { ssr: false });

function ViewerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const modelUrl = searchParams.get('model');
    const locationName = searchParams.get('name') || 'Monument';

    if (!modelUrl) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500 font-bold">
                Invalid 3D Model Parameters.
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-black relative">
            <button 
                onClick={() => router.back()}
                className="absolute top-6 left-6 z-50 text-white hover:text-[#C5A059] bg-black/50 p-3 rounded-full backdrop-blur-md transition-colors border border-white/20"
            >
                <ArrowLeft size={24} />
            </button>
            <Monument3DViewer 
                modelUrl={modelUrl} 
                locationName={locationName} 
                onClose={() => router.back()}
            />
        </div>
    );
}

export default function Independent3DPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-[#c5a059] animate-pulse">Loading Archives...</div>}>
            <ViewerContent />
        </Suspense>
    );
}
