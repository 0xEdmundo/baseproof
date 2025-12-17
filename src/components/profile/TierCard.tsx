'use client';

import { Profile } from '@/lib/supabase';

// Tier definitions based on score
export const TIERS = {
    PLATINUM: { name: 'Platinum', minScore: 8000, color: 'from-cyan-400 via-blue-500 to-purple-600', glow: 'shadow-cyan-500/50', emoji: '💎' },
    GOLD: { name: 'Gold', minScore: 5000, color: 'from-amber-400 via-yellow-500 to-orange-500', glow: 'shadow-amber-500/50', emoji: '🥇' },
    ELITE: { name: 'Elite', minScore: 2500, color: 'from-purple-500 via-pink-500 to-rose-500', glow: 'shadow-purple-500/50', emoji: '⭐' },
    SILVER: { name: 'Silver', minScore: 1000, color: 'from-gray-300 via-gray-400 to-slate-500', glow: 'shadow-gray-400/50', emoji: '🥈' },
    BASIC: { name: 'Basic', minScore: 0, color: 'from-slate-600 via-gray-700 to-zinc-800', glow: 'shadow-gray-600/30', emoji: '🌱' },
};

export function getTierByScore(score: number) {
    if (score >= TIERS.PLATINUM.minScore) return TIERS.PLATINUM;
    if (score >= TIERS.GOLD.minScore) return TIERS.GOLD;
    if (score >= TIERS.ELITE.minScore) return TIERS.ELITE;
    if (score >= TIERS.SILVER.minScore) return TIERS.SILVER;
    return TIERS.BASIC;
}

interface TierCardProps {
    profile: Profile | null;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    basename?: string;
    topRoles?: string[];
    isOwn?: boolean;
}

export function TierCard({
    profile,
    username,
    displayName,
    pfpUrl,
    basename,
    topRoles = [],
    isOwn = false
}: TierCardProps) {
    const score = profile?.trust_score ?? 100;
    const tier = getTierByScore(score);

    const displayIdentity = basename || username || profile?.wallet_address?.slice(0, 8) + '...' || 'Unknown';

    return (
        <div className={`
      relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-2xl overflow-hidden
      bg-gradient-to-br ${tier.color}
      shadow-2xl ${tier.glow}
      transform hover:scale-[1.02] transition-all duration-300
    `}>
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none">
                    <defs>
                        <pattern id="cardPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1" fill="white" />
                        </pattern>
                    </defs>
                    <rect fill="url(#cardPattern)" width="100%" height="100%" />
                </svg>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50" />

            {/* Content */}
            <div className="relative h-full p-5 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {/* PFP */}
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm overflow-hidden border-2 border-white/30">
                            {pfpUrl ? (
                                <img src={pfpUrl} alt={displayName || username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                                    {displayIdentity.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg drop-shadow-md">{displayName || username}</p>
                            <p className="text-white/70 text-sm">@{username}</p>
                        </div>
                    </div>

                    {/* Tier Badge */}
                    <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                        <span className="text-sm mr-1">{tier.emoji}</span>
                        <span className="text-white font-semibold text-sm">{tier.name}</span>
                    </div>
                </div>

                {/* Score */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-6xl font-bold text-white drop-shadow-lg">{score.toLocaleString()}</p>
                        <p className="text-white/60 text-sm font-medium mt-1">TRUST SCORE</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-end justify-between">
                    {/* Top Roles */}
                    <div className="flex gap-1.5">
                        {topRoles.slice(0, 3).map((role, i) => (
                            <span key={i} className="bg-black/30 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-white border border-white/20">
                                {role}
                            </span>
                        ))}
                    </div>

                    {/* Identity */}
                    <div className="text-right">
                        <p className="text-white/80 text-xs font-mono">{displayIdentity}</p>
                        <p className="text-white/50 text-[10px] mt-0.5">BaseProof Identity</p>
                    </div>
                </div>
            </div>

            {/* BaseProof Logo Watermark */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
        </div>
    );
}
