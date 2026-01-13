import { db } from './index';
import { users, headerInfo } from './schemas';
import { hashPassword } from '@/app/api/[[...route]]/security/authGuard';
import { logger } from '@/app/api/[[...route]]/utils/Logger';
import { eq } from 'drizzle-orm';

export async function seedDatabase() {
    const adminEmail = process.env.ADMIN_EMAIL ?? '';
    const adminPassword = process.env.ADMIN_PASSWORD ?? '';

    try {
        await db.transaction(async (tx) => {
            // --- Seed Admin User ---
            if (!adminEmail || !adminPassword) {
                logger.warn('ADMIN_EMAIL atau ADMIN_PASSWORD belum diset. Lewati pembuatan console user.');
            } else {
                const existingUserRows = await tx
                    .select()
                    .from(users)
                    .where(eq(users.email, adminEmail))
                    .limit(1);

                const existingUser = existingUserRows[0];

                if (!existingUser) {
                    const hashedPassword = await hashPassword(adminPassword);
                    await tx.insert(users).values({
                        email: adminEmail,
                        password: hashedPassword,
                    });
                    logger.info('Admin user created');
                } else {
                    logger.info('Admin user already exists, skip.');
                }
            }

            // --- Seed Header Info ---
            const existingHeaderRows = await tx.select().from(headerInfo).limit(1);
            const existingHeader = existingHeaderRows[0];

            if (!existingHeader) {
                await tx.insert(headerInfo).values({
                    title: 'Welcome to My Portfolio',
                    description:
                        'Full Stack Developer passionate about creating amazing web experiences',
                    name: 'Your Name',
                    role: 'Full Stack Developer',
                });
                logger.info('Default header info created');
            } else {
                logger.info('Header info already exists, skip.');
            }
        });

        logger.info('Database seeded successfully');
    } catch (error) {
        logger.error('Database seeding failed:', error);
        throw error;
    }
}
