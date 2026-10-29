# Lonetrail

<p align="center">
  <img src="public/images/og.webp" alt="Lonetrail" width="100%">
</p>

![Astro](https://img.shields.io/badge/Astro-7-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

[English](README.md) | 简体中文

极简 Astro 博客模板。纯静态输出，开箱即用的中英双语，配置分两层：`site.yml` 放站点信息，`config.ts` 放功能开关。

## 演示

👉 [在线预览](https://lonetrail.pages.dev/)

## 功能

- **Astro 7**——纯静态输出，不需要服务器
- **中英双语**——中文在 `/`，英文在 `/en/`，未翻译页面自动回退
- **日志（Essays）**——短句与图片，带时间线和活跃度热力图
- **Swup**——页面无刷新跳转
- **Pagefind**——构建时生成全文搜索索引
- **专题（Series）**——把文章按主题串起来
- **标签与分类**——随内容自动生成归档页
- **Markdown**——Expressive Code、KaTeX、Mermaid、提示块、目录
- **订阅**——RSS、Atom 与分片 sitemap，按语言分别输出
- **可选集成**——Twikoo 评论与 Umami 统计，默认关闭
- **深色模式**、响应式、可访问性

## 快速开始

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # 产物 dist/，同时生成 Pagefind 索引
```

需要 Node 24 或更高版本。

## 配置

站点元信息写在 `src/site.yml`：

```yaml
site:
  title: "Lonetrail"
  title_en: "Lonetrail"
  subtitle: "循此苦旅 直抵群星"
  subtitle_en: "Ad Astra Per Aspera"
  url: "https://lonetrail.pages.dev"
  author: "Lonetrail"
  email: "i@chongxi.us"
  favicon: "/images/favicon.webp"
  banner: "/images/banner.webp"
  og_image: "/images/og.webp"
  avatar: "/images/avatar.webp"
  version: "CEPATO_NEXT_v27.0"
```

`version` 是侧栏底部显示的标识，和 package.json 的版本号互不影响。

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

功能开关与集成参数写在 `src/config.ts`：

```ts
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

## 内容

文章放在 `src/content/posts/`：

```markdown
---
title: "我的第一篇文章"
published: 2026-01-01
description: "一句话摘要"
tags: ["astro", "blog"]
category: "技术"
---

正文……
```

英文版本用同名文件加 `.en` 后缀，例如 `hello.en.md`。

其他集合：

- `src/content/essays/`——日志
- `src/content/seri/`——专题
- `src/content/spec/`——独立页面

## 部署

`pnpm build` 产出完整的静态站点 `dist/`，任何静态托管都能跑：Cloudflare Pages、Vercel、Netlify、GitHub Pages 或对象存储。

`public/_headers` 与 `public/_redirects` 是 Netlify / Cloudflare 的约定文件，不支持的平台会直接忽略。

## 目录

```
src/
  site.yml         站点信息、导航、作者
  config.ts        功能开关与集成配置
  content/         文章、日志、专题、独立页
  components/      UI 与页面组件
  layouts/         页面布局
  pages/           路由（中文在 /，英文在 /en/）
  styles/          token、Markdown 与主题样式
  plugins/         remark / rehype 插件
  i18n/            多语言文案与工具
public/            静态资源与字体
```

## 许可

MIT，随意使用，无需署名。
