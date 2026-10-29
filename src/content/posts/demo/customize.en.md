---
title: "Configuring Lonetrail"
published: 2026-03-01
description: "Site metadata, navigation and profile live in site.yml; feature flags and third-party integrations live in config.ts."
tags: ["Lonetrail", "Configuration"]
category: "技术"
---

## Two layers of configuration

| File | Holds |
| --- | --- |
| `src/site.yml` | Title, subtitle, URL, author, navigation, social links, copyright, trusted domains, taxonomy labels |
| `src/config.ts` | Locale routing, feature flags (search, comments, analytics), Twikoo / Umami parameters |

`src/config.ts` reads `site.yml` and exports `siteConfig` / `navBarConfig` / `profileConfig`, so components never touch the raw YAML.

## site.yml

```yaml
site:
  title: "Lonetrail"
  title_en: "Lonetrail"
  subtitle: "循此苦旅 直抵群星"
  subtitle_en: "Ad Astra Per Aspera"
  description: "一个关于代码、安全与网络的个人笔记本。"
  description_en: "A personal notebook on code, security and the web."
  url: "https://lonetrail.pages.dev"
  lang: "zh_CN"
  author: "Lonetrail"
  email: "i@chongxi.us"
  favicon: "/images/favicon.webp"
  banner: "/images/banner.webp"
  og_image: "/images/og.webp"
  avatar: "/images/avatar.webp"
```

Bilingual fields come in pairs. The English site reads `*_en` and falls back to the default value when it is empty.

`url` also drives `site` and the image allow-list in `astro.config.mjs`, so changing the domain is a one-line edit.

### Navigation

Nav entries reference built-in labels by `key`, so they translate automatically:

```yaml
nav:
  - key: home
    url: "/"
  - key: archive
    url: "/archive/"
  - key: series
    url: "/seri/"
  - key: essays
    url: "/essays/"
  - key: about
    url: "/about/"
```

Available keys: `home`, `archive`, `series`, `essays`, `about`, `subscribe`. Custom links use `name` instead:

```yaml
nav:
  - name: "Notes"
    url: "/notes/"
```

### Taxonomy labels

Translated labels are display-only — URLs and filters keep the canonical name:

```yaml
taxonomy:
  tags:
    "技术": "Technology"
  categories:
    "技术": "Technology"
```

## config.ts

```ts
export const localeConfig = {
	defaultLocale: "zh",
	locales: ["zh", "en"],
	translatedPaths: ["/", "/archive/", "/about/", "/subscribe/", "/essays/"],
};

export const featureConfig = {
	comments: true,
	search: true,
	analytics: "none",
};

export const integrationConfig = {
	twikoo: { envId: "" },
	umami: { websiteId: "", domains: "" },
};
```

- `translatedPaths` — pages that have a real English version; every other `/en/` route is a fallback of the Chinese page and is marked noindex
- `featureConfig.comments` — turn off to drop the comment section
- `featureConfig.search` — turn off to skip mounting the search panel
- `featureConfig.analytics` — set to `"umami"` and fill `umami.websiteId` to load the script
- `integrationConfig.twikoo.envId` — leave empty to skip comments entirely

## Post frontmatter

```yaml
---
title: "Post title"
published: 2026-01-15
updated: 2026-02-01
description: "One-line summary"
tags: ["tag-one", "tag-two"]
category: "技术"
draft: false
pinned: false
noindex: false
---
```

- `draft: true` — skipped in production builds
- `pinned: true` — pinned to the top of the first home page
- `noindex: true` — kept out of listings and sitemaps
