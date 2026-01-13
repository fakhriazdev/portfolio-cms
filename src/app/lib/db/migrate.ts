import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { logger } from '@/app/api/[[...route]]/utils/Logger';

async function main() {
    try {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        });

        const db = drizzle(pool);

        logger.info('Running migrations...');
        await migrate(db, { migrationsFolder: 'drizzle' });
        logger.info('Migrations completed successfully');

        await pool.end();
        process.exit(0);
    } catch (error) {
        logger.error('Migration failed:', error);
        process.exit(1);
    }
}

main();