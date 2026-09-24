import { motion } from 'framer-motion';
import type { Track } from '@reverie/contracts';
import { EASE_OUT } from '../../lib/motion';

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + String(secs).padStart(2, '0');
}

export function TrackCard({ track }: { track: Track }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="flex items-center gap-5 border border-line bg-surface p-4"
        >
            {track.thumbnailUrl && (
                <img
                    src={track.thumbnailUrl}
                    alt=""
                    className="h-14 w-24 shrink-0 object-cover"
                    loading="lazy"
                />
            )}
            <div className="min-w-0">
                <p className="truncate text-sm text-ink">{track.title}</p>
                <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                    {track.artist ?? 'Unknown artist'} / {formatDuration(track.durationSeconds)}
                </p>
            </div>
        </motion.div>
    );
}