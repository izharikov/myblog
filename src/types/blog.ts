export type BlogPost = {
    slug: string;
    title: string;
    description: string;
    date: Date;
    dateDisplay: string;
    logo: string;
    tags: string[];
}

export type BlogMeta = Omit<BlogPost, 'dateDisplay' | 'date'> & {
    date: string;
};
