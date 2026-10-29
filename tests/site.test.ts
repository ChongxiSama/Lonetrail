import { describe, expect, it } from "vitest";
import { siteMeta } from "../src/config";
import { isInternalDomain, SITE_DOMAINS } from "../src/constants/site";

const host = new URL(siteMeta.url).hostname;

describe("isInternalDomain", () => {
	it("matches the configured site host", () => {
		expect(isInternalDomain(host)).toBe(true);
	});

	it("matches subdomains of registered domains", () => {
		expect(isInternalDomain(`sub.${host}`)).toBe(true);
	});

	it("rejects external domains", () => {
		expect(isInternalDomain("evil.com")).toBe(false);
		expect(isInternalDomain(`${host}.evil.com`)).toBe(false);
		expect(isInternalDomain(`evil${host}`)).toBe(false);
	});

	it("rejects empty hostname", () => {
		expect(isInternalDomain("")).toBe(false);
	});

	it("SITE_DOMAINS entries are well-formed", () => {
		for (const domain of SITE_DOMAINS) {
			expect(domain).toBe(domain.toLowerCase());
			expect(domain.length).toBeGreaterThan(0);
			expect(domain.startsWith(".")).toBe(false);
			expect(domain.endsWith(".")).toBe(false);
			expect(domain).not.toContain(" ");
			expect(domain).toMatch(/^[a-z0-9.-]+$/);
		}
	});
});
