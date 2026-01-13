import { put, del } from '@vercel/blob';


function sanitizeName(name: string) {
    return name.replace(/[^\w.\-]+/g, '_');
}

function extFromMime(mime?: string) {
    if (!mime) return '';
    const map: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/svg+xml': 'svg',
        'image/avif': 'avif',
    };
    return map[mime] ? `.${map[mime]}` : '';
}

/** Deteksi URL Vercel Blob agar bisa auto-delete saat replace */
export const isVercelBlobUrl = (url?: string | null) =>
    typeof url === 'string' && /blob\.vercel-storage\.com/.test(url);

type UploadOpts = {
    folder?: string;         // default: 'portfolio'
    addRandomSuffix?: boolean; // default: true
    cacheSeconds?: number;   // default: 1y
};

/**
 * Upload untuk Server Action/Route Handler (Next 15).
 * Terima File/Blob (hasil dari FormData) — TIDAK pakai Buffer.
 */
export async function uploadToBlobWeb(
    file: File | Blob,
    opts: UploadOpts = {}
): Promise<string> {
    const folder = opts.folder ?? 'portfolio';
    const addRandomSuffix = opts.addRandomSuffix ?? true;
    const cacheControlMaxAge = opts.cacheSeconds ?? 60 * 60 * 24 * 365; // 1y

    try {
        // File punya 'name', Blob biasa tidak — fallback ke nama generik.
        const rawName = (file as any).name ? String((file as any).name) : `file-${Date.now()}`;
        const name = sanitizeName(rawName);
        const contentType = (file as any).type || 'application/octet-stream';

        const hasExt = /\.[a-zA-Z0-9]{2,6}$/.test(name);
        const key = `${folder}/${Date.now()}-${name}${hasExt ? '' : extFromMime(contentType)}`;

        const blob = await put(key, file, {
            access: 'public',
            contentType,
            addRandomSuffix,
            cacheControlMaxAge,
        });

        return blob.url;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Blob upload error:', error);
        throw new Error('Failed to upload image');
    }
}

export async function deleteFromBlob(url: string): Promise<void> {
    try {
        await del(url);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Blob delete error:', error);
        throw new Error('Failed to delete image');
    }
}
