'use client';

import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { formatTrustScore, getTrustTier } from '@/hooks/useProfile';
import { useAccount } from 'wagmi';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';

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
    const { address, isConnected } = useAccount();

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-gray-900 via-base-gray-900 to-black">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-gray-900/80 border-b border-base-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
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

                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-base-gray-400 hover:text-white transition-colors">Dashboard</Link>
                            <Link href="/leaderboard" className="text-white font-medium">Leaderboard</Link>
                            {isConnected && (
                                <Link href={`/profile/${address}`} className="text-base-gray-400 hover:text-white transition-colors">Profile</Link>
                            )}
                        </nav>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block">
                                <SearchBar />
                            </div>
                            <Wallet>
                                <ConnectWallet className="!bg-base-blue hover:!bg-base-blue-light !rounded-xl !px-4 !py-2">
                                    <Avatar className="h-5 w-5" />
                                    <Name className="text-sm" />
                                </ConnectWallet>
                            </Wallet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🏆 All-Time Leaderboard</h1>
                    <p className="text-base-gray-400">Top 100 most trusted builders on Base</p>
                </div>

                {/* Top 3 Podium */}
                <div className="flex justify-center items-end gap-4 mb-10">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-2xl font-bold text-black mb-2 border-4 border-gray-400">
                            {MOCK_LEADERBOARD[1].username.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="font-semibold text-white text-sm">{MOCK_LEADERBOARD[1].username}</p>
                        <p className="text-base-gray-400 text-sm">{formatTrustScore(MOCK_LEADERBOARD[1].score)}</p>
                        <div className="mt-2 w-20 h-16 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">2</span>
                        </div>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl font-bold text-black mb-2 border-4 border-amber-300 shadow-lg shadow-amber-500/50">
                            {MOCK_LEADERBOARD[0].username.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="font-semibold text-white">{MOCK_LEADERBOARD[0].username}</p>
                        <p className="text-base-gray-400 text-sm">{formatTrustScore(MOCK_LEADERBOARD[0].score)}</p>
                        <div className="mt-2 w-24 h-24 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">1</span>
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-2xl font-bold text-white mb-2 border-4 border-amber-600">
                            {MOCK_LEADERBOARD[2].username.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="font-semibold text-white text-sm">{MOCK_LEADERBOARD[2].username}</p>
                        <p className="text-base-gray-400 text-sm">{formatTrustScore(MOCK_LEADERBOARD[2].score)}</p>
                        <div className="mt-2 w-20 h-12 bg-gradient-to-t from-amber-900 to-amber-800 rounded-t-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">3</span>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-base-gray-800/50 rounded-2xl border border-base-gray-700/50 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-base-gray-700 text-sm font-medium text-base-gray-400">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5">User</div>
                        <div className="col-span-2 text-center">Score</div>
                        <div className="col-span-2 text-center text-green-400">+Vouches</div>
                        <div className="col-span-2 text-center text-red-400">-Vouches</div>
                    </div>

                    {MOCK_LEADERBOARD.slice(3).map((user) => {
                        const tier = getTrustTier(user.score);

                        return (
                            <Link
                                key={user.rank}
                                href={`/profile/${user.address}`}
                                className="grid grid-cols-12 gap-4 p-4 border-b border-base-gray-700/50 hover:bg-base-gray-700/30 transition-colors items-center"
                            >
                                <div className="col-span-1 font-bold text-base-gray-400">#{user.rank}</div>
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center text-white font-bold text-sm">
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
                                <div className="col-span-2 text-center text-green-400">{user.positiveVouches}</div>
                                <div className="col-span-2 text-center text-red-400">{user.negativeVouches}</div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
