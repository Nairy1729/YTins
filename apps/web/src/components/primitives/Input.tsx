import type { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    hint?: string;
    error?: string;
}

export function Input({ label, hint, error, className, id, ...props }: Props) {
    const inputId = id ?? props.name;

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-4 block font-mono text-eyebrow uppercase tracking-[0.22em] text-faint"
                >
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn(
                    'w-full border-b bg-transparent pb-4 text-lg text-ink outline-none',
                    'placeholder:text-faint transition-colors duration-300',
                    error ? 'border-err' : 'border-line focus:border-brass',
                    className,
                )}
                {...props}
            />
            {(error ?? hint) && (
                <p
                    className={cn(
                        'mt-3 font-mono text-eyebrow tracking-wide',
                        error ? 'text-err' : 'text-faint',
                    )}
                >
                    {error ?? hint}
                </p>
            )}
        </div>
    );
}