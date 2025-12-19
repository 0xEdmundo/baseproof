'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { TierCard, getTierByScore } from '@/components/profile/TierCard';
import { VouchList } from '@/components/profile/VouchList';
import { useProfile } from '@/hooks/useProfile';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import {
    FarcasterIcon,
    TalentIcon,
    XIcon,
    GitHubIcon,
    BaseIcon,
    NeynarIcon,
    BuilderIcon,
    CreatorIcon,
    MintIcon,
    ShareIcon,
    DownloadIcon,
    EditIcon,
    VouchPositiveIcon,
    VouchNegativeIcon,
    VouchesIcon
} from '@/components/icons';

export default function ProfilePage() {
    const params = useParams();
    const profileAddress = params.address as string;
    const { user, isAuthenticated, canVouch, useVouch } = useAuth();
    const isOwnProfile = isAuthenticated && (
        user?.wallet_address?.toLowerCase() === profileAddress?.toLowerCase() ||
        user?.fid?.toString() === profileAddress
    );

    const { profile, vouches, isLoading } = useProfile(profileAddress);
    const [savedProfile, setSavedProfile] = useState<any>(null);

    // Load saved profile
    useEffect(() => {
        if (profileAddress) {
            const saved = localStorage.getItem(`baseproof_profile_${profileAddress}`) ||
                localStorage.getItem(`baseproof_profile_fid_${profileAddress}`);
            if (saved) setSavedProfile(JSON.parse(saved));
        }
    }, [profileAddress]);

    const displayData = {
        displayName: savedProfile?.displayName || user?.displayName || profileAddress?.slice(0, 8),
        username: savedProfile?.username || user?.username || profileAddress?.slice(0, 8),
        pfpUrl: savedProfile?.pfpUrl || user?.pfpUrl,
        bio: savedProfile?.bio || '',
        trustScore: profile?.trust_score || user?.trustScore || 100,
    };

    const tier = getTierByScore(displayData.trustScore);
    const vouchInfo = canVouch();

    const handleVouch = (positive: boolean) => {
        if (!vouchInfo.allowed) {
            alert(`Vouch limit reached! Daily: ${vouchInfo.dailyRemaining}/5, Weekly: ${vouchInfo.weeklyRemaining}/35`);
            return;
        }
        useVouch();
        // TODO: Call contract/API
    };

    return (
        <div className="min-h-screen bg-base-gray-900 pb-24 md:pb-8">
            <Header />

            <main className="max-w-5xl mx-auto px-4 py-6">
                {/* Profile Layout: 2 columns */}
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* LEFT: Card + Social Links + Stats */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Tier Card */}
                        <TierCard
                            profile={profile ?? null}
                            username={displayData.username}
                            displayName={displayData.displayName}
                            pfpUrl={displayData.pfpUrl}
                            topRoles={['Builder', 'Developer']}
                            isOwn={isOwnProfile}
                            fid={user?.fid || savedProfile?.fid}
                            positiveVouches={vouches.filter(v => v.positive).length}
                            negativeVouches={vouches.filter(v => !v.positive).length}
                            walletAddress={profile?.wallet_address || savedProfile?.walletAddress}
                        />

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2">
                            {savedProfile?.farcasterUsername && (
                                <a href={savedProfile.farcasterUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3.5 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400 text-sm hover:bg-purple-500/20 transition-all hover:scale-105">
                                    <FarcasterIcon className="w-4 h-4" />
                                    <span className="font-medium">@{savedProfile.farcasterUsername}</span>
                                </a>
                            )}
                            {savedProfile?.baseappUsername && (
                                <a href={savedProfile.baseappUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3.5 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 text-sm hover:bg-blue-500/20 transition-all hover:scale-105">
                                    <BaseIcon className="w-4 h-4" />
                                    <span className="font-medium">{savedProfile.baseappUsername}</span>
                                </a>
                            )}
                            {savedProfile?.xUsername && (
                                <a href={savedProfile.xUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3.5 py-2 bg-white/5 border border-white/20 rounded-xl text-white text-sm hover:bg-white/10 transition-all hover:scale-105">
                                    <XIcon className="w-4 h-4" />
                                    <span className="font-medium">@{savedProfile.xUsername}</span>
                                </a>
                            )}
                            {savedProfile?.githubUsername && (
                                <a href={savedProfile.githubUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3.5 py-2 bg-gray-500/10 border border-gray-500/30 rounded-xl text-gray-300 text-sm hover:bg-gray-500/20 transition-all hover:scale-105">
                                    <GitHubIcon className="w-4 h-4" />
                                    <span className="font-medium">@{savedProfile.githubUsername}</span>
                                </a>
                            )}
                            {savedProfile?.talentUsername && (
                                <a href={savedProfile.talentUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm hover:bg-emerald-500/20 transition-all hover:scale-105">
                                    <TalentIcon className="w-4 h-4" />
                                    <span className="font-medium">@{savedProfile.talentUsername}</span>
                                </a>
                            )}
                        </div>

                        {/* Premium Score Cards */}
                        <div className="grid grid-cols-4 gap-3">
                            {/* Neynar Score */}
                            <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 mb-2 mx-auto">
                                        <NeynarIcon className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-purple-400 text-center">
                                        {profile?.neynar_score ? Math.round(profile.neynar_score * 100) : savedProfile?.neynarScore ? Math.round(savedProfile.neynarScore * 100) : '--'}
                                    </p>
                                    <p className="text-[11px] text-purple-300/60 text-center mt-1 font-medium">Neynar</p>
                                </div>
                            </div>

                            {/* Builder Score */}
                            <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 mb-2 mx-auto">
                                        <BuilderIcon className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-blue-400 text-center">
                                        {profile?.builder_score ?? savedProfile?.builderScore ?? '--'}
                                    </p>
                                    <p className="text-[11px] text-blue-300/60 text-center mt-1 font-medium">Builder</p>
                                </div>
                            </div>

                            {/* Creator Score */}
                            <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-600/5 border border-pink-500/20 hover:border-pink-500/40 transition-all hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-pink-500/20 mb-2 mx-auto">
                                        <CreatorIcon className="w-4 h-4 text-pink-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-pink-400 text-center">
                                        {profile?.creator_score ?? savedProfile?.creatorScore ?? '--'}
                                    </p>
                                    <p className="text-[11px] text-pink-300/60 text-center mt-1 font-medium">Creator</p>
                                </div>
                            </div>

                            {/* Positive Vouches */}
                            <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/5 border border-green-500/20 hover:border-green-500/40 transition-all hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20 mb-2 mx-auto">
                                        <VouchesIcon className="w-4 h-4 text-green-400" />
                                    </div>
                                    <p className="text-2xl font-bold text-green-400 text-center">{vouches.filter(v => v.positive).length}</p>
                                    <p className="text-[11px] text-green-300/60 text-center mt-1 font-medium">Vouches+</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="lg:col-span-2 space-y-3">
                        {isOwnProfile ? (
                            <>
                                {/* Mint Button */}
                                {/* Mint Button */}
                                <button className="group w-full py-3.5 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-base-blue/25 hover:shadow-base-blue/40 hover:scale-[1.02] flex items-center justify-center gap-2.5">
                                    <MintIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Mint NFT Card</span>
                                </button>

                                {/* Share Button */}
                                <button
                                    onClick={() => {
                                        const url = `https://warpcast.com/~/compose?text=Check+out+my+BaseProof+profile!+Trust+Score:+${displayData.trustScore}&embeds[]=${encodeURIComponent(window.location.href)}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="group w-full py-3.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-400 font-semibold rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5"
                                >
                                    <ShareIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Share on Farcaster</span>
                                </button>

                                {/* Download PNG */}
                                <button className="group w-full py-3.5 bg-base-gray-800 hover:bg-base-gray-700 border border-base-gray-600 text-white font-medium rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5">
                                    <DownloadIcon className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                                    <span>Download Card PNG</span>
                                </button>

                                {/* Edit Profile */}
                                <Link href="/profile/edit" className="group w-full py-3.5 bg-base-gray-800 hover:bg-base-gray-700 border border-base-gray-600 text-white font-medium rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5">
                                    <EditIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Edit Profile</span>
                                </Link>

                                {/* Vouch Remaining */}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-base-gray-800/80 to-base-gray-800/40 border border-base-gray-700/50 backdrop-blur-sm">
                                    <p className="text-sm text-base-gray-300 mb-3 font-medium">Your Vouch Power</p>
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            <span className="text-base-gray-400">Today:</span>
                                            <span className="text-green-400 font-bold">{vouchInfo.dailyRemaining}/5</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                                            <span className="text-base-gray-400">Week:</span>
                                            <span className="text-purple-400 font-bold">{vouchInfo.weeklyRemaining}/35</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Vouch Buttons for visitors */}
                                <button
                                    onClick={() => handleVouch(true)}
                                    disabled={!vouchInfo.allowed}
                                    className="group w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-600/25 hover:shadow-green-600/40 hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2.5"
                                >
                                    <VouchPositiveIcon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
                                    <span>Vouch Positive</span>
                                </button>
                                <button
                                    onClick={() => handleVouch(false)}
                                    disabled={!vouchInfo.allowed}
                                    className="group w-full py-3.5 bg-red-600/20 hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/40 text-red-400 font-semibold rounded-xl transition-all hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2.5"
                                >
                                    <VouchNegativeIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Report Issue</span>
                                </button>

                                {!vouchInfo.allowed && (
                                    <p className="text-xs text-center text-base-gray-500 bg-base-gray-800/50 rounded-lg py-2 px-3">
                                        Vouch limit reached. Resets daily/weekly.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Vouches Section */}
                <section className="mt-8">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <VouchesIcon className="w-5 h-5 text-green-400" />
                        Vouches & Feedback
                    </h2>
                    <VouchList vouches={vouches} pageSize={10} isLoading={isLoading} />
                </section>
            </main>

            <MobileNav />
        </div>
    );
}
