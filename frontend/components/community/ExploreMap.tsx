"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import * as L from "leaflet";
import Supercluster from 'supercluster';
import { SocialService } from "../../services/SocialService";
import { Post as PostType, ViewportBounds } from "../../types/social";
import { ErrorBoundary } from "../common/ErrorBoundary";

function MapController({ target, zoom }: { target?: [number, number], zoom?: number }) {
    const map = useMap();
    useEffect(() => {
        if (target && zoom) {
            map.flyTo(target, zoom, { duration: 1.5 });
        }
    }, [target, zoom, map]);
    return null;
}

const createCustomIcon = (type: string, isSelected: boolean) => {
    const color = type === 'monument' ? '#f59e0b' : '#C5A059';
    const size = isSelected ? 40 : 32;
    return L.divIcon({
        className: 'custom-explore-pin',
        html: `<div style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transform: scale(${isSelected ? 1.2 : 1})">
                <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
                    <path d="M12 21C16 17 20 13.4183 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 13.4183 8 17 12 21Z" fill="${color}" stroke="white" stroke-width="1.5"/>
                    <circle cx="12" cy="9" r="3" fill="white" fill-opacity="0.8"/>
                </svg>
               </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
    });
};

interface ExploreMapProps {
    onLocationSelect: (location: PostType | string) => void;
    activeCategory: string;
    selectedLocationId?: string | null;
}

export default function ExploreMap({ onLocationSelect, activeCategory, selectedLocationId }: ExploreMapProps) {
    const [bounds, setBounds] = useState<ViewportBounds | null>(null);
    const [zoom, setZoom] = useState(6);
    const [heritagePosts, setHeritagePosts] = useState<PostType[]>([]);
    const [aiTarget, setAiTarget] = useState<[number, number] | null>(null);
    const markerRefs = useRef<Record<string, L.Marker>>({});

    const fetchData = useCallback(async () => {
        try {
            const posts = await SocialService.getPostsByCategory(activeCategory);
            setHeritagePosts(posts);
        } catch (err) {
            console.error('EXPLORE_MAP_FETCH_FAILED:', err);
        }
    }, [activeCategory]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Programmatic Popup Control: Open popup when card is clicked
    useEffect(() => {
        if (selectedLocationId && markerRefs.current[selectedLocationId]) {
            markerRefs.current[selectedLocationId].openPopup();
        }
    }, [selectedLocationId, heritagePosts]);

    useEffect(() => {
        const handleAiSync = (e: Event) => {
            const { target, zoom } = (e as CustomEvent).detail;
            if (target) setAiTarget(target);
        };
        window.addEventListener('map-fly-to-target', handleAiSync);
        return () => window.removeEventListener('map-fly-to-target', handleAiSync);
    }, []);

    const index = useMemo(() => {
        const sc = new Supercluster({ radius: 40, maxZoom: 16 });
        const points = heritagePosts.map(p => ({
            type: 'Feature',
            properties: { cluster: false, post: p },
            geometry: { type: 'Point', coordinates: [p.lng!, p.lat!] }
        }));
        sc.load(points as any);
        return sc;
    }, [heritagePosts]);

    const MapEvents = () => {
        const map = useMap();
        useEffect(() => {
            map.on('moveend', () => {
                setZoom(map.getZoom());
            });
        }, [map]);
        return null;
    };

    return (
        <ErrorBoundary componentName="ExploreMap">
            <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-xl relative border border-[#C5A059]/20">
                <MapContainer
                    center={[31.7917, -7.0926]}
                    zoom={6}
                    maxZoom={22}
                    className="w-full h-full"
                >
                    <MapController target={aiTarget || undefined} zoom={15} />
                    <MapEvents />
                    <TileLayer
                        attribution='&copy; Google'
                        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                        maxZoom={22}
                    />
                    {heritagePosts.map(post => (
                        <Marker 
                            key={post.id} 
                            position={[post.lat!, post.lng!]}
                            icon={createCustomIcon(post.location_type, selectedLocationId === post.id)}
                            ref={(ref) => { if (ref) markerRefs.current[post.id] = ref; }}
                            eventHandlers={{ click: () => onLocationSelect(post) }}
                        >
                            <Popup className="pin-popup">
                                <div className="p-2 min-w-[150px]">
                                    <h3 className="text-[#C5A059] font-bold uppercase text-xs mb-1">{post.location_name}</h3>
                                    <div className="h-px bg-[#C5A059]/20 w-full mb-2" />
                                    <p className="text-[10px] text-white/70">
                                        Trust Score: {post.profiles?.trust_score || 0}
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </ErrorBoundary>
    );
}
