import { createInsertSchema } from 'drizzle-zod';
import {experiences} from "@/drizzle/schema";
import {z} from "zod";
export const experienceSchema = createInsertSchema(experiences, {
    company: z.string().trim().min(1),
    position: z.string().trim().min(1),
    description: z.string().trim().min(1),
    startDate: z.string().trim().min(1),
    endDate: z.string().trim().optional(),
    current: z.boolean().optional(),
});
