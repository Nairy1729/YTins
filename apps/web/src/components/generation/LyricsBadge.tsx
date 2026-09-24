import { motion } from 'framer-motion';
import type { LyricsSummary } from '@reverie/contracts';
import { StatusDot } from '../primitives/StatusDot';
import type { Tone } from '../primitives/StatusDot';
import { EASE_OUT } from '../../lib/motion';

export function LyricsBadge({ lyrics }: { lyrics: LyricsSummary }) {
    const instrumental = lyrics.lineCount === 0;

    let tone: Tone = 'active';
    let label = lyrics.lineCount + ' lines, no timing';

    if (instrumental) {
        tone = 'warn';
        label = 'Instrumental treatment';
    } else if (lyrics.synced) {
        tone = 'ok';
        label = lyrics.lineCount + ' lines, timed';
    }

    const matched =
        lyrics.matchedTitle && lyrics.matchedArtist
            ? lyrics.matchedArtist + ' / ' + lyrics.matchedTitle
            : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="flex items-center gap-4 border border-line px-4 py-3"
        >
            <StatusDot tone={tone} />
            <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">{label}</p>
                {matched && (
                    <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                        {matched}
                    </p>
                )}
            </div>
        </motion.div>
    );
}