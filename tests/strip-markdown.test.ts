import { describe, expect, it } from "vitest";
import {
	extractFirstImage,
	stripMarkdown,
	truncate,
} from "../src/utils/strip-markdown";

describe("stripMarkdown", () => {
	it("drops images entirely", () => {
		expect(stripMarkdown("before ![alt](/img/a.webp) after")).toBe(
			"before  after",
		);
	});

	it("turns links into their text", () => {
		expect(stripMarkdown("[Lonetrail](https://example.com) is here")).toBe(
			"Lonetrail is here",
		);
	});

	it("removes bold and italic markers", () => {
		expect(stripMarkdown("**bold** and *italic*")).toBe("bold and italic");
	});

	it("removes heading markers", () => {
		expect(stripMarkdown("### Title\nbody")).toBe("Title\nbody");
	});

	it("unwraps inline code", () => {
		expect(stripMarkdown("run `pnpm build` now")).toBe("run pnpm build now");
	});

	it("removes raw html tags", () => {
		expect(stripMarkdown('<img src="/a.webp" alt="Photo" />')).toBe("");
		expect(stripMarkdown("text <span>inside</span> tail")).toBe(
			"text inside tail",
		);
	});

	it("keeps angle-bracket autolinks", () => {
		expect(stripMarkdown("<https://example.com>")).toBe("https://example.com");
	});

	it("collapses blank line runs and trims", () => {
		expect(stripMarkdown("a\n\n\n\nb\n")).toBe("a\nb");
	});
});

describe("truncate", () => {
	it("returns text unchanged when within limit", () => {
		expect(truncate("hello", 10)).toBe("hello");
	});

	it("appends ellipsis when exceeding limit", () => {
		expect(truncate("hello world", 5)).toBe("hello…");
	});

	it("trims trailing whitespace before ellipsis", () => {
		expect(truncate("hello world", 6)).toBe("hello…");
	});
});

describe("extractFirstImage", () => {
	it("returns the first image url", () => {
		expect(extractFirstImage("![a](/img/a.webp)\n![b](/img/b.webp)")).toBe(
			"/img/a.webp",
		);
	});

	it("returns empty string when no image", () => {
		expect(extractFirstImage("no image here")).toBe("");
	});
});
