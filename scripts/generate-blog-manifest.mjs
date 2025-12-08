import fs from 'node:fs/promises';
import path from 'path';
import { compile, run } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

async function extractMeta(filePath) {
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Compile MDX to JavaScript
    const compiled = await compile(fileContent, {
        outputFormat: 'function-body',
        development: false
    });

    // Run the compiled code to get exports
    const { meta } = await run(compiled, {
        ...runtime,
        baseUrl: import.meta.url
    });

    return meta;
}

async function generateBlogManifest() {
    const blogsDirectory = path.join(process.cwd(), 'blogs');
    const outputPath = path.join(process.cwd(), 'src', 'data', 'blog-manifest.ts');

    // Read all MDX files
    const files = await fs.readdir(blogsDirectory);
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));

    console.log(`Found ${mdxFiles.length} MDX files\n`);

    // Extract metadata from each MDX file
    const blogs = [];

    for (const file of mdxFiles) {
        const slug = file.replace(/\.mdx$/, '');
        const filePath = path.join(blogsDirectory, file);

        try {
            const data = await extractMeta(filePath);

            if (data && Object.keys(data).length > 0) {
                blogs.push({
                    slug,
                    ...data,
                });
                console.log(`✓ Loaded: ${slug}`);
            } else {
                console.warn(`⚠️  No frontmatter found in: ${file}`);
            }
        } catch (error) {
            console.error(`✗ Error loading ${slug}:`, error.message);
        }
    }

    // Sort by date (newest first)
    blogs.sort((a, b) => {
        const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split('.');
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        };
        return parseDate(b.date) - parseDate(a.date);
    });

    // Generate the TypeScript file content
    const fileContent = `// This file is auto-generated at build time
// Do not edit manually - run 'npm run generate-manifest' to regenerate

import { BlogMeta } from '@/types/blog';

export const blogManifest: BlogMeta[] = ${JSON.stringify(blogs, null, 4)};
`;

    // Write the file
    await fs.writeFile(outputPath, fileContent, 'utf-8');
    console.log(`\n✅ Generated blog manifest with ${blogs.length} posts`);
    console.log(`📝 Output: ${outputPath}`);
}

await generateBlogManifest();
