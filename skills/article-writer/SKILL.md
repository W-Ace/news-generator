---
name: article-writer
description: Generate FIFA 2026 World Cup news articles in Traditional Chinese, formatted as Astro content collection Markdown files with proper frontmatter.
---

## 使用時機

當使用者要求撰寫世界盃相關新聞文章時使用此 skill。可處理以下情境：
- 提供文案內容，需要轉換為新聞網頁格式
- 提供主題關鍵字，需要從頭撰寫新聞
- 沒有任何文案，需要自行構思故事

## 輸出格式

產出 Markdown 檔案，放置於 `src/content/articles/` 目錄。

```yaml
---
title: "文章標題——副標題"
description: "SEO 描述，最多 160 字元，簡潔概括文章重點"
author: "體育組記者"
publishDate: 2026-MM-DD
heroImage: "/images/xxx.svg"
heroImageAlt: "圖片描述"
heroImageCredit: "Photo: 來源"
---
```

## 寫作風格指南

### 語氣與文體
- **報導者風格**用於專題/分析：敘事感強、段落完整、善用場景描寫
- **中央社風格**用於速報/即時新聞：簡潔直接、倒金字塔結構
- 第三人稱客觀敘述，避免主觀評論
- 不使用「筆者認為」「我們」等第一人稱

### 文章結構
1. **導言**（第一段）：回答 Who/What/When/Where/Why，不加小標
2. **主體段落**：每個重點用 `## 小標題` 分隔，小標簡潔有力
3. **引述**：用 `> ` blockquote 格式，標注說話者
4. **結語**：展望或總結觀點

### 文章長度
- 速報/即時新聞：400-600 字
- 賽事報導/賽評：800-1200 字
- 專題報導/分析：1500-2500 字
- 賽前預覽：600-1000 字

### 台灣足球術語
| 使用 | 不使用 |
|------|--------|
| 世界盃 | 世界杯 |
| 足球 | 蹴球 |
| 進球 | 入球/入波 |
| 球門 | 龍門 |
| 罰球 | 罰球/自由球 |
| 角球 | 角球 |
| 越位 | 越位 |
| 紅牌/黃牌 | 紅牌/黃牌 |
| 教練 | 領隊 |
| 前鋒/中場/後衛/門將 | 前鋒/中場/後衛/門將 |

### 球員名稱
- 首次出現：中文譯名（英文原名），如「梅西（Lionel Messi）」
- 後續引用：僅用中文譯名
- 譯名以台灣慣用為準

### 批量生成
若需批量產生文章，輸出 JSON 格式至 `data/input/articles.json`：
```json
[
  {
    "title": "標題",
    "description": "SEO 描述",
    "author": "作者",
    "body": "Markdown 格式文章內文",
    "heroImage": "/images/xxx.svg",
    "heroImageCredit": "來源"
  }
]
```
然後執行 `npm run generate:build`。

### 圖片來源

每篇文章都必須附上圖片。在 JSON 中提供 `heroImageUrl` 欄位，generate script 會自動下載。

**搜尋策略：**
1. 有提到球星 → 在 Wikimedia Commons 搜尋球星名（如 `Lionel Messi`），取 CC BY-SA 授權照片
2. 有提到球隊 → 搜尋球隊名（如 `Japan national football team`）
3. 有提到場地 → 搜尋場地名（如 `MetLife Stadium`）
4. 以上都沒有 → 搜尋 `football match` 或 `FIFA World Cup`

**URL 格式（Wikimedia Commons）：**
`https://upload.wikimedia.org/wikipedia/commons/HASH/FILENAME`

可透過 API 查詢：
`https://commons.wikimedia.org/w/api.php?action=query&titles=File:FILENAME&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`

**必須**在 `heroImageCredit` 填寫 `"Photo: Wikimedia Commons / CC BY-SA 4.0"`

## 參考資料

詳細的 2026 世界盃資訊請參考 `data/reference/fifa-2026-info.md`。
