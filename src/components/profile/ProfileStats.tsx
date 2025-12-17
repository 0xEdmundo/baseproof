'use client';

interface ProfileStatsProps {
    neynarScore: number;
    builderScore: number;
    creatorScore: number;
    positiveVouches: number;
    negativeVouches: number;
    totalScore: number;
}

export function ProfileStats({
    neynarScore,
    builderScore,
    creatorScore,
    positiveVouches,
    negativeVouches,
    totalScore,
}: ProfileStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            {/* Neynar Score */}
            <div className="bg-base-gray-700/50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-purple-400 text-lg">N</span>
                </div>
                <p className="text-xl font-bold text-white">{neynarScore}</p>
                <p className="text-xs text-base-gray-500">Neynar</p>
            </div>

            {/* Builder Score */}
            <div className="bg-base-gray-700/50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-lg">🛠️</span>
                </div>
                <p className="text-xl font-bold text-white">{builderScore}</p>
                <p className="text-xs text-base-gray-500">Builder</p>
            </div>

            {/* Creator Score */}
            <div className="bg-base-gray-700/50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-lg">🎨</span>
                </div>
                <p className="text-xl font-bold text-white">{creatorScore}</p>
                <p className="text-xs text-base-gray-500">Creator</p>
            </div>

            {/* BaseProof Score (full width) */}
            <div className="col-span-3 bg-gradient-to-r from-base-blue/20 to-purple-600/20 border border-base-blue/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-base-gray-400">BaseProof Score</p>
                        <p className="text-3xl font-bold text-white">{totalScore.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-400">+{positiveVouches}</p>
                            <p className="text-xs text-base-gray-500">Positive</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-400">-{negativeVouches}</p>
                            <p className="text-xs text-base-gray-500">Negative</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
