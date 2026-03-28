import type { ImageMetadata } from 'astro';

const allImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/images/**/*.{jpeg,jpg,png,gif,webp,svg}'
);

/**
 * Resolve a public-style image path (e.g. "/images/2025/ch/logo.png")
 * to an ImageMetadata import for use with Astro <Image>.
 * Returns undefined if not found (caller can fall back to <img>).
 */
export function resolveImage(path: string): (() => Promise<{ default: ImageMetadata }>) | undefined {
  // "/images/2025/ch/logo.png" → "/src/images/2025/ch/logo.png"
  const key = `/src/images${path.startsWith('/images') ? path.slice('/images'.length) : path}`;
  return allImages[key];
}
