// astro.config.mjs
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: 'https://izharikov.dev',
  output: 'static',
  integrations: [
    solidJs(),
    mdx({
      remarkPlugins: [remarkGfm],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
