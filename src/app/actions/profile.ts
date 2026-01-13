'use server';

import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { db } from '@/src/app/lib/db';
import {HeaderInfo, headerInfo} from '@/src/app/lib/db/schemas';
import { uploadToBlobWeb, deleteFromBlob, isVercelBlobUrl } from '../utils/blob';
import {requireAuth} from "@/src/app/lib/auth/guard";

const HeaderInsertSchema = createInsertSchema(headerInfo, {
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    name: z.string().trim().min(1),
    role: z.string().trim().min(1),
    avatarUrl: z.preprocess(
        v => (typeof v === 'string' && v.trim() === '' ? undefined : v),
        z.string().url().optional()
    ),
    avatarAlt: z.preprocess(
        v => (typeof v === 'string' && v.trim() === '' ? undefined : v),
        z.string().optional()
    ),
});

const HeaderPayloadSchema = HeaderInsertSchema.pick({
    title: true,
    description: true,
    name: true,
    role: true,
    avatarUrl: true,
    avatarAlt: true,
});

type HeaderPayloadText = Omit<z.infer<typeof HeaderPayloadSchema>, 'avatarUrl'>;

/* ===== Utils ===== */
function omitUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

async function getLatestHeader(): Promise<HeaderInfo | null> {
    const [row] = await db
        .select()
        .from(headerInfo)
        .orderBy(desc(headerInfo.updatedAt))
        .limit(1);
    return row ?? null;
}

export async function getHeader(): Promise<HeaderInfo | null> {
    return getLatestHeader();
}

type SaveProfileOptions = {
    clearAvatar?: boolean;
};

export async function saveProfile(
    payloadText: HeaderPayloadText,
    incomingFile?: File | Blob | null,
    opts: SaveProfileOptions = {}
): Promise<HeaderInfo | null> {
    await requireAuth();
    const existing = await getLatestHeader();
    let nextAvatarUrl: string | undefined = existing?.avatarUrl ?? undefined;

    // opsi hapus avatar
    if (opts.clearAvatar) {
        if (existing?.avatarUrl && isVercelBlobUrl(existing.avatarUrl)) {
            try { await deleteFromBlob(existing.avatarUrl); } catch { /* ignore */ }
        }
        nextAvatarUrl = undefined;
    }

    // jika ada file baru → validasi + upload + hapus lama bila perlu
    if (incomingFile instanceof Blob) {
        const size = (incomingFile as any).size as number | undefined;
        const type = (incomingFile as any).type as string | undefined;

        if (size && size > 5 * 1024 * 1024) throw new Error('Avatar must be ≤ 5MB');

        // perketat tipe gambar
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        if (type && !allowed.includes(type) && !(type?.startsWith('image/'))) {
            throw new Error('Only image files allowed');
        }

        const uploadedUrl = await uploadToBlobWeb(incomingFile, { folder: 'profile' });

        if (existing?.avatarUrl && isVercelBlobUrl(existing.avatarUrl) && existing.avatarUrl !== uploadedUrl) {
            try { await deleteFromBlob(existing.avatarUrl); } catch { /* ignore */ }
        }
        nextAvatarUrl = uploadedUrl;
    }

    // Validasi akhir (Zod) mengikuti schema table
    const parsed = HeaderPayloadSchema.parse({
        ...payloadText,
        avatarUrl: nextAvatarUrl,
    });

    // Siapkan payload tanpa undefined agar Drizzle tidak men-set kolomnya
    const baseSet = omitUndefined({
        title: parsed.title,
        description: parsed.description,
        name: parsed.name,
        role: parsed.role,
        avatarAlt: parsed.avatarAlt,
    });

    if (existing) {
        const toSet: Partial<HeaderInfo> = omitUndefined({
            ...baseSet,
            avatarUrl: parsed.avatarUrl, // hanya ikut jika terdefinisi
            updatedAt: new Date(),
        });
        await db.update(headerInfo).set(toSet).where(eq(headerInfo.id, existing.id));
    } else {
        const toInsert: Partial<HeaderInfo> = omitUndefined({
            ...baseSet,
            avatarUrl: parsed.avatarUrl,
            // createdAt/updatedAt biarkan default DB jika ada
        });
        await db.insert(headerInfo).values(toInsert as HeaderInfo);
    }

    return getLatestHeader();
}
