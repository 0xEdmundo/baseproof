'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function MobileNav() {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        if (path === '/leaderboard') return pathname === '/leaderboard';
        if (path.startsWith('/profile')) return pathname?.startsWith('/profile');
        return false;
    };

    const navItemClass = (path: string) =>
        `flex flex-col items-center gap-0.5 ${isActive(path) ? 'text-white' : 'text-base-gray-400'}`;

    const profileHref = isAuthenticated && user
        ? `/profile/${user.wallet_address || user.fid}`
        : '/profile/setup';

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-gray-900/95 backdrop-blur-xl border-t border-base-gray-800 px-4 py-2 z-50">
            <div className="flex items-center justify-around">
                {/* Home / Dashboard */}
                <Link href="/dashboard" className={navItemClass('/dashboard')}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-[10px]">Home</span>
                </Link>

                {/* Leaderboard / Ranks */}
                <Link href="/leaderboard" className={navItemClass('/leaderboard')}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-[10px]">Ranks</span>
                </Link>

                {/* Profile */}
                <Link href={profileHref} className={navItemClass('/profile')}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[10px]">Profile</span>
                </Link>
            </div>
        </nav>
    );
}
