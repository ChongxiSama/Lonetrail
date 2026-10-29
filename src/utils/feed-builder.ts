import { getSortedPosts } from "@utils/content-utils";
import { Feed } from "feed";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { siteMeta } from "@/config";
import { DEFAULT_LOCALE, type Locale, localizePath } from "@/i18n/locales";
import { getSiteSubtitle, getSiteTitle } from "@/i18n/site";

const parser = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
});

async function renderFeed(
	site: string,
	locale: Locale = DEFAULT_LOCALE,
): Promise<string> {
	const blog = await getSortedPosts(locale);
	const feedBase = locale === "en" ? new URL("en/", site).toString() : site;
	const feed = new Feed({
		title: getSiteTitle(locale),
		description: getSiteSubtitle(locale),
		id: feedBase,
		link: feedBase,
		language: locale === "en" ? "en" : siteMeta.lang,
		favicon: `${site}favicon.ico`,
		copyright: `All rights reserved ${new Date().getFullYear()}, ${getSiteTitle(locale)}`,
		updated:
			blog.length > 0
				? blog[0].data.updated || blog[0].data.published
				: new Date(),
		generator: "Astro - Feed Library",
		feedLinks: {
			atom: new URL(
				locale === "en" ? "en/atom.xml" : "atom.xml",
				site,
			).toString(),
		},
		author: {
			name: siteMeta.author,
			email: siteMeta.email,
			link: site,
		},
	});
	const escapeHtml = (unsafe: string) => {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	};
	for (const post of blog) {
		const postPath = localizePath(`/posts/${post.slug}/`, locale);
		const postUrl = new URL(postPath.replace(/^\//, ""), site).toString();
		const content =
			typeof post.body === "string" ? post.body : String(post.body || "");
		const normalizeImageUrl = (source: string, base: string = postUrl) => {
			try {
				return new URL(source, base).toString();
			} catch {
				return source;
			}
		};
		const renderedContent = sanitizeHtml(parser.render(content), {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([
				"img",
				"figure",
				"figcaption",
				"video",
				"iframe",
				"pre",
				"code",
				"span",
				"div",
			]),
			allowedAttributes: {
				...sanitizeHtml.defaults.allowedAttributes,
				img: ["src", "alt", "title", "width", "height", "loading", "style"],
				iframe: [
					"src",
					"width",
					"height",
					"title",
					"frameborder",
					"allow",
					"allowfullscreen",
					"style",
				],
				div: ["class", "style"],
				span: ["class", "style"],
				pre: ["class", "style"],
				code: ["class", "style"],
			},
			transformTags: {
				img: (tagName, attribs) => ({
					tagName,
					attribs: attribs.src
						? { ...attribs, src: normalizeImageUrl(attribs.src) }
						: attribs,
				}),
			},
		});
		feed.addItem({
			title: post.data.title,
			id: postUrl,
			link: postUrl,
			description: post.data.description,
			content: renderedContent,
			author: [
				{
					name: siteMeta.author,
					email: siteMeta.email,
					link: site,
				},
			],
			date: post.data.updated || post.data.published,
			published: post.data.published,
			category: (post.data.tags || []).map((tag: string) => ({
				name: escapeHtml(tag),
			})),
		});
	}
	return feed.atom1();
}

const cachedFeeds = new Map<Locale, Promise<string>>();

export function buildAtomFeed(
	site: string,
	locale: Locale = DEFAULT_LOCALE,
): Promise<string> {
	if (import.meta.env.PROD) {
		const cached = cachedFeeds.get(locale);
		if (cached) return cached;
		const next = renderFeed(site, locale);
		cachedFeeds.set(locale, next);
		return next;
	}
	return renderFeed(site, locale);
}
