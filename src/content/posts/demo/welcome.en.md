---
title: "Welcome to Lonetrail"
published: 2026-01-15
description: "Lonetrail is an Astro-based blog theme — clean, restrained, and packed with features. This article walks you through what it does."
tags: ["Lonetrail", "Getting Started", "Astro"]
category: "技术"
---

## About Lonetrail

**Lonetrail** is a modern blog theme built with Astro. It puts reading experience first while keeping plenty of room for customization.

> Per Aspera, Ad Astra.
> *Through hardships to the stars.*

### What's inside

- **Static by default** — Astro ships plain HTML; almost nothing to wait for
- **Bilingual** — Chinese at `/`, English at `/en/`, the language switch keeps your place
- **Essays** — short notes and images, kept apart from long-form posts
- **No-refresh navigation** — Swup handles transitions between pages
- **Full-text search** — Pagefind index generated at build time, no backend
- **Series** — group articles into multi-part reads
- **Tags & categories** — archive pages generated from content
- **Dark mode** — follow the system or toggle manually
- **RSS / Atom / Sitemap** — emitted at build time, including per-locale variants
- **Code highlighting** — Expressive Code with line numbers, folding and copy
- **Math & diagrams** — KaTeX and Mermaid

### Quick start

```bash
git clone https://github.com/ChongxiSama/Lonetrail.git my-blog
cd my-blog
pnpm install
pnpm dev
pnpm build
```

### Directory layout

```
src/
├── content/        # Content
│   ├── posts/      # Posts
│   ├── essays/     # Essays
│   ├── seri/       # Series
│   └── spec/       # Standalone pages
├── components/     # Components
├── layouts/        # Layouts
├── pages/          # Routes
├── styles/         # Styles
├── config.ts       # Feature flags and integrations
└── site.yml        # Site metadata
```

### Writing a post

Drop a Markdown file into `src/content/posts/` with frontmatter:

```yaml
---
title: "Post title"
published: 2026-01-15
description: "One-line summary"
tags: ["tag-one", "tag-two"]
category: "技术"
---
```

For an English translation, add a sibling file with an `.en` suffix such as `welcome.en.md`; it is served at `/en/posts/welcome/`.

See "Configuring Lonetrail" for the full configuration reference.
