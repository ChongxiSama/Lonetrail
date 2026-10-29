import { SITE_URL } from "@constants/site";
import { buildAtomFeed } from "@utils/feed-builder";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
	const site = context.site?.toString() || SITE_URL;
	const xml = await buildAtomFeed(site, "en");
	return new Response(xml, {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
