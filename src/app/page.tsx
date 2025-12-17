'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const FEATURES = [
    {
        icon: '⚖️',
        title: 'Weighted Influence',
        desc: 'Higher trust = stronger votes',
    },
    {
        icon: '🏷️',
        title: 'Role Tags',
        desc: 'Builder, Developer, Creator...',
    },
    {
        icon: '📜',
        title: 'Wall of Trust',
        desc: 'Transparent vouch history',
    },
    {
        icon: '🎴',
        title: 'NFT Identity',
        desc: 'Mint your soulbound card',
    },
    {
        icon: '📊',
        title: 'Vouch Limits',
        desc: '5/day, 35/week per user',
    },
    {
        icon: '🏆',
        title: 'Leaderboard',
        desc: 'Compete for top ranks',
    },
];

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-base-gray-900 flex flex-col">
            {/* Header */}
            <header className="px-4 py-3 border-b border-base-gray-800">
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="text-base font-bold text-white">BaseProof</span>
                    </div>
                    <Link href="/dashboard" className="text-base-gray-400 text-xs hover:text-white transition-colors">
                        Skip →
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center px-4 py-6 max-w-lg mx-auto w-full">
                {/* Hero */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Onchain <span className="text-transparent bg-clip-text bg-gradient-to-r from-base-blue to-purple-500">Reputation</span>
                    </h1>
                    <p className="text-base-gray-400 text-sm">Build trust through weighted vouching on Base</p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="p-3 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                            <span className="text-xl mb-1 block">{f.icon}</span>
                            <p className="text-white font-medium text-sm">{f.title}</p>
                            <p className="text-base-gray-500 text-xs mt-0.5">{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* How it Works */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-base-blue/10 to-purple-600/10 border border-base-blue/20 mb-6">
                    <h3 className="text-white font-semibold text-sm mb-2">How it Works</h3>
                    <ol className="space-y-1.5 text-xs text-base-gray-400">
                        <li className="flex gap-2">
                            <span className="text-base-blue font-bold">1.</span>
                            Sign in with Farcaster
                        </li>
                        <li className="flex gap-2">
                            <span className="text-base-blue font-bold">2.</span>
                            Complete your profile & add social links
                        </li>
                        <li className="flex gap-2">
                            <span className="text-base-blue font-bold">3.</span>
                            Give & receive vouches (5/day, 35/week)
                        </li>
                        <li className="flex gap-2">
                            <span className="text-base-blue font-bold">4.</span>
                            Climb the leaderboard & mint your NFT card
                        </li>
                    </ol>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/profile/setup')}
                        className="w-full py-3 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 text-white font-semibold rounded-xl transition-all text-sm"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full py-3 bg-base-gray-800 hover:bg-base-gray-700 border border-base-gray-700 text-white font-medium rounded-xl transition-all text-sm"
                    >
                        Explore Dashboard
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-4 py-3 border-t border-base-gray-800 text-center">
                <p className="text-base-gray-500 text-xs">Built on Base • Powered by EAS</p>
            </footer>
        </div>
    );
}
