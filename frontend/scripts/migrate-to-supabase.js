const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual .env.local parsing to avoid 'dotenv' dependency
function getEnv(key) {
    const envPath = path.join(__dirname, '../.env.local');
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(new RegExp(`${key}=(.*)`));
    return match ? match[1].trim() : null;
}

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    console.log('🚀 Starting MoroVerse Infinite Migration...');

    const dataPath = path.join(__dirname, '../data/generated-content.json');
    if (!fs.existsSync(dataPath)) {
        console.error('❌ Data file not found at:', dataPath);
        return;
    }

    const db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const categories = ['landmarks', 'cities', 'battles', 'figures'];

    for (const cat of categories) {
        console.log(`\n📦 Migrating category: ${cat}...`);
        const items = db[cat] || [];
        
        for (const item of items) {
            const row = {
                id: item.id,
                category: cat,
                name: item.name,
                description: item.desc || item.history,
                imageUrl: item.imageUrl,
                modelUrl: item.modelUrl,
                audioUrl: item.audioUrl,
                videoUrl: item.videoUrl,
                seo: item.seo,
                metadata: {
                    city: item.city,
                    foundation: item.foundation,
                    regionName: item.regionName,
                    type: item.type,
                    year: item.year,
                    era: item.era,
                    location: item.location,
                    combatants: item.combatants,
                    outcome: item.outcome,
                    isPending: item.isPending
                }
            };

            const { error } = await supabase
                .from('heritage_items')
                .upsert(row, { onConflict: 'id' });

            if (error) {
                if (error.code === '42P01') {
                    console.error(`❌ Table 'heritage_items' does not exist. Please run scripts/schema.sql in Supabase SQL Editor.`);
                    process.exit(1);
                }
                console.error(`❌ Error migrating ${item.id}:`, error.message);
            } else {
                console.log(`✅ Migrated: ${item.id}`);
            }
        }
    }

    console.log('\n✨ Migration Complete!');
}

migrate();
