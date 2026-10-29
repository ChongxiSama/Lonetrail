import { DEFAULT_LOCALE, type Locale } from "@i18n/locales";
import { getSiteSubtitle, getSiteTitle } from "@i18n/site";
import {
	MAX_META_DESCRIPTION_LENGTH,
	META_DESCRIPTION_TRUNCATE_AT,
} from "./config";

export function getMetaDescription(
	description?: string,
	locale: Locale = DEFAULT_LOCALE,
): string {
	const raw = description || getSiteSubtitle(locale);
	return raw.length > MAX_META_DESCRIPTION_LENGTH
		? `${raw.substring(0, META_DESCRIPTION_TRUNCATE_AT)}...`
		: raw;
}

export function getPageTitle(
	title: string | undefined,
	locale: Locale = DEFAULT_LOCALE,
): string {
	const base = getSiteTitle(locale);
	if (!title || title === base) {
		const shortSubtitle = getSiteSubtitle(locale).split(/[.。]/)[0]?.trim();
		return shortSubtitle ? `${base} - ${shortSubtitle}` : base;
	}
	const suffix = ` - ${base}`;
	const cleanTitle = title.endsWith(suffix)
		? title.slice(0, -suffix.length)
		: title;
	return `${cleanTitle.trim()} - ${base}`;
}
