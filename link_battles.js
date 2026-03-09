const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'frontend/data/generated-content.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

if (data.battles && Array.isArray(data.battles)) {
    data.battles = data.battles.map(battle => {
        if (battle.id === 'battle-zallaqa') {
            battle.imageUrl = '/images/gemini-generated/battle-zallaqa.png';
            battle.visualStyle = '8K Photo-Realistic Cinematic';
        } else if (battle.id === 'battle-three-kings') {
            battle.imageUrl = '/images/gemini-generated/battle-three-kings.png';
            battle.visualStyle = '8K Photo-Realistic Cinematic';
        } else if (battle.id === 'battle-isly') {
            battle.imageUrl = '/images/gemini-generated/battle-isly.png';
            battle.visualStyle = '8K Photo-Realistic Cinematic';
        }
        return battle;
    });
} else {
    data.battles = [
        {
            "id": "battle-zallaqa",
            "name": {
                "ar": "معركة الزلاقة",
                "en": "Battle of Sagrajas"
            },
            "year": "1086 AD",
            "visualStyle": "8K Photo-Realistic Cinematic",
            "imageUrl": "/images/gemini-generated/battle-zallaqa.png",
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
            "visualStyle": "8K Photo-Realistic Cinematic",
            "imageUrl": "/images/gemini-generated/battle-three-kings.png",
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
            "visualStyle": "8K Photo-Realistic Cinematic",
            "imageUrl": "/images/gemini-generated/battle-isly.png",
            "isPending": false,
            "history": {
                "ar": "معركة تاريخية وقعت قرب وجدة بين الجيش المغربي والقوات الفرنسية تضامناً مع المقاومة الجزائرية.",
                "en": "A historic battle near Oujda between the Moroccan army and French forces in solidarity with the Algerian resistance."
            }
        }
    ];
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log("Successfully linked 8K battle assets.");
