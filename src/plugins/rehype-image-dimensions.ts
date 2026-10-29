import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";
import { getLocalImageSize } from "../utils/image-utils";

export function rehypeImageDimensions() {
	return async (tree: Root) => {
		const images: Element[] = [];

		visit(tree, "element", (node: Element) => {
			if (node.tagName === "img") images.push(node);
		});

		await Promise.all(
			images.map(async (node) => {
				const properties = node.properties ?? {};
				const src = properties.src;
				if (typeof src !== "string") return;
				if (properties.width !== undefined && properties.height !== undefined)
					return;
				if (src.startsWith("/_astro/") || src.startsWith("/@")) return;

				const size = await getLocalImageSize(src);
				if (!size) return;

				node.properties = {
					...properties,
					width: size.width,
					height: size.height,
				};
			}),
		);
	};
}
