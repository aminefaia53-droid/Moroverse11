import { useState, useEffect } from 'react';
import { Post } from '@/types/social';
import { SocialService } from '@/services/SocialService';

/**
 * useEncyclopedia
 * A unified data-fetching hook for the 5 Pillars of MoroVerse 2.0.
 * Connects the frontend directly to the Supabase metadata.
 */
export function useEncyclopedia(category: string, city?: string) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchPosts() {
            setIsLoading(true);
            setError(null);
            
            try {
                // Determine if we need to fetch multiple categories (e.g., 'all')
                let data: Post[] = [];
                if (category === 'all') {
                    // For Explore Map "All" view, fetch the base pillars
                    const [monuments, cities, battles] = await Promise.all([
                        SocialService.getPostsByCategory('heritage', city),
                        SocialService.getPostsByCategory('geography', city),
                        SocialService.getPostsByCategory('chronicles', city)
                    ]);
                    data = [...monuments, ...cities, ...battles];
                } else {
                    data = await SocialService.getPostsByCategory(category, city);
                }

                if (isMounted) {
                    setPosts(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error('Failed to fetch encyclopedia records'));
                    console.error('ENCYCLOPEDIA_FETCH_ERROR:', err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, [category, city]);

    return { posts, isLoading, error };
}
