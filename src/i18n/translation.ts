import type I18nKey from "./i18nKey";
import { en } from "./languages/en";
import { zh_CN } from "./languages/zh_CN";
import { DEFAULT_LOCALE, type Locale, toLocale } from "./locales";

export type Translation = {
	[K in I18nKey]: string;
};

const map: Record<Locale, Translation> = {
	zh: zh_CN,
	en,
};

/**
 * Resolve a translation for an explicit locale.
 *
 * All call sites run at build time (SSG), so the locale must be passed down
 * from the page. There is deliberately no mutable runtime language state.
 */
export function getTranslation(
	locale: Locale | string = DEFAULT_LOCALE,
): Translation {
	return map[toLocale(locale)];
}

export function i18n(
	key: I18nKey,
	locale: Locale | string = DEFAULT_LOCALE,
): string {
	return getTranslation(locale)[key] ?? String(key);
}
