import { siteMeta, trustedDomains } from "@/config";

function toHostname(url: string): string | null {
	try {
		return new URL(url).hostname.toLowerCase();
	} catch {
		return null;
	}
}

export const SITE_URL = siteMeta.url.endsWith("/")
	? siteMeta.url
	: `${siteMeta.url}/`;

export const SITE_ORIGIN = SITE_URL.replace(/\/$/, "");

export const SITE_DOMAINS: readonly string[] = [
	...new Set(
		[
			toHostname(siteMeta.url),
			...trustedDomains.map((d) => d.toLowerCase()),
		].filter((domain): domain is string => Boolean(domain)),
	),
];

export function isInternalDomain(hostname: string): boolean {
	return SITE_DOMAINS.some(
		(domain) => hostname === domain || hostname.endsWith(`.${domain}`),
	);
}
