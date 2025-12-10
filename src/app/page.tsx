import { Separator } from "@/components/ui/separator";
import { HeroSection } from "@/components/home/HeroSection";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { getLatestBlogs } from "@/lib/blogs";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
}

export default function HomePage() {
	const latestPosts = getLatestBlogs(3);
	return (
		<>
			<HeroSection />
			<Separator className="my-0" />
			<BlogGrid posts={latestPosts} title="📝 Latest Posts" />
		</>
	);
}
