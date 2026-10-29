import type { AstroIntegration } from "@swup/astro";

declare global {
	interface Window {
		swup: AstroIntegration;
		twikoo: {
			init: (options: { envId: string; el: string; lang?: string }) => void;
		};

		pagefind: {
			search: (query: string) => Promise<{
				results: Array<{
					data: () => Promise<SearchResult>;
				}>;
			}>;
		};
	}
}
interface SearchResult {
	url: string;
	meta: {
		title: string;
	};
	excerpt: string;
	content?: string;
	word_count?: number;
	filters?: Record<string, unknown>;
	anchors?: Array<{
		element: string;
		id: string;
		text: string;
		location: number;
	}>;
	weighted_locations?: Array<{
		weight: number;
		balanced_score: number;
		location: number;
	}>;
	locations?: number[];
	raw_content?: string;
	raw_url?: string;
	sub_results?: SearchResult[];
}
interface PagefindResultData {
	url: string;
	excerpt: string;
	meta: {
		title: string;
		image?: string;
	};
	sub_results: Array<{
		title: string;
		url: string;
		excerpt: string;
	}>;
}
