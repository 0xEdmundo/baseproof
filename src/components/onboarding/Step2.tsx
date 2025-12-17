'use client';

import { ROLE_LIST } from '@/lib/config';

export function Step2() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-slide-up">
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/30">
                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold mb-4">
                Tags Define Your <span className="gradient-text">Craft</span>
            </h2>

            {/* Description */}
            <p className="text-base-gray-400 text-lg leading-relaxed mb-8">
                When vouching, you select roles that describe the recipient's skills.
                These onchain tags build a verified professional identity.
            </p>

            {/* Role Tags */}
            <div className="w-full grid grid-cols-2 gap-3">
                {ROLE_LIST.map((role) => (
                    <div
                        key={role.id}
                        className="flex items-center gap-3 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-base-blue transition-colors cursor-pointer"
                    >
                        <span className="text-2xl">{role.emoji}</span>
                        <div className="text-left">
                            <p className="font-semibold">{role.name}</p>
                            <p className="text-xs text-base-gray-400">
                                {role.id === 0 && 'Ships products'}
                                {role.id === 1 && 'Creates content'}
                                {role.id === 2 && 'Writes code'}
                                {role.id === 3 && 'Leads communities'}
                                {role.id === 4 && 'Funds projects'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Note */}
            <div className="mt-6 p-4 rounded-xl bg-base-blue/10 border border-base-blue/20">
                <p className="text-sm text-base-blue">
                    💡 One vouch can assign multiple roles. Your profile aggregates all roles you've received.
                </p>
            </div>
        </div>
    );
}
