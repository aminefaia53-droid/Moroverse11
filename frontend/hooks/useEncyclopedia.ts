import { useState, useEffect } from 'react';
import { Post } from '@/types/social';

/**
 * useEncyclopedia
 * A unified data-fetching hook for the 5 Pillars of MoroVerse 2.0.
 * Now fetching directly from the Custom Dashboard API (`/api/admin/content`).
 */
export function useEncyclopedia(category: string, city?: string) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchDashboardContent() {
            setIsLoading(true);
            setError(null);
            
            try {
                const res = await fetch('/api/admin/content');
                if (!res.ok) throw new Error('Failed to load dashboard data');
                const json = await res.json();
                const db = json.data;

                // Helper to map Dashboard Item to Post
                const mapToPost = (item: any, type: string): Post => {
                    const title = item.name?.en || item.name?.ar || item.name || '';
                    const desc = typeof item.desc === 'string' ? item.desc : (item.desc?.en || item.desc?.ar || '');
                    const cityName = item.city?.en || item.city?.ar || item.city || item.regionName?.en || item.regionName?.ar || item.regionName || '';

                    return {
                        id: item.id || Math.random().toString(),
                        slug: item.id,
                        user_id: 'admin',
                        content: typeof item.history === 'string' ? item.history : (item.history?.en || item.history?.ar || desc),
                        summary: desc,
                        image_url: item.imageUrl || null,
                        video_url: item.videoUrl || null,
                        model_url: item.modelUrl || null,
                        gallery: item.gallery || null,
                        location_name: title,
                        city: cityName,
                        location_type: type,
                        lat: item.coordinates?.lat || item.lat || null,
                        lng: item.coordinates?.lng || item.lng || null,
                        likes_count: 0,
                        created_at: new Date().toISOString(),
                        year: item.foundation?.en || item.year,
                        era: item.era,
                        dynasty: item.dynasty,
                        field: item.field,
                        notable_works: item.notable_works,
                        combatants: item.combatants,
                        leaders: item.leaders,
                        outcome: item.outcome,
                        tactics: item.tactics,
                        impact: item.impact,
                        activities: item.activities,
                        best_time: item.best_time
                    };
                };

                let rawItems: any[] = [];
                
                if (category === 'all') {
                    rawItems = [
                        ...(db.cities || []).map((i: any) => mapToPost(i, 'geography')),
                        ...(db.landmarks || []).map((i: any) => mapToPost(i, 'heritage')),
                        ...(db.battles || []).map((i: any) => mapToPost(i, 'chronicles'))
                    ];
                } else if (category === 'geography' || category === 'city') {
                    rawItems = (db.cities || []).map((i: any) => mapToPost(i, 'geography'));
                } else if (category === 'heritage' || category === 'monument' || category === 'landmark') {
                    rawItems = [];
                } else if (category === 'chronicles' || category === 'battle') {
                    rawItems = (db.battles || []).map((i: any) => mapToPost(i, 'chronicles'));
                } else if (category === 'biographies' || category === 'figure') {
                    rawItems = (db.figures || []).map((i: any) => mapToPost(i, 'biographies'));
                } else if (category === 'tourism') {
                    rawItems = (db.tourism || []).map((i: any) => mapToPost(i, 'tourism'));
                }

                // Filter by city if requested
                if (city && city !== 'all') {
                    const normalizedTargetCity = city.toLowerCase();
                    rawItems = rawItems.filter(p => p.city && p.city.toLowerCase().includes(normalizedTargetCity));
                }

                if (isMounted) {
                    setPosts(rawItems);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Failed to fetch from Dashboard'));
                    console.error('DASHBOARD_FETCH_ERROR:', err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchDashboardContent();

        return () => {
            isMounted = false;
        };
    }, [category, city]);

    return { posts, isLoading, error };
}
