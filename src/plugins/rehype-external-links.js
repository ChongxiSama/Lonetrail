import { visit } from "unist-util-visit";

export function rehypeExternalLinks(options = {}) {
	const domains = options.domains ?? [];
	const isInternal = (hostname) =>
		domains.some(
			(domain) => hostname === domain || hostname.endsWith(`.${domain}`),
		);
	const isExternalUrl = (href) => {
		try {
			const url = new URL(href);
			return !isInternal(url.hostname);
		} catch {
			return false;
		}
	};
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName === "a" && node.properties && node.properties.href) {
				const href = node.properties.href;
				if (isExternalUrl(href)) {
					node.properties.rel = "noopener noreferrer";
					node.properties.target = "_blank";
					node.properties.href = `/go/?url=${encodeURIComponent(href)}`;
				}
			}
		});
	};
}
