/**
 * Locale primitives shared by the whole site.
 *
 * The site is statically generated, so the locale is always derived from the
 * URL at build time — never from localStorage. Chinese lives at `/`,
 * English lives under `/en/`.
 */

import { localeConfig } from "@/config";

export const LOCALES = localeConfig.locales;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = localeConfig.defaultLocale;

export const LOCALE_META: Record<
	Locale,
	{
		htmlLang: string;
		ogLocale: string;
		label: string;
		shortLabel: string;
		alternate: Locale;
	}
> = {
	zh: {
		htmlLang: "zh-CN",
		ogLocale: "zh_CN",
		label: "简体中文",
		shortLabel: "中",
		alternate: "en",
	},
	en: {
		htmlLang: "en",
		ogLocale: "en_US",
		label: "English",
		shortLabel: "EN",
		alternate: "zh",
	},
};

/**
 * Pages whose `/en/` address is a real English page rather than a fallback
 * rewrite of the Chinese one. Content routes (posts / essays / series /
 * taxonomy) are intentionally not listed: they only exist in Chinese until a
 * translated entry is added, so their `/en/` copies stay noindex.
 */
const TRANSLATED_PATHS = new Set(localeConfig.translatedPaths);

export function isLocale(value: unknown): value is Locale {
	return (
		typeof value === "string" && (LOCALES as readonly string[]).includes(value)
	);
}

export function toLocale(value?: string | null): Locale {
	if (!value) return DEFAULT_LOCALE;
	const normalized = value.toLowerCase().replace("_", "-");
	if (normalized === "zh" || normalized.startsWith("zh-")) return "zh";
	if (normalized === "en" || normalized.startsWith("en-")) return "en";
	return DEFAULT_LOCALE;
}

export function getLocaleFromPathname(pathname: string): Locale {
	if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
	return "zh";
}

/** Astro's `currentLocale` when available, otherwise infer from the URL. */
export function resolveLocale(
	currentLocale?: string | null,
	pathname?: string,
): Locale {
	if (currentLocale) {
		const locale = toLocale(currentLocale);
		// `toLocale` falls back to zh for unknown values, so only trust it when
		// the input actually maps to a supported language.
		if (
			isLocale(locale) &&
			(currentLocale === "zh" || currentLocale === "en")
		) {
			return locale;
		}
	}
	return pathname ? getLocaleFromPathname(pathname) : DEFAULT_LOCALE;
}

/** `/en/about/` -> `/about/`; `/en` -> `/`; anything else unchanged. */
export function stripLocaleFromPath(pathname: string): string {
	if (pathname === "/en" || pathname === "/en/") return "/";
	if (pathname.startsWith("/en/")) return pathname.slice(3);
	return pathname;
}

function withTrailingSlash(pathname: string): string {
	return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

/** Add (or remove) the locale prefix for a site path. */
export function localizePath(pathname: string, locale: Locale): string {
	const base = withTrailingSlash(stripLocaleFromPath(pathname));
	if (locale === DEFAULT_LOCALE) return base;
	return base === "/" ? "/en/" : `/en${base}`;
}

export function hasLocaleVersion(pathname: string): boolean {
	return TRANSLATED_PATHS.has(withTrailingSlash(stripLocaleFromPath(pathname)));
}

/** True when this is an `/en/` route rendered as a fallback of the zh page. */
export function isFallbackPath(pathname: string, locale?: Locale): boolean {
	const active = locale ?? getLocaleFromPathname(pathname);
	return active !== DEFAULT_LOCALE && !hasLocaleVersion(pathname);
}

/**
 * Target when the visitor flips languages. Astro's i18n fallback generates an
 * `/en/` address for every zh route, so we can always mirror the current path;
 * untranslated routes are `noindex` + canonicalized to zh by Layout.
 */
export function getSwitchLocalePath(pathname: string, target: Locale): string {
	return localizePath(pathname, target);
}

export function getLocaleLabel(locale: Locale): string {
	return LOCALE_META[locale].label;
}
