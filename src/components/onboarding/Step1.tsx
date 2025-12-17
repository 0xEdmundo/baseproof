'use client';

export function Step1() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-slide-up">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-base-blue to-base-blue-light flex items-center justify-center mb-8 shadow-2xl shadow-base-blue/30">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">
                Not All Votes Are <span className="gradient-text">Equal</span>
            </h2>

            {/* Description */}
            <p className="text-base-gray-400 text-lg leading-relaxed mb-8">
                In BaseProof, your influence is weighted by your Trust Score.
                Users with higher reputation carry more weight when vouching for others.
            </p>

            {/* Visual Example */}
            <div className="w-full space-y-4">
                <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                👑
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Legend (8,000+ score)</p>
                                <p className="text-xs text-base-gray-400">High influence vouch</p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-green-500">+80 pts</span>
                    </div>
                    <div className="h-2 bg-base-gray-200 dark:bg-base-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                    </div>
                </div>

                <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-sm">
                                🌱
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">Newcomer (100 score)</p>
                                <p className="text-xs text-base-gray-400">Standard vouch</p>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-green-500">+10 pts</span>
                    </div>
                    <div className="h-2 bg-base-gray-200 dark:bg-base-gray-800 rounded-full overflow-hidden">
                        <div className="h-full w-1/5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
