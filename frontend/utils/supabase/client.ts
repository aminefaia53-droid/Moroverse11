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
        console.error("❌ SUPABASE CONFIGURATION ERROR:\n" +
            "Your Next.js environment is missing the following public variables:\n" +
            " - NEXT_PUBLIC_SUPABASE_URL\n" +
            " - NEXT_PUBLIC_SUPABASE_ANON_KEY\n" +
            "\n" +
            "SETUP STEPS:\n" +
            "1. Local: Add these to your .env.local file.\n" +
            "2. Vercel: Go to Project Settings -> Environment Variables and add them there.\n" +
            "3. Redeploy: Environment variables are baked into the build; you MUST trigger a new deployment for changes to take effect.\n" +
            "\n" +
            "Client-side authentication and 3D uploads will fail until this is resolved.");
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}
