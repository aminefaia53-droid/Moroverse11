import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    // If the URL is missing or clearly a placeholder from process.env, use a valid URL format string
    // This is required to prevent Next.js prerendering from crashing during 'npm run build'
    // when environment variables are not present.
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabaseUrl = (rawUrl && rawUrl.startsWith('http'))
        ? rawUrl
        : 'https://placeholder-project.supabase.co';

    const supabaseKey = (rawKey && rawKey.length > 20)
        ? rawKey
        : 'public-anonymous-key-placeholder';

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}
