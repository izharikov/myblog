import Image from 'next/image';

export function Img({ src, alt, width, height }: { src: string; alt?: string; width?: number; height?: number }) {
    return (
        <span className="my-6 block">
            <Image
                src={src}
                alt={alt || ''}
                width={width || 600}
                height={height || 400}
                quality={100}
                className="max-w-full m-auto h-auto border-2"
            />
        </span>
    );
}
