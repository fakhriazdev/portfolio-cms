// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = (process.env.AUTH_COOKIE_NAME ?? 'access_token').trim();
const JWT_SECRET  = (process.env.JWT_SECRET ?? '').trim();

const PROTECTED_PREFIXES = ['/console', '/dashboard'];

async function isAuthenticated(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !JWT_SECRET) return false;
    try {
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return true;
    } catch {
        return false;
    }
}

export default async function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    const requiresAuth = PROTECTED_PREFIXES.some(
        (p) => pathname === p || pathname.startsWith(p + '/')
    );
    const isAuthPage = pathname === '/login';

    const authed = await isAuthenticated(req);

    if (requiresAuth && !authed) {
        const url = new URL('/login', req.url);
        url.searchParams.set('next', pathname + (search || ''));
        return NextResponse.redirect(url);
    }

    if (authed && isAuthPage) {
        return NextResponse.redirect(new URL('/console', req.url));
    }

    return NextResponse.next();
}

// ⬇️ Matcher simpel, tanpa regex berat
export const config = {
    matcher: ['/console/:path*', '/dashboard/:path*', '/login'],
};
