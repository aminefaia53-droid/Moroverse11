import { useState, useEffect } from 'react';

// Simple in-memory cache to prevent redundant API calls during the session
const imageCache: Record<string, string> = {};

interface UseAutoImageFetcherProps {
    query: string;
    preloadedImageUrl?: string;
}

interface UseAutoImageFetcherResult {
    imageUrl: string | null;
    isLoading: boolean;
    error: Error | null;
}

export function useAutoImageFetcher({ query, preloadedImageUrl }: UseAutoImageFetcherProps): UseAutoImageFetcherResult {
    const [imageUrl, setImageUrl] = useState<string | null>(preloadedImageUrl || null);
    const [isLoading, setIsLoading] = useState<boolean>(!preloadedImageUrl);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // If we already have a preloaded image, don't fetch
        if (preloadedImageUrl) {
            setIsLoading(false);
            return;
        }

        // If no query is provided, fallback immediately
        if (!query) {
            setImageUrl('/images/moroverse-fallback.svg');
            setIsLoading(false);
            return;
        }

        // Check Cache first
        if (imageCache[query]) {
            setImageUrl(imageCache[query]);
            setIsLoading(false);
            return;
        }

        let isMounted = true;

        const fetchImage = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Formatting query for Wikipedia API
                const encodedQuery = encodeURIComponent(query);
                // Wikipedia API endpoint for page images
                const apiUrl = `https://ar.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedQuery}&origin=*`;

                // Fallback to English Wikipedia if Arabic fails (will handle in response logic)
                const enApiUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${encodedQuery}&origin=*`;

                let res = await fetch(apiUrl);
                let data = await res.json();
                let pages = data.query?.pages;
                let pageId = Object.keys(pages || {})[0];
                let extractedUrl = pages?.[pageId]?.original?.source;

                // If not found in Arabic Wiki, try English wiki
                if (!extractedUrl || pageId === '-1') {
                    res = await fetch(enApiUrl);
                    data = await res.json();
                    pages = data.query?.pages;
                    pageId = Object.keys(pages || {})[0];
                    extractedUrl = pages?.[pageId]?.original?.source;
                }

                if (isMounted) {
                    if (extractedUrl) {
                        // Standardize Wikipedia URLs to https
                        const finalUrl = extractedUrl.startsWith('http:') ? extractedUrl.replace('http:', 'https:') : extractedUrl;
                        imageCache[query] = finalUrl;
                        setImageUrl(finalUrl);

                        // Dispatch event for Avatar to react
                        window.dispatchEvent(new CustomEvent('moroverse-image-loaded', {
                            detail: { entity: query, url: finalUrl }
                        }));
                    } else {
                        // Fallback image
                        const fallback = '/hero-bg.png'; // Using existing hero bg as a temporary fallback if no dedicated SVG
                        imageCache[query] = fallback;
                        setImageUrl(fallback);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    console.error(`Failed to fetch image for ${query}:`, err);
                    setError(err instanceof Error ? err : new Error('Failed to fetch image'));
                    const fallback = '/hero-bg.png';
                    imageCache[query] = fallback;
                    setImageUrl(fallback);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
        };
    }, [query, preloadedImageUrl]);

    return { imageUrl, isLoading, error };
}
