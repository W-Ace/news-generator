# 2026 FIFA World Cup News Generator

給定文章內容，批量產出一頁式新聞靜態網頁。以 2026 FIFA 世界盃為主題，版面參考報導者、中央社等台灣新聞網站風格。

## Tech Stack

- **[Astro](https://astro.build/)** 5.x — Static Site Generation（零 JS、SEO 最佳化）
- **[Tailwind CSS](https://tailwindcss.com/)** v4 — 樣式框架
- **Noto Serif TC / Noto Sans TC** — 中文排版字型
- **Node.js** 22+

## Quick Start

```bash
# 安裝依賴
nvm use    # 切換至 Node 22
npm install

# 開發
npm run dev          # localhost:4321

# 建置
npm run build        # 輸出至 ./dist
npm run preview      # 預覽建置結果
```

## 批量產生文章

1. 編輯 `data/input/articles.json`：

```json
[
  {
    "title": "文章標題",
    "description": "SEO 描述（≤160 字）",
    "body": "Markdown 格式內文...",
    "heroImageUrl": "https://upload.wikimedia.org/...",
    "heroImageCredit": "Photo: Wikimedia Commons / CC BY-SA 4.0"
  }
]
```

2. 執行批量生成 + 建置：

```bash
npm run generate:build
```

圖片會自動從 `heroImageUrl` 下載到 `public/images/`。

## 手動新增單篇文章

在 `src/content/articles/` 建立 `.md` 檔案：

```yaml
---
title: "文章標題"
description: "SEO 描述"
author: "作者"
publishDate: 2026-04-09
heroImage: "/images/photo.jpg"
heroImageAlt: "圖片描述"
heroImageCredit: "Photo: 來源"
---

文章內文（Markdown）...
```

然後 `npm run build`。

## 專案結構

```
src/
├── content/articles/   # Markdown 文章
├── components/         # Astro 元件（Header, Footer, HeroImage...）
├── layouts/            # BaseLayout, ArticleLayout
├── pages/              # 首頁 + 文章動態路由
└── styles/             # Tailwind CSS
scripts/
└── generate-articles.mjs   # 批量生成腳本
data/
├── input/articles.json     # 批量輸入
└── reference/              # FIFA 2026 參考資料
```

## SEO

每個頁面自動產生：
- Meta tags + Open Graph + Twitter Card
- Schema.org `NewsArticle` JSON-LD
- Sitemap（`@astrojs/sitemap`）

## License

Content images sourced from [Wikimedia Commons](https://commons.wikimedia.org/) under CC BY-SA 4.0.
