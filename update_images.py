import json
import os

filepath = r'c:\Users\amine\OneDrive\Desktop\Moroverse\frontend\data\generated-content.json'

with open(filepath, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Image Mapping logic
image_mapping = {
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
}

# Update Landmarks
for landmark in data['landmarks']:
    if not landmark.get('imageUrl'):
        city_id = landmark['city']['en'].lower()
        # Handle some city mappings or specific landmarks
        mapped_url = image_mapping.get(city_id, "https://images.unsplash.com/photo-1548013146-72479768bbaa")
        
        # Specific override for famous landmarks
        if "hassan II" in landmark['name']['en'].lower():
            mapped_url = "https://images.unsplash.com/photo-1559586111-94eb09bf2bb5"
        elif "majorelle" in landmark['name']['en'].lower():
            mapped_url = "https://images.unsplash.com/photo-1528127269322-539801943592"
        elif "chefchaouen" in city_id:
            mapped_url = "https://images.unsplash.com/photo-1528127269322-539801943592"
            
        landmark['imageUrl'] = mapped_url + "?q=80&w=1080&auto=format&fit=crop"

# Add Battles
data['battles'] = [
    {
        "id": "battle-zallaqa",
        "name": {
            "ar": "معركة الزلاقة",
            "en": "Battle of Sagrajas"
        },
        "year": "1086 AD",
        "visualStyle": "Epic Oil Painting",
        "imageUrl": "/battle_zallaqa_epic.png",
        "isPending": false
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
        "isPending": false
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
        "isPending": false
    }
]

with open(filepath, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Update complete.")
