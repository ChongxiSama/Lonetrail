import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { DEFAULT_LOCALE, type Locale } from "@i18n/locales";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

export type SluggedPost = Omit<CollectionEntry<"posts">, "data"> & {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};

/**
 * English translations live next to the Chinese original as `<slug>.en.md`.
 * The suffix is stripped from the public slug, so `dji.md` and `dji.en.md`
 * share the same slug and are served at `/posts/dji/` and `/en/posts/dji/`.
 */
const EN_SUFFIX = ".en";

const cachedRawPosts = new Map<Locale, Promise<SluggedPost[]>>();

async function getRawSortedPosts(
	locale: Locale = DEFAULT_LOCALE,
): Promise<SluggedPost[]> {
	if (import.meta.env.PROD) {
		const cached = cachedRawPosts.get(locale);
		if (cached) return cached;
	}
	const build = async (): Promise<SluggedPost[]> => {
		const allBlogPosts = await getCollection("posts", ({ data }) => {
			const isDraft = import.meta.env.PROD ? data.draft === true : false;
			const isNoindex = data.noindex === true;
			return !isDraft && !isNoindex;
		});
		const postsWithCase = allBlogPosts
			.filter((entry) =>
				locale === "en"
					? entry.id.endsWith(EN_SUFFIX)
					: !entry.id.endsWith(EN_SUFFIX),
			)
			.map((entry: CollectionEntry<"posts">) => {
				const parts = entry.id.split("/");
				const filename = parts[parts.length - 1];
				const slug =
					locale === "en" ? filename.slice(0, -EN_SUFFIX.length) : filename;
				return {
					...entry,
					slug,
				};
			});
		return postsWithCase.sort(
			(a, b) => b.data.published.getTime() - a.data.published.getTime(),
		);
	};
	const promise = build();
	if (import.meta.env.PROD) cachedRawPosts.set(locale, promise);
	return promise;
}

export async function getSortedPosts(
	locale: Locale = DEFAULT_LOCALE,
): Promise<SluggedPost[]> {
	return getRawSortedPosts(locale);
}

export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};

export async function getSortedPostsList(
	locale: Locale = DEFAULT_LOCALE,
): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts(locale);
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));
	return sortedPostsList;
}

export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(
	locale: Locale = DEFAULT_LOCALE,
): Promise<Tag[]> {
	const allBlogPosts = await getRawSortedPosts(locale);
	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		const countDiff = countMap[b] - countMap[a];
		if (countDiff !== 0) return countDiff;
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(
	locale: Locale = DEFAULT_LOCALE,
): Promise<Category[]> {
	const allBlogPosts = await getRawSortedPosts(locale);
	const count: { [key: string]: number } = {};
	const uncategorizedKey = i18n(I18nKey.uncategorized, locale);
	allBlogPosts.forEach((post) => {
		if (!post.data.category) {
			count[uncategorizedKey] = count[uncategorizedKey]
				? count[uncategorizedKey] + 1
				: 1;
			return;
		}
		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();
		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});
	const lst = Object.keys(count).sort((a, b) => {
		const countDiff = count[b] - count[a];
		if (countDiff !== 0) return countDiff;
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

export async function getRelatedPosts(
	currentPost: CollectionEntry<"posts">,
	allPosts: SluggedPost[],
	limit = 3,
): Promise<PostForList[]> {
	const tokenize = (text: string) => {
		if (!text) return new Set<string>();
		const matches = text.toLowerCase().match(/[一-龥]|[a-zA-Z0-9]+/g) || [];
		const stopWords = new Set([
			"的",
			"了",
			"和",
			"与",
			"在",
			"是",
			"a",
			"an",
			"the",
			"is",
			"of",
			"for",
			"how",
			"to",
			"why",
			"in",
		]);
		return new Set(
			(matches as string[])
				.filter((m) => m.length > 1 || /[一-龥]/.test(m))
				.filter((m) => !stopWords.has(m)),
		);
	};
	const currentTokens = tokenize(currentPost.data.title);
	const currentTags = new Set(currentPost.data.tags || []);
	const currentCategory = currentPost.data.category;
	const scoredPosts = allPosts
		.filter((post) => post.id !== currentPost.id)
		.map((post) => {
			let score = 0;
			if (currentCategory && post.data.category === currentCategory) {
				score += 5;
			}
			const postTags = post.data.tags || [];
			postTags.forEach((tag: string) => {
				if (currentTags.has(tag)) score += 3;
			});
			const postTokens = tokenize(post.data.title);
			postTokens.forEach((token) => {
				if (currentTokens.has(token)) score += 8;
			});
			return { post, score };
		})
		.filter((item) => item.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((item) => ({
			slug: item.post.slug,
			data: item.post.data,
		}));
	return scoredPosts;
}
