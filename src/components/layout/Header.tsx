'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { SearchBar } from '@/components/search/SearchBar';
import { NotificationBell } from '@/components/dashboard/NotificationBell';

interface HeaderProps {
    showSearch?: boolean;
}

export function Header({ showSearch = true }: HeaderProps) {
    const pathname = usePathname();
    const { user, isAuthenticated } = useAuth();

    const isActive = (path: string) => {
        if (path === '/dashboard') return pathname === '/dashboard';
        if (path === '/leaderboard') return pathname === '/leaderboard';
        if (path.startsWith('/profile')) return pathname?.startsWith('/profile') && !pathname?.includes('/setup');
        return false;
    };

    const navLinkClass = (path: string) =>
        `text-sm transition-colors ${isActive(path)
            ? 'text-white font-medium'
            : 'text-base-gray-400 hover:text-white'
        }`;

    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-gray-900/90 border-b border-base-gray-800">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center shadow-lg shadow-base-blue/25">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="text-lg font-bold text-white hidden sm:block">BaseProof</span>
                    </Link>

                    {/* Navigation - always visible */}
                    <nav className="flex items-center gap-4 sm:gap-6">
                        <Link href="/dashboard" className={navLinkClass('/dashboard')}>
                            Dashboard
                        </Link>
                        <Link href="/leaderboard" className={navLinkClass('/leaderboard')}>
                            Leaderboard
                        </Link>
                        <Link
                            href={isAuthenticated && user ? `/profile/${user.wallet_address || user.fid}` : '/profile/setup'}
                            className={navLinkClass('/profile')}
                        >
                            Profile
                        </Link>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {showSearch && (
                            <div className="hidden sm:block">
                                <SearchBar />
                            </div>
                        )}

                        <NotificationBell />

                        {/* Profile Button */}
                        {isAuthenticated && user ? (
                            <Link
                                href={`/profile/${user.wallet_address || user.fid}`}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-base-gray-800 hover:bg-base-gray-700 transition-colors border border-base-gray-700"
                            >
                                <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-base-blue to-purple-600">
                                    {user.pfpUrl ? (
                                        <img src={user.pfpUrl} alt={user.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                                            {user.displayName?.slice(0, 1).toUpperCase() || '?'}
                                        </div>
                                    )}
                                </div>
                                <span className="text-white text-sm hidden sm:block">{user.username || 'User'}</span>
                            </Link>
                        ) : (
                            <Link
                                href="/profile/setup"
                                className="px-4 py-2 bg-gradient-to-r from-base-blue to-purple-600 text-white text-sm font-medium rounded-lg hover:from-base-blue-light hover:to-purple-500 transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
