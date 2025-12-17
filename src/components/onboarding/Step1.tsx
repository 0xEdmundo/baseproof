'use client';

export function Step1() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-slide-up">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-base-blue to-base-blue-light flex items-center justify-center mb-8 shadow-2xl shadow-base-blue/30">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">
                <span className="gradient-text">Onchain Reputation</span>
                <br />
                <span>Matters on Base</span>
            </h2>

            {/* Description */}
            <p className="text-base-gray-400 text-lg leading-relaxed mb-8">
                In the decentralized world, your reputation is your most valuable asset.
                BaseProof creates a permanent, verifiable record of your skills and
                trustworthiness directly on the Base network.
            </p>

            {/* Features */}
            <div className="w-full space-y-4">
                <div className="glass-card rounded-xl p-4 flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-lg bg-base-blue/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-base-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Immutable & Trustless</h3>
                        <p className="text-sm text-base-gray-400">Your reputation lives on-chain, owned by you forever.</p>
                    </div>
                </div>

                <div className="glass-card rounded-xl p-4 flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-lg bg-base-blue/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-base-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-1">Fast & Low-Cost</h3>
                        <p className="text-sm text-base-gray-400">Built on Base for sub-cent transactions and instant finality.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
