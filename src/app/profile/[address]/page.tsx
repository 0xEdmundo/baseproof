'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { SearchBar } from '@/components/search/SearchBar';
import { TierCard, getTierByScore } from '@/components/profile/TierCard';
import { VouchList } from '@/components/profile/VouchList';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
    const params = useParams();
    const profileAddress = params.address as string;
    const { user, isAuthenticated, canVouch, useVouch } = useAuth();
    const isOwnProfile = isAuthenticated && (
        user?.custody_address?.toLowerCase() === profileAddress?.toLowerCase() ||
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
        <div className="min-h-screen bg-base-gray-900 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-gray-900/90 border-b border-base-gray-800">
                <div className="max-w-5xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span className="text-base font-bold text-white">BaseProof</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <SearchBar />
                        </div>
                    </div>
                </div>
            </header>

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
                        />

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2">
                            {savedProfile?.farcasterUsername && (
                                <a href={savedProfile.farcasterUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400 text-sm hover:bg-purple-500/20 transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.24 4H5.76A1.76 1.76 0 0 0 4 5.76v12.48A1.76 1.76 0 0 0 5.76 20h12.48A1.76 1.76 0 0 0 20 18.24V5.76A1.76 1.76 0 0 0 18.24 4Z" /></svg>
                                    @{savedProfile.farcasterUsername}
                                </a>
                            )}
                            {savedProfile?.baseappUsername && (
                                <a href={savedProfile.baseappUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm hover:bg-blue-500/20 transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
                                    {savedProfile.baseappUsername}
                                </a>
                            )}
                            {savedProfile?.xUsername && (
                                <a href={savedProfile.xUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    @{savedProfile.xUsername}
                                </a>
                            )}
                            {savedProfile?.githubUsername && (
                                <a href={savedProfile.githubUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-500/10 border border-gray-500/30 rounded-lg text-gray-300 text-sm hover:bg-gray-500/20 transition-colors">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                    @{savedProfile.githubUsername}
                                </a>
                            )}
                        </div>

                        {/* Scores Row */}
                        <div className="flex gap-3">
                            <div className="flex-1 p-3 rounded-lg bg-base-gray-800/50 border border-base-gray-700/30 text-center">
                                <p className="text-lg font-bold text-purple-400">85</p>
                                <p className="text-[10px] text-base-gray-500">Neynar</p>
                            </div>
                            <div className="flex-1 p-3 rounded-lg bg-base-gray-800/50 border border-base-gray-700/30 text-center">
                                <p className="text-lg font-bold text-blue-400">72</p>
                                <p className="text-[10px] text-base-gray-500">Builder</p>
                            </div>
                            <div className="flex-1 p-3 rounded-lg bg-base-gray-800/50 border border-base-gray-700/30 text-center">
                                <p className="text-lg font-bold text-pink-400">45</p>
                                <p className="text-[10px] text-base-gray-500">Creator</p>
                            </div>
                            <div className="flex-1 p-3 rounded-lg bg-base-gray-800/50 border border-base-gray-700/30 text-center">
                                <p className="text-lg font-bold text-green-400">{vouches.filter(v => v.positive).length}</p>
                                <p className="text-[10px] text-base-gray-500">Vouches+</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="lg:col-span-2 space-y-4">
                        {isOwnProfile ? (
                            <>
                                {/* Mint Button */}
                                <button className="w-full py-3 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 text-white font-semibold rounded-xl transition-all text-sm">
                                    🎴 Mint NFT Card
                                </button>

                                {/* Share Button */}
                                <button
                                    onClick={() => {
                                        const url = `https://warpcast.com/~/compose?text=Check+out+my+BaseProof+profile!+Trust+Score:+${displayData.trustScore}&embeds[]=${encodeURIComponent(window.location.href)}`;
                                        window.open(url, '_blank');
                                    }}
                                    className="w-full py-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/50 text-purple-400 font-semibold rounded-xl transition-all text-sm"
                                >
                                    📤 Share on Farcaster
                                </button>

                                {/* Download PNG */}
                                <button className="w-full py-3 bg-base-gray-800 hover:bg-base-gray-700 border border-base-gray-700 text-white font-medium rounded-xl transition-all text-sm">
                                    📥 Download Card PNG
                                </button>

                                {/* Edit Profile */}
                                <Link href="/profile/setup" className="block w-full py-3 bg-base-gray-800 hover:bg-base-gray-700 border border-base-gray-700 text-white font-medium rounded-xl transition-all text-sm text-center">
                                    ✏️ Edit Profile
                                </Link>

                                {/* Vouch Remaining */}
                                <div className="p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                                    <p className="text-sm text-base-gray-400 mb-2">Your Vouch Power</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white">Today: <span className="text-green-400">{vouchInfo.dailyRemaining}/5</span></span>
                                        <span className="text-white">Week: <span className="text-purple-400">{vouchInfo.weeklyRemaining}/35</span></span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Vouch Buttons for visitors */}
                                <button
                                    onClick={() => handleVouch(true)}
                                    disabled={!vouchInfo.allowed}
                                    className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                                >
                                    👍 Vouch Positive
                                </button>
                                <button
                                    onClick={() => handleVouch(false)}
                                    disabled={!vouchInfo.allowed}
                                    className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed border border-red-600/50 text-red-400 font-semibold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                                >
                                    👎 Report Issue
                                </button>

                                {!vouchInfo.allowed && (
                                    <p className="text-xs text-center text-base-gray-500">
                                        Vouch limit reached. Resets daily/weekly.
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Vouches Section */}
                <section className="mt-8">
                    <h2 className="text-lg font-bold text-white mb-4">Vouches & Feedback</h2>
                    <VouchList vouches={vouches} pageSize={10} isLoading={isLoading} />
                </section>
            </main>
        </div>
    );
}
