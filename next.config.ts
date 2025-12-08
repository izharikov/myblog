import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

	// Image optimization configuration
	images: {
		formats: ['image/avif', 'image/webp'], // AVIF first (better compression), fallback to WebP
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller image sizes
		minimumCacheTTL: 60 * 60 * 24 * 365, // Cache for 1 year
		dangerouslyAllowSVG: true, // Allow SVG images if needed
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		qualities: [75],
	},
};


const withMDX = createMDX({
	options: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
	extension: /\.(md|mdx)$/,
})

export default withMDX(nextConfig)

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
