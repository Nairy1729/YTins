import { motion } from 'framer-motion';
import type { TimelineSummary } from '@reverie/contracts';
import { EASE_OUT } from '../../lib/motion';

function clock(ms: number): string {
    const total = Math.round(ms / 1000);
    return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
}

export function SegmentBar({ timeline }: { timeline: TimelineSummary }) {
    const total = Math.max(1, timeline.totalDurationMs);
    const left = (timeline.segment.startMs / total) * 100;
    const width = Math.max(2, (timeline.segment.durationMs / total) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
        >
            <div className="mb-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                <span>{timeline.segment.reason}</span>
                <span>
                    {clock(timeline.segment.startMs)} - {clock(timeline.segment.endMs)}
                </span>
            </div>

            <div className="relative h-6 w-full border border-line bg-surface">
                <motion.div
                    className="absolute inset-y-0 bg-brass"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
                    style={{ left: left + '%', width: width + '%' }}
                />
            </div>

            <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                <span>0:00</span>
                <span>
                    {timeline.kind === 'instrumental'
                        ? 'Mood driven'
                        : timeline.segmentLineCount + ' lines in window'}
                </span>
                <span>{clock(timeline.totalDurationMs)}</span>
            </div>
        </motion.div>
    );
}