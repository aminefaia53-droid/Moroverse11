import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
    // update user's auth session
    const supabaseResponse = await updateSession(request);

    const adminCookie = request.cookies.get('admin_session');

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!adminCookie || adminCookie.value !== 'authenticated') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect /admin to /dashboard
    if (request.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If already logged in, don't show login page
    if (request.nextUrl.pathname === '/login') {
        if (adminCookie && adminCookie.value === 'authenticated') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Must return the supabaseResponse which contains the updated auth cookies
    // For admin routes that redirect, we can just return the redirect (auth cookies aren't touched)
    // For regular routes, we return supabaseResponse to persist user sessions

    // Merge headers if needed in the future, but currently returning supabaseResponse is fine
    return supabaseResponse;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
