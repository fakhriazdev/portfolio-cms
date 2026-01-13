import { relations } from "drizzle-orm/relations";
import { projects, projectDetails, blogPosts, blogImages, projectImages } from "./schema";

export const projectDetailsRelations = relations(projectDetails, ({one}) => ({
	project: one(projects, {
		fields: [projectDetails.projectId],
		references: [projects.id]
	}),
}));

export const projectsRelations = relations(projects, ({many}) => ({
	projectDetails: many(projectDetails),
	projectImages: many(projectImages),
}));

export const blogImagesRelations = relations(blogImages, ({one}) => ({
	blogPost: one(blogPosts, {
		fields: [blogImages.blogPostId],
		references: [blogPosts.id]
	}),
}));

export const blogPostsRelations = relations(blogPosts, ({many}) => ({
	blogImages: many(blogImages),
}));

export const projectImagesRelations = relations(projectImages, ({one}) => ({
	project: one(projects, {
		fields: [projectImages.projectId],
		references: [projects.id]
	}),
}));