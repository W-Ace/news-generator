# 2026 FIFA World Cup News Site

靜態新聞網站，以 2026 FIFA 世界盃為主題。給定文章內容，產出一頁式新聞網頁。

## Tech Stack

- Astro 5.x (SSG), Tailwind CSS v4 (`@tailwindcss/vite`), TypeScript
- Fonts: Noto Serif TC (body), Noto Sans TC (headers/UI)
- Node.js 22+ (see `.nvmrc`)

## Commands

```bash
npm run dev              # Dev server at localhost:4321
npm run build            # Build static site to ./dist
npm run preview          # Preview built site
npm run generate         # Generate articles from data/input/articles.json
npm run generate:build   # Generate + build in one step
npm run generate:preview # Generate + build + preview in one step
```


## Architecture

- `src/content/articles/*.md` — Markdown articles (frontmatter + body)
- `src/content.config.ts` — Content collection schema (7 fields)
- `src/layouts/` — BaseLayout (HTML shell), ArticleLayout (news article)
- `src/components/` — SEOHead, Header, Footer, HeroImage, ArticleBody, ArticleMeta
- `src/pages/articles/[...slug].astro` — Dynamic article routes (slug = filename)
- `scripts/generate-articles.mjs` — Batch generator: JSON → Markdown files
- `data/input/articles.json` — Batch input format
- `data/reference/fifa-2026-info.md` — FIFA 2026 reference data

## Content Schema (Frontmatter)

```yaml
title: "文章標題"          # required
description: "SEO 描述"   # required, max 160 chars
author: "作者"             # default: 編輯部
publishDate: 2026-04-09   # required, YYYY-MM-DD
heroImage: "/images/x.svg" # optional, path in public/
heroImageAlt: "圖片描述"   # optional
heroImageCredit: "來源"    # optional
```

## Writing Style

- 繁體中文（zh-TW），正式新聞語氣
- 參考報導者（twreporter.org）、中央社（cna.com.tw）的文風
- 台灣用語：世界盃（非世界杯）、足球、進球
- 文章結構：導言（5W1H）→ 段落 → 小標（H2）→ 結語
- 球員名稱格式：中文譯名（原名），如「梅西（Lionel Messi）」

## Design Principles

- 專業新聞風格，乾淨可讀，不花俏
- 文章最大寬度 720px（中文 35-40 字/行）
- 行高 1.85，字距 0.02em（中文優化）
- 深色 header + 暖白內文 + 紅色 accent (#c41e3a)

## Image Strategy

- `public/images/` — 所有圖片（球員照片、場地照片、OG 圖）
- Hero image 在 frontmatter 中用 string path 指定（如 `/images/messi.jpg`）
- 無 hero image 時自動顯示漸層 fallback
- 圖片來源必須標注 heroImageCredit
- **批量生成時**：在 JSON 中提供 `heroImageUrl`（外部 URL），generate script 會自動下載到 `public/images/`
- **圖片來源**：優先使用 Wikimedia Commons（CC BY-SA 授權），搜尋球員名或場地名
- 有球星就用球星照片，沒有至少要有足球相關圖片
