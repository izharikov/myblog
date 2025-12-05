import { BlogPost } from '@/types/blog';

export const LATEST_BLOG_POSTS: BlogPost[] = [
    {
        slug: 'optimizing-mdx',
        title: 'Optimizing MDX for Next.js with Server Components',
        preview: 'Discover advanced techniques for parsing and rendering complex MDX content efficiently within the latest Next.js App Router setup.',
        date: 'Dec 4, 2025',
        category: 'Next.js',
        imageAlt: 'Laptop screen showing code',
        imageUrl: '/images/blog-1-thumb.jpg'
    },
    {
        slug: 'cloudflare-build-deep-dive',
        title: "A Deep Dive into Cloudflare Pages' Build Process",
        preview: 'Understanding the limitations and opportunities when hosting static Next.js sites and utilizing Cloudflare Functions.',
        date: 'Nov 28, 2025',
        category: 'Cloudflare',
        imageAlt: 'Cloud computing icons',
        imageUrl: '/images/blog-2-thumb.jpg'
    },
    {
        slug: 'typescript-with-shadcn',
        title: 'Using shadcn/ui with TypeScript Safely',
        preview: 'Best practices for extending, modifying, and integrating shadcn components while maintaining strong TypeScript typing.',
        date: 'Nov 15, 2025',
        category: 'UI/UX',
        imageAlt: 'TypeScript logo overlay',
        imageUrl: '/images/blog-3-thumb.jpg'
    },
];
