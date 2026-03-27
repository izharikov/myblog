/**
 * Stub replacement for the deleted next/image-based Img component.
 * Used by blog post 9 via MDX import. Phase 3 will replace with a proper MDX component.
 */
export function Img(props: { src: string; alt: string }) {
  return <img src={props.src} alt={props.alt} loading="lazy" />;
}
