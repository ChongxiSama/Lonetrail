import { readFile, writeFile, glob as fsGlob } from "node:fs/promises";

const { parseHTML } = await import("linkedom");

const dom = parseHTML("<!DOCTYPE html><html><body></body></html>");

global.window = dom.window;
global.document = dom.document;
global.HTMLElement = dom.HTMLElement;
global.customElements = dom.customElements;
global.Event = dom.Event;
global.Node = dom.Node;

Object.defineProperty(global.document, "styleSheets", {
	get() {
		return [];
	},
});

global.CSSStyleSheet = class CSSStyleSheet {
	constructor() {
		this._rules = [];
	}
	get cssRules() {
		return this._rules;
	}
	replaceSync() {}
	insertRule(rule, index) {
		if (index === undefined) index = this._rules.length;
		this._rules.splice(index, 0, rule);
		return index;
	}
};

const { default: mermaid } = await import("mermaid");
mermaid.initialize({ startOnLoad: false });

const files = [];
for await (const p of fsGlob("dist/**/*.html")) {
	files.push(p);
}

let total = 0;

for (const file of files) {
	let html = await readFile(file, "utf-8");
	if (!html.includes("mermaid-src")) continue;

	const regex = /<pre class="mermaid-src" data-processed="false">([\s\S]*?)<\/pre>/g;
	let match;
	let idx = 0;
	let modified = false;

	while ((match = regex.exec(html)) !== null) {
		const raw = match[1];
		const source = raw
			.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'");

		try {
			const { svg } = await mermaid.render(`mermaid-${idx++}`, source);
			const wrapper = `<div class="mermaid-wrapper">${svg}</div>`;
			html = html.replace(match[0], wrapper);
			modified = true;
			total++;
		} catch (err) {
			console.error(`[mermaid] ${file}: render failed:`, err.message);
		}
	}

	if (modified) {
		await writeFile(file, html);
		console.log(`[mermaid] ${file}: ${idx} diagram(s) rendered`);
	}
}

console.log(`[mermaid] Done — ${total} diagram(s) rendered across all pages`);
