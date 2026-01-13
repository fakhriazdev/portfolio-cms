

import { verifyAuth, COOKIE_NAME } from '@/src/app/lib/auth/jwt';

export class UnauthorizedError extends Error {
    status = 401 as const;
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends Error {
    status = 403 as const;
    constructor(message = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
    }
}

/** Ambil token dari cookies (null kalau tidak ada) */
export async function getTokenFromCookies(): Promise<string | null> {
    const { cookies } = await import('next/headers'); // ⬅️ lazy import (hindari client bundle error)
    return (await cookies()).get(COOKIE_NAME)?.value ?? null;
}

/** Non-throwing auth: kembalikan payload atau null */
export async function getAuth<TPayload = unknown>(): Promise<TPayload | null> {
    const token = await getTokenFromCookies();
    if (!token) return null;

    // Kompatibel bila verifyAuth sync/async
    const payload = (await Promise.resolve(verifyAuth(token))) as TPayload | null;
    return payload ?? null;
}

/** Throwing guard: lempar UnauthorizedError jika tidak login */
export async function requireAuth<TPayload = unknown>(): Promise<TPayload> {
    const payload = await getAuth<TPayload>();
    if (!payload) throw new UnauthorizedError('Unauthorized');
    return payload;
}

/** Helper untuk Route Handler apabila ingin balikan JSON 401/403 cepat */
export function jsonError(status: 401 | 403, message = status === 401 ? 'Unauthorized' : 'Forbidden') {
    return new Response(JSON.stringify({ message }), {
        status,
        headers: { 'content-type': 'application/json' },
    });
}
