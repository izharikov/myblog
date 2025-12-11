import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAllBlogs } from '@/lib/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
    const allBlogs = getAllBlogs();
    return [
        {
            url: siteConfig.site,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: siteConfig.site + '/about',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: siteConfig.site + '/blogs',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5,
        },
        ... (allBlogs.map((blog) => ({
            url: siteConfig.site + '/blogs/' + blog.slug,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.5,
        }))),
    ]
}