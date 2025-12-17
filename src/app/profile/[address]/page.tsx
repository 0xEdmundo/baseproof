'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { Wallet, ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { SearchBar } from '@/components/search/SearchBar';
import { TierCard } from '@/components/profile/TierCard';
import { VouchList } from '@/components/profile/VouchList';
import { SocialLinks } from '@/components/profile/SocialLinks';
import { ShareButton } from '@/components/profile/ShareButton';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
    const params = useParams();
    const profileAddress = params.address as string;
    const { address: connectedAddress, isConnected } = useAccount();
    const isOwnProfile = isConnected && connectedAddress?.toLowerCase() === profileAddress?.toLowerCase();

    const { profile, vouches, isLoading } = useProfile(profileAddress);
    const [vouchFilter, setVouchFilter] = useState<'all' | 'positive' | 'negative'>('all');
    const [pageSize, setPageSize] = useState(10);

    // Mock data - will be replaced with real API calls
    const mockUserData = {
        fid: 12345,
        username: 'builder.base',
        displayName: 'Builder',
        pfpUrl: undefined as string | undefined,
        neynarScore: 85,
        talentBuilderScore: 72,
        talentCreatorScore: 45,
        basename: 'builder.base',
        xUsername: 'builderx',
        githubUsername: 'builder-dev',
        farcasterUrl: 'https://warpcast.com/builder',
        baseappUrl: 'https://base.org/name/builder',
    };

    const filteredVouches = vouches.filter(v => {
        if (vouchFilter === 'positive') return v.positive;
        if (vouchFilter === 'negative') return !v.positive;
        return true;
    });

    const positiveCount = vouches.filter(v => v.positive).length;
    const negativeCount = vouches.filter(v => !v.positive).length;

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-gray-900 via-base-gray-900 to-black pb-20">
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

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Profile Header with Card and Info */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Tier Card */}
                    <div>
                        <TierCard
                            profile={profile ?? null}
                            username={mockUserData.username}
                            displayName={mockUserData.displayName}
                            pfpUrl={mockUserData.pfpUrl}
                            basename={mockUserData.basename}
                            topRoles={['Builder', 'Developer']}
                            isOwn={isOwnProfile}
                        />

                        {/* Mint Button */}
                        {isOwnProfile && (
                            <button className="w-full mt-4 py-3 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-base-blue/25">
                                Mint NFT Card
                            </button>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-6">
                        {/* User Identity */}
                        <div className="bg-base-gray-800/50 rounded-2xl border border-base-gray-700/50 p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {mockUserData.displayName.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">{mockUserData.displayName}</h1>
                                    <p className="text-base-gray-400">@{mockUserData.username}</p>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <ProfileStats
                                neynarScore={mockUserData.neynarScore}
                                builderScore={mockUserData.talentBuilderScore}
                                creatorScore={mockUserData.talentCreatorScore}
                                positiveVouches={positiveCount}
                                negativeVouches={negativeCount}
                                totalScore={profile?.trust_score ?? 100}
                            />
                        </div>

                        {/* Social Links */}
                        <SocialLinks
                            farcasterUsername={mockUserData.username}
                            baseappUsername={mockUserData.basename}
                            xUsername={mockUserData.xUsername}
                            githubUsername={mockUserData.githubUsername}
                        />

                        {/* Share Button */}
                        {isOwnProfile && (
                            <ShareButton
                                profileUrl={`https://baseproof.vercel.app/profile/${profileAddress}`}
                                username={mockUserData.username}
                            />
                        )}
                    </div>
                </div>

                {/* Vouch Actions (for visitors) */}
                {!isOwnProfile && isConnected && (
                    <div className="flex gap-4 mb-8">
                        <button className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            Vouch Positive
                        </button>
                        <button className="flex-1 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400 font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                            </svg>
                            Report Issue
                        </button>
                    </div>
                )}

                {/* Vouches Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Vouches & Feedback</h2>

                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setVouchFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${vouchFilter === 'all' ? 'bg-base-blue text-white' : 'bg-base-gray-800 text-base-gray-400 hover:text-white'
                                    }`}
                            >
                                All ({vouches.length})
                            </button>
                            <button
                                onClick={() => setVouchFilter('positive')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${vouchFilter === 'positive' ? 'bg-green-600 text-white' : 'bg-base-gray-800 text-base-gray-400 hover:text-white'
                                    }`}
                            >
                                ✓ ({positiveCount})
                            </button>
                            <button
                                onClick={() => setVouchFilter('negative')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${vouchFilter === 'negative' ? 'bg-red-600 text-white' : 'bg-base-gray-800 text-base-gray-400 hover:text-white'
                                    }`}
                            >
                                ✗ ({negativeCount})
                            </button>
                        </div>
                    </div>

                    {/* Vouch List */}
                    <VouchList vouches={filteredVouches} pageSize={pageSize} isLoading={isLoading} />

                    {/* Page Size Selector */}
                    <div className="flex justify-center gap-2 mt-6">
                        {[5, 10, 25, 50, 100].map((size) => (
                            <button
                                key={size}
                                onClick={() => setPageSize(size)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${pageSize === size ? 'bg-base-blue text-white' : 'bg-base-gray-800 text-base-gray-400 hover:text-white'
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
