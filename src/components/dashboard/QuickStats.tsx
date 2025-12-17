'use client';

export function QuickStats() {
    // Mock stats - will be replaced with real data
    const stats = [
        { label: 'Total Vouches', value: '12,847', change: '+234 today', icon: '🤝', color: 'from-green-500 to-emerald-600' },
        { label: 'Active Users', value: '3,291', change: '+89 today', icon: '👥', color: 'from-base-blue to-blue-600' },
        { label: 'Your Rank', value: '#142', change: '↑ 12', icon: '📈', color: 'from-amber-500 to-orange-600' },
        { label: 'Your Score', value: '2,450', change: '+45 today', icon: '⭐', color: 'from-purple-500 to-pink-600' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="relative overflow-hidden rounded-xl bg-base-gray-800/50 border border-base-gray-700/50 p-4"
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />

                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className="text-xs text-green-400 font-medium">{stat.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-base-gray-400 mt-1">{stat.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
