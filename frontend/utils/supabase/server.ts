import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Standard client for user-authenticated requests (uses ANON key)
// ⚠️ MUST use the ANON key to correctly verify user session cookies.
export async function createClient() {
    const cookieStore = await cookies()

    // Server-side can check both prefixed and non-prefixed versions
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    // Robust check: must be a string starting with http, and not the literal string "undefined"
    const isValidUrl = rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && rawUrl !== 'undefined';
    const isValidKey = rawKey && typeof rawKey === 'string' && rawKey.length > 10 && rawKey !== 'undefined';

    const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder-project.supabase.co';
    const supabaseKey = isValidKey ? rawKey : 'placeholder-key';

    if (!isValidUrl || !isValidKey) {
        console.error("❌ SUPABASE SERVER AUTH ERROR:\n" +
            "Public environment variables (NEXT_PUBLIC_SUPABASE_URL/ANON_KEY) are missing on the server.\n" +
            "This will cause 401 errors during the authentication handshake for 3D uploads.\n" +
            "Current URL: " + (rawUrl ? "Found (masked)" : "MISSING") + "\n" +
            "Current Key: " + (rawKey ? "Found (masked)" : "MISSING"));
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    } catch {
                        // Handle server action / middleware cookie restriction
                    }
                },
            },
        }
    )
}

// Higher-privilege client for server-side operations (uses SERVICE_ROLE key)
// ⚠️ WARNING: Never use this client to verify user sessions or return to the browser.
export async function createAdminClient() {
    // Admin client prefers SUPABASE_URL and REQUIRES SERVICE_ROLE_KEY
    const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!rawUrl || !rawKey || rawKey === 'undefined') {
        throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL. Admin operations will fail.");
    }

    // Admin client doesn't need cookies as it bypasses RLS
    return createServerClient(
        rawUrl,
        rawKey,
        {
            cookies: {
                getAll() { return [] },
                setAll() { },
            },
        }
    )
}
