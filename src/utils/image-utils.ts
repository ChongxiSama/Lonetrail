import path from "node:path";
import sharp from "sharp";

export type ImageSize = { width: number; height: number };

const cache = new Map<string, Promise<ImageSize | null>>();

export function getLocalImageSize(src: string): Promise<ImageSize | null> {
	if (!src || !src.startsWith("/") || src.startsWith("//")) {
		return Promise.resolve(null);
	}

	const cached = cache.get(src);
	if (cached) return cached;

	const cleanPath = decodeURIComponent(src.split("?")[0].split("#")[0]);
	const publicDir = path.resolve(process.cwd(), "public");
	const filePath = path.resolve(publicDir, `.${cleanPath}`);

	const sizePromise = filePath.startsWith(`${publicDir}${path.sep}`)
		? sharp(filePath)
				.metadata()
				.then(({ width, height }) =>
					width && height ? { width, height } : null,
				)
				.catch(() => null)
		: Promise.resolve(null);

	cache.set(src, sizePromise);
	return sizePromise;
}
