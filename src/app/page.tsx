import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/home/HeroSection";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getLatestBlogs } from "@/lib/blogs";

export default async function HomePage() {
	const latestPosts = await getLatestBlogs(3);
	return (
		<>
			<HeroSection />
			<Separator className="my-0" />
			<BlogGrid posts={latestPosts} title="📝 Latest Posts" />
		</>
	);
}
