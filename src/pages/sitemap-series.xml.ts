import { getCollection } from "astro:content";
import { SITE_URL } from "@constants/site";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ site }) => {
	const siteUrl = site?.toString() || SITE_URL;

	const series = await getCollection("seri");
	const specs = await getCollection("spec");

	const seriesUrls = series.map((s) => {
		const lastmod = s.data.published.toISOString();
		return `  <url>
    <loc>${new URL(`/seri/${s.id}/`, siteUrl).toString()}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
	});

	const specUrls = specs
		.filter((s) => s.id.startsWith("about-"))
		.map((s) => {
			const id = s.id.replace("about-", "").replace(/\.(md|mdx)$/, "");
			const lastmod = (s.data.updated || s.data.published).toISOString();
			return `  <url>
    <loc>${new URL(`/about/${id}/`, siteUrl).toString()}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
		});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seriesUrls.join("\n")}
${specUrls.join("\n")}
</urlset>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
