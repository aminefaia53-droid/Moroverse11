-- ==========================================
-- MoroVerse Scalability & Reliability: Trust Scores & Performance
-- ==========================================

-- 1. Trust Score & Reputation System
-- Tracks user history to automate moderation for "Trusted" citizens.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS trust_score float DEFAULT 0.0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS approved_posts_count int DEFAULT 0;

-- 2. Performance: GiST Indexing for all geography columns
-- Ensures O(log n) spatial lookups even at 1M+ posts.
CREATE INDEX IF NOT EXISTS community_posts_spatial_idx ON public.community_posts USING GIST (location);

-- 3. Automated Moderation Trigger
-- If a user is trusted (score > 10 or posts > 5), skip manual approval.
-- Note: 'approved' column should exist in community_posts.
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

CREATE OR REPLACE FUNCTION public.auto_moderate_trusted_users()
RETURNS trigger AS $$
DECLARE
  u_score float;
  u_count int;
BEGIN
  SELECT trust_score, approved_posts_count INTO u_score, u_count 
  FROM public.profiles WHERE id = NEW.user_id;
  
  -- Auto-approve if user is a veteran traveler
  IF (u_score >= 10.0 OR u_count >= 5) THEN
    NEW.is_approved := true;
    
    -- Log this automated action in audit_logs
    INSERT INTO public.audit_logs (action, target_table, target_id, new_data)
    VALUES ('AUTO_APPROVE', 'community_posts', NEW.id, jsonb_build_object('user_trust', u_score, 'user_count', u_count));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_auto_moderate ON public.community_posts;
CREATE TRIGGER tr_auto_moderate
BEFORE INSERT ON public.community_posts
FOR EACH ROW EXECUTE PROCEDURE public.auto_moderate_trusted_users();

-- 4. Reputation Update Trigger
-- Increment trust score when a moderator approves a post.
CREATE OR REPLACE FUNCTION public.update_user_reputation()
RETURNS trigger AS $$
BEGIN
  IF (NEW.is_approved = true AND OLD.is_approved = false) THEN
    UPDATE public.profiles 
    SET trust_score = trust_score + 1.0,
        approved_posts_count = approved_posts_count + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_reputation_sync ON public.community_posts;
CREATE TRIGGER tr_reputation_sync
AFTER UPDATE OF is_approved ON public.community_posts
FOR EACH ROW EXECUTE PROCEDURE public.update_user_reputation();

-- 5. Race Condition Prevention: Atomic Likes
-- Re-implementing likes using a function to ensure atomic increments if needed.
-- But using community_post_likes bridge table (already secure via PK unique constraint).
-- Just adding an index for the bridge table.
CREATE INDEX IF NOT EXISTS community_post_likes_post_id_idx ON public.community_post_likes(post_id);
