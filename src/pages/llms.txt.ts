import { getCollection } from 'astro:content';
import { siteConfig } from '@/config/site';

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog');
  const sorted = [...posts].sort((a, b) =>
    b.data.date.localeCompare(a.data.date)
  );

  const body = `# ${siteConfig.name}

${siteConfig.description}

## Blogs
${sorted.map(p => `- [${p.data.title}](${siteConfig.site}/blogs/${p.id})`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
