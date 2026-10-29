import { SITE_URL } from "@constants/site";
import type { APIRoute } from "astro";

const robotsTxt = `
User-agent: *
Disallow: /favicon/
Disallow: /audio/
Disallow: /go/
Disallow: /*?tag=*
Disallow: /*?category=*
Disallow: /*?uncategorized=*
Sitemap: ${SITE_URL}sitemap-index.xml
`.trim();
export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};
