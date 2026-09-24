import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface Props {
    children: ReactNode;
    className?: string;
    muted?: boolean;
}

export function Panel({ children, className, muted = false }: Props) {
    return (
        <div className={cn('border border-line p-6 sm:p-8', muted ? 'bg-surface' : '', className)}>
            {children}
        </div>
    );
}