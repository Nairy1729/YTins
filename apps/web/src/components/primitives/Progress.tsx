import { motion } from 'framer-motion';
import { EASE_OUT } from '../../lib/motion';

export function Progress({ value }: { value: number }) {
    const clamped = Math.min(1, Math.max(0, value));

    return (
        <div className="h-px w-full bg-line">
            <motion.div
                className="h-px bg-brass"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: clamped }}
                style={{ transformOrigin: 'left' }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
            />
        </div>
    );
}