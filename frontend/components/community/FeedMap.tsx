"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents, Marker, Popup, Polyline } from "react-leaflet";
import * as L from "leaflet";
import Supercluster from 'supercluster';
import { useLanguage } from "../../context/LanguageContext";
import moroccoRegionsGeoJSON from "../../data/morocco-regions-geo";
// Removed direct Supabase client for DAL approach
import { SocialService } from "../../services/SocialService";
import { Post as PostType, ViewportBounds } from "../../types/social";

function MapController() {
    const map = useMap();

    useEffect(() => {
        const handleFlyToBounds = (e: Event) => {
            const { bounds } = (e as CustomEvent).detail;
            if (bounds) {
                map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
            }
        };
        const handleFlyToTarget = (e: Event) => {
            const { target, zoom } = (e as CustomEvent).detail;
            if (target && zoom) {
                map.flyTo(target, zoom, { duration: 1.5 });
            }
        };
        window.addEventListener('map-fly-to-bounds', handleFlyToBounds);
        window.addEventListener('map-fly-to-target', handleFlyToTarget);
        return () => {
             window.removeEventListener('map-fly-to-bounds', handleFlyToBounds);
             window.removeEventListener('map-fly-to-target', handleFlyToTarget);
        };
    }, [map]);

    return null;
}

const createCustomIcon = (type: string, isSelected: boolean) => {
    const color = type === 'battle' ? '#ef4444'
        : type === 'temp' ? '#f59e0b'
        : type === 'community' ? '#a855f7'
        : type === 'cluster' ? '#C5A059'
        : '#C5A059';
    const size = isSelected ? 40 : 32;

    return L.divIcon({
        className: 'custom-map-pin',
        html: `
            <div style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transform: scale(${isSelected ? 1.2 : 1})" class="${type === 'temp' ? 'animate-bounce' : ''}">
                <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16 17 20 13.4183 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 13.4183 8 17 12 21Z" fill="${color}" stroke="white" stroke-width="1.5"/>
                    ${type === 'community'
                        ? `<text x="12" y="13" text-anchor="middle" font-size="7" fill="white" font-weight="bold" font-family="sans-serif">✍</text>`
                        : type === 'cluster' 
                        ? `<circle cx="12" cy="9" r="3" fill="white" fill-opacity="0.8"/>`
                        : `<circle cx="12" cy="9" r="3" fill="white" fill-opacity="0.8"/>`
                    }
                </svg>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
    });
};

const clusterIcon = (count: number) => {
    return L.divIcon({
        html: `<div class="bg-[#C5A059] text-black font-bold w-10 h-10 rounded-full border-2 border-white flex items-center justify-center shadow-lg transform scale-100 hover:scale-110 transition-transform">${count}</div>`,
        className: 'cluster-icon',
        iconSize: [40, 40]
    });
};

interface FeedMapProps {
    onCitySelect: (cityId: string | null) => void;
    selectedCityId: string | null;
    onLandmarkSelect: (landmarkId: string | null) => void;
    selectedLandmarkId: string | null;
    showLandmarks: boolean;
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

const HARDCODED_PINS = [
    { id: 'marrakech', name: 'Marrakech', lat: 31.6295, lng: -7.9811, type: 'city' },
    { id: 'fes', name: 'Fez', lat: 34.0331, lng: -5.0003, type: 'city' },
    { id: 'tangier', name: 'Tangier', lat: 35.7595, lng: -5.8340, type: 'city' },
    { id: 'rabat', name: 'Rabat', lat: 34.0209, lng: -6.8416, type: 'city' },
    { id: 'casablanca', name: 'Casablanca', lat: 33.5731, lng: -7.5898, type: 'city' },
    { id: 'agadir', name: 'Agadir', lat: 30.4278, lng: -9.5981, type: 'city' },
    { id: 'ouarzazate', name: 'Ouarzazate', lat: 30.9189, lng: -6.8934, type: 'city' },
    { id: 'essaouira', name: 'Essaouira', lat: 31.5085, lng: -9.7595, type: 'city' },
    { id: 'chefchaouen', name: 'Chefchaouen', lat: 35.1688, lng: -5.2636, type: 'city' },
    { id: 'meknes', name: 'Meknes', lat: 33.8730, lng: -5.5407, type: 'city' },
    { id: 'tetouan', name: 'Tetouan', lat: 35.5785, lng: -5.3684, type: 'city' },
    { id: 'oujda', name: 'Oujda', lat: 34.6814, lng: -1.9086, type: 'city' },
    { id: 'laayoune', name: 'Laayoune', lat: 27.1253, lng: -13.1625, type: 'city' },
    { id: 'dakhla', name: 'Dakhla', lat: 23.6848, lng: -15.9579, type: 'city' },
    { id: 'errachidia', name: 'Errachidia', lat: 31.9314, lng: -4.4244, type: 'city' }
];

export default function FeedMap({ onCitySelect, selectedCityId }: FeedMapProps) {
    const { lang } = useLanguage();
    const isAr = lang === "ar";
    const [highlightedCityIds, setHighlightedCityIds] = useState<string[]>([]);
    const [itineraryPoints, setItineraryPoints] = useState<[number, number][]>([]);
    const [tempPin, setTempPin] = useState<{lat: number, lng: number, name: string} | null>(null);
    const [zoomLevel, setZoomLevel] = useState(6);
    const [bounds, setBounds] = useState<ViewportBounds | null>(null);
    const [pins, setPins] = useState<any[]>(HARDCODED_PINS);
    const [communityPins, setCommunityPins] = useState<PostType[]>([]);
    const [clusters, setClusters] = useState<any[]>([]);

    const mapCenter: [number, number] = [31.7917, -7.0926];
    const initialZoom = 6;

    // Zero-Trust Data Fetching: Centralized DAL with Bounding Box
    const fetchData = useCallback(async (currentBounds: ViewportBounds) => {
        try {
            // TODO: In Phase 2, map_pins will also be fetched via viewport bounds if size grows
            const posts = await SocialService.getPosts(currentBounds);
            setCommunityPins(posts);
        } catch (err) {
            console.error('MAP_CYBER_FORTRESS_ERROR:', err);
        }
    }, []);

    // Cluster Initialization (Military-Grade Performance)
    const index = useMemo(() => {
        const supercluster = new Supercluster({
            radius: 40,
            maxZoom: 16
        });
        
        const communityPoints = communityPins.map(p => ({
            type: 'Feature',
            properties: { cluster: false, postId: p.id, type: 'community', post: p },
            geometry: { type: 'Point', coordinates: [p.lng!, p.lat!] }
        }));

        const cityPoints = pins.map(p => ({
            type: 'Feature',
            properties: { cluster: false, pinId: p.id, type: p.type, pin: p },
            geometry: { type: 'Point', coordinates: [p.lng, p.lat] }
        }));

        supercluster.load([...communityPoints, ...cityPoints] as any);
        return supercluster;
    }, [communityPins, pins]);

    // Handle map interaction to trigger viewport-based loading
    const MapEvents = () => {
        useMapEvents({
            moveend: (e) => {
                const map = e.target;
                const b = map.getBounds();
                const newBounds = {
                    minLat: b.getSouth(),
                    minLng: b.getWest(),
                    maxLat: b.getNorth(),
                    maxLng: b.getEast()
                };
                setBounds(newBounds);
                setZoomLevel(map.getZoom());
                fetchData(newBounds);
            }
        });
        return null;
    };

    const getSpiderifiedClusters = useCallback(() => {
        if (!bounds) return [];
        const bbox: [number, number, number, number] = [bounds.minLng, bounds.minLat, bounds.maxLng, bounds.maxLat];
        const rawClusters = index.getClusters(bbox, zoomLevel);
        
        const finalMarkers: any[] = [];
        rawClusters.forEach(c => {
            const { cluster: isCluster, point_count: pointCount } = c.properties;
            // Spiderfy if cluster exists at max index zoom (16) or if very close
            if (isCluster && zoomLevel >= 16) {
                const leaves = index.getLeaves(c.id as number, Infinity);
                leaves.forEach((leaf, i) => {
                    const angle = (i / leaves.length) * 2 * Math.PI;
                    const idNum = typeof leaf.id === 'string' ? parseInt(leaf.id) : (leaf.id || 0);
                    const radius = 0.0001 * (1 + i / (idNum + 1)); // Safe radial spread
                    const [lng, lat] = leaf.geometry.coordinates;
                    finalMarkers.push({
                        ...leaf,
                        geometry: {
                            ...leaf.geometry,
                            coordinates: [lng + Math.cos(angle) * radius, lat + Math.sin(angle) * radius]
                        },
                        properties: { ...leaf.properties, spider: true }
                    });
                });
            } else {
                finalMarkers.push(c);
            }
        });
        return finalMarkers;
    }, [index, zoomLevel, bounds]);

    useEffect(() => {
        if (bounds) {
            setClusters(getSpiderifiedClusters());
        }
    }, [getSpiderifiedClusters, bounds]);

    useEffect(() => {
        const handleConciergeCommand = async (e: Event) => {
            const { cities, isItinerary, dynamicLocation } = (e as CustomEvent).detail;
            if ((!cities || cities.length === 0) && !dynamicLocation) return;
            
            setTempPin(null);
            if (cities && cities.length > 0) setHighlightedCityIds(cities);

            if (isItinerary) {
                const points: [number, number][] = [];
                cities.forEach((cId: string) => {
                    const pin = pins.find(p => p.id === cId);
                    if (pin) points.push([pin.lat, pin.lng]);
                });
                
                if (points.length > 1) {
                     setItineraryPoints(points);
                     const polyline = L.polyline(points);
                     window.dispatchEvent(new CustomEvent('map-fly-to-bounds', { detail: { bounds: polyline.getBounds() } }));
                }
            } else {
                setItineraryPoints([]);
                // Optimized deep-search for AI targets
                const mainId = cities?.[0] as string | undefined;
                const mainPin = pins.find(p => p.id === mainId || p.name.toLowerCase() === dynamicLocation?.toLowerCase().trim());
                if (mainPin) {
                    window.dispatchEvent(new CustomEvent('map-fly-to-target', { detail: { target: [mainPin.lat, mainPin.lng], zoom: 15 } }));
                } else if (dynamicLocation) {
                    // Fallback to geocoding only if DB fails
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dynamicLocation + ', Morocco')}&limit=1`);
                        const data = await res.json();
                        if (data?.[0]) {
                            const lat = parseFloat(data[0].lat);
                            const lon = parseFloat(data[0].lon);
                            setTempPin({ lat, lng: lon, name: dynamicLocation });
                            window.dispatchEvent(new CustomEvent('map-fly-to-target', { detail: { target: [lat, lon], zoom: 15 } }));
                        }
                    } catch (err) {}
                }
            }
        };

        window.addEventListener('concierge-map-command', handleConciergeCommand);
        return () => window.removeEventListener('concierge-map-command', handleConciergeCommand);
    }, [pins]);

    const onEachFeature = useCallback((feature: any, layer: any) => {
        const regionName = feature.properties?.NAME_1 ?? "";
        layer.on({
            click: (e: any) => {
                const cityId = regionToCityId(regionName);
                onCitySelect(cityId);
                e.target._map.flyToBounds(e.target.getBounds(), { padding: [40, 40], duration: 1.1 });
            },
        });
    }, [onCitySelect]);

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl isolate feed-map-container">
            <style dangerouslySetInnerHTML={{
                __html: `
                    .leaflet-container { background: #020202 !important; }
                    .custom-map-pin { transition: all 0.2s ease-out; }
                    .pin-popup .leaflet-popup-content-wrapper { 
                        background: rgba(10, 10, 10, 0.95);
                        backdrop-filter: blur(8px);
                        border: 1px solid rgba(197, 160, 89, 0.3);
                        color: white;
                        border-radius: 12px;
                    }
                `
            }} />

            <MapContainer
                center={mapCenter}
                zoom={initialZoom}
                minZoom={3}
                maxZoom={22}
                className="w-full h-full"
                style={{ background: "#020202" }}
            >
                <MapController />
                <MapEvents />

                <TileLayer
                    attribution='&copy; Google'
                    url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    maxZoom={22}
                />

                {itineraryPoints.length > 1 && (
                    <Polyline positions={itineraryPoints} pathOptions={{ color: '#C5A059', weight: 4, dashArray: '10, 10' }} />
                )}

                <GeoJSON
                    data={moroccoRegionsGeoJSON as any}
                    style={{ fillColor: "transparent", fillOpacity: 0, color: "transparent", weight: 0 }}
                    onEachFeature={onEachFeature}
                />

                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates;
                    const { cluster: isCluster, point_count: pointCount, type, pin, post } = cluster.properties;

                    if (isCluster) {
                        return (
                            <Marker
                                key={`cluster-${cluster.id}`}
                                position={[latitude, longitude]}
                                icon={clusterIcon(pointCount)}
                                eventHandlers={{
                                    click: (e) => {
                                        const expansionZoom = Math.min(index.getClusterExpansionZoom(cluster.id), 18);
                                        e.target._map.setView([latitude, longitude], expansionZoom);
                                    }
                                }}
                            />
                        );
                    }

                    if (type === 'community' && post) {
                        return (
                            <Marker key={`post-${post.id}`} position={[latitude, longitude]} icon={createCustomIcon('community', false)}>
                                <Popup className="pin-popup">
                                    <div className="p-2 min-w-[200px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <img src={post.profiles?.avatar_url || 'https://i.pravatar.cc/40'} className="w-7 h-7 rounded-full" />
                                            <span className="text-xs font-bold text-[#C5A059]">{post.profiles?.full_name || 'Traveler'}</span>
                                        </div>
                                        <p className="text-[11px] leading-snug">{post.content}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }

                    if (pin) {
                        return (
                            <Marker
                                key={`pin-${pin.id}`}
                                position={[latitude, longitude]}
                                icon={createCustomIcon(pin.type, selectedCityId === pin.id)}
                                eventHandlers={{ click: () => { if (pin.type === 'city') onCitySelect(pin.id); } }}
                            >
                                <Popup className="pin-popup">
                                    <div className="p-2 min-w-[200px]">
                                        <h3 className="text-[#C5A059] font-bold border-b border-[#C5A059]/20 pb-1 mb-1">{pin.name}</h3>
                                        <p className="text-[10px] text-white/80 leading-tight">{pin.description || (isAr ? "معلمة مغربية." : "Moroccan landmark.")}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }

                    return null;
                })}

                {tempPin && (
                    <Marker position={[tempPin.lat, tempPin.lng]} icon={createCustomIcon('temp', true)}>
                        <Popup className="pin-popup">
                            <div className="p-2">
                                <h3 className="text-[#f59e0b] font-bold">{tempPin.name}</h3>
                                <p className="text-[10px]">{isAr ? "تم تحديد الموقع آلياً." : "Al-Mapped location."}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}

