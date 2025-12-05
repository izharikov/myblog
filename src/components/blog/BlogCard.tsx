import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
    post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <Link href={`/blogs/${post.slug}`}>
            {/* Mock Image using a div with an aspect ratio */}
            <div className="aspect-video w-full bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground">{post.imageAlt || 'Image Placeholder'}</span>
            </div>
        </Link>
        <CardContent className="p-6 space-y-3">
            <h3 className="text-xl font-bold line-clamp-2">
                <Link href={`/blogs/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                </Link>
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
                {post.preview}
            </p>
            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                <span>Published: {post.date}</span>
                <Badge variant="secondary">{post.category}</Badge>
            </div>
        </CardContent>
    </Card>
);
