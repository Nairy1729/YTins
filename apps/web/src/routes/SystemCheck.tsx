import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { HealthResponse } from '@reverie/contracts';
import { api, ApiRequestError } from '../lib/api';

type Status = 'checking' | 'ok' | 'error';

const DOT: Record<Status, string> = {
    checking: 'bg-warn',
    ok: 'bg-ok',
    error: 'bg-err',
};

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{label}</span>
            <span className="font-mono text-sm text-ink">{value}</span>
        </div>
    );
}

export function SystemCheck() {
    const [status, setStatus] = useState<Status>('checking');
    const [health, setHealth] = useState<HealthResponse | null>(null);
    const [message, setMessage] = useState<string>('Contacting API...');

    const check = useCallback(async () => {
        setStatus('checking');
        setMessage('Contacting API...');
        try {
            const result = await api.health();
            setHealth(result);
            setStatus('ok');
            setMessage('All systems nominal.');
        } catch (error) {
            setStatus('error');
            setMessage(
                error instanceof ApiRequestError
                    ? error.message
                    : 'Unexpected failure while contacting the API.',
            );
        }
    }, []);

    useEffect(() => {
        void check();
    }, [check]);

    return (
        <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center px-6 py-16">
            <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                className="w-full max-w-lg"
            >
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-14"
                >
                    <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-brass">
                        Reverie
                    </p>
                    <div className="mb-6 h-px w-32 bg-brass" />

                    <h1 className="font-display text-4xl font-light tracking-tight text-ink sm:text-5xl">
                        Turn music into
                        <br />
                        <span className="text-muted">a visual story.</span>
                    </h1>
                </motion.div>

                <motion.div
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 flex items-center gap-3"
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${DOT[status]}`} />
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                        {message}
                    </span>
                </motion.div>

                <motion.div
                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border-t border-line"
                >
                    <Row label="Frontend" value="Vite - React - Tailwind" />
                    <Row label="API" value={status === 'ok' ? 'connected' : status} />
                    <Row label="Node" value={health?.node ?? '-'} />
                    <Row label="Environment" value={health?.environment ?? '-'} />
                    <Row label="Schema" value={health?.schemaVersion ?? '-'} />
                    <Row
                        label="Format"
                        value={health ? `${health.video.width}x${health.video.height} @ ${health.video.fps}fps` : '-'}
                    />
                </motion.div>

                {status === 'error' && (
                    <button
                        onClick={() => void check()}
                        className="mt-8 border border-line px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:border-brass hover:text-brass"
                    >
                        Retry
                    </button>
                )}

                <p className="mt-14 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                    Phase 1 - Foundation - not the landing page
                </p>
            </motion.div>
        </div>
    );
}