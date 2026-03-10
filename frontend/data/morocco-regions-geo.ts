/**
 * Simplified Morocco Regions GeoJSON — 12 Official Regions (2015 Reform)
 * Coordinates are simplified polygons suitable for interactive overlays.
 * Source: Public domain administrative boundaries data.
 */
const moroccoRegionsGeoJSON = {
    type: "FeatureCollection" as const,
    features: [
        {
            type: "Feature",
            properties: { NAME_1: "Tanger-Tétouan-Al Hoceïma", id: "tangier" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-5.92, 36.01], [-5.33, 35.89], [-4.96, 35.77], [-4.30, 35.15],
                    [-3.90, 34.85], [-4.50, 34.60], [-5.20, 34.70], [-5.80, 34.90],
                    [-6.20, 35.30], [-6.35, 35.70], [-5.92, 36.01]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "L'Oriental", id: "oujda" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-3.90, 34.85], [-3.00, 34.50], [-2.20, 34.80], [-1.70, 34.20],
                    [-1.70, 33.00], [-2.50, 32.50], [-3.50, 32.00], [-4.50, 32.20],
                    [-4.50, 34.60], [-3.90, 34.85]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Fès-Meknès", id: "fes" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-5.20, 34.70], [-4.50, 34.60], [-4.50, 32.20], [-5.00, 32.00],
                    [-5.50, 32.50], [-6.00, 33.00], [-5.80, 33.80], [-5.50, 34.30],
                    [-5.20, 34.70]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Rabat-Salé-Kénitra", id: "rabat" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-6.35, 35.70], [-6.20, 35.30], [-5.80, 34.90], [-5.50, 34.30],
                    [-5.80, 33.80], [-6.50, 33.50], [-7.00, 33.80], [-7.00, 34.50],
                    [-6.70, 35.00], [-6.35, 35.70]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Béni Mellal-Khénifra", id: "beni_mellal" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-6.00, 33.00], [-5.50, 32.50], [-5.00, 32.00], [-5.00, 31.50],
                    [-5.80, 31.50], [-6.50, 31.80], [-7.00, 32.20], [-6.80, 32.80],
                    [-6.50, 33.50], [-6.00, 33.00]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Casablanca-Settat", id: "casablanca" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-7.00, 33.80], [-6.50, 33.50], [-6.80, 32.80], [-7.00, 32.20],
                    [-7.80, 32.00], [-8.50, 32.50], [-8.50, 33.20], [-8.00, 33.70],
                    [-7.50, 33.90], [-7.00, 33.80]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Marrakech-Safi", id: "marrakech" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-7.00, 32.20], [-6.50, 31.80], [-5.80, 31.50], [-5.80, 30.80],
                    [-6.50, 30.50], [-7.50, 30.50], [-8.50, 30.50], [-9.00, 31.00],
                    [-8.80, 31.70], [-8.50, 32.50], [-7.80, 32.00], [-7.00, 32.20]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Drâa-Tafilalet", id: "ouarzazate" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-5.80, 31.50], [-5.00, 31.50], [-4.00, 31.00], [-3.50, 30.50],
                    [-3.70, 29.80], [-4.50, 29.50], [-5.50, 29.00], [-6.50, 29.00],
                    [-7.00, 29.50], [-7.50, 30.00], [-7.50, 30.50], [-6.50, 30.50],
                    [-5.80, 30.80], [-5.80, 31.50]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Souss-Massa", id: "agadir" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-9.00, 31.00], [-8.50, 30.50], [-7.50, 30.50], [-7.50, 30.00],
                    [-8.00, 29.50], [-8.80, 29.00], [-9.50, 29.00], [-10.20, 29.50],
                    [-10.00, 30.20], [-9.50, 30.70], [-9.00, 31.00]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Guelmim-Oued Noun", id: "guelmim" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-10.20, 29.50], [-9.50, 29.00], [-8.80, 29.00], [-8.00, 29.50],
                    [-7.50, 30.00], [-7.00, 29.50], [-6.50, 29.00], [-6.50, 28.00],
                    [-8.00, 27.50], [-9.50, 27.50], [-10.50, 28.00], [-11.00, 28.70],
                    [-10.50, 29.20], [-10.20, 29.50]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Laâyoune-Sakia El Hamra", id: "laayoune" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-11.00, 28.70], [-10.50, 28.00], [-9.50, 27.50], [-8.00, 27.50],
                    [-6.50, 28.00], [-6.00, 27.00], [-8.70, 26.00], [-11.00, 26.00],
                    [-13.20, 26.00], [-13.20, 27.50], [-12.00, 28.00], [-11.00, 28.70]
                ]]
            }
        },
        {
            type: "Feature",
            properties: { NAME_1: "Dakhla-Oued Ed Dahab", id: "dakhla" },
            geometry: {
                type: "Polygon",
                coordinates: [[
                    [-13.20, 26.00], [-11.00, 26.00], [-8.70, 26.00], [-6.00, 27.00],
                    [-6.00, 21.30], [-13.20, 21.30], [-17.10, 23.70], [-17.10, 26.00],
                    [-13.20, 26.00]
                ]]
            }
        }
    ]
};

export default moroccoRegionsGeoJSON;
