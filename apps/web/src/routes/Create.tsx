import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { extractYouTubeVideoId } from '@reverie/contracts';
import type { AnimationIntensity, LyricTreatment, StyleId } from '@reverie/contracts';
import { Button } from '../components/primitives/Button';
import { Input } from '../components/primitives/Input';
import { OptionGroup } from '../components/primitives/OptionGroup';
import { StyleCard } from '../components/primitives/StyleCard';
import { STYLE_OPTIONS } from '../data/styles';
import { api, ApiRequestError } from '../lib/api';
import { fadeUp, stagger, pageTransition } from '../lib/motion';


const TREATMENTS = [
    { value: 'minimal', label: 'Minimal' },
    { value: 'handwritten_reveal', label: 'Handwritten' },
    { value: 'kinetic', label: 'Kinetic' },
    { value: 'none', label: 'None' },
];

const INTENSITY = [
    { value: 'subtle', label: 'Subtle' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'expressive', label: 'Expressive' },
];

export function Create() {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2>(1);
    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [styleId, setStyleId] = useState<StyleId>('pen-ink');
    const [treatment, setTreatment] = useState('handwritten_reveal');
    const [intensity, setIntensity] = useState('balanced');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const videoId = extractYouTubeVideoId(url);

    const submitUrl = (event: FormEvent) => {
        event.preventDefault();
        if (!videoId) {
            setError('We could not read a YouTube link from that. Videos, Shorts and Music links all work.');
            return;
        }
        setError(undefined);
        setStep(2);
    };

    const generate = async () => {
        setSubmitting(true);
        setSubmitError(null);
        try {
            const job = await api.createReel({
                url: url.trim(),
                styleId,
                lyricTreatment: treatment as LyricTreatment,
                animationIntensity: intensity as AnimationIntensity,
            });
            navigate('/generate/' + job.jobId);
        } catch (err) {
            setSubmitError(
                err instanceof ApiRequestError ? err.message : 'We could not start this reel.',
            );
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.section key="step1" {...pageTransition}>
                        <motion.div
                            initial="hidden"
                            animate="show"
                            variants={stagger(0.1, 0.05)}
                            className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-2xl flex-col justify-center"
                        >
                            <motion.p
                                variants={fadeUp}
                                className="mb-8 font-mono text-eyebrow uppercase tracking-[0.28em] text-faint"
                            >
                                Step 01 / 02
                            </motion.p>
                            <motion.h1 variants={fadeUp} className="font-display text-title text-ink">
                                Which song?
                            </motion.h1>

                            <motion.form variants={fadeUp} onSubmit={submitUrl} className="mt-14">
                                <Input
                                    name="url"
                                    label="YouTube link"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                        if (error) setError(undefined);
                                    }}
                                    error={error}
                                    hint={videoId ? 'Track recognised - ' + videoId : 'Videos, Shorts and Music links all work.'}
                                    autoComplete="off"
                                />
                                <div className="mt-12">
                                    <Button type="submit" size="lg" disabled={url.trim().length === 0}>
                                        Continue
                                    </Button>
                                </div>
                            </motion.form>
                        </motion.div>
                    </motion.section>
                ) : (
                    <motion.section key="step2" {...pageTransition} className="pt-16 sm:pt-24">
                        <motion.div initial="hidden" animate="show" variants={stagger(0.08)}>
                            <motion.p
                                variants={fadeUp}
                                className="mb-8 font-mono text-eyebrow uppercase tracking-[0.28em] text-faint"
                            >
                                Step 02 / 02
                            </motion.p>
                            <motion.h1 variants={fadeUp} className="font-display text-title text-ink">
                                How should it look?
                            </motion.h1>

                            <motion.div
                                variants={fadeUp}
                                className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
                            >
                                {STYLE_OPTIONS.map((option) => (
                                    <div key={option.id} className="bg-void">
                                        <StyleCard
                                            option={option}
                                            selected={styleId === option.id}
                                            onSelect={setStyleId}
                                        />
                                    </div>
                                ))}
                            </motion.div>

                            <motion.div variants={fadeUp} className="mt-14 grid gap-10 sm:grid-cols-2">
                                <OptionGroup
                                    label="Lyric treatment"
                                    options={TREATMENTS}
                                    value={treatment}
                                    onChange={setTreatment}
                                />
                                <OptionGroup
                                    label="Animation intensity"
                                    options={INTENSITY}
                                    value={intensity}
                                    onChange={setIntensity}
                                />
                            </motion.div>

                            <motion.div variants={fadeUp} className="mt-16">
                                <div className="flex flex-wrap items-center gap-6">
                                    <Button size="lg" onClick={() => void generate()} disabled={submitting}>
                                        {submitting ? 'Starting' : 'Create the reel'}
                                    </Button>
                                    <Button variant="ghost" onClick={() => setStep(1)} disabled={submitting}>
                                        Back
                                    </Button>
                                </div>
                                {submitError && (
                                    <p className="mt-6 font-mono text-eyebrow tracking-wide text-err">{submitError}</p>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
}