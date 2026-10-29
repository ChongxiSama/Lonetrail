import MarkdownIt from "markdown-it";

const inlineParser = new MarkdownIt({
	html: false,
	linkify: false,
	breaks: true,
	typographer: true,
});

inlineParser.renderer.rules.link_open = () => "";
inlineParser.renderer.rules.link_close = () => "";
inlineParser.renderer.rules.image = () => "";

export function renderInlineMarkdown(md: string): string {
	const prepared = md
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/<video[\s\S]*?<\/video>|<video[^>]*\/?>/gi, "")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/^\s*#{1,6}\s+/gm, "");
	return inlineParser.renderInline(prepared).trim();
}

export function stripMarkdown(md: string): string {
	return (
		md
			// html comments
			.replace(/<!--[\s\S]*?-->/g, "")
			// angle-bracket autolinks keep their url
			.replace(/<(https?:\/\/[^>\s]+)>/g, "$1")
			// raw html tags
			.replace(/<\/?[A-Za-z][^>]*>/g, "")
			// images: ![alt](url) → drop entirely (preview handled separately)
			.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
			// links: [text](url) → text
			.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
			// strikethrough: ~~text~~ → text
			.replace(/~~([^~]+)~~/g, "$1")
			// task list markers: - [ ] / - [x]
			.replace(/^\s*[-*]\s+\[[ xX]\]\s+/gm, "")
			// table rows
			.replace(/^\s*\|.*\|\s*$/gm, "")
			// horizontal rules
			.replace(/^\s*([-*_])\1{2,}\s*$/gm, "")
			// footnote references
			.replace(/\[\^[^\]]+\]/g, "")
			// bold: **text** → text
			.replace(/\*\*([^*]+)\*\*/g, "$1")
			// italic: *text* → text
			.replace(/\*([^*]+)\*/g, "$1")
			// heading markers: ### etc
			.replace(/^#{1,6}\s+/gm, "")
			// inline code: `code` → code
			.replace(/`([^`]*)`/g, "$1")
			// collapse whitespace
			.replace(/\n{2,}/g, "\n")
			.trim()
	);
}

export function truncate(text: string, maxLen: number): string {
	if (text.length <= maxLen) return text;
	return `${text.slice(0, maxLen).trimEnd()}…`;
}

export function extractFirstImage(md: string): string {
	const m = md.match(/!\[[^\]]*\]\(([^)]+)\)/);
	return m ? m[1] : "";
}
