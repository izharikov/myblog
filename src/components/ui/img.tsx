/** @jsxImportSource solid-js */

/**
 * Explicit image component for MDX posts that need non-full-width images.
 * Used by blog post 9 via `import { Img } from '@/components/ui/img'`.
 * Markdown ![alt](src) images go through src/components/mdx/Img.astro instead.
 */
export function Img(props: { src: string; alt: string }) {
  return <img src={props.src} alt={props.alt} loading="lazy" class="max-w-full h-auto m-auto border-2 my-6" />;
}
