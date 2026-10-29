---
title: "欢迎来到 Lonetrail"
published: 2026-01-15
description: "Lonetrail 是一个基于 Astro 的博客主题：干净、克制，功能齐全。这篇文章带你过一遍它都能做什么。"
tags: ["Lonetrail", "入门", "Astro"]
category: "技术"
---

## 关于 Lonetrail

**Lonetrail** 是一个用 Astro 构建的现代博客主题。它把阅读体验放在第一位，同时保留了足够的可定制空间。

> Per Aspera, Ad Astra.
> *循此苦旅，直抵群星。*

### 核心能力

- **静态生成**——Astro 输出纯静态页面，首屏几乎没有等待
- **中英双语**——中文在 `/`，英文在 `/en/`，语言来回切换不丢路径
- **日志（Essays）**——短句、图片、随手记，和长文分开呈现
- **无刷新导航**——Swup 接管跳转，页面切换带过渡
- **全文搜索**——构建时生成 Pagefind 索引，无需后端
- **系列（Series）**——把文章按主题串成专题
- **标签与分类**——随内容自动生成归档页
- **深色模式**——跟随系统或手动切换
- **RSS / Atom / Sitemap**——构建时自动输出，含按语言分片的版本
- **代码高亮**——Expressive Code，带行号、折叠、复制
- **数学与图表**——KaTeX 公式、Mermaid 图

### 快速开始

```bash
git clone https://github.com/ChongxiSama/Lonetrail.git my-blog
cd my-blog
pnpm install
pnpm dev
pnpm build
```

### 目录结构

```
src/
├── content/        # 内容
│   ├── posts/      # 文章
│   ├── essays/     # 日志
│   ├── seri/       # 专题
│   └── spec/       # 独立页面
├── components/     # 组件
├── layouts/        # 布局
├── pages/          # 路由
├── styles/         # 样式
├── config.ts       # 功能开关与集成配置
└── site.yml        # 站点元信息
```

### 写文章

在 `src/content/posts/` 下新建 Markdown 文件，补一段 frontmatter：

```yaml
---
title: "文章标题"
published: 2026-01-15
description: "一句话摘要"
tags: ["标签一", "标签二"]
category: "技术"
---
```

英文版本用同名文件加 `.en` 后缀，例如 `welcome.en.md`，它会出现在 `/en/posts/welcome/`。

详细配置见《Lonetrail 配置说明》。
