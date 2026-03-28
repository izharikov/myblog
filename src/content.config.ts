// src/content.config.ts
// Astro 6 content collections config — must be at src/content.config.ts
// Import z from 'astro:content', NOT from 'zod' — Astro 6 bundles Zod 4 with breaking API changes
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './blogs',
    generateId: ({ entry }) => {
      // Strip numeric prefix from filename for fallback slug
      // "1-xp-precompilation.mdx" → "xp-precompilation"
      // Explicit slug field in YAML frontmatter takes priority
      return entry.replace(/^\d+-/, '').replace(/\.mdx$/, '');
    },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    logo: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    date: z.string(),
  }),
});

export const collections = { blog };
