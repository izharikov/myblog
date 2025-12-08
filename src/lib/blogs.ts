import { BlogMeta, BlogPost } from '@/types/blog';
import { blogManifest } from '@/data/blog-manifest';

function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Transform blog post for display in BlogCard
 */
function formatBlogForDisplay(blog: BlogMeta): BlogPost {
    const date = parseDate(blog.date);
    return {
        ...blog,
        date: date,
        dateDisplay: formatDate(date),
    };
}

/**
 * Get all blog posts from the static manifest
 * This is build-time safe and works in Cloudflare Pages
 */
export function getAllBlogs(): BlogPost[] {
    return blogManifest
        .map(formatBlogForDisplay)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Get the latest N blog posts
 */
export function getLatestBlogs(count: number = 3): BlogPost[] {
    const allBlogs = getAllBlogs();
    return allBlogs.slice(0, count);
}

/**
 * Get all blog slugs for static generation
 */
export function getAllBlogSlugs(): string[] {
    return blogManifest.map(blog => blog.slug);
}
