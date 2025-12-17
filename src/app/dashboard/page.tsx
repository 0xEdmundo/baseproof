'use client';

import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { SearchBar } from '@/components/search/SearchBar';
import { DailyRisers } from '@/components/dashboard/DailyRisers';
import { NotificationBell } from '@/components/dashboard/NotificationBell';

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();

    const vouchLimit = user ? {
        dailyRemaining: 5 - (user.dailyVouchesUsed || 0),
        weeklyRemaining: 35 - (user.weeklyVouchesUsed || 0),
    } : { dailyRemaining: 5, weeklyRemaining: 35 };

    return (
        <div className="min-h-screen bg-base-gray-900 pb-24 md:pb-8">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-gray-900/90 border-b border-base-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white hidden sm:block">BaseProof</span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-4">
                            <Link href="/dashboard" className="text-white text-sm font-medium">Dashboard</Link>
                            <Link href="/leaderboard" className="text-base-gray-400 hover:text-white text-sm transition-colors">Leaderboard</Link>
                            {isAuthenticated && (
                                <Link href={`/profile/${user?.custody_address || user?.fid}`} className="text-base-gray-400 hover:text-white text-sm transition-colors">Profile</Link>
                            )}
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block">
                                <SearchBar />
                            </div>

                            <NotificationBell />

                            {/* Profile Button */}
                            {isAuthenticated && user ? (
                                <Link
                                    href={`/profile/${user.custody_address || user.fid}`}
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
                                    className="px-4 py-2 bg-gradient-to-r from-base-blue to-purple-600 text-white text-sm font-medium rounded-lg"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Welcome/Profile Card */}
                {!isAuthenticated ? (
                    <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-base-blue/20 to-purple-600/20 border border-base-blue/30">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Welcome to BaseProof</h3>
                                <p className="text-base-gray-400 text-sm">Create your profile to start building onchain reputation</p>
                            </div>
                            <Link href="/profile/setup" className="px-5 py-2 bg-gradient-to-r from-base-blue to-purple-600 rounded-lg font-medium text-white text-sm">
                                Create Profile
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Quick Stats */
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                            <p className="text-base-gray-400 text-xs mb-1">Your Rank</p>
                            <p className="text-2xl font-bold text-white">
                                {user?.rank ? `#${user.rank}` : '—'}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                            <p className="text-base-gray-400 text-xs mb-1">Trust Score</p>
                            <p className="text-2xl font-bold text-base-blue">
                                {user?.trustScore || '—'}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                            <p className="text-base-gray-400 text-xs mb-1">Daily Vouches</p>
                            <p className="text-2xl font-bold text-green-400">
                                {vouchLimit.dailyRemaining}/5
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                            <p className="text-base-gray-400 text-xs mb-1">Weekly Vouches</p>
                            <p className="text-2xl font-bold text-purple-400">
                                {vouchLimit.weeklyRemaining}/35
                            </p>
                        </div>
                    </div>
                )}

                {/* Daily Risers */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">🔥 Daily Risers</h2>
                            <p className="text-base-gray-400 text-xs mt-0.5">Top performers in the last 24 hours</p>
                        </div>
                        <Link href="/leaderboard" className="text-base-blue hover:text-base-blue-light text-sm font-medium transition-colors">
                            View All →
                        </Link>
                    </div>
                    <DailyRisers />
                </section>
            </main>

            {/* Mobile Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-gray-900/95 backdrop-blur-xl border-t border-base-gray-800 px-4 py-2 z-50">
                <div className="flex items-center justify-around">
                    <Link href="/dashboard" className="flex flex-col items-center gap-0.5 text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="text-[10px]">Home</span>
                    </Link>
                    <Link href="/leaderboard" className="flex flex-col items-center gap-0.5 text-base-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-[10px]">Ranks</span>
                    </Link>
                    <Link
                        href={isAuthenticated && user ? `/profile/${user.custody_address || user.fid}` : '/profile/setup'}
                        className="flex flex-col items-center gap-0.5 text-base-gray-400"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-[10px]">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
