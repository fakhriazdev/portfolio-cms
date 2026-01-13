import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as schema from './schemas';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const db = drizzle(pool, { schema });

// Run migrations
export async function runMigrations() {
    try {
        await migrate(db, { migrationsFolder: './lib/db/migrations' });
        console.log('Database migrations completed successfully');
    } catch (error) {
        console.error('Error running migrations:', error);
    }
}

export { schema };