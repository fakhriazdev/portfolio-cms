import { pgTable, serial, text, boolean, timestamp, integer, uniqueIndex, index } from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull().default('User'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});


export const headerInfo = pgTable('header_info', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    avatarUrl: text('avatar_url'),
    avatarAlt: text('avatar_alt'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const projects = pgTable('projects', {
        id: serial('id').primaryKey(),
        title: text('title').notNull(),
        description: text('description').notNull(),
        image: text('image').notNull(),
        featured: boolean('featured').default(false),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    }, (t) => ({
        idxCreatedAt: index('projects_created_at_idx').on(t.createdAt),
        idxFeatured: index('projects_featured_idx').on(t.featured),
    })
);

export const projectDetails = pgTable('project_details', {
        id: serial('id').primaryKey(),
        projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
        goalsAndMotivation: text('goals_and_motivation').notNull(),
        techStackUsed: text('tech_stack_used').notNull(),
        features: text('features').notNull(),
        challenges: text('challenges').notNull(),
        demo: text('demo').notNull(),
        repositories: text('repositories').notNull(),
        outro: text('outro').notNull(),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    }, (t) => ({
        uqProject: uniqueIndex('project_details_project_id_uq').on(t.projectId),
    })
);

export const experiences = pgTable('experiences', {
    id: serial('id').primaryKey(),
    company: text('company').notNull(),
    position: text('position').notNull(),
    description: text('description').notNull(),
    startDate: text('start_date').notNull(),
    endDate: text('end_date'),
    current: boolean('current').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});


export const testimonials = pgTable('testimonials', {
    id: serial('id').primaryKey(),
    clientName: text('client_name').notNull(),
    responseClient: text('response_client').notNull(),
    avatarUrl: text('avatar_url').notNull(),
    avatarAlt: text('avatar_alt').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
    idxCreatedAt: index('testimonials_created_at_idx').on(t.createdAt),
}));


export const blogPosts = pgTable('blog_posts', {
        id: serial('id').primaryKey(),
        title: text('title').notNull(),
        content: text('content').notNull(),
        excerpt: text('excerpt').notNull(),
        slug: text('slug').notNull().unique(),
        published: boolean('published').default(false),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    },
    (t) => ({
        idxSlug: uniqueIndex('blog_posts_slug_uq').on(t.slug),
        idxCreatedAt: index('blog_posts_created_at_idx').on(t.createdAt),
    })
);

/** =================== Images: many-to-one ke Projects =================== */
export const projectImages = pgTable('project_images', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    alt: text('alt').notNull(),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
    idxProject: index('project_images_project_id_idx').on(t.projectId),
    idxProjectSort: index('project_images_project_sort_idx').on(t.projectId, t.sortOrder),
}));

/** =================== Images: many-to-one ke Blog Posts =================== */
export const blogImages = pgTable('blog_images', {
    id: serial('id').primaryKey(),
    blogPostId: integer('blog_post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    alt: text('alt').notNull(),
    sortOrder: integer('sort_order').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
    idxBlogPost: index('blog_images_blog_post_id_idx').on(t.blogPostId),
    idxBlogSort: index('blog_images_blog_sort_idx').on(t.blogPostId, t.sortOrder),
}));


export type User = typeof users.$inferSelect;
export type HeaderInfo = typeof headerInfo.$inferSelect;
export type Experience = typeof experiences.$inferInsert;


