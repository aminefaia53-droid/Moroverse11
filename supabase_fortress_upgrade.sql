-- ==========================================
-- MoroVerse Cyber-Fortress: Database Hardening & Performance
-- ==========================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Performance: Geospatial Integration
-- Add geography point for optimized querying in community_posts
ALTER TABLE public.community_posts 
ADD COLUMN IF NOT EXISTS location geography(POINT) GENERATED ALWAYS AS (
  CASE 
    WHEN lat IS NOT NULL AND lng IS NOT NULL 
    THEN ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography 
    ELSE NULL 
  END
) STORED;

-- Create spatial index
CREATE INDEX IF NOT EXISTS community_posts_geo_idx ON public.community_posts USING GIST (location);

-- 3. Security: RBAC & Infrastructure
-- Add is_admin to profiles for dashboard protection
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_post_at timestamp with time zone;

-- 4. Audit Logging System
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.profiles(id),
  action text NOT NULL,
  target_table text NOT NULL,
  target_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
-- Audit logs only visible to admins
CREATE POLICY "Admins can view audit logs" ON public.audit_logs 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Trigger Function for Auditing
CREATE OR REPLACE FUNCTION public.audit_moderation_action()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO public.audit_logs (admin_id, action, target_table, target_id, old_data)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_logs (admin_id, action, target_table, target_id, old_data, new_data)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Link audit trigger to community_posts
DROP TRIGGER IF EXISTS audit_posts_trigger ON public.community_posts;
CREATE TRIGGER audit_posts_trigger
BEFORE UPDATE OR DELETE ON public.community_posts
FOR EACH ROW EXECUTE PROCEDURE public.audit_moderation_action();

-- 5. Rate Limiting Logic (Spam Prevention)
CREATE OR REPLACE FUNCTION public.check_post_rate_limit()
RETURNS trigger AS $$
DECLARE
  last_post timestamp with time zone;
BEGIN
  SELECT last_post_at INTO last_post FROM public.profiles WHERE id = auth.uid();
  
  IF (last_post IS NOT NULL AND (now() - last_post) < interval '30 seconds') THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait 30 seconds between posts.';
  END IF;
  
  UPDATE public.profiles SET last_post_at = now() WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_limit_posts ON public.community_posts;
CREATE TRIGGER tr_limit_posts
BEFORE INSERT ON public.community_posts
FOR EACH ROW EXECUTE PROCEDURE public.check_post_rate_limit();

-- 6. Optimized Viewport Query (PostGIS RPC)
-- This allows the frontend to fetch only what's visible on the screen
CREATE OR REPLACE FUNCTION public.get_posts_in_viewport(min_lat float, min_lng float, max_lat float, max_lng float)
RETURNS SETOF public.community_posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.community_posts
  WHERE location && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)::geography
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
