import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import Link from 'next/link'
import { CodeBlock } from '@/components/code-block'
import { H2, H3, H4, H5, H6 } from '@/components/ui/heading-with-anchor';

const anchor = (text: string) => text.toString().toLowerCase().replace(/\s/g, '-');

const components: MDXComponents = {
    // Headings
    h1: ({ children }) => (
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6 mt-8">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <H2 anchor={anchor(children)}
            anchorVisibility="hover"
            className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4">
            {children}
        </H2>
    ),
    h3: ({ children }) => (
        <H3 anchor={anchor(children)}
            anchorVisibility="hover" className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">
            {children}
        </H3>
    ),
    h4: ({ children }) => (
        <H4 anchor={anchor(children)}
            anchorVisibility="hover" className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3">
            {children}
        </H4>
    ),
    h5: ({ children }) => (
        <H5 anchor={anchor(children)}
            anchorVisibility="hover" className="scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-3">
            {children}
        </H5>
    ),
    h6: ({ children }) => (
        <H6 anchor={anchor(children)}
            anchorVisibility="hover" className="scroll-m-20 text-base font-semibold tracking-tight mt-6 mb-3">
            {children}
        </H6>
    ),

    // Paragraph
    p: ({ children }) => (
        <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
            {children}
        </p>
    ),

    // Links
    a: ({ href, children }) => (
        <Link
            href={href as string}
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
            target="_blank"
        >
            {children}
        </Link>
    ),

    // Lists
    ul: ({ children }) => (
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground">
            {children}
        </ol>
    ),
    li: ({ children }) => (
        <li className="leading-7">
            {children}
        </li>
    ),

    // Blockquote
    blockquote: ({ children }) => (
        <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground">
            {children}
        </blockquote>
    ),

    // Code
    code: ({ children, className }) => {
        const isInline = !className
        if (isInline) {
            return (
                <code className="relative rounded bg-muted text-primary py-[0.2rem] font-mono text-sm font-semibold px-1">
                    {children}
                </code>
            )
        }
        return (
            <CodeBlock className={className}>
                {children as string}
            </CodeBlock>
        )
    },
    pre: ({ children }) => (
        <>{children}</>
    ),

    // Horizontal Rule
    hr: () => (
        <hr className="my-8 border-border" />
    ),

    // Table
    table: ({ children }) => (
        <div className="my-6 w-full overflow-y-auto">
            <table className="w-full border-collapse border border-border">
                {children}
            </table>
        </div>
    ),
    thead: ({ children }) => (
        <thead className="bg-muted">
            {children}
        </thead>
    ),
    tbody: ({ children }) => (
        <tbody>
            {children}
        </tbody>
    ),
    tr: ({ children }) => (
        <tr className="border-b border-border transition-colors hover:bg-muted/50">
            {children}
        </tr>
    ),
    th: ({ children }) => (
        <th className="border border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="border border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
            {children}
        </td>
    ),

    // Image
    img: ({ src, alt }) => (
        <span className="my-6 block">
            <Image
                src={src as string}
                alt={alt || ''}
                width={1000}
                height={500}
                sizes="100vw"
                quality={100}
                className="max-w-full w-full m-auto h-auto border-2"
            />
        </span>
    ),

    // Strong and Emphasis
    strong: ({ children }) => (
        <strong className="font-bold text-foreground">
            {children}
        </strong>
    ),
    em: ({ children }) => (
        <em className="italic">
            {children}
        </em>
    ),
}

export function useMDXComponents(): MDXComponents {
    return components
}
