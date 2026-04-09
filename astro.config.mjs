import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.CI ? 'https://w-ace.github.io' : 'http://localhost:4321',
  base: process.env.CI ? '/news-generator' : '/',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW'],
  },
});
