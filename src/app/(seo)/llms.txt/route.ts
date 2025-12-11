import { siteConfig } from '@/config/site';
import { getAllBlogs } from '@/lib/blogs';

export async function GET(request: Request) {
    const allBlogs = getAllBlogs();
    const llmsTxt = `# ${siteConfig.name}

${siteConfig.description}

## Blogs
${allBlogs.map((blog) => `- [${blog.title}](${siteConfig.site}/blogs/${blog.slug}.md)`).join('\n')}

`;
    const headers = new Headers({ 'content-type': 'text/plain; charset=utf-8' })

    return new Response(llmsTxt, { headers })
}