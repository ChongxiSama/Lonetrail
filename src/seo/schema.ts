import { profileConfig } from "@/config";
import { DEFAULT_LOCALE, toLocale } from "@/i18n/locales";
import { getSiteSubtitle, getSiteTitle } from "@/i18n/site";

interface JsonLdProps {
	siteUrl: string;
	canonicalURL: string;
	title?: string;
	metaDescription?: string;
	siteLang?: string;
	isHomePage?: boolean;
	isPostPage?: boolean;
	published?: Date;
	updated?: Date;
	ogImage?: string;
	tags?: string[];
	category?: string;
	wordCount?: number;
	entities?: Record<string, unknown>[];
	citations?: string[];
	currentPath: string;
}

export function generateJsonLd({
	siteUrl,
	canonicalURL,
	title,
	metaDescription,
	siteLang,
	isHomePage,
	isPostPage,
	published,
	updated,
	ogImage,
	tags,
	category,
	wordCount,
	entities,
	citations,
	currentPath,
}: JsonLdProps): Record<string, unknown> {
	const locale = toLocale(siteLang?.startsWith("en") ? "en" : DEFAULT_LOCALE);
	const siteTitle = getSiteTitle(locale);
	let schemaType: string | string[] = "WebPage";
	if (isHomePage) schemaType = "CollectionPage";
	if (isPostPage) {
		schemaType = "BlogPosting";
	} else if (currentPath.includes("/essays/")) {
		schemaType = "CreativeWork";
	} else if (currentPath.includes("/photos/")) {
		schemaType = "ImageGallery";
	} else if (currentPath.includes("/about/")) {
		schemaType = "AboutPage";
	} else if (currentPath.includes("/seri/")) {
		schemaType = "CollectionPage";
	}

	const jsonLd: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": Array.isArray(schemaType) ? schemaType : [schemaType],
				"@id": `${canonicalURL}#main-entity`,
				url: canonicalURL,
				name: title || siteTitle,
				description: metaDescription,
				isPartOf: { "@id": `${siteUrl}#website` },
				publisher: { "@id": `${siteUrl}#person` },
				author: { "@id": `${siteUrl}#person` },
				inLanguage: siteLang,
			},
			{
				"@type": "WebSite",
				"@id": `${siteUrl}#website`,
				url: siteUrl,
				name: siteTitle,
				description: getSiteSubtitle(locale),
				inLanguage: siteLang,
				publisher: { "@id": `${siteUrl}#person` },
			},
			{
				"@type": "Person",
				"@id": `${siteUrl}#person`,
				name: profileConfig.name,
				url: siteUrl,
				image: profileConfig.avatar
					? {
							"@type": "ImageObject",
							"@id": `${siteUrl}#personImage`,
							url: new URL(profileConfig.avatar, siteUrl).toString(),
						}
					: undefined,
				sameAs: profileConfig.links
					.map((link) => link.url)
					.filter((url) => url.startsWith("http")),
			},
		],
	};

	const graph = jsonLd["@graph"] as Record<string, unknown>[];

	if (isPostPage) {
		const mainEntity = graph[0];
		mainEntity.headline = (title || siteTitle).replace(` - ${siteTitle}`, "");
		mainEntity.datePublished = published?.toISOString();
		mainEntity.dateModified = (updated || published)?.toISOString();
		mainEntity.image = ogImage;
		mainEntity.keywords = tags || [];
		mainEntity.articleSection = category;
		mainEntity.wordCount = wordCount;

		if (entities && entities.length > 0) {
			mainEntity.about = entities.map((e) => ({
				"@type": (e["@type"] as string) || "Thing",
				name: e.name as string,
				description: e.description as string,
				sameAs: (e.sameAs || e.url) as string | undefined,
			}));
		}

		if (citations && citations.length > 0) {
			mainEntity.citation = citations;
		}
	}

	const types = graph[0]["@type"] as string[];
	if (types.includes("CreativeWorkSeries") && entities) {
		graph[0].hasPart = entities.map((e) => ({
			"@type": "BlogPosting",
			name: e.title as string,
			url: e.url as string,
		}));
	}

	return jsonLd;
}
