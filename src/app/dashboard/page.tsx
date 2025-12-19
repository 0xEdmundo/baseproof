'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { DailyRisers } from '@/components/dashboard/DailyRisers';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();
    const [isCheckingProfile, setIsCheckingProfile] = useState(false);

    const vouchLimit = user ? {
        dailyRemaining: 5 - (user.dailyVouchesUsed || 0),
        weeklyRemaining: 35 - (user.weeklyVouchesUsed || 0),
    } : { dailyRemaining: 5, weeklyRemaining: 35 };

    // Smart redirect - check if profile exists
    const handleCreateProfile = async () => {
        setIsCheckingProfile(true);
        try {
            const saved = localStorage.getItem('baseproof_current_user');
            if (saved) {
                const userData = JSON.parse(saved);
                if (userData.wallet_address) {
                    const response = await fetch(`/api/profile/${userData.wallet_address}`);
                    const data = await response.json();

                    if (data.profile && !data.isNewUser) {
                        router.push(`/profile/${userData.wallet_address}`);
                        return;
                    }
                }
            }
            router.push('/profile/setup');
        } catch (error) {
            router.push('/profile/setup');
        } finally {
            setIsCheckingProfile(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-gray-900 pb-24 md:pb-8">
            <Header />

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
                            <button
                                onClick={handleCreateProfile}
                                disabled={isCheckingProfile}
                                className="px-5 py-2 bg-gradient-to-r from-base-blue to-purple-600 rounded-lg font-medium text-white text-sm disabled:opacity-70 flex items-center gap-2"
                            >
                                {isCheckingProfile ? (
                                    <>
                                        <span className="animate-spin">⏳</span>
                                        Checking...
                                    </>
                                ) : (
                                    'Create Profile'
                                )}
                            </button>
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

            <MobileNav />
        </div>
    );
}
