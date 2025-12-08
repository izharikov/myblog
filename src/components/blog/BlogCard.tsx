import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
    post: BlogPost;
}

export const BlogCard = ({ post }: BlogCardProps) => (
    <Link href={`/blogs/${post.slug}`}>
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-video w-full bg-secondary flex items-center justify-center overflow-hidden">
                <Image
                    src={post.logo}
                    alt={post.title}
                    width={600}
                    height={338}
                    className="object-cover w-full h-full"
                />
            </div>
            <CardContent className="p-6 space-y-3">
                <h3 className="text-xl font-bold line-clamp-2">
                    <span className="hover:text-primary transition-colors">
                        {post.title}
                    </span>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.description}
                </p>
                <div className="flex flex-col justify-between text-xs text-muted-foreground pt-2 gap-4">
                    <span>Published: {post.dateDisplay}</span>
                    <div className="flex gap-2">
                        {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
);
