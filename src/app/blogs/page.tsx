import { BlogGrid } from "@/components/blog/BlogGrid";
import { getAllBlogs } from "@/lib/blogs";

export default async function BlogsPage() {
    const latestPosts = await getAllBlogs();
    return (
        <>
            <BlogGrid posts={latestPosts} title="Blogs" showLink={false} />
        </>
    );
}
