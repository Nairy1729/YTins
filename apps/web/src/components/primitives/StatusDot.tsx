import { cn } from '../../lib/cn';

export type Tone = 'idle' | 'active' | 'ok' | 'warn' | 'error';

const TONES: Record<Tone, string> = {
    idle: 'bg-faint',
    active: 'bg-brass',
    ok: 'bg-ok',
    warn: 'bg-warn',
    error: 'bg-err',
};

export function StatusDot({ tone = 'idle', pulse = false }: { tone?: Tone; pulse?: boolean }) {
    return (
        <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
            {pulse && (
                <span className={cn('absolute inline-flex h-full w-full animate-ping', TONES[tone])} />
            )}
            <span className={cn('relative inline-flex h-1.5 w-1.5', TONES[tone])} />
        </span>
    );
}