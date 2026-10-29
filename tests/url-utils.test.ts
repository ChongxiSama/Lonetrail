import { describe, expect, it } from "vitest";
import {
	getCategoryUrl,
	getPostUrlBySlug,
	isHomePath,
	makeUrl,
} from "../src/utils/url-utils";

describe("getPostUrlBySlug", () => {
	it("builds post url with trailing slash", () => {
		expect(getPostUrlBySlug("hello")).toBe("/posts/hello/");
	});
});

describe("getCategoryUrl", () => {
	it("builds category url for a real category", () => {
		expect(getCategoryUrl("Tech")).toBe("/categories/Tech/");
		expect(getCategoryUrl("  dev  ")).toBe("/categories/dev/");
	});

	it("routes uncategorized to fallback", () => {
		expect(getCategoryUrl(null)).toBe("/categories/uncategorized/");
		expect(getCategoryUrl("")).toBe("/categories/uncategorized/");
		expect(getCategoryUrl("   ")).toBe("/categories/uncategorized/");
		expect(getCategoryUrl("未分类")).toBe("/categories/uncategorized/");
	});
});

describe("makeUrl", () => {
	it("joins base url and path", () => {
		expect(makeUrl("/about/")).toBe("/about/");
	});
});

describe("isHomePath", () => {
	it("matches home and numbered pages", () => {
		expect(isHomePath("/")).toBe(true);
		expect(isHomePath("/3/")).toBe(true);
		expect(isHomePath("/page/2/")).toBe(true);
	});

	it("rejects non-home paths", () => {
		expect(isHomePath("/about/")).toBe(false);
		expect(isHomePath("/posts/hello/")).toBe(false);
		expect(isHomePath("/12abc/")).toBe(false);
	});
});
