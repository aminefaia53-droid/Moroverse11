/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * MoroVerse WP-to-Supabase Content Migrator
 * Syncs existing historical/community content from Headless WordPress to Supabase.
 */
const { createClient } = require('@supabase/supabase-js');

// Config from environment or user context
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WP_API_URL = process.env.WP_API_URL || 'https://moroverse-admin.local/wp-json/wp/v2';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
    console.log('🚀 Starting MoroVerse Migration: WP -> Supabase');
    
    try {
        // 1. Fetch from WP (Example: Posts category)
        const response = await fetch(`${WP_API_URL}/posts?per_page=100`);
        const wpPosts = await response.json();
        
        console.log(`📦 Found ${wpPosts.length} posts in WordPress.`);
        
        for (const wpPost of wpPosts) {
            // Map WP schema to Supabase schema
            const { data, error } = await supabase.from('community_posts').insert({
                content: wpPost.content.rendered.replace(/<[^>]*>?/gm, ''), // Basic sanitization
                location_name: wpPost.acf?.location_name || 'Morocco',
                image_url: wpPost.featured_media_url,
                created_at: wpPost.date,
                is_approved: true // Legacy content is pre-approved
            }).select();
            
            if (error) {
                console.error(`❌ Failed to migrate post ${wpPost.id}:`, error.message);
            } else {
                console.log(`✅ Migrated: ${wpPost.title.rendered}`);
            }
        }
    } catch (err) {
        console.error('💥 Migration CRITICAL FAILURE:', err);
    }
}

migrate();
