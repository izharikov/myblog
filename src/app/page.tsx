import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/home/HeroSection";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { LATEST_BLOG_POSTS } from "@/data/mock-blog-posts";

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<Separator className="my-0" />
			<BlogGrid posts={LATEST_BLOG_POSTS} />
		</>
	);
}
