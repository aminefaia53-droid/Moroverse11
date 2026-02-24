"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Landmark,
    Map as MapIcon,
    ChevronLeft,
    Target,
    Sparkles
} from 'lucide-react';
import { moroccoRegions, Region, Location } from '../data/morocco-geography';

interface InteractiveMapProps {
    lang: 'en' | 'ar';
    onExplore: (cityName: string) => void;
    onLocationEvent?: (event: { name: string, region: string, type: 'city' | 'battle', pos: { x: number, y: number } }) => void;
    onRegionHover?: (regionId: string | null) => void;
}

export default function InteractiveMap({ lang, onExplore, onLocationEvent, onRegionHover }: InteractiveMapProps) {
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [hoveredLoc, setHoveredLoc] = useState<Location | null>(null);

    const handleLocationClick = (loc: Location, region: Region) => {
        if (onLocationEvent) {
            // Calculate approximate pixel coordinates for the avatar to follow
            const rect = document.querySelector('.map-container')?.getBoundingClientRect();
            if (rect) {
                // Calculate viewport-relative coordinates
                const x = rect.left + (parseFloat(loc.coords.left) / 100) * rect.width;
                const y = rect.top + (parseFloat(loc.coords.top) / 100) * rect.height;
                onLocationEvent({ name: loc.name[lang], region: region.name[lang], type: 'city', pos: { x, y } });
            }
        }
        onExplore(loc.name[lang]);
    };

    return (
        <div className="relative w-full aspect-[4/5] md:aspect-video bg-white/50 backdrop-blur-md map-container" onMouseLeave={() => onRegionHover?.(null)}>
            {/* Base SVG Map (Simplified Outline) */}
            <svg
                viewBox="0 0 800 1000"
                className="w-full h-full p-4"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
            >
                {/* Morocco General Shape (Simplified) */}
                <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2 }}
                    d="M 400 50 L 500 100 L 550 200 L 500 300 L 550 400 L 500 500 L 450 600 L 400 700 L 300 800 L 200 900 L 150 950 L 100 850 L 50 750 L 100 650 L 50 550 L 100 450 L 150 350 L 250 250 L 300 150 Z"
                    fill="rgba(0, 102, 79, 0.1)"
                    stroke="#c29d61"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                />

                {/* Region Circles (Baseline Style) */}
                <AnimatePresence>
                    {!selectedRegion && moroccoRegions.map((region) => (
                        <motion.circle
                            key={region.id}
                            cx={region.zoomLevel.x.includes('%') ? parseInt(region.zoomLevel.x) * 8 : 400} // Rough estimation for baseline
                            cy={region.zoomLevel.y.includes('%') ? parseInt(region.zoomLevel.y) * 10 : 500}
                            r="14"
                            fill="#c29d61"
                            stroke="#fdfaf5"
                            strokeWidth="2"
                            onMouseEnter={() => onRegionHover?.(region.id)}
                            whileHover={{ scale: 1.6, fill: "#00664f", strokeWidth: 4 }}
                            onClick={() => setSelectedRegion(region)}
                            className="cursor-pointer"
                        />
                    ))}
                </AnimatePresence>
            </svg>

            {/* Region Overlay UI */}
            <AnimatePresence>
                {selectedRegion && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="absolute inset-0 z-20 bg-white/95 backdrop-blur-2xl p-10 flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setSelectedRegion(null)}
                            className="absolute top-10 left-10 p-4 rounded-full bg-ivory text-slate-deep hover:bg-emerald-light hover:text-ivory transition-all shadow-xl"
                        >
                            <ChevronLeft />
                        </button>

                        <motion.h4
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="text-4xl font-serif text-foreground mb-2"
                        >
                            {selectedRegion.name[lang]}
                        </motion.h4>
                        <p className="text-foreground/40 mb-12 italic uppercase tracking-[0.4em] text-[10px]">{selectedRegion.capital} Capital</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
                            {selectedRegion.provinces.map((loc, i) => (
                                <motion.div
                                    key={loc.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -8, scale: 1.05, backgroundColor: 'rgba(0, 102, 79, 0.15)' }}
                                    onClick={() => handleLocationClick(loc, selectedRegion)}
                                    className="p-8 rounded-[30px] bg-white border border-foreground/5 cursor-pointer group transition-all text-center shadow-lg hover:border-primary/30 hover:shadow-xl"
                                >
                                    <h5 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{loc.name[lang]}</h5>
                                    <p className="text-xs text-ivory/40 mt-3 line-clamp-2 leading-relaxed">{loc.history[lang]}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Map HUD */}
            <div className="absolute bottom-10 left-10 flex items-center gap-5 bg-black/60 backdrop-blur-lg px-8 py-4 rounded-full border border-gold-royal/20 shadow-2xl">
                <MapIcon className="text-emerald-light w-6 h-6 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.6em] uppercase text-ivory/90">Sovereign Atlas v1.2</span>
            </div>
        </div>
    );
}
