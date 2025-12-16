import { BlogPost } from '@/types/blog';
import { siteConfig } from '@/config/site';
import { BlogPosting, Person, WithContext } from 'schema-dts';

export function personJsonLd(): WithContext<Person> {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: siteConfig.author.name,
        email: siteConfig.author.email,
        url: siteConfig.site,
        image: `${siteConfig.site}/myphoto.jpg`,
        sameAs: [siteConfig.site, siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.twitter],
    };
}

export function generateBlogJsonLd(post: BlogPost): WithContext<BlogPosting> {
    const person = personJsonLd();
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: `${siteConfig.site}${post.logo}`,
        datePublished: post.date.toISOString(),
        author: person,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteConfig.site}/blogs/${post.slug}`,
        },
    };
}
