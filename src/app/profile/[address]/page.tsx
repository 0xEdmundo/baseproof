'use client';

import { useParams } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { VouchFeed } from '@/components/profile/VouchFeed';
import { SearchBar } from '@/components/search/SearchBar';
import Link from 'next/link';

export default function ProfilePage() {
    const params = useParams();
    const address = params.address as string;

    const { profile, vouches, isLoading, error } = useProfile(address);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="w-full px-6 py-4 flex items-center justify-between border-b border-[var(--border)]">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-base-blue flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold gradient-text">BaseProof</h1>
                </Link>

                <SearchBar />
            </header>

            {/* Main Content */}
            <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
                {error ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Error Loading Profile</h2>
                        <p className="text-base-gray-400">{error.message}</p>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fade-in">
                        {/* Profile Header / SBT Card */}
                        <ProfileHeader profile={profile ?? null} isLoading={isLoading} />

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                Vouch Positive
                            </button>
                            <button className="btn-secondary flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                </svg>
                                Report
                            </button>
                        </div>

                        {/* Vouch Feed */}
                        <VouchFeed vouches={vouches} isLoading={isLoading} />
                    </div>
                )}
            </main>
        </div>
    );
}
