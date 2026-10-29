import { profileBioEn, profileConfig, siteConfig, siteMeta } from "@/config";
import { DEFAULT_LOCALE, type Locale } from "./locales";

export function getSiteTitle(locale: Locale = DEFAULT_LOCALE): string {
	return locale === "en" ? siteMeta.titleEn : siteConfig.title;
}

export function getSiteSubtitle(locale: Locale = DEFAULT_LOCALE): string {
	return locale === "en" ? siteMeta.subtitleEn : siteConfig.subtitle;
}

export function getSiteDescription(locale: Locale = DEFAULT_LOCALE): string {
	return locale === "en" ? siteMeta.descriptionEn : siteConfig.subtitle;
}

export function getProfileBio(locale: Locale = DEFAULT_LOCALE): string {
	if (locale === "en") return profileBioEn;
	return profileConfig.bio ?? "";
}
