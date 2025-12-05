export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const { default: Post, meta } = await import(`@/blogs/${slug}.mdx`);
  console.log('meta', meta);

  return <div className="container max-w-screen-xl mx-auto p-4">
    <Post />
  </div>
}

export function generateStaticParams() {
  return [{ slug: 'example' }]
}

export const dynamicParams = false

