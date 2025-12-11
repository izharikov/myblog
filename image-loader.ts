import { imgUrl } from "@/lib/img";
import type { ImageLoaderProps } from "next/image";

export default function cloudflareLoader({
    src,
    width,
    quality,
}: ImageLoaderProps) {
    return imgUrl({ src, width, quality });
}
