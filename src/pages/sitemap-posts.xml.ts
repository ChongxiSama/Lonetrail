import { SITE_URL } from "@constants/site";
import { getSortedPosts } from "@utils/content-utils";
import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ site }) => {
	const [posts, englishPosts] = await Promise.all([
		getSortedPosts("zh"),
		getSortedPosts("en"),
	]);
	const siteUrl = site?.toString() || SITE_URL;
	const toEntry = (post: (typeof posts)[number], prefix: string) => {
		const url = new URL(`${prefix}/posts/${post.slug}/`, siteUrl).toString();
		const lastmod = (post.data.updated || post.data.published).toISOString();
		return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
	};
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${posts.map((post) => toEntry(post, "")).join("\n")}
${englishPosts.map((post) => toEntry(post, "/en")).join("\n")}
</urlset>`;
	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
		},
	});
};
