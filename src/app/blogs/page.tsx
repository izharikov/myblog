import { BlogGrid } from "@/components/blog/BlogGrid";
import { getAllBlogs } from "@/lib/blogs";

export default function BlogsPage() {
    const latestPosts = getAllBlogs();
    return (
        <>
            <BlogGrid posts={latestPosts} title="Blogs" showLink={false} />
        </>
    );
}
