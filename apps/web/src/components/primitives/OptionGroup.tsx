import { cn } from '../../lib/cn';

export interface Option {
    value: string;
    label: string;
}

interface Props {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}

export function OptionGroup({ label, options, value, onChange }: Props) {
    return (
        <div>
            <span className="mb-4 block font-mono text-eyebrow uppercase tracking-[0.22em] text-faint">
                {label}
            </span>
            <div className="flex flex-wrap gap-px border border-line bg-line">
                {options.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'flex-1 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300',
                            value === option.value
                                ? 'bg-brass text-void'
                                : 'bg-void text-muted hover:bg-surface hover:text-ink',
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}