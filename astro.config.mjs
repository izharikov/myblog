// astro.config.mjs
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';
import fs from 'node:fs';

export default defineConfig({
  site: 'https://izharikov.dev',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
  integrations: [
    solidJs(),
    mdx({
      remarkPlugins: [remarkGfm],
    }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['solid-js', 'solid-js/web'],
    },
    server: {
      host: 'blog.local',
      https: {
        key: fs.readFileSync('.certs/key.pem'),
        cert: fs.readFileSync('.certs/cert.pem'),
      },
      hmr: {
        host: 'blog.local',
      },
    },
  },
});
