import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}
export function getPostUrlBySlug(slug: string): string {
	return makeUrl(`/posts/${slug}/`);
}
export function getCategoryUrl(category: string | null): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() === i18n(I18nKey.uncategorized).toLowerCase()
	)
		return makeUrl("/categories/uncategorized/");
	return makeUrl(`/categories/${encodeURIComponent(category.trim())}/`);
}
export function makeUrl(path: string): string {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
export function isHomePath(path: string): boolean {
	const p = path.endsWith("/") ? path : `${path}/`;
	const root = makeUrl("/");
	const rootP = root.endsWith("/") ? root : `${root}/`;
	return p === rootP || /^\/\d+\/?$/.test(p) || /^\/page\/\d+\/?$/.test(p);
}
