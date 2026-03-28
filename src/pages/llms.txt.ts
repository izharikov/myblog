import { getCollection } from 'astro:content';
import { siteConfig } from '@/config/site';
import { getSlug } from '@/lib/blog';
import { parseDate } from '@/lib/date';

export const prerender = true;

export async function GET() {
  const posts = await getCollection('blog');
  const sorted = [...posts].sort((a, b) =>
    parseDate(b.data.date).getTime() - parseDate(a.data.date).getTime()
  );

  const body = `# ${siteConfig.name}

${siteConfig.description}

## Blogs
${sorted.map(p => `- [${p.data.title}](${siteConfig.site}/blogs/${getSlug(p)}.md)`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
