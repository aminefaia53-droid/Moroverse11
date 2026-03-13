const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load env from .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const envLines = envFile.split('\n');
const envConfig = {};
envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        envConfig[key.trim()] = valueParts.join('=').trim();
    }
});

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Connecting to:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('Fetching all Landmark posts...');
    const { data, error } = await supabase
        .from('community_posts')
        .select('id, title, category, location_type, model_url')
        .eq('category', 'Landmarks');
    
    if (error) {
        console.error('Error fetching landmarks:', error);
    } else {
        console.log('Landmarks found:', JSON.stringify(data, null, 2));
    }
}

checkData();
