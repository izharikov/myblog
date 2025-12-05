import Link from 'next/link';
import { Certification } from '@/types/certification';

interface CertificationBadgeProps {
    certification: Certification;
}

export const CertificationBadge = ({ certification }: CertificationBadgeProps) => (
    <Link href={certification.href} title={certification.title}>
        <div className="h-6 w-6 rounded-full flex items-center justify-center border-2 border-primary/50 text-xs bg-primary/10 transition-colors hover:bg-primary/20">
            {certification.icon}
        </div>
    </Link>
);
