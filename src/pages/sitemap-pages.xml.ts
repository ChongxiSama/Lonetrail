import { SITE_URL } from "@constants/site";
import type { APIRoute } from "astro";
import {
	hasLocaleVersion,
	LOCALES,
	type Locale,
	localizePath,
} from "@/i18n/locales";

interface SitemapPage {
	url: string;
	priority: string;
	changefreq: string;
}

const PAGES: SitemapPage[] = [
	{ url: "/", priority: "1.0", changefreq: "daily" },
	{ url: "/archive/", priority: "0.8", changefreq: "weekly" },
	{ url: "/about/", priority: "0.8", changefreq: "monthly" },
	{ url: "/seri/", priority: "0.8", changefreq: "weekly" },
	{ url: "/essays/", priority: "0.8", changefreq: "weekly" },
	{ url: "/subscribe/", priority: "0.6", changefreq: "monthly" },
];

const hreflang: Record<Locale, string> = { zh: "zh-CN", en: "en" };

export const GET: APIRoute = async ({ site }) => {
	const siteUrl = site?.toString() || SITE_URL;
	const absolute = (path: string, locale: Locale) =>
		new URL(localizePath(path, locale), siteUrl).toString();

	const pageUrls = PAGES.flatMap((page) => {
		const locales: Locale[] = LOCALES.filter(
			(locale) => locale === "zh" || hasLocaleVersion(page.url),
		);
		const alternates = [
			...locales.map(
				(locale) =>
					`    <xhtml:link rel="alternate" hreflang="${hreflang[locale]}" href="${absolute(page.url, locale)}" />`,
			),
			`    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(page.url, "zh")}" />`,
		].join("\n");
		return locales.map(
			(locale) => `  <url>
    <loc>${absolute(page.url, locale)}</loc>
${alternates}
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>`,
		);
	}).join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pageUrls}
</urlset>`;
	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
