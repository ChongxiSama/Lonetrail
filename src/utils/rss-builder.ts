import rss from "@astrojs/rss";
import { getSortedPosts } from "@utils/content-utils";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteMeta } from "@/config";
import { DEFAULT_LOCALE, type Locale, localizePath } from "@/i18n/locales";
import { getSiteSubtitle, getSiteTitle } from "@/i18n/site";

const parser = new MarkdownIt();

function stripInvalidXmlChars(str: string): string {
	return str.replace(
		/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]/g,
		"",
	);
}

/** Build a locale-aware RSS response. Chinese lives at `/rss.xml`, English at `/en/rss.xml`. */
export async function buildRssResponse(
	context: APIContext,
	locale: Locale = DEFAULT_LOCALE,
): Promise<Response> {
	const blog = await getSortedPosts(locale);
	const site = context.site?.toString() || siteMeta.url.replace(/\/?$/, "/");
	const feedBase = locale === "en" ? new URL("en/", site).toString() : site;
	const selfPath = locale === "en" ? "en/rss.xml" : "rss.xml";

	return rss({
		title: getSiteTitle(locale),
		description: getSiteSubtitle(locale) || "No description",
		site: feedBase,
		stylesheet: "/rss-style.xsl",
		items: blog.map((post) => {
			const content =
				typeof post.body === "string" ? post.body : String(post.body || "");
			const cleanedContent = stripInvalidXmlChars(content);
			const renderedContent = sanitizeHtml(parser.render(cleanedContent), {
				allowedTags: sanitizeHtml.defaults.allowedTags.concat([
					"img",
					"figure",
					"figcaption",
					"video",
					"iframe",
				]),
				allowedAttributes: {
					...sanitizeHtml.defaults.allowedAttributes,
					img: ["src", "alt", "title", "width", "height", "loading"],
					iframe: [
						"src",
						"width",
						"height",
						"title",
						"frameborder",
						"allow",
						"allowfullscreen",
					],
				},
			});
			const postPath = localizePath(`/posts/${post.slug}/`, locale);
			return {
				title: post.data.title,
				pubDate: post.data.published,
				description: post.data.description || "",
				link: new URL(postPath.replace(/^\//, ""), site).toString(),
				content: renderedContent,
				categories: post.data.tags,
				author: siteMeta.author,
				customData: post.data.updated
					? `<atom:updated>${post.data.updated.toISOString()}</atom:updated>`
					: "",
			};
		}),
		xmlns: {
			atom: "http://www.w3.org/2005/Atom",
			content: "http://purl.org/rss/1.0/modules/content/",
			dc: "http://purl.org/dc/elements/1.1/",
		},
		customData: `
            <language>${locale === "en" ? "en" : siteMeta.lang}</language>
            <atom:link href="${new URL(selfPath, site).toString()}" rel="self" type="application/rss+xml" />
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <generator>Astro RSS</generator>
        `,
	});
}
