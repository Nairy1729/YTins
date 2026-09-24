import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../primitives/Button';
import { fadeUp, stagger } from '../../lib/motion';

interface StateProps {
    title: string;
    body: string;
    action?: ReactNode;
    tone?: 'neutral' | 'error';
}

function BaseState({ title, body, action, tone = 'neutral' }: StateProps) {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={stagger(0.08)}
            className="mx-auto flex max-w-md flex-col items-center py-24 text-center"
        >
            <motion.div
                variants={fadeUp}
                className={tone === 'error' ? 'mb-8 h-px w-16 bg-err' : 'mb-8 h-px w-16 bg-brass'}
            />
            <motion.h2 variants={fadeUp} className="font-display text-3xl text-ink">
                {title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-sm leading-relaxed text-muted">
                {body}
            </motion.p>
            {action && (
                <motion.div variants={fadeUp} className="mt-10">
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
}

export function EmptyState({ title, body, action }: Omit<StateProps, 'tone'>) {
    return <BaseState title={title} body={body} action={action} />;
}

export function ErrorState({
    title = 'Something went wrong',
    body,
    onRetry,
}: {
    title?: string;
    body: string;
    onRetry?: () => void;
}) {
    return (
        <BaseState
            tone="error"
            title={title}
            body={body}
            action={
                onRetry ? (
                    <Button variant="outline" onClick={onRetry}>
                        Try again
                    </Button>
                ) : undefined
            }
        />
    );
}