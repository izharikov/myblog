import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { BlogCard } from './BlogCard';
import { BlogPost } from '@/types/blog';

interface BlogGridProps {
    posts: BlogPost[];
}

export const BlogGrid = ({ posts }: BlogGridProps) => (
    <section className="py-16 md:py-24" id="blogs">
        <div className="container max-w-screen-xl mx-auto px-4 space-y-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
                📝 Latest Posts
            </h2>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                ))}
            </div>
            <div className="text-center pt-8">
                <Link href="/blogs">
                    <Button variant="outline" size="lg">See All Blog Posts &rarr;</Button>
                </Link>
            </div>
        </div>
    </section>
);
