// All Moroccan cities data — kept separate from FeedMap to avoid importing Leaflet in SSR contexts

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
    // Saharan
    { id: "laayoune", name: "Laâyoune", nameAr: "العيون", lat: 27.1536, lng: -13.2033, type: "saharan" },
    { id: "dakhla", name: "Dakhla", nameAr: "الداخلة", lat: 23.6847, lng: -15.9570, type: "saharan" },
];

export const LANDMARKS = [
    { id: "hassan", name: "Hassan Tower", nameAr: "صومعة حسان", lat: 34.0245, lng: -6.8228 },
    { id: "koutoubia", name: "Koutoubia Mosque", nameAr: "مسجد الكتبية", lat: 31.6238, lng: -7.9946 },
    { id: "volubilis", name: "Volubilis", nameAr: "وليلي", lat: 34.0674, lng: -5.5556 },
    { id: "ait_benhaddou", name: "Aït Ben Haddou", nameAr: "أيت بنحدو", lat: 31.0472, lng: -7.1372 },
    { id: "badii_palace", name: "El Badi Palace", nameAr: "قصر البديع", lat: 31.6148, lng: -7.9857 },
    { id: "marinid", name: "Marinid Tombs", nameAr: "مقابر المرينيين", lat: 34.0671, lng: -4.9885 },
    { id: "chellah", name: "Chellah", nameAr: "شالة", lat: 33.9921, lng: -6.8319 },
];
