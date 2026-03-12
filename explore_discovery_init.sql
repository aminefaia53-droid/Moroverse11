-- ==========================================
-- MoroVerse Discovery Engine: Categorization & Filtering
-- ==========================================

-- 1. Add location_type for contextual filtering
-- Types: 'monument' (Historical), 'city' (Urban Stories), 'hidden_gem' (Hidden Gems)
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS location_type text DEFAULT 'city';

-- 2. Category Discovery Function (RPC)
-- Fetches posts based on category and proximity (optional) or city name
CREATE OR REPLACE FUNCTION public.get_posts_by_category(category_filter text, city_name text DEFAULT NULL)
RETURNS SETOF public.community_posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.community_posts
  WHERE 
    is_approved = true AND
    location_type = category_filter AND
    (city_name IS NULL OR location_name = city_name)
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. Index for Category Filtering
CREATE INDEX IF NOT EXISTS community_posts_category_idx ON public.community_posts(location_type, is_approved);
