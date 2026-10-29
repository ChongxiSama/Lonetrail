import { getCollection } from "astro:content";
import { SITE_URL } from "@constants/site";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const siteUrl = site?.toString() || SITE_URL;
	const essays = await getCollection("essays");
	const zhEssays = essays.filter(
		(entry) => !entry.filePath?.endsWith(".en.md"),
	);

	const urls = zhEssays.flatMap((entry) => {
		const lastmod = new Date(entry.data.published).toISOString();
		const paths = [`/essays/${entry.id}/`];
		if (essays.some((item) => item.filePath?.endsWith(`${entry.id}.en.md`))) {
			paths.push(`/en/essays/${entry.id}/`);
		}
		return paths.map(
			(path) => `  <url>
    <loc>${new URL(path, siteUrl).toString()}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`,
		);
	});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
