'use client';

export function Step3() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-slide-up">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center mb-8 shadow-2xl shadow-green-500/30">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">
                The Wall of <span className="gradient-text">Trust</span>
            </h2>

            {/* Description */}
            <p className="text-base-gray-400 text-lg leading-relaxed mb-8">
                Every vouch is public and transparent. View the complete history
                of who vouched for whom, with their comments preserved forever onchain.
            </p>

            {/* Sample Vouches */}
            <div className="w-full space-y-3">
                {/* Sample Positive Vouch */}
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-base-blue to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                            AB
                        </div>
                        <div>
                            <p className="font-semibold text-sm">alice.base</p>
                            <p className="text-xs text-base-gray-400">2 days ago</p>
                        </div>
                        <span className="ml-auto text-green-500 font-bold">+25 pts</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                        <span className="px-2 py-0.5 text-xs rounded-full bg-white dark:bg-base-gray-800 border">🛠️ Builder</span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-white dark:bg-base-gray-800 border">💻 Developer</span>
                    </div>
                    <p className="text-sm text-base-gray-600 dark:text-base-gray-300">
                        "Incredible work on the DEX integration. Fast, reliable, and always delivers."
                    </p>
                </div>

                {/* Sample Negative Vouch */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-left opacity-75">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-xs">
                            XY
                        </div>
                        <div>
                            <p className="font-semibold text-sm">anon.eth</p>
                            <p className="text-xs text-base-gray-400">5 days ago</p>
                        </div>
                        <span className="ml-auto text-red-500 font-bold">-15 pts</span>
                    </div>
                    <p className="text-sm text-base-gray-600 dark:text-base-gray-300">
                        "Missed deadline on project delivery."
                    </p>
                </div>
            </div>

            <p className="mt-6 text-sm text-base-gray-400">
                📜 All comments are 280 characters max, stored permanently via EAS.
            </p>
        </div>
    );
}
