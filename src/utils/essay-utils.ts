import { getCollection } from "astro:content";
import { DEFAULT_LOCALE, type Locale } from "../i18n/locales";
import { getLocalImageSize } from "./image-utils";
import {
	extractFirstImage,
	renderInlineMarkdown,
	stripMarkdown,
	truncate,
} from "./strip-markdown";

const MAX_PREVIEW = 100;

export type EssayItem = {
	slug: string;
	title: string;
	published: Date;
	image: string;
	imageWidth?: number;
	imageHeight?: number;
	preview: string;
	previewHtml: string;
};

export async function getEssayItems(
	locale: Locale = DEFAULT_LOCALE,
): Promise<EssayItem[]> {
	const entries = (await getCollection("essays")).filter((entry) =>
		locale === "en"
			? entry.filePath?.endsWith(".en.md")
			: !entry.filePath?.endsWith(".en.md"),
	);
	const sorted = entries.sort(
		(a, b) =>
			new Date(b.data.published).getTime() -
			new Date(a.data.published).getTime(),
	);

	return Promise.all(
		sorted.map(async (entry) => {
			const body = entry.body ?? "";
			const image = extractFirstImage(body);
			const size = image ? await getLocalImageSize(image) : null;
			const hasVideo = /<video[\s>]/i.test(body);
			const plain = body ? truncate(stripMarkdown(body), MAX_PREVIEW) : "";
			const preview =
				plain || (hasVideo ? (locale === "en" ? "Video" : "视频") : "");
			const previewHtml = (body ? renderInlineMarkdown(body) : "") || preview;
			return {
				slug: (entry.filePath?.split("/").pop() ?? entry.id)
					.replace(/\.en\.md$/, "")
					.replace(/\.md$/, ""),
				title: entry.data.title,
				published: entry.data.published,
				image,
				imageWidth: size?.width,
				imageHeight: size?.height,
				preview,
				previewHtml,
			};
		}),
	);
}
