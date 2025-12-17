'use client';

import { VouchRecord } from '@/lib/supabase';
import { ROLE_LIST } from '@/lib/config';
import { Name, Avatar, Identity } from '@coinbase/onchainkit/identity';

interface VouchCardProps {
    vouch: VouchRecord;
}

export function VouchCard({ vouch }: VouchCardProps) {
    const isPositive = vouch.positive;

    // Get role info
    const roles = vouch.roles.map(roleName => {
        const role = ROLE_LIST.find(r => r.name.toLowerCase() === roleName.toLowerCase());
        return role || { name: roleName, emoji: '❓' };
    });

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className={`
      relative rounded-xl border p-4 transition-all duration-200 hover:shadow-lg
      ${isPositive
                ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
            }
    `}>
            {/* Type Indicator */}
            <div className={`
        absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
        ${isPositive ? 'bg-green-500' : 'bg-red-500'}
      `}>
                {isPositive ? '✓' : '✗'}
            </div>

            {/* Header: Sender Info */}
            <div className="flex items-center gap-3 mb-3">
                <Identity
                    address={vouch.sender_address as `0x${string}`}
                    className="flex items-center gap-2"
                >
                    <Avatar className="w-10 h-10 rounded-full" />
                    <div>
                        <Name className="font-semibold text-sm" />
                        <p className="text-xs text-base-gray-400">
                            {formatDate(vouch.created_at)}
                        </p>
                    </div>
                </Identity>
            </div>

            {/* Role Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
                {roles.map((role, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white dark:bg-base-gray-800 rounded-full text-xs font-medium border border-base-gray-200 dark:border-base-gray-700"
                    >
                        <span>{role.emoji}</span>
                        <span>{role.name}</span>
                    </span>
                ))}
            </div>

            {/* Comment */}
            {vouch.comment && (
                <p className="text-sm text-base-gray-700 dark:text-base-gray-300 leading-relaxed">
                    "{vouch.comment}"
                </p>
            )}

            {/* Weighted Points */}
            <div className="mt-3 pt-3 border-t border-base-gray-200 dark:border-base-gray-700">
                <div className="flex items-center justify-between text-xs text-base-gray-400">
                    <span>Weighted Impact</span>
                    <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}{vouch.weighted_points} pts
                    </span>
                </div>
            </div>
        </div>
    );
}
