"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { useLanguage } from "../../context/LanguageContext";

// Icons are created lazily inside the component to avoid SSR issues
// (Leaflet references `window` at import time on newer versions)
function getIcon(color: string, size = 18) {
    return new L.DivIcon({
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -(size / 2 + 4)],
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid rgba(255,255,255,0.85);box-shadow:0 0 12px ${color};cursor:pointer;transition:transform .2s" onmouseover="this.style.transform='scale(1.5)'" onmouseout="this.style.transform='scale(1)'"></div>`
    });
}

function getLandmarkIcon(label: string) {
    return new L.DivIcon({
        className: "",
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -16],
        html: `<div title="${label}" style="width:26px;height:26px;border-radius:6px;background:#f97316;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;box-shadow:0 0 12px #f97316aa">🏛</div>`
    });
}


import { ALL_CITIES, LANDMARKS } from "../../data/morocco-geo";


function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.2 });
    }, [center, zoom, map]);
    return null;
}

interface FeedMapProps {
    onCitySelect: (cityId: string | null) => void;
    onLandmarkSelect?: (landmarkId: string | null) => void;
    selectedCityId: string | null;
    selectedLandmarkId?: string | null;
    showLandmarks?: boolean;
}

export default function FeedMap({
    onCitySelect,
    onLandmarkSelect,
    selectedCityId,
    selectedLandmarkId,
    showLandmarks = true,
}: FeedMapProps) {
    const { lang } = useLanguage();
    const isAr = lang === "ar";

    const mapCenter: [number, number] = [29.0, -8.0]; // Proper center of Morocco including Sahara
    const selectedCity = ALL_CITIES.find(c => c.id === selectedCityId);
    const flyCenter: [number, number] = selectedCity
        ? [selectedCity.lat, selectedCity.lng]
        : mapCenter;
    const flyZoom = selectedCity ? 9 : 5;

    const typeColor = (type: string) => {
        if (type === "imperial") return "#C5A059";
        if (type === "major") return "#60a5fa";
        if (type === "heritage") return "#a78bfa";
        return "#38bdf8";
    };

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl isolate">
            <MapContainer
                center={mapCenter}
                zoom={5}
                scrollWheelZoom={true}
                className="w-full h-full"
                style={{ background: "#0a0a0a" }}
            >
                <MapController center={flyCenter} zoom={flyZoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* City Markers */}
                {ALL_CITIES.map(city => (
                    <CircleMarker
                        key={city.id}
                        center={[city.lat, city.lng]}
                        radius={selectedCityId === city.id ? 12 : 8}
                        pathOptions={{
                            fillColor: selectedCityId === city.id ? "#facc15" : typeColor(city.type),
                            fillOpacity: 0.9,
                            color: "#fff",
                            weight: selectedCityId === city.id ? 3 : 1.5,
                        }}
                        eventHandlers={{ click: () => onCitySelect(city.id) }}
                    >
                        <Popup>
                            <div style={{ fontFamily: "system-ui", textAlign: "center", minWidth: 120 }}>
                                <div style={{ fontWeight: "bold", fontSize: 14, color: "#1a1a1a", marginBottom: 4 }}>
                                    {isAr ? city.nameAr : city.name}
                                </div>
                                <button
                                    onClick={() => onCitySelect(city.id)}
                                    style={{
                                        background: "#C5A059", color: "#000", border: "none",
                                        borderRadius: 6, padding: "4px 12px", fontSize: 11,
                                        fontWeight: "bold", cursor: "pointer", letterSpacing: 1,
                                        textTransform: "uppercase"
                                    }}
                                >
                                    {isAr ? "عرض المنشورات" : "Show Posts"}
                                </button>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* Landmark Markers  */}
                {showLandmarks && LANDMARKS.map(landmark => (
                    <Marker
                        key={landmark.id}
                        position={[landmark.lat, landmark.lng]}
                        icon={getLandmarkIcon(isAr ? landmark.nameAr : landmark.name)}
                        eventHandlers={{ click: () => onLandmarkSelect?.(landmark.id) }}
                    >
                        <Popup>
                            <div style={{ fontFamily: "system-ui", textAlign: "center", minWidth: 140 }}>
                                <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 4 }}>
                                    {isAr ? landmark.nameAr : landmark.name}
                                </div>
                                <button
                                    onClick={() => onLandmarkSelect?.(landmark.id)}
                                    style={{
                                        background: "#f97316", color: "#fff", border: "none",
                                        borderRadius: 6, padding: "4px 12px", fontSize: 11,
                                        fontWeight: "bold", cursor: "pointer", textTransform: "uppercase"
                                    }}
                                >
                                    {isAr ? "اكتشف المعلم" : "Explore Landmark"}
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[9999] bg-black/70 backdrop-blur-sm rounded-xl p-3 flex flex-col gap-1.5 text-[10px] border border-white/10">
                {[
                    { color: "#C5A059", label: isAr ? "مدن رئيسية" : "Imperial Cities" },
                    { color: "#60a5fa", label: isAr ? "مدن كبرى" : "Major Cities" },
                    { color: "#a78bfa", label: isAr ? "سياحية" : "Heritage Sites" },
                    { color: "#f97316", label: isAr ? "معالم" : "Landmarks" },
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }}></span>
                        <span className="text-white/80">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Reset Button */}
            {selectedCityId && (
                <button
                    onClick={() => onCitySelect(null)}
                    className="absolute top-3 right-3 z-[9999] bg-black/70 backdrop-blur-md border border-[#C5A059]/50 text-[#C5A059] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-black transition-all"
                >
                    {isAr ? "← العودة" : "← All Morocco"}
                </button>
            )}
        </div>
    );
}
