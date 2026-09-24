import { motion } from 'framer-motion';
import { JOB_STAGE_LABELS } from '@reverie/contracts';
import type { JobState } from '@reverie/contracts';
import { cn } from '../../lib/cn';
import { StatusDot } from '../primitives/StatusDot';
import { EASE_OUT } from '../../lib/motion';

export const PIPELINE: JobState[] = [
    'queued',
    'processing_song',
    'processing_lyrics',
    'analyzing',
    'generating_visuals',
    'rendering',
];

export function StageTimeline({ current }: { current: JobState }) {
    const activeIndex = PIPELINE.indexOf(current);
    const resolvedIndex = activeIndex === -1 ? PIPELINE.length : activeIndex;

    return (
        <ol className="border-t border-line">
            {PIPELINE.map((stage, index) => {
                const done = index < resolvedIndex;
                const active = index === resolvedIndex;

                return (
                    <motion.li
                        key={stage}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05, ease: EASE_OUT }}
                        className="flex items-center gap-5 border-b border-line py-4"
                    >
                        <StatusDot tone={done ? 'ok' : active ? 'active' : 'idle'} pulse={active} />
                        <span
                            className={cn(
                                'font-mono text-eyebrow uppercase tracking-[0.2em] transition-colors duration-500',
                                done && 'text-muted',
                                active && 'text-ink',
                                !done && !active && 'text-faint',
                            )}
                        >
                            {JOB_STAGE_LABELS[stage]}
                        </span>
                    </motion.li>
                );
            })}
        </ol>
    );
}