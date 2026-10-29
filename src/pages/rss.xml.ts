import { buildRssResponse } from "@utils/rss-builder";
import type { APIContext } from "astro";

export async function GET(context: APIContext): Promise<Response> {
	return buildRssResponse(context, "zh");
}
