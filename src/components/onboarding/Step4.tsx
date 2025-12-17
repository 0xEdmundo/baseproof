'use client';

import { PRICING } from '@/lib/config';

export function Step4() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-slide-up">
            {/* Icon - Passport Style */}
            <div className="relative mb-8">
                <div className="w-32 h-40 rounded-xl bg-gradient-to-br from-base-blue via-base-blue-dark to-purple-900 flex flex-col items-center justify-center text-white shadow-2xl shadow-base-blue/30 border-4 border-white/20">
                    {/* Passport Header */}
                    <div className="absolute top-2 left-0 right-0 text-center">
                        <p className="text-[8px] font-bold tracking-widest opacity-60">BASE NETWORK</p>
                    </div>

                    {/* Chip */}
                    <div className="w-8 h-6 rounded bg-amber-400/80 mb-2 border border-amber-500" />

                    {/* Avatar Placeholder */}
                    <div className="w-12 h-12 rounded-full bg-white/20 mb-2 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>

                    {/* Passport Footer */}
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                        <p className="text-[6px] font-mono tracking-wider opacity-40">BASEPROOF SBT</p>
                    </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4 text-white">
                Your Onchain <span className="bg-gradient-to-r from-base-blue to-purple-500 bg-clip-text text-transparent">Passport</span>
            </h2>

            {/* Description */}
            <p className="text-base-gray-400 text-lg leading-relaxed mb-6">
                Mint your BaseProof Identity as a Soulbound Token.
                This dynamic NFT updates with your Trust Score and roles.
            </p>

            {/* Pricing Info */}
            <div className="w-full p-6 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="font-semibold text-white">Identity Mint</p>
                        <p className="text-sm text-base-gray-400">One-time SBT creation</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-base-blue">${PRICING.MINT_SBT_USD.toFixed(2)}</p>
                        <p className="text-xs text-base-gray-500">+ gas</p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-base-gray-700/50">
                    <div>
                        <p className="font-semibold text-white">Profile Refresh</p>
                        <p className="text-sm text-base-gray-400">Update SBT metadata</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-base-gray-500">${PRICING.REFRESH_PROFILE_USD.toFixed(2)}</p>
                        <p className="text-xs text-base-gray-500">+ gas</p>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="w-full grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-left">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-base-gray-300">Non-transferable</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-base-gray-300">Dynamic metadata</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-base-gray-300">Onchain verified</span>
                </div>
                <div className="flex items-center gap-2 text-left">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-base-gray-300">Base native</span>
                </div>
            </div>

            {/* Note - No mint button here, just info */}
            <p className="text-sm text-base-gray-500 italic">
                You can mint your identity card from your profile after entering the dashboard.
            </p>
        </div>
    );
}
