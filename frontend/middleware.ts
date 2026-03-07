import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin', '/login'],
};
