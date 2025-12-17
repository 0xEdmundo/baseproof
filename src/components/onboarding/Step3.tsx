'use client';

import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownLink, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';

export function Step3() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-slide-up">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/30">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">
                Earn <span className="gradient-text">Builder Points</span>
            </h2>

            {/* Description */}
            <p className="text-base-gray-400 text-lg leading-relaxed mb-8">
                Every vouch you give and receive earns you Builder Points.
                Grow your reputation score and unlock rewards in the Base ecosystem.
            </p>

            {/* Points breakdown */}
            <div className="w-full grid grid-cols-2 gap-4 mb-8">
                <div className="glass-card rounded-xl p-4">
                    <div className="text-3xl font-bold text-base-blue mb-1">+10</div>
                    <p className="text-sm text-base-gray-400">Give a Vouch</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-500 mb-1">+25</div>
                    <p className="text-sm text-base-gray-400">Receive a Vouch</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                    <div className="text-3xl font-bold text-amber-500 mb-1">+50</div>
                    <p className="text-sm text-base-gray-400">Weekly Streak</p>
                </div>
                <div className="glass-card rounded-xl p-4">
                    <div className="text-3xl font-bold text-purple-500 mb-1">+100</div>
                    <p className="text-sm text-base-gray-400">Top Builder</p>
                </div>
            </div>

            {/* Wallet Connect */}
            <div className="w-full">
                <p className="text-sm text-base-gray-400 mb-4">Connect your wallet to get started</p>
                <Wallet>
                    <ConnectWallet className="w-full">
                        <Avatar className="h-6 w-6" />
                        <Name />
                    </ConnectWallet>
                    <WalletDropdown>
                        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                            <Avatar />
                            <Name />
                            <Address />
                        </Identity>
                        <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
                            Wallet
                        </WalletDropdownLink>
                        <WalletDropdownDisconnect />
                    </WalletDropdown>
                </Wallet>
            </div>
        </div>
    );
}
