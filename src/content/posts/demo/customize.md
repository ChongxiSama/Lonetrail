---
title: "Lonetrail 配置说明"
published: 2026-03-01
description: "站点元信息、导航和作者资料写在 site.yml，功能开关与第三方集成写在 config.ts，两者分工明确。"
tags: ["Lonetrail", "配置"]
category: "技术"
---

## 配置分工

Lonetrail 把配置拆成两层：

| 文件 | 放什么 |
| --- | --- |
| `src/site.yml` | 站点标题、副标题、URL、作者、导航、社交链接、版权、信任域名、标签翻译 |
| `src/config.ts` | 语言路由、功能开关（搜索、评论、统计）、Twikoo / Umami 等集成参数 |

`src/config.ts` 会读取 `site.yml` 并导出同形的 `siteConfig` / `navBarConfig` / `profileConfig`，组件只关心后者。

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

双语字段成对出现。英文站读 `*_en`，没填就回退到中文值。

`url` 同时决定了 `astro.config.mjs` 里的 `site` 和图片白名单，改域名只改这一处。

### 导航

导航用 `key` 引用内置文案，中英文自动切换：

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

可用的 `key`：`home`、`archive`、`series`、`essays`、`about`、`subscribe`。想加自定义链接就直接写 `name`：

```yaml
nav:
  - name: "Notes"
    url: "/notes/"
```

### 标签翻译

英文站展示标签时用的译名，只影响显示，不影响 URL：

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

- `translatedPaths`：这些页面有真正的英文版本，其余 `/en/` 路由是中文页的 fallback，会被标记 noindex
- `featureConfig.comments`：关闭后文章页不再渲染评论区
- `featureConfig.search`：关闭后不挂载搜索面板
- `featureConfig.analytics`：设为 `"umami"` 并填好 `umami.websiteId` 才会加载统计脚本
- `integrationConfig.twikoo.envId`：留空则不渲染评论

## 文章 frontmatter

```yaml
---
title: "文章标题"
published: 2026-01-15
updated: 2026-02-01
description: "一句话摘要"
tags: ["标签一", "标签二"]
category: "技术"
draft: false
pinned: false
noindex: false
---
```

- `draft: true`：生产构建时跳过
- `pinned: true`：在首页第一页置顶
- `noindex: true`：不进入列表，也不输出 sitemap
