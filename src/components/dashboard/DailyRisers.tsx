'use client';

import Link from 'next/link';
import { formatTrustScore, getTrustTier } from '@/hooks/useProfile';

// Mock data for now - will be replaced with API call
const MOCK_RISERS = [
    { rank: 1, address: '0x1234...5678', username: 'vitalik.eth', pfp: null, score: 8500, change: 450 },
    { rank: 2, address: '0x2345...6789', username: 'jesse.base', pfp: null, score: 7200, change: 380 },
    { rank: 3, address: '0x3456...7890', username: 'dan', pfp: null, score: 6800, change: 320 },
    { rank: 4, address: '0x4567...8901', username: 'linda.eth', pfp: null, score: 5500, change: 280 },
    { rank: 5, address: '0x5678...9012', username: 'builder.base', pfp: null, score: 4200, change: 210 },
];

export function DailyRisers() {
    return (
        <div className="grid gap-3">
            {MOCK_RISERS.map((user, index) => {
                const tier = getTrustTier(user.score);

                return (
                    <Link
                        key={user.address}
                        href={`/profile/${user.address}`}
                        className="group flex items-center gap-4 p-4 rounded-xl bg-base-gray-800/50 hover:bg-base-gray-800 border border-base-gray-700/50 hover:border-base-gray-600 transition-all"
                    >
                        {/* Rank */}
                        <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
              ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black' : ''}
              ${index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : ''}
              ${index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' : ''}
              ${index > 2 ? 'bg-base-gray-700 text-base-gray-400' : ''}
            `}>
                            {user.rank}
                        </div>

                        {/* PFP */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                            {user.pfp ? (
                                <img src={user.pfp} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                user.username.slice(0, 2).toUpperCase()
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-white truncate">{user.username}</p>
                                <span className="text-sm">{tier.emoji}</span>
                            </div>
                            <p className="text-sm text-base-gray-400 truncate">{user.address}</p>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                            <p className="font-bold text-white">{formatTrustScore(user.score)}</p>
                            <p className="text-sm text-green-400 font-medium">+{user.change}</p>
                        </div>

                        {/* Arrow */}
                        <svg className="w-5 h-5 text-base-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                );
            })}
        </div>
    );
}
