"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import { useLanguage } from "../../context/LanguageContext";
import moroccoRegionsGeoJSON from "../../data/morocco-regions-geo";
import { createClient } from "../../utils/supabase/client";

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.2 });
    }, [center, zoom, map]);

    useEffect(() => {
        const handleFlyToBounds = (e: Event) => {
            const { bounds } = (e as CustomEvent).detail;
            if (bounds) {
                map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
            }
        };
        window.addEventListener('map-fly-to-bounds', handleFlyToBounds);
        return () => window.removeEventListener('map-fly-to-bounds', handleFlyToBounds);
    }, [map]);

    return null;
}

function ZoomTracker({ onZoomChange }: { onZoomChange: (z: number) => void }) {
    useMapEvents({
        zoomend: (e) => {
            onZoomChange(e.target.getZoom());
        }
    });
    return null;
}

const createCustomIcon = (type: string, isSelected: boolean) => {
    const color = type === 'battle' ? '#ef4444' : type === 'landmark' ? '#C5A059' : '#0ea5e9';
    const size = isSelected ? 40 : 32;

    return L.divIcon({
        className: 'custom-map-pin',
        html: `
            <div style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transform: scale(${isSelected ? 1.2 : 1})">
                <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16 17 20 13.4183 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 13.4183 8 17 12 21Z" fill="${color}" stroke="white" stroke-width="1.5"/>
                    <circle cx="12" cy="9" r="3" fill="white" fill-opacity="0.8"/>
                </svg>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
    });
};

interface FeedMapProps {
    onCitySelect: (cityId: string | null) => void;
    onLandmarkSelect?: (landmarkId: string | null) => void;
    selectedCityId: string | null;
    selectedLandmarkId?: string | null;
    showLandmarks?: boolean;
}

function regionToCityId(name: string): string {
    const n = (name ?? "").toLowerCase();
    if (n.includes("souss") || n.includes("agadir")) return "agadir";
    if (n.includes("fès") || n.includes("fes") || n.includes("meknès") || n.includes("meknes")) return "fes";
    if (n.includes("tanger") || n.includes("tangier") || n.includes("tétouan") || n.includes("hoceima")) return "tangier";
    if (n.includes("rabat") || n.includes("salé") || n.includes("kénitra")) return "rabat";
    if (n.includes("casablanca") || n.includes("settat")) return "casablanca";
    if (n.includes("marrakech") || n.includes("safi")) return "marrakech";
    if (n.includes("oriental") || n.includes("oujda")) return "oujda";
    if (n.includes("laâyoune") || n.includes("laayoune") || n.includes("sakia")) return "laayoune";
    if (n.includes("dakhla")) return "dakhla";
    if (n.includes("béni mellal") || n.includes("beni mellal") || n.includes("khénifra")) return "beni_mellal";
    if (n.includes("drâa") || n.includes("draa") || n.includes("tafilalet") || n.includes("ouarzazate")) return "ouarzazate";
    if (n.includes("guelmim") || n.includes("noun")) return "guelmim";
    return "marrakech";
}

const baseStyle = {
    fillColor: "#C5A059",
    fillOpacity: 0.05,
    color: "#C5A059",
    weight: 1,
    dashArray: "4 4",
    opacity: 0.35,
};

const hoverStyle = {
    fillColor: "#D4AF37",
    fillOpacity: 0.42,
    color: "#D4AF37",
    weight: 2.5,
    dashArray: "",
    opacity: 1,
};

const selectedStyle = {
    fillColor: "#D4AF37",
    fillOpacity: 0.28,
    color: "#D4AF37",
    weight: 2,
    dashArray: "",
    opacity: 0.9,
};

export default function FeedMap({
    onCitySelect,
    selectedCityId,
}: FeedMapProps) {
    const { lang } = useLanguage();
    const isAr = lang === "ar";
    const [highlightedCityIds, setHighlightedCityIds] = useState<string[]>([]);
    const [zoomLevel, setZoomLevel] = useState(5);
    const [pins, setPins] = useState<any[]>([]);

    // Geographically centered for all Morocco [lat, lng]
    const mapCenter: [number, number] = [31.7917, -7.0926];
    const initialZoom = 6;

    useEffect(() => {
        const fetchPins = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('map_pins')
                    .select('*');

                if (error) throw error;
                if (data) {
                    console.log(`MAP_DEBUG: Fetched ${data.length} pins from Supabase`);
                    setPins(data);
                }
            } catch (err) {
                console.error('MAP_ERROR: Failed to fetch pins:', err);
                // Fallback to empty or static data if needed
            }
        };
        fetchPins();
    }, []);

    useEffect(() => {
        const handleConciergeCommand = (e: Event) => {
            const { cities } = (e as CustomEvent).detail;
            if (!cities || cities.length === 0) return;

            setHighlightedCityIds(cities);

            const targetFeatures = moroccoRegionsGeoJSON.features.filter(f =>
                cities.includes(regionToCityId(f.properties?.NAME_1))
            );

            if (targetFeatures.length > 0) {
                const tempLayer = L.geoJSON({ type: "FeatureCollection", features: targetFeatures } as any);
                const bounds = tempLayer.getBounds();
                window.dispatchEvent(new CustomEvent('map-fly-to-bounds', { detail: { bounds } }));
            }

            setTimeout(() => setHighlightedCityIds([]), 10000);
        };

        window.addEventListener('concierge-map-command', handleConciergeCommand);
        return () => window.removeEventListener('concierge-map-command', handleConciergeCommand);
    }, []);

    const onEachFeature = (feature: any, layer: any) => {
        const regionName = feature.properties?.NAME_1 ?? "";

        layer.on({
            mouseover: (e: any) => {
                e.target.setStyle(hoverStyle);
                e.target.bringToFront();
            },
            mouseout: (e: any) => {
                const cityId = regionToCityId(regionName);
                const isSelected = selectedCityId && cityId === selectedCityId;
                const isAIHighlighted = highlightedCityIds.includes(cityId);

                if (isAIHighlighted) {
                    e.target.setStyle({ ...selectedStyle, fillOpacity: 0.5, weight: 3 });
                } else {
                    e.target.setStyle(isSelected ? selectedStyle : baseStyle);
                }
            },
            click: (e: any) => {
                const cityId = regionToCityId(regionName);
                onCitySelect(cityId);
                e.target._map.flyToBounds(e.target.getBounds(), {
                    padding: [40, 40],
                    duration: 1.1,
                });
            },
        });
    };

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl isolate feed-map-container">
            <style dangerouslySetInnerHTML={{
                __html: `
                    .leaflet-control-attribution {
                        opacity: 0.08 !important;
                        transition: opacity 0.4s;
                        font-size: 9px;
                        background: transparent !important;
                        color: rgba(255,255,255,0.4) !important;
                    }
                    .leaflet-control-attribution:hover { opacity: 0.65 !important; }
                    .leaflet-interactive { cursor: pointer; }
                    .feed-map-container .leaflet-container { background: #020202 !important; }
                    .custom-map-pin { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    .pin-popup .leaflet-popup-content-wrapper { 
                        background: rgba(10, 10, 10, 0.95);
                        backdrop-filter: blur(8px);
                        border: 1px solid rgba(197, 160, 89, 0.3);
                        color: white;
                        border-radius: 16px;
                    }
                    .pin-popup .leaflet-popup-tip { background: rgba(10, 10, 10, 0.95); }
                `
            }} />

            <MapContainer
                center={mapCenter}
                zoom={initialZoom}
                minZoom={3}
                maxZoom={19}
                scrollWheelZoom={true}
                inertia={true}
                inertiaDeceleration={3000}
                inertiaMaxSpeed={1500}
                worldCopyJump={true}
                className="w-full h-full"
                style={{ background: "#020202" }}
            >
                <MapController center={mapCenter} zoom={initialZoom} />
                <ZoomTracker onZoomChange={setZoomLevel} />

                {/* TOTAL REALISM: GOOGLE HYBRID SATELLITE (Imagery + Roads + Labels) */}
                <TileLayer
                    attribution='&copy; Google'
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    maxZoom={19}
                />

                <GeoJSON
                    key={`${selectedCityId}-${highlightedCityIds.join(',')}-${zoomLevel}`}
                    data={moroccoRegionsGeoJSON as any}
                    style={(feature) => {
                        const regionName = feature?.properties?.NAME_1 ?? "";
                        const cityId = regionToCityId(regionName);
                        const isSelected = !!selectedCityId && cityId === selectedCityId;
                        const isAIHighlighted = highlightedCityIds.includes(cityId);

                        // Fade regions as we zoom in for realism (Digital Twin effect)
                        const opacity = zoomLevel > 10 ? 0 : isSelected || isAIHighlighted ? 0.3 : 0.05;

                        if (isAIHighlighted) return { ...selectedStyle, fillOpacity: opacity + 0.2, weight: 3, opacity: 1 };
                        return { ...isSelected ? selectedStyle : baseStyle, fillOpacity: opacity, opacity: zoomLevel > 10 ? 0.1 : 0.35 };
                    }}
                    onEachFeature={onEachFeature}
                />

                {/* DYNAMIC SUPABASE PINS */}
                {pins.map((pin) => {
                    // Logic for revealing pins based on zoom
                    const isVisible =
                        (zoomLevel < 8 && pin.type === 'city') ||
                        (zoomLevel >= 8 && zoomLevel < 12 && (pin.type === 'city' || pin.type === 'landmark' || pin.type === 'battle')) ||
                        (zoomLevel >= 12);

                    if (!isVisible) return null;

                    return (
                        <Marker
                            key={pin.id}
                            position={[pin.lat, pin.lng]}
                            icon={createCustomIcon(pin.type, selectedCityId === pin.id)}
                            eventHandlers={{
                                click: () => {
                                    if (pin.type === 'city') onCitySelect(pin.id);
                                }
                            }}
                        >
                            <Popup className="pin-popup">
                                <div className="p-2 min-w-[200px]">
                                    {pin.imageUrl && (
                                        <img src={pin.imageUrl} alt={pin.name} className="w-full h-24 object-cover rounded-lg mb-2 border border-[#C5A059]/30" />
                                    )}
                                    <h3 className="text-[#C5A059] font-bold border-b border-[#C5A059]/20 pb-1 mb-1">{pin.name}</h3>
                                    <p className="text-[10px] text-white/80 leading-tight">
                                        {pin.description || (isAr ? "معلمة مغربية أصيلة." : "Authentic Moroccan landmark.")}
                                    </p>
                                    {pin.externalUrl && (
                                        <a href={pin.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[10px] text-[#C5A059] underline">
                                            {isAr ? "عرض المزيد" : "View Details"}
                                        </a>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            <div className="absolute bottom-4 left-4 z-[9999] bg-black/60 rounded-xl p-3 flex flex-col gap-1.5 text-[10px] border border-[#C5A059]/20">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-3 shrink-0 rounded-sm border border-[#D4AF37]/60 bg-[#D4AF37]/20" />
                    <span className="text-white/70">{isAr ? "جهات المملكة" : "Morocco — Hover to explore"}</span>
                </div>
            </div>

            {selectedCityId && (
                <button
                    onClick={() => onCitySelect(null)}
                    className="absolute top-3 right-3 z-[9999] bg-black/70 border border-[#C5A059]/50 text-[#C5A059] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-black transition-all"
                >
                    {isAr ? "← عودة" : "← All Morocco"}
                </button>
            )}
        </div>
    );
}
