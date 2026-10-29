import { taxonomyConfig } from "@/config";
import { DEFAULT_LOCALE, type Locale } from "./locales";

function translate(
	map: Record<string, string>,
	value: string,
	locale: Locale,
): string {
	if (locale === DEFAULT_LOCALE) return value;
	return map[value] ?? value;
}

export function getTagLabel(
	tag: string,
	locale: Locale = DEFAULT_LOCALE,
): string {
	return translate(taxonomyConfig.tags ?? {}, tag, locale);
}

export function getCategoryLabel(
	category: string | null | undefined,
	locale: Locale = DEFAULT_LOCALE,
): string {
	if (!category) return "";
	return translate(taxonomyConfig.categories ?? {}, category, locale);
}
