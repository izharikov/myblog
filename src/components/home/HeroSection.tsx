import Link from 'next/link';
import { CertificationBadge } from './CertificationBadge';
import { Certification } from '@/types/certification';
import { siteConfig } from '@/config/site';

const CERTIFICATIONS: Certification[] = [
    { icon: "🟢", title: "Next.js Professional", href: "/about#certifications" },
    { icon: "☁️", title: "Cloudflare Developer", href: "/about#certifications" },
    { icon: "🔑", title: "AWS Certified Developer", href: "/about#certifications" },
];

export const HeroSection = () => (
    <section className="py-8 md:py-12 border-b">
        <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col justify-center space-y-3">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Hello, I'm <span className="text-primary">{siteConfig.name}</span>
                </h1>
                <p className="max-w-[700px] text-base text-muted-foreground">
                    {siteConfig.description}
                </p>

                {/* CONCISE CREDLY BADGES ROW */}
                <div className="pt-1 flex items-center space-x-3">
                    <span className="text-xs font-semibold text-muted-foreground">Key Certifications:</span>
                    {CERTIFICATIONS.map((cert) => (
                        <CertificationBadge key={cert.title} certification={cert} />
                    ))}
                    <Link href="/about#certifications" className="text-xs text-primary hover:underline">
                        View Full List
                    </Link>
                </div>
            </div>
        </div>
    </section>
);
