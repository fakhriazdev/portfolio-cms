// src/app/lib/auth/cookies.ts
import { NextRequest, NextResponse } from "next/server";

const isProd = process.env.NODE_ENV === "production";

export function setAccessTokenCookie(token: string, res: NextResponse) {
    res.cookies.set("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 menit
    });
}
export function clearAuthCookies(res: NextResponse) {
    res.cookies.set("access_token", "", { httpOnly: true, secure: isProd, sameSite: "none", path: "/", maxAge: 0 });
}
