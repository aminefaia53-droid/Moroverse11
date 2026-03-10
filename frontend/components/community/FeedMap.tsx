"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import * as L from "leaflet";
import { useLanguage } from "../../context/LanguageContext";
import moroccoRegionsGeoJSON from "../../data/morocco-regions-geo";

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

    const mapCenter: [number, number] = [29.0, -9.5];

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
                    .feed-map-container .leaflet-container { background: #060606 !important; }
                `
            }} />

            <MapContainer
                center={mapCenter}
                zoom={5}
                scrollWheelZoom={true}
                inertia={true}
                inertiaDeceleration={3000}
                inertiaMaxSpeed={1500}
                className="w-full h-full"
                style={{ background: "#060606" }}
            >
                <MapController center={mapCenter} zoom={5} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                />

                <GeoJSON
                    key={`${selectedCityId}-${highlightedCityIds.join(',')}`}
                    data={moroccoRegionsGeoJSON as any}
                    style={(feature) => {
                        const regionName = feature?.properties?.NAME_1 ?? "";
                        const cityId = regionToCityId(regionName);
                        const isSelected = !!selectedCityId && cityId === selectedCityId;
                        const isAIHighlighted = highlightedCityIds.includes(cityId);

                        if (isAIHighlighted) return { ...selectedStyle, fillOpacity: 0.5, weight: 3 };
                        return isSelected ? selectedStyle : baseStyle;
                    }}
                    onEachFeature={onEachFeature}
                />
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
