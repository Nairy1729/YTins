import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';

const NAV = [
    { to: '/create', label: 'Create' },
    { to: '/system', label: 'System' },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 z-50 bg-void/90 backdrop-blur-sm transition-colors duration-500',
                scrolled ? 'border-b border-line' : 'border-b border-transparent',
            )}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:h-20 sm:px-10">
                <Link
                    to="/"
                    className="font-mono text-eyebrow uppercase tracking-[0.34em] text-ink transition-colors duration-300 hover:text-brass"
                >
                    Reverie
                </Link>

                <nav className="flex items-center gap-8">
                    {NAV.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'font-mono text-eyebrow uppercase tracking-[0.22em] transition-colors duration-300',
                                    isActive ? 'text-brass' : 'text-muted hover:text-ink',
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}