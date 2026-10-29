import { describe, expect, it } from "vitest";
import { getSiteSubtitle, getSiteTitle } from "../src/i18n/site";
import { getCategoryLabel, getTagLabel } from "../src/i18n/taxonomy";

describe("getSiteTitle", () => {
	it("returns the default locale title", () => {
		expect(getSiteTitle("zh")).toBe("Lonetrail");
	});

	it("returns the English title for en", () => {
		expect(getSiteTitle("en")).toBe("Lonetrail");
	});
});

describe("getSiteSubtitle", () => {
	it("returns the default locale subtitle", () => {
		expect(getSiteSubtitle("zh")).toBe("循此苦旅 直抵群星");
	});

	it("returns the English subtitle for en", () => {
		expect(getSiteSubtitle("en")).toBe("Ad Astra Per Aspera");
	});
});

describe("getTagLabel", () => {
	it("keeps canonical tags in the default locale", () => {
		expect(getTagLabel("技术", "zh")).toBe("技术");
		expect(getTagLabel("Android", "zh")).toBe("Android");
	});

	it("translates mapped tags for English readers", () => {
		expect(getTagLabel("技术", "en")).toBe("Technology");
		expect(getTagLabel("随笔", "en")).toBe("Essays");
	});

	it("passes unknown tags through", () => {
		expect(getTagLabel("maimai", "en")).toBe("maimai");
	});
});

describe("getCategoryLabel", () => {
	it("translates mapped categories", () => {
		expect(getCategoryLabel("技术", "en")).toBe("Technology");
		expect(getCategoryLabel("未分类", "en")).toBe("Uncategorized");
	});

	it("returns an empty label for missing categories", () => {
		expect(getCategoryLabel(null, "en")).toBe("");
	});
});
