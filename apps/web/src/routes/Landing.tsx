import { motion } from 'framer-motion';
import { Button } from '../components/primitives/Button';
import { TransformHero } from '../components/hero/TransformHero';
import { fadeUp, stagger } from '../lib/motion';

const STEPS = [
    { n: '01', title: 'Paste a song', body: 'Any track. We take it from there.' },
    { n: '02', title: 'Choose a style', body: 'Pen and ink, cinematic, minimal type.' },
    { n: '03', title: 'Watch it become visual', body: 'A short film built from what the song means.' },
];

export function Landing() {
    return (
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
            <motion.section
                initial="hidden"
                animate="show"
                variants={stagger(0.12, 0.1)}
                className="flex min-h-[calc(100dvh-5rem)] flex-col justify-center py-20"
            >
                <motion.p
                    variants={fadeUp}
                    className="mb-8 font-mono text-eyebrow uppercase tracking-[0.34em] text-brass"
                >
                    Reverie
                </motion.p>

                <motion.h1
                    variants={fadeUp}
                    className="max-w-4xl font-display text-display font-normal tracking-tight text-ink"
                >
                    Turn music into
                    <br />
                    <span className="italic text-muted">a visual story.</span>
                </motion.h1>

                <motion.p variants={fadeUp} className="mt-10 max-w-xl text-lead text-muted">
                    Give us a song. Reverie listens for meaning, mood and imagery, then draws what it
                    finds into a short vertical film.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-6">
                    <Button to="/create" size="lg">
                        Begin
                    </Button>
                    <a
                        href="#how"
                        className="font-mono text-eyebrow uppercase tracking-[0.22em] text-faint transition-colors duration-300 hover:text-ink"
                    >
                        How it works
                    </a>
                </motion.div>
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-15%' }}
                variants={fadeUp}
                className="border-t border-line py-20"
            >
                <TransformHero />
            </motion.section>

            <section id="how" className="border-t border-line py-20 sm:py-28">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-15%' }}
                    variants={stagger(0.1)}
                    className="grid gap-12 sm:grid-cols-3 sm:gap-10"
                >
                    {STEPS.map((step) => (
                        <motion.div key={step.n} variants={fadeUp}>
                            <span className="font-mono text-eyebrow tracking-[0.28em] text-brass">{step.n}</span>
                            <h3 className="mt-5 font-display text-2xl text-ink sm:text-3xl">{step.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            <footer className="flex flex-col gap-4 border-t border-line py-10 font-mono text-[10px] uppercase tracking-[0.24em] text-faint sm:flex-row sm:items-center sm:justify-between">
                <span>Reverie</span>
                <span>Phase 2A - Design foundation</span>
            </footer>
        </div>
    );
}