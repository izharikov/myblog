import { getCollection } from 'astro:content';
import { getSlug } from '@/lib/blog';

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: getSlug(post) },
    props: { title: post.data.title, body: post.body ?? '' },
  }));
}

export async function GET({ props }: { props: { title: string; body: string } }) {
  return new Response(`# ${props.title}\n\n${props.body.trimStart()}`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
