import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    // Priority: Secret Key > Public Key
    // On the server, we should try to use the secret service role key if available
    const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Robust check: must be a string starting with http, and not the literal string "undefined"
    const isValidUrl = rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('http') && rawUrl !== 'undefined';
    const isValidKey = rawKey && typeof rawKey === 'string' && rawKey.length > 10 && rawKey !== 'undefined';

    const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder-project.supabase.co';
    const supabaseKey = isValidKey ? rawKey : 'placeholder-key';

    if (!isValidUrl || !isValidKey) {
        console.error("Supabase environment variables are missing or invalid! Server-side client will fail.");
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
