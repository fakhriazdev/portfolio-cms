import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',                         // ganti kalau bukan Postgres
    schema: ['./src/app/lib/db/schemas.ts'],          // ← sesuai struktur kamu
    out: './drizzle',                              // folder migrations (untuk generate/migrate)
    dbCredentials: { url: process.env.DATABASE_URL! },
    strict: true,
    verbose: true,
});
