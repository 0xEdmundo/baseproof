'use client';

import { useSearch, formatMatchType } from '@/hooks/useSearch';
import { useRouter } from 'next/navigation';
import { getTrustTier, formatTrustScore } from '@/hooks/useProfile';
import sdk from '@farcaster/frame-sdk';

export function SearchBar() {
    const router = useRouter();
    const { query, setQuery, results, isLoading, clearSearch } = useSearch();

    const handleSelect = (result: { wallet_address: string; fid?: number; isRegistered?: boolean }) => {
        if (result.isRegistered && result.wallet_address) {
            // User is registered - go to their profile
            router.push(`/profile/${result.wallet_address}`);
            clearSearch();
        } else if (result.wallet_address) {
            // Not registered but has wallet - still try to show profile
            router.push(`/profile/${result.wallet_address}`);
            clearSearch();
        }
    };

    const handleInvite = async (result: { farcaster_username?: string | null; fid?: number }) => {
        const username = result.farcaster_username || '';
        const appUrl = 'https://baseproof.app'; // Will be updated with actual domain

        const castText = `🎯 @${username} seni BaseProof'a davet ediyorum! 

Onchain itibarını oluştur, güvenilir bağlantılar kur ve Web3 kimliğini güçlendir. 

Hadi katıl! 👇`;

        try {
            // Use Farcaster SDK to compose cast
            await sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${encodeURIComponent(appUrl)}`);
        } catch (e) {
            // Fallback to opening Warpcast in new tab
            window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(castText)}&embeds[]=${encodeURIComponent(appUrl)}`, '_blank');
        }
        clearSearch();
    };

    return (
        <div className="relative w-full max-w-md">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                        className={`w-5 h-5 ${isLoading ? 'text-base-blue animate-pulse' : 'text-base-gray-400'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by wallet, Basename, or Farcaster..."
                    className="w-full pl-12 pr-10 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-base-blue focus:border-transparent transition-all"
                />

                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-gray-400 hover:text-base-gray-600"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {query && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl overflow-hidden">
                    {results.map((result, index) => {
                        const tier = getTrustTier(result.trust_score);

                        return (
                            <div
                                key={result.wallet_address || `fid-${result.fid}` || index}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-gray-50 dark:hover:bg-base-gray-800 transition-colors"
                            >
                                {/* Clickable User Info */}
                                <button
                                    onClick={() => handleSelect(result)}
                                    className="flex items-center gap-3 flex-1 text-left"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                                        {result.pfp_url ? (
                                            <img src={result.pfp_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            (result.farcaster_username || result.wallet_address || '?').slice(0, 2).toUpperCase()
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold truncate">
                                                {result.farcaster_username || result.basename || `${result.wallet_address?.slice(0, 8)}...`}
                                            </p>
                                            <span className="text-xs">{tier.emoji}</span>
                                            {result.isRegistered && (
                                                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-base-gray-400">
                                            {result.fid ? `FID #${result.fid}` : formatMatchType(result.match_type)} • Score: {formatTrustScore(result.trust_score)}
                                        </p>
                                    </div>
                                </button>

                                {/* Invite Button for non-registered users */}
                                {!result.isRegistered && result.farcaster_username && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleInvite(result);
                                        }}
                                        className="flex-shrink-0 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs font-medium rounded-lg transition-colors"
                                    >
                                        Invite
                                    </button>
                                )}

                                {/* Arrow for registered users */}
                                {result.isRegistered && (
                                    <svg className="w-5 h-5 text-base-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* No Results */}
            {query && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute z-50 w-full mt-2 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-xl p-4 text-center">
                    <p className="text-base-gray-400 text-sm">No users found for "{query}"</p>
                </div>
            )}
        </div>
    );
}
