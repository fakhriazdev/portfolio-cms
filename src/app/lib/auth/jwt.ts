import 'server-only';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import {  parse } from 'cookie';
import type { NextApiRequest } from 'next';


const JWT_SECRET                = process.env.JWT_SECRET ?? '';
export const COOKIE_NAME        = (process.env.AUTH_COOKIE_NAME ?? '').trim();
const COOKIE_DOMAIN    = process.env.COOKIE_DOMAIN || undefined;
const IS_PROD                 = process.env.NODE_ENV === 'production';

export interface TokenPayload {
    userId: number;
    email: string;
    iat?: number;
    exp?: number;
}

/* ================= JWT core ================= */


export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
        return null;
    }
}

//setter
export async function setAuthCookie(token: string, opts?: { domain?: string; sameSite?: 'lax' | 'strict' | 'none'; maxAge?: number }) {
    const jar = await cookies();
    jar.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: IS_PROD || opts?.sameSite === 'none', // 'none' wajib HTTPS
        sameSite: opts?.sameSite ?? 'lax',
        path: '/',
        domain: opts?.domain ?? COOKIE_DOMAIN,
        maxAge: opts?.maxAge ?? 60 * 60 * 24 * 7, // default 7 hari
    });
}

export async function clearAuthCookie(opts?: { domain?: string; sameSite?: 'lax' | 'strict' | 'none' }) {
    const jar = await cookies();
    jar.set({
        name: COOKIE_NAME,
        value: '',
        httpOnly: true,
        secure: IS_PROD || opts?.sameSite === 'none',
        sameSite: opts?.sameSite ?? 'lax',
        path: '/',
        domain: opts?.domain ?? COOKIE_DOMAIN,
        maxAge: 0,
    });
}


export function getTokenFromRequest(req: NextApiRequest): string | null {
    const auth = (req.headers.authorization as string | undefined) ?? (req.headers.Authorization as string | undefined);
    if (auth?.startsWith('Bearer ')) return auth.slice(7).trim();
    const jar = parse(req.headers.cookie || '');
    return jar[COOKIE_NAME] ?? null;
}

export function verifyAuth(arg: NextApiRequest): TokenPayload | null;
export function verifyAuth(arg: string): TokenPayload | null;
export function verifyAuth(arg: NextApiRequest | string): TokenPayload | null {
    try {
        if (typeof arg === 'string') return verifyToken(arg);
        const token = getTokenFromRequest(arg);
        return token ? verifyToken(token) : null;
    } catch {
        return null;
    }
}
