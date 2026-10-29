import { SITE_URL } from "@constants/site";
import { getCategoryList, getTagList } from "@utils/content-utils";
import type { APIRoute } from "astro";
export const GET: APIRoute = async ({ site }) => {
	const categories = await getCategoryList();
	const tags = await getTagList();
	const siteUrl = site?.toString() || SITE_URL;
	const categoryUrls = categories
		.map(
			(c) => `  <url>
    <loc>${new URL(c.url, siteUrl).toString()}</loc>
    <priority>0.6</priority>
    <changefreq>weekly</changefreq>
  </url>`,
		)
		.join("\n");
	const tagUrls = tags
		.map((t) => {
			const url = new URL(
				`/tags/${encodeURIComponent(t.name)}/`,
				siteUrl,
			).toString();
			return `  <url>
    <loc>${url}</loc>
    <priority>0.4</priority>
    <changefreq>monthly</changefreq>
  </url>`;
		})
		.join("\n");
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryUrls}
${tagUrls}
</urlset>`;
	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
