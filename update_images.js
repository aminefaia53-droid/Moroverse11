const fs = require('fs');
const path = require('path');

const filepath = path.resolve('c:/Users/amine/OneDrive/Desktop/Moroverse/frontend/data/generated-content.json');

const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

const imageMapping = {
    "rabat": "https://images.unsplash.com/photo-1549733059-d81615d862e",
    "casablanca": "https://images.unsplash.com/photo-1559586111-94eb09bf2bb5",
    "marrakech": "https://images.unsplash.com/photo-1548013146-72479768bbaa",
    "fes": "https://images.unsplash.com/photo-1584617415442-f87f2e468d60",
    "tangier": "https://images.unsplash.com/photo-1580227974557-41a69074094e",
    "meknes": "https://images.unsplash.com/photo-1549733059-d81615d862e",
    "agadir": "https://images.unsplash.com/photo-1533116548767-463879f725fb",
    "chefchaouen": "https://images.unsplash.com/photo-1528127269322-539801943592",
    "tetouan": "https://images.unsplash.com/photo-1580227974557-41a69074094e",
    "essaouira": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200",
    "ouarzazate": "https://images.unsplash.com/photo-1559586111-94eb09bf2bb5",
    "sahara": "https://images.unsplash.com/photo-1559586111-94eb09bf2bb5",
    "safi": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200"
};

// Update Landmarks
data.landmarks.forEach(landmark => {
    if (!landmark.imageUrl) {
        const cityId = landmark.city.en.toLowerCase();
        let mappedUrl = imageMapping[cityId] || "https://images.unsplash.com/photo-1548013146-72479768bbaa";

        const nameEn = landmark.name.en.toLowerCase();
        if (nameEn.includes("hassan ii")) {
            mappedUrl = "https://images.unsplash.com/photo-1559586111-94eb09bf2bb5";
        } else if (nameEn.includes("majorelle")) {
            mappedUrl = "https://images.unsplash.com/photo-1528127269322-539801943592";
        } else if (cityId.includes("chefchaouen")) {
            mappedUrl = "https://images.unsplash.com/photo-1528127269322-539801943592";
        }

        landmark.imageUrl = mappedUrl + "?q=80&w=1080&auto=format&fit=crop";
    }
});

// Update Cities
data.cities.forEach(city => {
    const cityId = city.id.toLowerCase();
    const mappedUrl = imageMapping[cityId] || "https://images.unsplash.com/photo-1549733059-d81615d862e";
    city.imageUrl = mappedUrl + "?q=80&w=1080&auto=format&fit=crop";
    city.isPending = false;
});

// Add Battles
data.battles = [
    {
        "id": "battle-zallaqa",
        "name": {
            "ar": "معركة الزلاقة",
            "en": "Battle of Sagrajas"
        },
        "year": "1086 AD",
        "visualStyle": "Epic Oil Painting",
        "imageUrl": "/battle_zallaqa_epic.png",
        "isPending": false,
        "history": {
            "ar": "انتصار ساحق للمرابطين بقيادة يوسف بن تاشفين، وحّد بلاد المغرب والأندلس.",
            "en": "A decisive Almoravid victory led by Yusuf ibn Tashfin, uniting Morocco and Al-Andalus."
        }
    },
    {
        "id": "battle-three-kings",
        "name": {
            "ar": "معركة الملوك الثلاثة",
            "en": "Battle of the Three Kings"
        },
        "year": "1578 AD",
        "visualStyle": "Renaissance Masterpiece",
        "imageUrl": "/battle_three_kings_epic.png",
        "isPending": false,
        "history": {
            "ar": "معركة وادي المخازن الشهيرة التي أنهت الأطماع البرتغالية في المغرب.",
            "en": "The famous Battle of Wadi al-Makhazin that ended Portuguese ambitions in Morocco."
        }
    },
    {
        "id": "battle-isly",
        "name": {
            "ar": "معركة إيسلي",
            "en": "Battle of Isly"
        },
        "year": "1844 AD",
        "visualStyle": "19th Century Drama",
        "imageUrl": "/battle_isly_epic.png",
        "isPending": false,
        "history": {
            "ar": "مواجهة بطولية للجيش المغربي ضد القوات الفرنسية دفاعاً عن السيادة والجزائر.",
            "en": "A heroic confrontation of the Moroccan army against French forces in defense of sovereignty and Algeria."
        }
    }
];

fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');

console.log("Update complete.");
