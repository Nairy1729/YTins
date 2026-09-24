import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Button } from '../components/primitives/Button';
import { Progress } from '../components/primitives/Progress';
import { StageTimeline } from '../components/generation/StageTimeline';
import { TrackCard } from '../components/generation/TrackCard';
import { LyricsBadge } from '../components/generation/LyricsBadge';
import { EmptyState, ErrorState } from '../components/states/States';
import { useReelJob } from '../lib/useReelJob';
import { fadeUp, stagger } from '../lib/motion';
import { SegmentBar } from '../components/generation/SegmentBar';

export function Generate() {
    const { jobId } = useParams<{ jobId: string }>();
    const { snapshot, loading, error } = useReelJob(jobId);

    if (!jobId) {
        return (
            <div className="mx-auto max-w-5xl px-6 sm:px-10">
                <EmptyState
                    title="Nothing to generate"
                    body="Start by choosing a song and a visual style."
                    action={<Button to="/create">Start a reel</Button>}
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-5xl px-6 sm:px-10">
                <ErrorState title="We could not load this reel" body={error} />
            </div>
        );
    }

    if (loading || !snapshot) {
        return (
            <div className="mx-auto max-w-5xl px-6 sm:px-10">
                <EmptyState title="Connecting" body="Picking up the generation stream." />
            </div>
        );
    }

    if (snapshot.state === 'failed') {
        return (
            <div className="mx-auto max-w-5xl px-6 sm:px-10">
                <ErrorState
                    title="We could not finish this reel"
                    body={snapshot.error?.userMessage ?? 'The pipeline stopped partway through.'}
                    onRetry={
                        snapshot.error?.recoverable ? () => window.location.assign('/create') : undefined
                    }
                />
            </div>
        );
    }

    const done = snapshot.state === 'completed';

    return (
        <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 sm:px-10 sm:pt-24">
            <motion.div initial="hidden" animate="show" variants={stagger(0.08)}>
                <motion.p
                    variants={fadeUp}
                    className="mb-8 font-mono text-eyebrow uppercase tracking-[0.28em] text-faint"
                >
                    {snapshot.jobId}
                </motion.p>

                <motion.h1 variants={fadeUp} className="font-display text-title text-ink">
                    {done ? 'Your reel is ready.' : 'Reverie is watching the song.'}
                </motion.h1>

                {snapshot.track && (
                    <div className="mt-10 max-w-md">
                        <TrackCard track={snapshot.track} />
                    </div>
                )}

                {snapshot.lyrics && (
                    <div className="mt-3 max-w-md">
                        <LyricsBadge lyrics={snapshot.lyrics} />
                    </div>
                )}


                {snapshot.timeline && (
                    <div className="mt-8 max-w-md">
                        <SegmentBar timeline={snapshot.timeline} />
                    </div>
                )}

                {snapshot.scenePlan && (
                    <motion.div variants={fadeUp} className="mt-6 max-w-md border border-line bg-surface/60 p-4">
                        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted mb-2.5">
                            <span>Visual Direction ({snapshot.scenePlan.styleId})</span>
                            <span className="text-brass">{snapshot.scenePlan.scenes.length} Scenes</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {snapshot.scenePlan.scenes.map((s) => (
                                <span
                                    key={s.id}
                                    className="border border-line/60 bg-surface px-2 py-0.5 font-mono text-[10px] text-faint"
                                    title={`Emotion: ${s.emotion} | Camera: ${s.camera.move}`}
                                >
                                    {s.id}: {s.emotion}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                <motion.p variants={fadeUp} className="mt-8 h-6 text-sm text-muted">
                    {snapshot.detail ?? snapshot.stageLabel}
                </motion.p>

                <motion.div variants={fadeUp} className="mt-4">
                    <Progress value={snapshot.progress} />
                </motion.div>

                <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_auto]">
                    <motion.div variants={fadeUp}>
                        <StageTimeline current={snapshot.state} />
                    </motion.div>

                    <motion.div variants={fadeUp} className="mx-auto w-full max-w-[260px]">
                        <div className="relative aspect-[9/16] w-full border border-line bg-surface">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
                                    {done ? '1080 x 1920' : 'Preview'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {done && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mt-16 flex flex-wrap items-center gap-6 border-t border-line pt-10"
                    >
                        <Button size="lg" disabled>
                            Export MP4
                        </Button>
                        <Button variant="outline" to="/create">
                            Create another
                        </Button>
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
                            Export arrives in Phase 13
                        </span>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}