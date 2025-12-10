import { BlogPost } from "@/types/blog";
import Image from "next/image";
import { getAllBlogs } from "@/lib/blogs";
import { blogSlugToPath } from "@/data/blog-manifest";
import Head from 'next/head';

async function getBlogPost(slug: string) {
  return await import(`@/blogs/${blogSlugToPath[slug]}.mdx`);
}

async function getBlogMeta(slug: string): Promise<BlogPost> {
  const allBlogs = getAllBlogs();
  const blog = allBlogs.find(b => b.slug === slug);
  if (!blog) {
    throw new Error(`Blog post not found: ${slug}`);
  }
  return blog;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const meta = await getBlogMeta(slug);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      publishedTime: meta.dateDisplay,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const { default: Post } = await getBlogPost(slug);
  const meta = await getBlogMeta(slug);

  return <div className="container max-w-screen-xl mx-auto p-4">
    <Head>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.tags.join(", ")} />
      <meta name="og:image" content={meta.logo} />
    </Head>
    <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6 mt-8">{meta.title}</h1>
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <time className="text-sm text-gray-600 dark:text-gray-400">
        {meta.dateDisplay}
      </time>
      <div className="flex gap-2">
        {meta.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-3 py-1 text-xs font-medium text-blue-800 dark:text-blue-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
    <div className="flex justify-center">
      <Image
        src={meta.logo}
        alt={meta.title}
        width={600}
        height={600}
        priority
        quality={75}
      />
    </div>
    <Post />
  </div>
}

export function generateStaticParams() {
  return Object.keys(blogSlugToPath).map((slug) => ({ slug }));
}

export const dynamicParams = false

