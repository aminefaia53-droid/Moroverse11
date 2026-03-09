"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguage } from "../../context/LanguageContext";

// Fix standard marker icons in Next.js/Leaflet
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Marker for selected city
const SelectedIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const CITIES = [
    { id: "marrakech", name: "Marrakech", nameAr: "مراكش", lat: 31.6295, lng: -7.9811 },
    { id: "fez", name: "Fez", nameAr: "فاس", lat: 34.0331, lng: -5.0003 },
    { id: "tangier", name: "Tangier", nameAr: "طنجة", lat: 35.7595, lng: -5.8340 },
    { id: "chefchaouen", name: "Chefchaouen", nameAr: "شفشاون", lat: 35.1714, lng: -5.2697 },
    { id: "ouarzazate", name: "Ouarzazate", nameAr: "ورزازات", lat: 30.9189, lng: -6.8934 },
    { id: "rabat", name: "Rabat", nameAr: "الرباط", lat: 34.0209, lng: -6.8416 },
];

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
}

export default function FeedMap({ onCitySelect, selectedCityId }: { onCitySelect: (cityId: string | null) => void, selectedCityId: string | null }) {
    const { lang } = useLanguage();
    const isAr = lang === 'ar';

    const center: [number, number] = [31.7917, -7.0926]; // Center of Morocco

    const handleMapClick = () => {
        // If clicking outside markers, reset selection
        // In leaflet, we handle this by an empty click on the map container
        // For simplicity, we add a reset button overlay instead
    };

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-2xl z-0 isolate">
            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={false}
                className="w-full h-full"
                style={{ background: '#0a0a0a' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {CITIES.map(city => (
                    <Marker
                        key={city.id}
                        position={[city.lat, city.lng]}
                        icon={selectedCityId === city.id ? SelectedIcon : DefaultIcon}
                        eventHandlers={{
                            click: () => onCitySelect(city.id)
                        }}
                    >
                        <Popup className="custom-popup">
                            <div className="text-center font-bold text-[#C5A059] font-serif uppercase tracking-widest text-xs">
                                {isAr ? city.nameAr : city.name}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay controls */}
            {selectedCityId && (
                <button
                    onClick={() => onCitySelect(null)}
                    className="absolute top-4 right-4 z-[9999] bg-black/60 backdrop-blur-md border border-[#C5A059]/40 text-white px-4 py-2 rounded-lg text-xs tracking-wider uppercase hover:bg-black/80 transition-colors"
                >
                    {isAr ? 'عرض كل المغرب' : 'Show All Morocco'}
                </button>
            )}
        </div>
    );
}
