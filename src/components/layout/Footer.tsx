import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { GitHub, Linkedin, XCom } from '../icons';

export const Footer = () => (
    <footer className="border-t py-8 w-full">
        <div className="container max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} {siteConfig.author.name}
            </p>
            <div className="flex items-center space-x-6">
                <Link href={siteConfig.social.github} target='_blank' className="text-muted-foreground hover:text-primary transition-colors">
                    <GitHub />
                </Link>
                <Link href={siteConfig.social.linkedin} target='_blank' className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin />
                </Link>
                <Link href={siteConfig.social.twitter} target='_blank' className="text-muted-foreground hover:text-primary transition-colors">
                    <XCom />
                </Link>
            </div>
        </div>
    </footer>
);
