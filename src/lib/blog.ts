import type { CollectionEntry } from 'astro:content';

/** Canonical slug for a blog post — prefers explicit frontmatter slug over filename-derived id. */
export function getSlug(post: CollectionEntry<'blog'>): string {
  return post.data.slug || post.id;
}
