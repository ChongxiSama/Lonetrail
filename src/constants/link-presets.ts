import I18nKey from "@i18n/i18nKey";
import { DEFAULT_LOCALE, type Locale } from "@i18n/locales";
import { i18n } from "@i18n/translation";
import { LinkPreset, type NavBarLink } from "@/types/config";

const presetMap: Record<LinkPreset, { key: I18nKey; url: string }> = {
	[LinkPreset.Home]: { key: I18nKey.home, url: "/" },
	[LinkPreset.About]: { key: I18nKey.about, url: "/about/" },
	[LinkPreset.Archive]: { key: I18nKey.archive, url: "/archive/" },
};

/**
 * Resolve a navigation preset for a specific locale.
 * Kept as a function so nothing is frozen at module-load time.
 */
export function getLinkPreset(
	preset: LinkPreset,
	locale: Locale = DEFAULT_LOCALE,
): NavBarLink {
	const item = presetMap[preset];
	return { name: i18n(item.key, locale), url: item.url };
}

/** Localize a configured nav link (used by Layout). */
export function resolveNavLink(
	link: NavBarLink | LinkPreset,
	locale: Locale = DEFAULT_LOCALE,
): NavBarLink {
	if (typeof link === "number") return getLinkPreset(link, locale);
	const name = link.labelKey ? i18n(link.labelKey, locale) : link.name;
	return { ...link, name };
}
