import { BlogMeta, BlogPost } from '@/types/blog';
import fs from 'fs';
import path from 'path';

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
 * Get all blog posts by reading MDX files from the blogs directory
 * This function reads the filesystem and imports each MDX file to extract metadata
 */
export async function getAllBlogs(): Promise<BlogPost[]> {
    const blogsDirectory = path.join(process.cwd(), 'blogs');

    // Read all files in the blogs directory
    const files = fs.readdirSync(blogsDirectory);

    // Filter for .mdx files only
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    // Import each MDX file and extract metadata
    const blogs = await Promise.all(
        mdxFiles.map(async (file) => {
            const slug = file.replace(/\.mdx$/, '');

            try {
                // Dynamically import the MDX file
                const { meta } = await import(`@/blogs/${slug}.mdx`);

                return formatBlogForDisplay({
                    ...meta,
                    slug,
                } as BlogMeta);
            } catch (error) {
                console.error(`Error loading blog ${slug}:`, error);
                return null;
            }
        })
    );

    // Filter out any failed imports and sort by date (newest first)
    return blogs
        .filter((blog): blog is BlogPost => blog !== null)
        .sort((a, b) => {
            return b.date.getTime() - a.date.getTime();
        });
}

/**
 * Get the latest N blog posts
 */
export async function getLatestBlogs(count: number = 3): Promise<BlogPost[]> {
    const allBlogs = await getAllBlogs();
    return allBlogs.slice(0, count);
}

/**
 * Get all blog slugs for static generation
 */
export async function getAllBlogSlugs(): Promise<string[]> {
    const allBlogs = await getAllBlogs();
    return allBlogs.map(blog => blog.slug);
}
