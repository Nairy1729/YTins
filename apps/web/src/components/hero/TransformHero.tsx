import { motion } from 'framer-motion';

const LOOP = 10;
const BARS = Array.from({ length: 24 }, (_, i) => ({
    x: 60 + i * 14,
    h: 16 + Math.abs(Math.sin(i * 0.85)) * 96,
    delay: i * 0.04,
}));

const STROKES: { d: string; delay: number }[] = [
    { d: 'M 850 262 L 1130 262', delay: 0 },
    { d: 'M 905 128 C 925 78, 1035 78, 1055 128', delay: 0.5 },
    { d: 'M 905 128 Q 942 148 980 128 Q 1018 148 1055 128', delay: 0.9 },
    { d: 'M 980 100 L 980 186', delay: 1.2 },
    { d: 'M 980 208 L 980 238', delay: 1.6 },
    { d: 'M 980 238 L 966 262', delay: 1.8 },
    { d: 'M 980 238 L 994 262', delay: 1.9 },
    { d: 'M 880 66 L 868 104', delay: 2.1 },
    { d: 'M 928 52 L 916 90', delay: 2.2 },
    { d: 'M 1034 58 L 1022 96', delay: 2.3 },
    { d: 'M 1092 78 L 1080 116', delay: 2.4 },
    { d: 'M 852 116 L 840 154', delay: 2.5 },
    { d: 'M 1114 134 L 1102 172', delay: 2.6 },
];

const drawTransition = (delay: number) => ({
    duration: LOOP,
    times: [0, 0.3, 0.8, 1],
    repeat: Infinity,
    delay,
    ease: 'easeInOut' as const,
});

export function TransformHero() {
    return (
        <div className="w-full">
            <svg
                viewBox="0 0 1200 320"
                className="h-auto w-full"
                fill="none"
                aria-label="A sound wave resolving into a drawn scene"
            >
                {BARS.map((bar, i) => (
                    <motion.rect
                        key={i}
                        x={bar.x}
                        y={160 - bar.h / 2}
                        width={3}
                        height={bar.h}
                        fill="#8a8994"
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                        animate={{ scaleY: [0.25, 1, 0.55, 1, 0.25], opacity: [0.35, 1, 0.7, 1, 0.35] }}
                        transition={{ duration: 3.2, repeat: Infinity, delay: bar.delay, ease: 'easeInOut' }}
                    />
                ))}

                <line x1={430} y1={160} x2={790} y2={160} stroke="#22222b" strokeWidth={1} />

                <motion.circle
                    r={3}
                    cy={160}
                    fill="#c8a97e"
                    animate={{ cx: [430, 790], opacity: [0, 1, 1, 0] }}
                    transition={{ duration: LOOP, times: [0, 0.12, 0.24, 0.3], repeat: Infinity }}
                />

                {STROKES.map((stroke, i) => (
                    <motion.path
                        key={i}
                        d={stroke.d}
                        stroke="#ecebe8"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                        transition={drawTransition(stroke.delay)}
                    />
                ))}

                <motion.circle
                    cx={980}
                    cy={198}
                    r={10}
                    stroke="#ecebe8"
                    strokeWidth={1.6}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={drawTransition(1.4)}
                />
            </svg>

            <div className="mt-6 grid grid-cols-3 gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-faint">
                <span className="text-left">Sound</span>
                <span className="text-center">Meaning</span>
                <span className="text-right">Image</span>
            </div>
        </div>
    );
}