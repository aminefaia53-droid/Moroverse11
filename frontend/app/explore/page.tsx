"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ExploreBlogPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to homepage where the explore engine now lives
        router.push("/#explore-engine");
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-[#C5A059] animate-spin mb-4" />
            <p className="text-[#C5A059] font-black uppercase tracking-[0.3em] text-xs">
                Redirecting to Imperial Archive...
            </p>
        </div>
    );
}
