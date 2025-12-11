const normalizeSrc = (src: string) => {
    return src.startsWith("/") ? src.slice(1) : src;
};

const cloudflareUrl = ({
    src,
    width,
    quality,
}: {
    src: string;
    width: number;
    quality?: number;
}) => {
    const params = [`width=${width}`];
    if (quality) {
        params.push(`quality=${quality}`);
    }
    params.push(`format=auto`);

    // Use Cloudflare Images transformation in production
    return `/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}

export const imgUrl = ({
    src,
    width,
    quality,
}: {
    src: string;
    width: number;
    quality?: number;
}) => {
    if (process.env.NODE_ENV === "development") {
        return '/_next/image?url=' + encodeURIComponent(src) + '&w=' + width + '&q=' + quality;
    }
    return cloudflareUrl({ src, width, quality });
}