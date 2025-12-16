"use client"


import { useTheme } from "next-themes"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { ghcolors, vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useEffect, useState } from "react"

import { CopyButton } from "@/components/ui/shadcn-io/copy-button"

interface CodeBlockProps {
    language?: string
    children: string
    className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
    const { theme, systemTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <pre className="bg-muted text-primary mb-4 mt-6 overflow-x-auto rounded-lg border p-4">
                <code className={className}>{children}</code>
            </pre>
        )
    }

    const currentTheme = theme === "system" ? systemTheme : theme
    const style = currentTheme === "dark" ? vscDarkPlus : ghcolors

    // Extract language from className (e.g., "language-typescript")
    const match = /language-(\w+)/.exec(className || "")
    const language = match ? match[1] : undefined
    const content = String(children).replace(/\n$/, "")

    return (
        <div className="relative mb-4 mt-6 rounded-lg overflow-hidden border group">
            <div className="absolute right-4 top-4 transition-opacity z-10">
                <CopyButton
                    content={content}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 bg-background/50 hover:bg-background backdrop-blur-sm"
                    aria-label="Copy code"
                />
            </div>
            <SyntaxHighlighter
                language={language}
                style={style}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    padding: "1rem",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    border: "none",
                }}
                codeTagProps={{
                    style: {
                        fontSize: "inherit",
                        fontFamily: "var(--font-geist-mono)",
                    }
                }}
            >
                {content}
            </SyntaxHighlighter>
        </div>
    )
}
