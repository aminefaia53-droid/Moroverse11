import { createClient } from '../utils/supabase/client';
import { Post, Profile, ViewportBounds } from '@/types/social';

const supabase = createClient();

/**
 * SocialService: The Data Access Layer (DAL) for MoroVerse Heritage Hub.
 * Enforces architectural separation between UI and Data Persistence.
 */
const MAX_RETRIES = 3;
const INITIAL_BACKOFF = 1000; // 1 second

export class SocialService {
    
    /**
     * Resilience Helper: Exponential Backoff for Supabase calls.
     */
    private static async withRetry<T>(operation: () => Promise<T>): Promise<T> {
        let attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                return await operation();
            } catch (error: any) {
                attempt++;
                if (attempt >= MAX_RETRIES || (error.status !== 429 && error.status !== 500 && error.status !== 503)) {
                    throw error;
                }
                const backoff = INITIAL_BACKOFF * Math.pow(2, attempt - 1);
                console.warn(`RETRY_ATTEMPT_${attempt}: Waiting ${backoff}ms after status ${error.status}`);
                await new Promise(resolve => setTimeout(resolve, backoff));
            }
        }
        throw new Error("MAX_RETRIES_EXCEEDED");
    }
    
    private static cache: Record<string, { data: Post[], timestamp: number }> = {};
    private static CACHE_TTL = 0; // Forced Cache Busting for Real-Time Heritage Accuracy

    /**
     * Fetch community posts with SWR (Stale-While-Revalidate) pattern.
     * Reduces database load and provides near-instant UI response.
     */
    static async getPosts(bounds?: ViewportBounds): Promise<Post[]> {
        const cacheKey = bounds ? JSON.stringify(bounds) : 'all_posts';
        const cached = this.cache[cacheKey];
        const now = Date.now();

        // Background Refresh (Revalidate)
        const revalidate = async () => {
            try {
                const freshData = await this.withRetry(async () => {
                    if (bounds) {
                        const { data, error } = await supabase.rpc('get_posts_in_viewport', {
                            min_lat: bounds.minLat,
                            min_lng: bounds.minLng,
                            max_lat: bounds.maxLat,
                            max_lng: bounds.maxLng
                        }).select('*, profiles(full_name, avatar_url, username)');
                        if (error) throw error;
                        return data as Post[];
                    }

                    const { data, error } = await supabase
                        .from('community_posts')
                        .select('*, profiles(full_name, avatar_url, username)')
                        .order('created_at', { ascending: false })
                        .limit(100);
                        
                    if (error) throw error;
                    return data as Post[];
                });

                this.cache[cacheKey] = { data: freshData, timestamp: Date.now() };
                return freshData;
            } catch (err) {
                console.error('SWR_REVALIDATION_FAILED:', err);
                return cached?.data || [];
            }
        };

        // Return stale data if available, but trigger revalidation
        if (cached && (now - cached.timestamp) < this.CACHE_TTL) {
            revalidate(); // Async background update
            return cached.data;
        }

        // No cache or expired: block and fetch
        return await revalidate();
    }

    /**
     * Fetch posts filtered by category and city (Discovery Engine)
     */
    static async getPostsByCategory(category: string, cityName?: string): Promise<Post[]> {
        const cacheKey = `cat_${category}_${cityName || 'all'}`;
        const cached = (this as any).cache[cacheKey];
        const now = Date.now();

        const revalidate = async () => {
            try {
                const { data, error } = await supabase.rpc('get_posts_by_category', {
                    category_filter: category,
                    city_name: cityName || null
                }).select('*, profiles(full_name, avatar_url, username, trust_score)');
                
                if (error) throw error;
                (this as any).cache[cacheKey] = { data: data as Post[], timestamp: Date.now() };
                return data as Post[];
            } catch (err) {
                console.error('CATEGORY_FETCH_FAILED:', err);
                return cached?.data || [];
            }
        };

        if (cached && (now - cached.timestamp) < (this as any).CACHE_TTL) {
            revalidate();
            return cached.data;
        }

        return await revalidate();
    }

    /**
     * Fetch a single post by its slug (Deep Archive linking)
     */
    static async getPostBySlug(slug: string): Promise<Post | null> {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .select('*, profiles(full_name, avatar_url, username, trust_score)')
                .eq('slug', slug)
                .single();
            
            if (error) {
                // Fallback to ID if slug not found
                const { data: idData, error: idError } = await supabase
                    .from('community_posts')
                    .select('*, profiles(full_name, avatar_url, username, trust_score)')
                    .eq('id', slug)
                    .single();
                
                if (idError) throw idError;
                return idData as Post;
            }
            return data as Post;
        } catch (err) {
            console.error('FETCH_POST_BY_SLUG_FAILED:', err);
            return null;
        }
    }

    /**
     * Create a new community post with sanitized content, location tagging, and type.
     */
    static async createPost(userId: string, content: string, cityName: string | null, lat: number | null, lng: number | null, imageUrl: string | null, locationType: string = 'city', modelUrl?: string | null): Promise<void> {
        // Geospatial Boundary Guard (Moroccan Territory)
        if (lat !== null && lng !== null) {
            const isWithinMorocco = lat >= 21.0 && lat <= 36.0 && lng >= -17.0 && lng <= -1.0;
            if (!isWithinMorocco) {
                throw new Error("GEOSPATIAL_OUT_OF_BOUNDS: Post is outside Moroccan territory.");
            }
        }

        // Null Safety: Only include model_url if locationType is 'monument' and modelUrl is a valid .glb URL
        const safeModelUrl = (locationType === 'monument' && modelUrl && modelUrl.trim().length > 0)
            ? modelUrl.trim()
            : null;

        const { error } = await supabase.from('community_posts').insert({
            user_id: userId,
            content: content.trim(),
            location_name: cityName,
            lat,
            lng,
            image_url: imageUrl,
            model_url: safeModelUrl,
            location_type: locationType,
            likes_count: 0
        });
        if (error) throw error;
    }

    /**
     * Atomic Liking Operation
     */
    static async toggleLike(postId: string, userId: string, isCurrentlyLiked: boolean): Promise<void> {
        if (isCurrentlyLiked) {
            await supabase.from('community_post_likes').delete().eq('post_id', postId).eq('user_id', userId);
        } else {
            await supabase.from('community_post_likes').insert({ post_id: postId, user_id: userId });
        }
    }

    /**
     * Fetch user profile with administrative context
     */
    static async getProfile(userId: string): Promise<Profile> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (error) throw error;
        return data as Profile;
    }

    /**
     * Real-time subscription helper for community updates
     */
    static subscribeToPosts(callback: () => void) {
        return supabase
            .channel('public:community_posts')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, callback)
            .subscribe();
    }
}
