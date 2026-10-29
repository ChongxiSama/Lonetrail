import { defineCollection } from "astro:content";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { parseContentDate } from "./utils/date-utils";

const published = z.preprocess(parseContentDate, z.date());
const updated = z.preprocess(
	(val) => (val ? parseContentDate(val) : undefined),
	z.date().optional(),
);

const postsCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/posts",
		// 显式保留原始文件名的 ID，不进行任何转换
		generateId: ({ entry, base }) => {
			const entryPath =
				typeof entry === "string" ? entry : fileURLToPath(entry);
			const basePath = typeof base === "string" ? base : fileURLToPath(base);
			const absoluteEntry = path.isAbsolute(entryPath)
				? entryPath
				: path.resolve(basePath, entryPath);
			const relativePath = path
				.relative(basePath, absoluteEntry)
				.replace(/\.[^/.]+$/, "");
			return relativePath;
		},
		deferRender: true,
	}),
	schema: z.object({
		title: z.string(),
		published,
		updated,
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().nullable().default(""),
		lang: z.string().optional().default(""),
		noindex: z.boolean().optional().default(false),
		pinned: z.boolean().optional().default(false),
	}),
});

const specCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/spec",
		deferRender: true,
	}),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		published,
		updated,
	}),
});

const seriCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/seri",
		deferRender: true,
	}),
	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		description: z.string().optional(),
		image: z.string().optional(),
		published,
		filter: z
			.object({
				tag: z.string().optional(),
				category: z.string().optional(),
			})
			.optional(),
		sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
	}),
});

const essaysCollection = defineCollection({
	loader: glob({
		pattern: "**/*.{md,mdx}",
		base: "./src/content/essays",
		deferRender: true,
	}),
	schema: z.preprocess(
		(data) => {
			if (!data || typeof data !== "object") return data;
			const raw = (data as Record<string, unknown>).published;
			return {
				...(data as Record<string, unknown>),
				// 只有日期的日志不显示 00:00
				publishedHasTime: typeof raw === "string" && /\d{2}:\d{2}/.test(raw),
			};
		},
		z.object({
			title: z.string().optional().default(""),
			published,
			publishedHasTime: z.boolean(),
		}),
	),
});

export const collections = {
	posts: postsCollection,
	spec: specCollection,
	seri: seriCollection,
	essays: essaysCollection,
};
