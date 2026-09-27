import type { BlogPost } from '@/types/blog';
import { siteConfig } from '@/config/site';
import type { BlogPosting, Person, WithContext } from 'schema-dts';
import badges from '@/data/credly.json';

export function personJsonLd({ includeCredentials = false } = {}): WithContext<Person> {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: siteConfig.author.name,
        email: siteConfig.author.email,
        url: siteConfig.site,
        image: `${siteConfig.site}/profile.jpg`,
        sameAs: [siteConfig.site, siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.twitter],
        ...(includeCredentials && {
            hasCredential: badges.map(badge => ({
                '@type': 'EducationalOccupationalCredential' as const,
                name: badge.name,
                url: badge.url,
                dateCreated: badge.issuedAt,
                recognizedBy: { '@type': 'Organization' as const, name: badge.issuer },
            })),
        }),
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
