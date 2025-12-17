'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VouchRecord } from '@/lib/supabase';
import { ROLE_LIST } from '@/lib/config';

interface VouchListProps {
    vouches: VouchRecord[];
    pageSize: number;
    isLoading?: boolean;
}

export function VouchList({ vouches, pageSize, isLoading }: VouchListProps) {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(vouches.length / pageSize);
    const startIndex = currentPage * pageSize;
    const paginatedVouches = vouches.slice(startIndex, startIndex + pageSize);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-base-gray-800/50 rounded-xl h-32" />
                ))}
            </div>
        );
    }

    if (vouches.length === 0) {
        return (
            <div className="text-center py-12 bg-base-gray-800/30 rounded-2xl border border-base-gray-700/50">
                <div className="text-4xl mb-3">🤝</div>
                <p className="text-white font-medium">No vouches yet</p>
                <p className="text-base-gray-500 text-sm mt-1">Be the first to vouch for this user!</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div>
            {/* Vouch Grid - 2 columns on desktop */}
            <div className="grid md:grid-cols-2 gap-4">
                {paginatedVouches.map((vouch) => {
                    const roles = vouch.roles.map(roleName => {
                        const role = ROLE_LIST.find(r => r.name.toLowerCase() === roleName.toLowerCase());
                        return role || { name: roleName, emoji: '❓' };
                    });

                    return (
                        <div
                            key={vouch.id}
                            className={`rounded-xl border p-4 transition-all ${vouch.positive
                                    ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                                    : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <Link
                                    href={`/profile/${vouch.sender_address}`}
                                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                        {vouch.sender_address.slice(2, 4).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">
                                            {vouch.sender_address.slice(0, 6)}...{vouch.sender_address.slice(-4)}
                                        </p>
                                        <p className="text-xs text-base-gray-500">{formatDate(vouch.created_at)}</p>
                                    </div>
                                </Link>

                                <div className={`
                  px-2 py-1 rounded-lg text-sm font-medium
                  ${vouch.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                `}>
                                    {vouch.positive ? '+' : '-'}{vouch.weighted_points} pts
                                </div>
                            </div>

                            {/* Role Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                                {roles.map((role, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 bg-base-gray-700/50 rounded-md text-xs text-base-gray-300"
                                    >
                                        {role.emoji} {role.name}
                                    </span>
                                ))}
                            </div>

                            {/* Comment */}
                            {vouch.comment && (
                                <p className="text-sm text-base-gray-300 leading-relaxed">
                                    "{vouch.comment}"
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="px-3 py-1.5 rounded-lg bg-base-gray-800 text-base-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition-colors"
                    >
                        ←
                    </button>

                    <span className="text-base-gray-400 text-sm">
                        Page {currentPage + 1} of {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="px-3 py-1.5 rounded-lg bg-base-gray-800 text-base-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white transition-colors"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}
