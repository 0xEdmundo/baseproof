'use client';

export function Step2() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-slide-up">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">
                <span className="gradient-text">Vouch</span> for Each Other
            </h2>

            {/* Description */}
            <p className="text-base-gray-400 text-lg leading-relaxed mb-8">
                Use the Ethereum Attestation Service (EAS) to create cryptographic vouches
                for people you trust. Each vouch is a signed attestation stored permanently on Base.
            </p>

            {/* How it works */}
            <div className="w-full space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
                    <div className="w-8 h-8 rounded-full bg-base-blue text-white font-bold flex items-center justify-center text-sm">
                        1
                    </div>
                    <p className="text-left text-sm">
                        <span className="font-semibold">Connect your wallet</span> and verify your identity
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
                    <div className="w-8 h-8 rounded-full bg-base-blue text-white font-bold flex items-center justify-center text-sm">
                        2
                    </div>
                    <p className="text-left text-sm">
                        <span className="font-semibold">Search for a user</span> by wallet, Basename, or Farcaster
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
                    <div className="w-8 h-8 rounded-full bg-base-blue text-white font-bold flex items-center justify-center text-sm">
                        3
                    </div>
                    <p className="text-left text-sm">
                        <span className="font-semibold">Create an attestation</span> vouching for their skill or reliability
                    </p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center text-sm">
                        ✓
                    </div>
                    <p className="text-left text-sm">
                        <span className="font-semibold">Vouch recorded on-chain</span> forever via EAS
                    </p>
                </div>
            </div>
        </div>
    );
}
