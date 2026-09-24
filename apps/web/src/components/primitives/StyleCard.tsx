import { cn } from '../../lib/cn';
import type { StyleOption } from '../../data/styles';

interface Props {
    option: StyleOption;
    selected: boolean;
    onSelect: (id: StyleOption['id']) => void;
}

export function StyleCard({ option, selected, onSelect }: Props) {
    const disabled = !option.available;

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.id)}
            className={cn(
                'group relative flex h-full flex-col border p-5 text-left transition-all duration-300',
                disabled && 'cursor-not-allowed border-line opacity-35',
                !disabled && selected && 'border-brass bg-surface',
                !disabled && !selected && 'border-line hover:border-line-strong hover:bg-surface',
            )}
        >
            <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
                {option.glyph.map((d, i) => (
                    <path
                        key={i}
                        d={d}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        className={cn(
                            'transition-colors duration-300',
                            selected ? 'stroke-brass' : 'stroke-muted group-hover:stroke-ink',
                        )}
                    />
                ))}
            </svg>

            <h3 className="mt-6 font-display text-xl text-ink">{option.displayName}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">{option.description}</p>

            {disabled && (
                <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
                    Soon
                </span>
            )}
            {selected && (
                <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-brass">
                    Selected
                </span>
            )}
        </button>
    );
}