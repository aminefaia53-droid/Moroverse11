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
    const previewImageUrl = searchParams.get('img') ? decodeURIComponent(searchParams.get('img')!) : undefined;

    if (!modelUrl) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500 font-bold">
                Invalid 3D Model Parameters.
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-black relative">
            <Monument3DViewer 
                modelUrl={modelUrl} 
                locationName={locationName}
                previewImageUrl={previewImageUrl}
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
