import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import loadYaml from "js-yaml";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import yaml from "@rollup/plugin-yaml";
import swup from "@swup/astro";
import { defineConfig, fontProviders } from "astro/config";
import compress from "astro-compress";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeComponents from "rehype-components";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import remarkGithubAdmonitionsToDirectives from "remark-github-admonitions-to-directives";
import remarkMath from "remark-math";
import remarkSectionize from "remark-sectionize";
import { pluginCustomCopyButton } from "./src/plugins/expressive-code/custom-copy-button.js";
import { pluginLanguageBadge } from "./src/plugins/expressive-code/language-badge.ts";
import { AdmonitionComponent } from "./src/plugins/rehype-component-admonition.mjs";
import { GithubCardComponent } from "./src/plugins/rehype-component-github-card.mjs";
import { rehypeExternalLinks } from "./src/plugins/rehype-external-links.js";
import { rehypeImageDimensions } from "./src/plugins/rehype-image-dimensions.ts";
import { rehypeOptimizeImages } from "./src/plugins/rehype-optimize-images.js";
import { rehypePangu } from "./src/plugins/rehype-pangu.js";
import { rehypeTableWrapper } from "./src/plugins/rehype-table-wrapper.js";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { remarkMermaid } from "./src/plugins/remark-mermaid.mjs";
import { remarkReadingTime } from "./src/plugins/remark-reading-time.mjs";

const isCI = process.env.CI === "true";

const siteYaml = loadYaml.load(
	readFileSync(
		join(dirname(fileURLToPath(import.meta.url)), "src/site.yml"),
		"utf8",
	),
);
const siteUrl = siteYaml.site.url.endsWith("/")
	? siteYaml.site.url
	: `${siteYaml.site.url}/`;
const imageDomains = [
	...new Set([new URL(siteUrl).hostname, ...(siteYaml.trusted_domains ?? [])]),
];

export default defineConfig({
	site: siteUrl,
	base: "/",
	trailingSlash: "always",
	i18n: {
		defaultLocale: "zh",
		locales: ["zh", "en"],
		// Missing English routes are rendered from the Chinese page so the
		// language switch never 404s. Layout marks them noindex.
		fallback: { en: "zh" },
		routing: {
			// Chinese stays at `/`, English lives under `/en/`.
			prefixDefaultLocale: false,
			// Any route that has no English page yet is rendered at its `/en/`
			// address with the English UI shell (content stays as authored).
			fallbackType: "rewrite",
		},
	},
	experimental: {
		collectionStorage: "chunked",
	},
	fonts: [
		{
			name: "Fira Code",
			provider: fontProviders.fontsource("fira-code"),
			cssVariable: "--font-mono-var",
		},
	],
	image: {
		domains: imageDomains,
		format: ["webp"],
		service: isCI
			? { entrypoint: "astro/assets/services/sharp" }
			: { entrypoint: "astro/assets/services/noop" },
	},
	integrations: [
		react(),
		icon({}),
		swup({
			containers: ["#content-main"],
			cache: true,
			preload: { hover: true, visible: false },
			accessibility: true,
			theme: false,
			animationSelector: "#nonexistent",
			updateHead: { persistAssets: true },
		}),
		expressiveCode({
			themes: ["github-dark"],
			useVariableFonts: true,
			plugins: [
				pluginCollapsibleSections(),
				pluginLineNumbers(),
				pluginLanguageBadge(),
				pluginCustomCopyButton(),
			],
			defaultProps: {
				wrap: false,
				showLineNumbers: true,
				overridesByLang: {
					shellsession: {
						showLineNumbers: false,
					},
				},
			},
			styleOverrides: {
				codeBackground: "#1A1814",
				borderRadius: "0px",
				borderColor: "rgba(255, 255, 255, 0.05)",
				codeFontSize: "13px",
				codeFontFamily:
					"'Fira Code', 'Fira Code Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
				codeLineHeight: "1.7",
				uiLineHeight: "1.7",
				frames: {
					editorBackground: "#1A1814",
					terminalBackground: "#1A1814",
					terminalTitlebarBackground: "none",
					editorTabBarBackground: "none",
					editorActiveTabBackground: "none",
					editorActiveTabIndicatorBottomColor: "#D4621A",
					editorActiveTabIndicatorTopColor: "none",
					editorTabBarBorderBottomColor: "transparent",
					terminalTitlebarBorderBottomColor: "transparent",
					inlineButtonForeground: "transparent",
				},
			},
			frames: {
				showCopyToClipboardButton: false,
			},
		}),
		compress({
			CSS: false,
			HTML: false,
			Image: false,
			JavaScript: true,
			SVG: true,
			Logger: 1,
		}),
		mdx(),
	],
	markdown: {
		processor: unified({
			remarkPlugins: [
				remarkMermaid,
				remarkMath,
				remarkReadingTime,
				remarkGithubAdmonitionsToDirectives,
				remarkDirective,
				remarkSectionize,
				parseDirectiveNode,
			],
			rehypePlugins: [
				rehypeRaw,
				rehypePangu,
				rehypeImageDimensions,
				rehypeKatex,
				rehypeSlug,
				rehypeOptimizeImages,
				[rehypeExternalLinks, { domains: imageDomains }],
				rehypeTableWrapper,
				[
					rehypeComponents,
					{
						components: {
							github: GithubCardComponent,
							note: (x, y) => AdmonitionComponent(x, y, "note"),
							tip: (x, y) => AdmonitionComponent(x, y, "tip"),
							important: (x, y) => AdmonitionComponent(x, y, "important"),
							caution: (x, y) => AdmonitionComponent(x, y, "caution"),
							warning: (x, y) => AdmonitionComponent(x, y, "warning"),
							red: (x, y) => AdmonitionComponent(x, y, "caution"),
							blue: (x, y) => AdmonitionComponent(x, y, "note"),
							green: (x, y) => AdmonitionComponent(x, y, "tip"),
							yellow: (x, y) => AdmonitionComponent(x, y, "warning"),
							cyan: (x, y) => AdmonitionComponent(x, y, "important"),
						},
					},
				],
				[
					rehypeAutolinkHeadings,
					{
						behavior: "append",
						properties: {
							className: ["anchor"],
						},
						content: {
							type: "element",
							tagName: "span",
							properties: {
								className: ["anchor-icon"],
								"data-pagefind-ignore": true,
							},
							children: [
								{
									type: "text",
									value: "#",
								},
							],
						},
					},
				],
			],
		}),
	},
	vite: {
		plugins: [yaml()],
		build: {
			cssCodeSplit: true,
			rollupOptions: {
				external: ["/pagefind/pagefind.js"],
				onwarn(warning, warn) {
					if (
						warning.message.includes("is dynamically imported by") &&
						warning.message.includes("but also statically imported by")
					) {
						return;
					}
					warn(warning);
				},
			},
		},

		server: {
			watch: {
				ignored: ["**/*.bak", "**/*.bak.*"],
			},
		},
	},
});
