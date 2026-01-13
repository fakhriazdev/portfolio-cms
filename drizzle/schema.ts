import { pgTable, unique, serial, text, timestamp, boolean, index, uniqueIndex, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	name: text().default('User').notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const experiences = pgTable("experiences", {
	id: serial().primaryKey().notNull(),
	company: text().notNull(),
	position: text().notNull(),
	description: text().notNull(),
	startDate: text("start_date").notNull(),
	endDate: text("end_date"),
	current: boolean().default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const headerInfo = pgTable("header_info", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	name: text().notNull(),
	role: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	avatarUrl: text("avatar_url"),
	avatarAlt: text("avatar_alt"),
});

export const blogPosts = pgTable("blog_posts", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	content: text().notNull(),
	excerpt: text().notNull(),
	slug: text().notNull(),
	published: boolean().default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("blog_posts_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	uniqueIndex("blog_posts_slug_uq").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	unique("blog_posts_slug_unique").on(table.slug),
]);

export const projects = pgTable("projects", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	image: text().notNull(),
	featured: boolean().default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("projects_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("projects_featured_idx").using("btree", table.featured.asc().nullsLast().op("bool_ops")),
]);

export const projectDetails = pgTable("project_details", {
	id: serial().primaryKey().notNull(),
	projectId: integer("project_id").notNull(),
	goalsAndMotivation: text("goals_and_motivation").notNull(),
	techStackUsed: text("tech_stack_used").notNull(),
	features: text().notNull(),
	challenges: text().notNull(),
	demo: text().notNull(),
	repositories: text().notNull(),
	outro: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	uniqueIndex("project_details_project_id_uq").using("btree", table.projectId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "project_details_project_id_projects_id_fk"
		}).onDelete("cascade"),
]);

export const blogImages = pgTable("blog_images", {
	id: serial().primaryKey().notNull(),
	blogPostId: integer("blog_post_id").notNull(),
	url: text().notNull(),
	alt: text().notNull(),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("blog_images_blog_post_id_idx").using("btree", table.blogPostId.asc().nullsLast().op("int4_ops")),
	index("blog_images_blog_sort_idx").using("btree", table.blogPostId.asc().nullsLast().op("int4_ops"), table.sortOrder.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.blogPostId],
			foreignColumns: [blogPosts.id],
			name: "blog_images_blog_post_id_blog_posts_id_fk"
		}).onDelete("cascade"),
]);

export const projectImages = pgTable("project_images", {
	id: serial().primaryKey().notNull(),
	projectId: integer("project_id").notNull(),
	url: text().notNull(),
	alt: text().notNull(),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("project_images_project_id_idx").using("btree", table.projectId.asc().nullsLast().op("int4_ops")),
	index("project_images_project_sort_idx").using("btree", table.projectId.asc().nullsLast().op("int4_ops"), table.sortOrder.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.projectId],
			foreignColumns: [projects.id],
			name: "project_images_project_id_projects_id_fk"
		}).onDelete("cascade"),
]);

export const testimonials = pgTable("testimonials", {
	id: serial().primaryKey().notNull(),
	clientName: text("client_name").notNull(),
	responseClient: text("response_client").notNull(),
	avatarUrl: text("avatar_url").notNull(),
	avatarAlt: text("avatar_alt").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("testimonials_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
]);
