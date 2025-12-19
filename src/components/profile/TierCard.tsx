'use client';

import { Profile } from '@/lib/supabase';
import {
    BasicTierIcon,
    SilverTierIcon,
    EliteTierIcon,
    GoldTierIcon,
    PlatinumTierIcon,
    BuilderIcon,
    DeveloperIcon,
    CreatorIcon,
    LeaderIcon,
    InvestorIcon,
    FarcasterIcon
} from '@/components/icons';

// Tier definitions based on score
export const TIERS = {
    PLATINUM: {
        name: 'Platinum',
        minScore: 8000,
        color: 'from-cyan-400 via-blue-500 to-purple-600',
        glow: 'shadow-cyan-500/50',
        Icon: PlatinumTierIcon,
        bgGradient: 'from-cyan-500/20 to-purple-600/20',
        borderColor: 'border-cyan-400/40',
        accent: 'text-cyan-400'
    },
    GOLD: {
        name: 'Gold',
        minScore: 5000,
        color: 'from-amber-400 via-yellow-500 to-orange-500',
        glow: 'shadow-amber-500/50',
        Icon: GoldTierIcon,
        bgGradient: 'from-amber-500/20 to-orange-600/20',
        borderColor: 'border-amber-400/40',
        accent: 'text-amber-400'
    },
    ELITE: {
        name: 'Elite',
        minScore: 2500,
        color: 'from-purple-500 via-pink-500 to-rose-500',
        glow: 'shadow-purple-500/50',
        Icon: EliteTierIcon,
        bgGradient: 'from-purple-500/20 to-rose-600/20',
        borderColor: 'border-purple-400/40',
        accent: 'text-purple-400'
    },
    SILVER: {
        name: 'Silver',
        minScore: 1000,
        color: 'from-gray-300 via-gray-400 to-slate-500',
        glow: 'shadow-gray-400/50',
        Icon: SilverTierIcon,
        bgGradient: 'from-gray-400/20 to-slate-600/20',
        borderColor: 'border-gray-400/40',
        accent: 'text-gray-300'
    },
    BASIC: {
        name: 'Basic',
        minScore: 0,
        color: 'from-slate-600 via-gray-700 to-zinc-800',
        glow: 'shadow-gray-600/30',
        Icon: BasicTierIcon,
        bgGradient: 'from-slate-600/20 to-zinc-800/20',
        borderColor: 'border-slate-500/40',
        accent: 'text-slate-400'
    },
};

export function getTierByScore(score: number) {
    if (score >= TIERS.PLATINUM.minScore) return TIERS.PLATINUM;
    if (score >= TIERS.GOLD.minScore) return TIERS.GOLD;
    if (score >= TIERS.ELITE.minScore) return TIERS.ELITE;
    if (score >= TIERS.SILVER.minScore) return TIERS.SILVER;
    return TIERS.BASIC;
}

// Role icon mapping
const ROLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
    'Builder': BuilderIcon,
    'Developer': DeveloperIcon,
    'Creator': CreatorIcon,
    'Leader': LeaderIcon,
    'Investor': InvestorIcon,
};

interface TierCardProps {
    profile: Profile | null;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
    basename?: string;
    topRoles?: string[];
    isOwn?: boolean;
    fid?: number;
    positiveVouches?: number;
    negativeVouches?: number;
    walletAddress?: string;
}

export function TierCard({
    profile,
    username,
    displayName,
    pfpUrl,
    basename,
    topRoles = [],
    isOwn = false,
    fid,
    positiveVouches = 0,
    negativeVouches = 0,
    walletAddress
}: TierCardProps) {
    const score = profile?.trust_score ?? 100;
    const tier = getTierByScore(score);
    const TierIcon = tier.Icon;

    const displayIdentity = basename || username || profile?.wallet_address?.slice(0, 8) + '...' || 'Unknown';
    const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : null;
    const actualFid = fid || profile?.farcaster_fid;

    return (
        <div className={`
            relative w-full max-w-md mx-auto aspect-[1.75/1] rounded-2xl overflow-hidden
            bg-gradient-to-br ${tier.color}
            shadow-2xl ${tier.glow}
            transform hover:scale-[1.01] transition-all duration-300
        `}>
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none">
                    <defs>
                        <pattern id="cardPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="1" fill="white" />
                        </pattern>
                    </defs>
                    <rect fill="url(#cardPattern)" width="100%" height="100%" />
                </svg>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60" />

            {/* Content */}
            <div className="relative h-full p-5 flex flex-col justify-between">
                {/* Top Section - User Info */}
                <div className="flex items-start justify-between">
                    {/* Left - PFP and Identity */}
                    <div className="flex items-start gap-4">
                        {/* PFP */}
                        <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm overflow-hidden border-2 border-white/40 shadow-lg">
                            {pfpUrl ? (
                                <img src={pfpUrl} alt={displayName || username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-2xl">
                                    {displayIdentity.slice(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Identity Info */}
                        <div className="flex flex-col">
                            <p className="font-bold text-white text-lg drop-shadow-md leading-tight">{displayName || username}</p>
                            <p className="text-white/70 text-sm">@{username}</p>

                            {/* Farcaster FID Badge */}
                            {actualFid && (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <FarcasterIcon className="w-3.5 h-3.5 text-white/60" />
                                    <span className="text-white/60 text-xs font-mono">FID #{actualFid}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Tier Badge */}
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                            <TierIcon className="w-5 h-5 text-white" />
                            <span className="text-white font-semibold text-sm">{tier.name}</span>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Score and Stats */}
                <div className="flex items-center justify-between">
                    {/* Trust Score */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white drop-shadow-lg">{score.toLocaleString()}</span>
                        <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Trust Score</span>
                    </div>

                    {/* Vouch Stats */}
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-lg font-bold text-green-300">{positiveVouches}</p>
                            <p className="text-[10px] text-white/50 uppercase">Vouches</p>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="text-center">
                            <p className="text-lg font-bold text-white/80">{negativeVouches || 0}</p>
                            <p className="text-[10px] text-white/50 uppercase">Reports</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Roles and Branding */}
                <div className="flex items-end justify-between">
                    {/* Top Roles with Icons */}
                    <div className="flex flex-wrap gap-1.5">
                        {topRoles.slice(0, 3).map((role, i) => {
                            const RoleIcon = ROLE_ICONS[role] || BuilderIcon;
                            return (
                                <span key={i} className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs text-white border border-white/20">
                                    <RoleIcon className="w-3.5 h-3.5" />
                                    {role}
                                </span>
                            );
                        })}
                    </div>

                    {/* BaseProof Identity + Wallet */}
                    <div className="text-right flex flex-col items-end gap-1">
                        {shortAddress && (
                            <p className="text-white/60 text-[10px] font-mono">{shortAddress}</p>
                        )}
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">BaseProof Identity</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export tier list for onboarding
export const TIER_LIST = [
    { name: 'Platinum', minScore: 8000, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', Icon: PlatinumTierIcon },
    { name: 'Gold', minScore: 5000, color: 'text-amber-400', bgColor: 'bg-amber-500/20', Icon: GoldTierIcon },
    { name: 'Elite', minScore: 2500, color: 'text-purple-400', bgColor: 'bg-purple-500/20', Icon: EliteTierIcon },
    { name: 'Silver', minScore: 1000, color: 'text-gray-300', bgColor: 'bg-gray-500/20', Icon: SilverTierIcon },
    { name: 'Basic', minScore: 0, color: 'text-slate-400', bgColor: 'bg-slate-500/20', Icon: BasicTierIcon },
];
