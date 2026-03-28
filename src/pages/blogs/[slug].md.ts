import { getCollection } from 'astro:content';
import { getSlug } from '@/lib/blog';

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: getSlug(post) },
    props: { body: post.body ?? '' },
  }));
}

export async function GET({ props }: { props: { body: string } }) {
  return new Response(props.body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
