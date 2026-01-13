'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/src/app/lib/db';
import { users } from '@/src/app/lib/db/schemas';
import { verifyPassword } from '@/src/app/lib/auth/hash';
import { signToken, setAuthCookie, clearAuthCookie } from '@/src/app/lib/auth/jwt';

type State = { error?: string } | undefined;

export async function loginAction(prevState: State, formData: FormData): Promise<State> {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    if (!email || !password) return { error: 'Email dan password wajib diisi.' };

    const rows = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (rows.length === 0) return { error: 'Kredensial tidak valid.' };

    const user = rows[0];
    const ok = await verifyPassword(password, user.password);
    if (!ok) return { error: 'Kredensial tidak valid.' };

    const token = signToken({ userId: user.id, email: user.email });


    await setAuthCookie(token, { maxAge: 60 * 60 * 24 }); // 1 hari

    redirect('/console');
}

export async function logoutAction() {

    await clearAuthCookie();
    redirect('/login');
}
