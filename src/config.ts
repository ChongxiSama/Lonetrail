import I18nKey from "./i18n/i18nKey";
import yaml from "./site.yml";
import type {
	NavBarConfig,
	NavBarLink,
	ProfileConfig,
	SiteConfig,
} from "./types/config";

type NavEntry = {
	key?: string;
	name?: string;
	url: string;
	external?: boolean;
};

type RawConfig = {
	site: {
		title: string;
		title_en: string;
		subtitle: string;
		subtitle_en: string;
		description: string;
		description_en: string;
		url: string;
		lang: string;
		author: string;
		email: string;
		favicon: string;
		banner: string;
		banner_credit: string;
		banner_credit_url: string;
		og_image: string;
		avatar: string;
		version: string;
	};
	profile: {
		name: string;
		bio: string;
		bio_en: string;
		links: { name: string; icon: string; url: string }[];
	};
	nav: NavEntry[];
	taxonomy: {
		tags: Record<string, string>;
		categories: Record<string, string>;
	};
	copyright: {
		site_name: string;
		license: string;
		license_url: string;
	};
	trusted_domains: string[];
};

const cfg = yaml as RawConfig;

const NAV_KEYS: Record<string, I18nKey> = {
	home: I18nKey.home,
	archive: I18nKey.archive,
	series: I18nKey.navSeries,
	essays: I18nKey.navEssays,
	about: I18nKey.about,
	subscribe: I18nKey.subscribe,
};

export const siteConfig: SiteConfig = {
	title: cfg.site.title,
	subtitle: cfg.site.subtitle,
	lang: cfg.site.lang as SiteConfig["lang"],
	banner: {
		enable: Boolean(cfg.site.banner),
		src: cfg.site.banner,
		position: "center",
		credit: {
			enable: Boolean(cfg.site.banner_credit),
			text: cfg.site.banner_credit,
			url: cfg.site.banner_credit_url,
		},
	},
	toc: {
		enable: true,
		depth: 3,
	},
	showPageViews: false,
	favicon: [
		{ src: cfg.site.favicon, sizes: "32x32" },
		{ src: cfg.site.favicon, sizes: "192x192" },
	],
};

export const siteMeta = {
	url: cfg.site.url,
	lang: cfg.site.lang.replace("_", "-"),
	author: cfg.site.author,
	email: cfg.site.email,
	ogImage: cfg.site.og_image,
	avatar: cfg.site.avatar,
	version: cfg.site.version,
	titleEn: cfg.site.title_en,
	subtitleEn: cfg.site.subtitle_en,
	descriptionEn: cfg.site.description_en,
};

export const navBarConfig: NavBarConfig = {
	links: cfg.nav.map(
		(item): NavBarLink => ({
			name: item.name ?? item.key ?? "",
			url: item.url,
			external: item.external,
			labelKey: item.key ? NAV_KEYS[item.key] : undefined,
		}),
	),
};

export const profileConfig: ProfileConfig = {
	avatar: cfg.site.avatar,
	name: cfg.profile.name,
	bio: cfg.profile.bio,
	links: cfg.profile.links,
};

export const profileBioEn = cfg.profile.bio_en;

export const taxonomyConfig = cfg.taxonomy;

export const copyrightConfig = {
	siteName: cfg.copyright.site_name,
	license: cfg.copyright.license,
	licenseUrl: cfg.copyright.license_url,
};

export const trustedDomains: string[] = cfg.trusted_domains;

export const localeConfig = {
	defaultLocale: "zh" as const,
	locales: ["zh", "en"] as const,
	translatedPaths: ["/", "/archive/", "/about/", "/subscribe/", "/essays/"],
};

export const featureConfig = {
	comments: true,
	search: true,
	analytics: "none" as "none" | "umami",
};

export const integrationConfig = {
	twikoo: {
		envId: "",
	},
	umami: {
		websiteId: "",
		domains: "",
	},
	posthog: {
		key: "",
		host: "https://app.posthog.com",
	},
};
