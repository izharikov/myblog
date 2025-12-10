import type { ImageLoaderProps } from "next/image";

const normalizeSrc = (src: string) => {
    return src.startsWith("/") ? src.slice(1) : src;
};

export default function cloudflareLoader({
    src,
    width,
    quality,
}: ImageLoaderProps) {
    const params = [`width=${width}`];
    if (quality) {
        params.push(`quality=${quality}`);
    }
    params.push(`format=auto`);

    // Use Cloudflare Images transformation in production
    return `/cdn-cgi/image/${params.join(",")}/${normalizeSrc(src)}`;
}
