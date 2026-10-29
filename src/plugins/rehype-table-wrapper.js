import { h } from "hastscript";
import { visit } from "unist-util-visit";

export function rehypeTableWrapper() {
	return (tree) => {
		visit(tree, "element", (node, index, parent) => {
			if (node.tagName !== "table" || !parent || index === undefined) return;

			const parentClass = parent.properties?.className;
			if (Array.isArray(parentClass) && parentClass.includes("table-scroll"))
				return;

			parent.children.splice(index, 1, h("div.table-scroll", [node]));
		});
	};
}
