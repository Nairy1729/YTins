import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppShell } from './components/shell/AppShell';
import { Landing } from './routes/Landing';
import { Create } from './routes/Create';
import { Generate } from './routes/Generate';
import { SystemCheck } from './routes/SystemCheck';
import { pageTransition } from './lib/motion';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageTransition}>
                <Routes location={location}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/generate/:jobId" element={<Generate />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/system" element={<SystemCheck />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

export function App() {
    return (
        <BrowserRouter>
            <AppShell>
                <AnimatedRoutes />
            </AppShell>
        </BrowserRouter>
    );
}