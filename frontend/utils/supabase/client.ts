import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // Browser can ONLY see variables prefixed with NEXT_PUBLIC_
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Robust check: must be a string starting with http, and not the literal string "undefined"
    const isValidUrl = rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && rawUrl !== 'undefined';
    const isValidKey = rawKey && typeof rawKey === 'string' && rawKey.length > 10 && rawKey !== 'undefined';

    // If variables are missing, we still return a client with placeholders to prevent crashes
    // but the console warning will lead the user to fix their Vercel settings.
    const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder-project.supabase.co';
    const supabaseKey = isValidKey ? rawKey : 'placeholder-key';

    if (!isValidUrl || !isValidKey) {
        console.error("❌ SUPABASE CONFIGURATION ERROR:\n" +
            "Your Next.js browser bundle is missing the following public variables:\n" +
            " - NEXT_PUBLIC_SUPABASE_URL\n" +
            " - NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
            "\n" +
            "THE FIX:\n" +
            "1. In Vercel, ensure these variables have the EXACT 'NEXT_PUBLIC_' prefix.\n" +
            "2. Ensure they are assigned to 'Production' and 'Preview' environments.\n" +
            "3. You MUST trigger a REDEPLOY for the browser to see these changes.");
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}
