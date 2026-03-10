"use client";

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguage } from "../../context/LanguageContext";

// Fix default Leaflet icon paths for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const makeIcon = (color: string) => L.divIcon({
    className: "",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12],
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid rgba(255,255,255,0.8);box-shadow:0 0 12px ${color};cursor:pointer;transition:transform .2s" onmouseover="this.style.transform='scale(1.5)'" onmouseout="this.style.transform='scale(1)'"></div>`
});

const normalIcon = makeIcon("#C5A059");
const selectedIcon = makeIcon("#facc15");
const landmarkIcon = makeIcon("#f97316");

// Full list of Moroccan cities
export const ALL_CITIES = [
    // Imperial Cities
    { id: "marrakech", name: "Marrakech", nameAr: "مراكش", lat: 31.6295, lng: -7.9811, type: "imperial" },
    { id: "fez", name: "Fez", nameAr: "فاس", lat: 34.0331, lng: -5.0003, type: "imperial" },
    { id: "meknes", name: "Meknes", nameAr: "مكناس", lat: 33.8935, lng: -5.5473, type: "imperial" },
    { id: "rabat", name: "Rabat", nameAr: "الرباط", lat: 34.0209, lng: -6.8416, type: "imperial" },
    // Major Cities
    { id: "casablanca", name: "Casablanca", nameAr: "الدار البيضاء", lat: 33.5731, lng: -7.5898, type: "major" },
    { id: "tangier", name: "Tangier", nameAr: "طنجة", lat: 35.7595, lng: -5.8340, type: "major" },
    { id: "agadir", name: "Agadir", nameAr: "أكادير", lat: 30.4278, lng: -9.5981, type: "major" },
    { id: "oujda", name: "Oujda", nameAr: "وجدة", lat: 34.6853, lng: -1.9037, type: "major" },
    { id: "kenitra", name: "Kenitra", nameAr: "القنيطرة", lat: 34.2610, lng: -6.5802, type: "major" },
    { id: "tetouan", name: "Tetouan", nameAr: "تطوان", lat: 35.5785, lng: -5.3684, type: "major" },
    { id: "safi", name: "Safi", nameAr: "آسفي", lat: 32.2994, lng: -9.2372, type: "major" },
    { id: "el_jadida", name: "El Jadida", nameAr: "الجديدة", lat: 33.2549, lng: -8.5084, type: "major" },
    // Heritage & Tourism
    { id: "chefchaouen", name: "Chefchaouen", nameAr: "شفشاون", lat: 35.1714, lng: -5.2697, type: "heritage" },
    { id: "essaouira", name: "Essaouira", nameAr: "الصويرة", lat: 31.5125, lng: -9.7700, type: "heritage" },
    { id: "ouarzazate", name: "Ouarzazate", nameAr: "ورزازات", lat: 30.9189, lng: -6.8934, type: "heritage" },
    { id: "merzouga", name: "Merzouga", nameAr: "مرزوقة", lat: 31.0988, lng: -4.0124, type: "heritage" },
    { id: "ifrane", name: "Ifrane", nameAr: "إفران", lat: 33.5264, lng: -5.1124, type: "heritage" },
    { id: "azrou", name: "Azrou", nameAr: "أزرو", lat: 33.4360, lng: -5.2190, type: "heritage" },
    { id: "taza", name: "Taza", nameAr: "تازة", lat: 34.2100, lng: -3.9900, type: "heritage" },
    { id: "al_hoceima", name: "Al Hoceima", nameAr: "الحسيمة", lat: 35.2479, lng: -3.9288, type: "heritage" },
    { id: "tiznit", name: "Tiznit", nameAr: "تيزنيت", lat: 29.6975, lng: -9.7303, type: "heritage" },
    { id: "taroudant", name: "Taroudant", nameAr: "تارودانت", lat: 30.4724, lng: -8.8773, type: "heritage" },
    { id: "zagora", name: "Zagora", nameAr: "زاكورة", lat: 30.3333, lng: -5.8435, type: "heritage" },
    // Saharan Cities
    { id: "laayoune", name: "Laâyoune", nameAr: "العيون", lat: 27.1536, lng: -13.2033, type: "saharan" },
    { id: "dakhla", name: "Dakhla", nameAr: "الداخلة", lat: 23.6847, lng: -15.9570, type: "saharan" },
];

const LANDMARKS = [
    { id: "hassan", name: "Hassan Tower", nameAr: "صومعة حسان", lat: 34.0245, lng: -6.8228 },
    { id: "koutoubia", name: "Koutoubia Mosque", nameAr: "مسجد الكتبية", lat: 31.6238, lng: -7.9946 },
    { id: "volubilis", name: "Volubilis", nameAr: "وليلي", lat: 34.0674, lng: -5.5556 },
    { id: "ait_benhaddou", name: "Aït Ben Haddou", nameAr: "أيت بنحدو", lat: 31.0472, lng: -7.1372 },
    { id: "badii_palace", name: "El Badi Palace", nameAr: "قصر البديع", lat: 31.6148, lng: -7.9857 },
    { id: "marinid", name: "Marinid Tombs", nameAr: "مقابر المرينيين", lat: 34.0671, lng: -4.9885 },
    { id: "chellah", name: "Chellah", nameAr: "شالة", lat: 33.9921, lng: -6.8319 },
];

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
                        icon={L.divIcon({
                            className: "",
                            iconSize: [22, 22],
                            iconAnchor: [11, 11],
                            popupAnchor: [0, -14],
                            html: `<div title="${isAr ? landmark.nameAr : landmark.name}" style="width:22px;height:22px;border-radius:4px;background:#f97316;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:11px;cursor:pointer;box-shadow:0 0 10px #f97316aa">🏛</div>`
                        })}
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
