'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatTrustScore, getTrustTier } from '@/hooks/useProfile';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { TrophyIcon, CrownIcon } from '@/components/icons';

// Mock leaderboard data - top 100
const MOCK_LEADERBOARD = Array.from({ length: 100 }, (_, i) => ({
    rank: i + 1,
    address: `0x${(i + 1).toString(16).padStart(4, '0')}...${(i + 100).toString(16).padStart(4, '0')}`,
    username: i === 0 ? 'vitalik.eth' : i === 1 ? 'jesse.base' : i === 2 ? 'dan' : `user${i + 1}.base`,
    pfp: null,
    score: Math.floor(10000 - (i * 80) + Math.random() * 50),
    positiveVouches: Math.floor(100 - i + Math.random() * 20),
    negativeVouches: Math.floor(Math.random() * 5),
}));

export default function LeaderboardPage() {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-gray-900 via-base-gray-900 to-black pb-24 md:pb-8">
            <Header />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <TrophyIcon className="w-8 h-8 text-amber-400" />
                        <h1 className="text-3xl font-bold text-white">All-Time Leaderboard</h1>
                        <TrophyIcon className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="text-base-gray-400">Top 100 most trusted builders on Base</p>
                </div>

                {/* Top 3 Podium with Drop Animation */}
                <div className="flex justify-center items-end gap-4 mb-12">
                    {/* 2nd Place */}
                    <div className={`flex flex-col items-center transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}
                        style={{ transitionDelay: '300ms' }}>
                        <div className="relative mb-3">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500 flex items-center justify-center text-2xl font-bold text-gray-800 border-4 border-gray-300 shadow-xl shadow-gray-500/30 animate-pulse-slow">
                                {MOCK_LEADERBOARD[1].username.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-800 border-2 border-white shadow-lg">
                                2
                            </div>
                        </div>
                        <p className="font-semibold text-white text-sm">{MOCK_LEADERBOARD[1].username}</p>
                        <p className="text-gray-400 text-sm font-medium">{formatTrustScore(MOCK_LEADERBOARD[1].score)}</p>
                        <div className="mt-3 w-24 h-20 bg-gradient-to-t from-gray-700 via-gray-600 to-gray-500 rounded-t-xl flex items-center justify-center shadow-lg border-t border-gray-400/30">
                            <span className="text-3xl font-bold text-white/90">2</span>
                        </div>
                    </div>

                    {/* 1st Place */}
                    <div className={`flex flex-col items-center transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0'}`}
                        style={{ transitionDelay: '100ms' }}>
                        <div className="relative mb-3">
                            {/* Crown */}
                            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${animate ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-4 opacity-0 -rotate-12'}`}
                                style={{ transitionDelay: '800ms' }}>
                                <CrownIcon className="w-8 h-8 text-amber-400 drop-shadow-lg" />
                            </div>
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 flex items-center justify-center text-3xl font-bold text-amber-900 border-4 border-amber-300 shadow-2xl shadow-amber-500/50">
                                {MOCK_LEADERBOARD[0].username.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-sm font-bold text-amber-900 border-2 border-amber-200 shadow-lg">
                                1
                            </div>
                            {/* Sparkles */}
                            <div className="absolute -top-2 -left-2 w-3 h-3 bg-amber-300 rounded-full animate-ping" />
                            <div className="absolute -bottom-1 -right-3 w-2 h-2 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '500ms' }} />
                        </div>
                        <p className="font-bold text-white text-base">{MOCK_LEADERBOARD[0].username}</p>
                        <p className="text-amber-400 text-sm font-semibold">{formatTrustScore(MOCK_LEADERBOARD[0].score)}</p>
                        <div className="mt-3 w-28 h-28 bg-gradient-to-t from-amber-700 via-amber-600 to-amber-500 rounded-t-xl flex items-center justify-center shadow-2xl border-t border-amber-400/50">
                            <span className="text-4xl font-bold text-white drop-shadow-lg">1</span>
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className={`flex flex-col items-center transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : '-translate-y-16 opacity-0'}`}
                        style={{ transitionDelay: '500ms' }}>
                        <div className="relative mb-3">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center text-2xl font-bold text-amber-100 border-4 border-amber-600 shadow-xl shadow-amber-700/30">
                                {MOCK_LEADERBOARD[2].username.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-xs font-bold text-amber-100 border-2 border-amber-400 shadow-lg">
                                3
                            </div>
                        </div>
                        <p className="font-semibold text-white text-sm">{MOCK_LEADERBOARD[2].username}</p>
                        <p className="text-amber-600 text-sm font-medium">{formatTrustScore(MOCK_LEADERBOARD[2].score)}</p>
                        <div className="mt-3 w-24 h-16 bg-gradient-to-t from-amber-900 via-amber-800 to-amber-700 rounded-t-xl flex items-center justify-center shadow-lg border-t border-amber-600/30">
                            <span className="text-3xl font-bold text-amber-200/90">3</span>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-base-gray-800/50 rounded-2xl border border-base-gray-700/50 overflow-hidden backdrop-blur-sm">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-base-gray-700 text-sm font-medium text-base-gray-400">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5">User</div>
                        <div className="col-span-2 text-center">Score</div>
                        <div className="col-span-2 text-center text-green-400">+Vouches</div>
                        <div className="col-span-2 text-center text-red-400">-Vouches</div>
                    </div>

                    {MOCK_LEADERBOARD.slice(3).map((user, index) => {
                        const tier = getTrustTier(user.score);

                        return (
                            <Link
                                key={user.rank}
                                href={`/profile/${user.address}`}
                                className={`grid grid-cols-12 gap-4 p-4 border-b border-base-gray-700/50 hover:bg-base-gray-700/30 transition-all items-center ${animate ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                                style={{ transitionDelay: `${700 + index * 30}ms`, transitionDuration: '300ms' }}
                            >
                                <div className="col-span-1 font-bold text-base-gray-400">#{user.rank}</div>
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-base-blue/20">
                                        {user.username.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white">{user.username}</span>
                                            <span className="text-sm">{tier.emoji}</span>
                                        </div>
                                        <span className="text-xs text-base-gray-500">{user.address}</span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center font-bold text-white">{formatTrustScore(user.score)}</div>
                                <div className="col-span-2 text-center text-green-400 font-medium">{user.positiveVouches}</div>
                                <div className="col-span-2 text-center text-red-400 font-medium">{user.negativeVouches}</div>
                            </Link>
                        );
                    })}
                </div>
            </main>

            <MobileNav />

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
