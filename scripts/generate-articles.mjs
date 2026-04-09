#!/usr/bin/env node

/**
 * Batch article generator.
 * Reads data/input/articles.json and generates Markdown files
 * in src/content/articles/ with proper frontmatter.
 *
 * Supports automatic image downloading from heroImageUrl.
 *
 * Usage: node scripts/generate-articles.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT_FILE = join(ROOT, 'data/input/articles.json');
const OUTPUT_DIR = join(ROOT, 'src/content/articles');
const IMAGES_DIR = join(ROOT, 'public/images');

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function downloadImage(url, slug) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  Failed to download image (${res.status}): ${url}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    let ext = '.jpg';
    if (contentType.includes('png')) ext = '.png';
    else if (contentType.includes('webp')) ext = '.webp';
    else if (contentType.includes('svg')) ext = '.svg';

    // Also check URL extension
    const urlExt = extname(new URL(url).pathname).toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(urlExt)) {
      ext = urlExt === '.jpeg' ? '.jpg' : urlExt;
    }

    const filename = `${slug}${ext}`;
    const filepath = join(IMAGES_DIR, filename);

    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(filepath, buffer);

    console.log(`  Downloaded: ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`);
    return `/images/${filename}`;
  } catch (err) {
    console.warn(`  Failed to download image: ${err.message}`);
    return null;
  }
}

function toFrontmatter(data) {
  const lines = [];
  const add = (key, val) => {
    if (val != null) lines.push(`${key}: "${String(val).replace(/"/g, '\\"')}"`);
  };

  add('title', data.title);
  add('description', data.description || data.title);
  add('author', data.author || '編輯部');
  add('publishDate', data.publishDate || new Date().toISOString().split('T')[0]);
  add('heroImage', data.heroImage);
  add('heroImageAlt', data.heroImageAlt);
  add('heroImageCredit', data.heroImageCredit);

  return `---\n${lines.join('\n')}\n---`;
}

async function main() {
  if (!existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    console.error('Create data/input/articles.json with an array of articles.');
    process.exit(1);
  }

  const raw = readFileSync(INPUT_FILE, 'utf-8');
  const articles = JSON.parse(raw);

  if (!Array.isArray(articles)) {
    console.error('articles.json must contain a JSON array.');
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(IMAGES_DIR, { recursive: true });

  let created = 0;
  let skipped = 0;

  for (const article of articles) {
    if (!article.title || !article.body) {
      console.warn(`Skipping article without title or body: ${JSON.stringify(article).slice(0, 80)}`);
      skipped++;
      continue;
    }

    const slug = article.slug || toSlug(article.title);
    const filepath = join(OUTPUT_DIR, `${slug}.md`);

    if (existsSync(filepath)) {
      console.warn(`Skipping existing file: ${slug}.md`);
      skipped++;
      continue;
    }

    console.log(`Processing: ${article.title}`);

    // Download image if heroImageUrl is provided
    if (article.heroImageUrl && !article.heroImage) {
      const localPath = await downloadImage(article.heroImageUrl, slug);
      if (localPath) {
        article.heroImage = localPath;
        if (!article.heroImageAlt) {
          article.heroImageAlt = article.title;
        }
      }
    }

    const content = `${toFrontmatter(article)}\n\n${article.body.trim()}\n`;
    writeFileSync(filepath, content, 'utf-8');
    console.log(`  Created: ${slug}.md`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
}

main();
