'use server';

import { z } from 'zod';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/src/app/lib/db';
import { experiences,Experience } from '@/src/app/lib/db/schemas';
import { requireAuth } from '@/src/app/lib/auth/guard';
import { experienceSchema } from '@/src/app/lib/types/experience-types';


/* =================== List options =================== */
const ListOptionsSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).max(100).default(10),
    orderBy: z.enum(['startDate', 'createdAt']).default('startDate'),
    order: z.enum(['asc', 'desc']).default('desc'),
    current: z.boolean().optional(),              // filter by current flag
    q: z.string().trim().min(1).optional(),       // search company/position
});

/* =================== Helpers =================== */
function omitUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function coerceId(id: string | number) {
    if (typeof id === 'number') return id;
    return /^\d+$/.test(String(id)) ? Number(id) : id; // biarkan string jika UUID
}

/* =================== Actions =================== */

export async function listExperiences(opts?: z.input<typeof ListOptionsSchema>) {
    await requireAuth();

    const { page, pageSize, orderBy, order, current, q } = ListOptionsSchema.parse(opts ?? {});
    const offset = (page - 1) * pageSize;

    const whereParts: any[] = [];
    if (typeof current === 'boolean') {
        // pakai kolom boolean `current`. Kalau ingin fallback endDate, bisa tambah OR isNull(experiences.endDate)
        whereParts.push(eq(experiences.current, current));
    }
    if (q) {
        const likeQ = `%${q}%`;
        // Postgres: ILIKE; jika pakai MySQL/SQLite, ganti ke LIKE
        whereParts.push(sql`(${experiences.company} ILIKE ${likeQ} OR ${experiences.position} ILIKE ${likeQ})`);
    }

    const whereExpr = whereParts.length ? and(...whereParts) : undefined;

    const orderExpr =
        orderBy === 'createdAt'
            ? order === 'asc'
                ? asc(experiences.createdAt)
                : desc(experiences.createdAt)
            : order === 'asc'
                ? asc(experiences.startDate) // NOTE: startDate bertipe text; pastikan format ISO (YYYY-MM-DD) agar sort benar
                : desc(experiences.startDate);

    const [{ value: total }] = await db
        .select({ value: sql<number>`count(*)` })
        .from(experiences)
        .where(whereExpr as any);

    const rows = await db
        .select()
        .from(experiences)
        .where(whereExpr as any)
        .orderBy(orderExpr)
        .limit(pageSize)
        .offset(offset);

    return { data: rows, page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getExperience(id: string | number): Promise<Experience | null> {
    await requireAuth();
    const pk = coerceId(id);
    const [row] = await db.select().from(experiences).where(eq(experiences.id as any, pk as any)).limit(1);
    return row ?? null;
}

export async function createExperience(payload: unknown): Promise<Experience> {
    await requireAuth();

    // Validasi payload create pakai Zod schema-mu
    const parsed = experienceSchema.parse(payload) as Experience;

    const [created] = await db.insert(experiences).values(parsed).returning();
    return created as Experience;
}

export async function updateExperience(
    id: string | number,
    patch: unknown
): Promise<Experience | null> {
    await requireAuth();

    // Partial update + buang undefined biar tidak meng-overwrite kolom
    const parsed = omitUndefined(experienceSchema.partial().parse(patch)) as Partial<Experience>;
    if (Object.keys(parsed).length === 0) throw new Error('No fields to update');

    const pk = coerceId(id);

    const [updated] = await db
        .update(experiences)
        .set({ ...parsed, updatedAt: new Date() } as any)
        .where(eq(experiences.id as any, pk as any))
        .returning();

    return updated ?? null;
}

export async function deleteExperience(id: string | number): Promise<Experience | null> {
    await requireAuth();

    const pk = coerceId(id);

    const [deleted] = await db
        .delete(experiences)
        .where(eq(experiences.id as any, pk as any))
        .returning();

    return deleted ?? null;
}
