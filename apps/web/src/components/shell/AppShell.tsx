import type { ReactNode } from 'react';
import { Header } from './Header';

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-dvh">
            <Header />
            <main className="pt-16 sm:pt-20">{children}</main>
        </div>
    );
}