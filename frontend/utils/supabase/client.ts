import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Browser can ONLY see variables prefixed with NEXT_PUBLIC_
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Robust check: must be a string starting with http, and not the literal string "undefined"
    const isValidUrl = rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && rawUrl !== 'undefined';
    const isValidKey = rawKey && typeof rawKey === 'string' && rawKey.length > 10 && rawKey !== 'undefined';

    // If variables are missing, we still return a client with placeholders to prevent crashes
    // during static site generation (npm run build) when variables aren't injected.
    const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder-project.supabase.co';
    const supabaseKey = isValidKey ? rawKey : 'placeholder-key';

    if (!isValidUrl || !isValidKey) {
        console.warn("⚠️ SUPABASE CONFIGURATION: Public environment variables are missing in the browser bundle.\n" +
            "If this is a production environment, please check your Vercel Project Settings.");
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}
