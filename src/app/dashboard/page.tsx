'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { DailyRisers } from '@/components/dashboard/DailyRisers';
import { NotificationBell } from '@/components/dashboard/NotificationBell';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { useAccount } from 'wagmi';
import { useFarcaster } from '@/lib/farcaster';

export default function DashboardPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { isInFrame, isLoaded, user } = useFarcaster();
    const [hasProfile, setHasProfile] = useState(false);
    const [showProfilePrompt, setShowProfilePrompt] = useState(false);

    // Check if user has profile
    useEffect(() => {
        if (isLoaded) {
            const userAddress = isInFrame && user ? user.custody_address : address;
            if (userAddress) {
                const savedProfile = localStorage.getItem(`baseproof_profile_${userAddress}`);
                setHasProfile(!!savedProfile);
                setShowProfilePrompt(!savedProfile);
            }
        }
    }, [isLoaded, isInFrame, user, address]);

    const userAddress = isInFrame && user ? user.custody_address : address;
    const displayName = user?.displayName || 'User';
    const userName = user?.username || (userAddress ? `${userAddress.slice(0, 6)}...` : 'Anonymous');
    const pfpUrl = user?.pfpUrl;

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-gray-900 via-base-gray-900 to-black pb-24 md:pb-8">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-gray-900/80 border-b border-base-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center shadow-lg shadow-base-blue/25">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-base-gray-400 bg-clip-text text-transparent">
                                BaseProof
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
                            <Link href="/leaderboard" className="text-base-gray-400 hover:text-white transition-colors">Leaderboard</Link>
                            <Link
                                href={hasProfile && userAddress ? `/profile/${userAddress}` : '/profile/setup'}
                                className="text-base-gray-400 hover:text-white transition-colors"
                            >
                                Profile
                            </Link>
                        </nav>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block">
                                <SearchBar />
                            </div>

                            <NotificationBell />

                            {/* Profile Button */}
                            <Link
                                href={hasProfile && userAddress ? `/profile/${userAddress}` : '/profile/setup'}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-base-gray-800 hover:bg-base-gray-700 transition-colors border border-base-gray-700"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center overflow-hidden">
                                    {pfpUrl ? (
                                        <img src={pfpUrl} alt={displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white text-sm font-bold">
                                            {displayName.slice(0, 1).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <span className="text-white text-sm font-medium hidden sm:block">{userName}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile Creation Prompt */}
                {showProfilePrompt && (
                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-base-blue/20 to-purple-600/20 border border-base-blue/30">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">🎉 Welcome to BaseProof!</h3>
                                <p className="text-base-gray-400">Complete your profile to start building your onchain reputation</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowProfilePrompt(false)}
                                    className="px-4 py-2 text-base-gray-400 hover:text-white transition-colors"
                                >
                                    Later
                                </button>
                                <Link
                                    href="/profile/setup"
                                    className="px-6 py-2 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 rounded-xl font-medium text-white transition-all shadow-lg shadow-base-blue/25"
                                >
                                    Create Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <QuickStats />

                {/* Daily Risers */}
                <section className="mt-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">🔥 Daily Risers</h2>
                            <p className="text-base-gray-400 text-sm mt-1">Top performers in the last 24 hours</p>
                        </div>
                        <Link href="/leaderboard" className="text-base-blue hover:text-base-blue-light text-sm font-medium transition-colors">
                            View All →
                        </Link>
                    </div>
                    <DailyRisers />
                </section>

                {/* Mobile Navigation */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-base-gray-900/95 backdrop-blur-xl border-t border-base-gray-800 px-4 py-3 z-50">
                    <div className="flex items-center justify-around">
                        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-xs">Home</span>
                        </Link>
                        <Link href="/leaderboard" className="flex flex-col items-center gap-1 text-base-gray-400">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-xs">Ranks</span>
                        </Link>
                        <Link
                            href={hasProfile && userAddress ? `/profile/${userAddress}` : '/profile/setup'}
                            className="flex flex-col items-center gap-1 text-base-gray-400"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-xs">Profile</span>
                        </Link>
                    </div>
                </nav>
            </main>
        </div>
    );
}
