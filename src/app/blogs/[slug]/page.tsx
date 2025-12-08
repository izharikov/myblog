import { BlogPost } from "@/types/blog";
import Image from "next/image";

async function getBlogPost(slug: string) {
  return await import(`@/blogs/${slug}.mdx`);
}

function formatDate(dateString: string): string {
  // Parse dd.MM.yyyy format
  const [day, month, year] = dateString.split('.');
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

  // Format to "Month DD, YYYY"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const { meta }: { meta: BlogPost } = await getBlogPost(slug);

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      publishedTime: meta.date,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const { default: Post, meta }: { default: any; meta: BlogPost } = await getBlogPost(slug);

  return <div className="container max-w-screen-xl mx-auto p-4">
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
      <Image src={meta.logo} alt={meta.title} width={600} height={600} />
    </div>
    <Post />
  </div>
}

export async function generateStaticParams() {
  const { getAllBlogSlugs } = await import('@/lib/blogs');
  const slugs = await getAllBlogSlugs();
  return slugs.map(slug => ({ slug }));
}

export const dynamicParams = false

