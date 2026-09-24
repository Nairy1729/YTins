import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const BASE =
    'inline-flex items-center justify-center gap-3 font-mono uppercase tracking-[0.2em] ' +
    'transition-all duration-300 ease-out select-none disabled:opacity-40 disabled:pointer-events-none';

const VARIANTS: Record<Variant, string> = {
    primary: 'bg-brass text-void hover:bg-ink',
    outline: 'border border-line text-ink hover:border-brass hover:text-brass',
    ghost: 'text-muted hover:text-ink',
};

const SIZES: Record<Size, string> = {
    sm: 'h-9 px-4 text-[10px]',
    md: 'h-11 px-6 text-eyebrow',
    lg: 'h-14 px-10 text-eyebrow',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    to?: string;
}

export function Button({ variant = 'primary', size = 'md', to, className, ...props }: Props) {
    const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

    if (to) {
        return (
            <Link to={to} className={classes}>
                {props.children}
            </Link>
        );
    }

    return <button className={classes} {...props} />;
}