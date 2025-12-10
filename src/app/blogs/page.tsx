import { BlogGrid } from "@/components/blog/BlogGrid";
import { getAllBlogs } from "@/lib/blogs";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Blogs',
    description: siteConfig.description,
}

export default function BlogsPage() {
    const latestPosts = getAllBlogs();
    return (
        <>
            <BlogGrid posts={latestPosts} title="Blogs" showLink={false} />
        </>
    );
}
