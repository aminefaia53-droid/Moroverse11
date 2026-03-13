-- ============================================================
-- MoroVerse: Test Data - Kasbah Mediouna 3D Monument
-- Run this in your Supabase SQL Editor to test the Elite View
-- ============================================================

-- IMPORTANT: Replace the user_id below with a valid UUID from your `profiles` table.
-- You can get a valid user_id by running: SELECT id FROM public.profiles LIMIT 1;

-- Step 1: Insert the 3D Monument Post
INSERT INTO public.community_posts (
    user_id,
    content,
    location_name,
    location_type,
    lat,
    lng,
    model_url,
    image_url,
    likes_count,
    is_approved
)
VALUES (
    -- Replace this with a real user UUID from your profiles table
    (SELECT id FROM public.profiles LIMIT 1),

    'قصبة مديونة، درة العمارة المغربية الموحدية. اكتشف تفاصيلها المعمارية الرائعة في العرض الثلاثي الأبعاد النخبوي.',

    'Kasbah Mediouna',   -- location_name
    'monument',           -- location_type: MUST be monument to trigger "Elite View"

    33.4561,             -- lat (approximate coords for Kasbah Mediouna area)
    -7.5882,             -- lng

    -- model_url: Replace this with a real Draco-compressed .glb URL
    -- For testing, you can use a sample public GLB from Three.js examples:
    'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',

    -- Optional: A cover image for the card
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Kasbah_Mediouna_Morocco.jpg/1280px-Kasbah_Mediouna_Morocco.jpg',

    0,    -- likes_count
    true  -- is_approved: MUST be true for the Discovery Engine to surface it
);

-- Step 2: Verify the insert
SELECT 
    id,
    location_name,
    location_type,
    model_url,
    is_approved,
    lat,
    lng
FROM public.community_posts
WHERE location_name = 'Kasbah Mediouna'
ORDER BY created_at DESC
LIMIT 1;
