'use client';

import { Profile } from '@/lib/supabase';
import { getTrustTier, formatTrustScore } from '@/hooks/useProfile';
import { ROLE_LIST } from '@/lib/config';

interface ProfileHeaderProps {
    profile: Profile | null;
    isLoading?: boolean;
}

export function ProfileHeader({ profile, isLoading }: ProfileHeaderProps) {
    if (isLoading) {
        return (
            <div className="w-full animate-pulse">
                <div className="h-48 bg-base-gray-200 dark:bg-base-gray-800 rounded-2xl" />
            </div>
        );
    }

    const trustScore = profile?.trust_score ?? 100;
    const tier = getTrustTier(trustScore);

    // Calculate score percentage for visual bar
    const scorePercentage = Math.min((trustScore / 10000) * 100, 100);

    return (
        <div className="w-full">
            {/* SBT Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-blue via-base-blue-dark to-purple-900 p-6 text-white shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect fill="url(#grid)" width="100" height="100" />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{tier.emoji}</span>
                                <span className="text-sm font-medium opacity-80">{tier.name}</span>
                            </div>
                            <h2 className="text-lg font-mono opacity-60">
                                {profile?.wallet_address
                                    ? `${profile.wallet_address.slice(0, 6)}...${profile.wallet_address.slice(-4)}`
                                    : 'Not Connected'
                                }
                            </h2>
                        </div>

                        {/* SBT Badge */}
                        {profile?.sbt_token_id !== null && (
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                                <span className="text-xs font-medium">SBT #{profile?.sbt_token_id}</span>
                            </div>
                        )}
                    </div>

                    {/* Identity */}
                    <div className="mb-6">
                        {profile?.basename && (
                            <p className="text-2xl font-bold">{profile.basename}</p>
                        )}
                        {profile?.farcaster_username && (
                            <p className="text-sm opacity-60">@{profile.farcaster_username}</p>
                        )}
                    </div>

                    {/* Trust Score */}
                    <div className="mb-4">
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-sm font-medium opacity-60">Trust Score</span>
                            <span className="text-4xl font-bold">{formatTrustScore(trustScore)}</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000"
                                style={{ width: `${scorePercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold">{profile?.total_vouches_received ?? 0}</p>
                            <p className="text-xs opacity-60">Received</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{profile?.total_vouches_given ?? 0}</p>
                            <p className="text-xs opacity-60">Given</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-400">{profile?.positive_vouches ?? 0}</p>
                            <p className="text-xs opacity-60">Positive</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-400">{profile?.negative_vouches ?? 0}</p>
                            <p className="text-xs opacity-60">Negative</p>
                        </div>
                    </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute top-0 -left-40 w-80 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shine" />
            </div>
        </div>
    );
}

// Add shine animation to globals.css
// @keyframes shine { 0% { left: -40%; } 100% { left: 140%; } }
// .animate-shine { animation: shine 3s ease-in-out infinite; }
