import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // If the URL is missing or clearly a placeholder from process.env, use a valid URL format string
    // This is required to prevent Next.js prerendering from crashing during 'npm run build'
    // when environment variables are not present.
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Robust check: must be a string starting with http, and not the literal string "undefined"
    const isValidUrl = rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && rawUrl !== 'undefined';
    const isValidKey = rawKey && typeof rawKey === 'string' && rawKey.length > 10 && rawKey !== 'undefined';

    const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder-project.supabase.co';
    const supabaseKey = isValidKey ? rawKey : 'placeholder-key';

    if (!isValidUrl || !isValidKey) {
        console.error("Supabase public environment variables are missing! Client-side auth will fail.");
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}
