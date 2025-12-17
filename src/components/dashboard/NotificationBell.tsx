'use client';

import { useState } from 'react';

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);

    // Mock notifications
    const notifications = [
        { id: 1, type: 'vouch', message: 'vitalik.eth vouched for you as a Builder', time: '2m ago', read: false },
        { id: 2, type: 'achievement', message: 'You reached Silver tier! 🎉', time: '1h ago', read: false },
        { id: 3, type: 'vouch', message: 'jesse.base gave you a positive vouch', time: '3h ago', read: true },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-base-gray-800 transition-colors"
            >
                <svg className="w-6 h-6 text-base-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {hasUnread && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-base-gray-900" />
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-base-gray-800 border border-base-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-base-gray-700">
                            <h3 className="font-semibold text-white">Notifications</h3>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 border-b border-base-gray-700/50 hover:bg-base-gray-700/50 transition-colors ${!notif.read ? 'bg-base-blue/5' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${notif.type === 'vouch' ? 'bg-green-500/20 text-green-400' : ''}
                      ${notif.type === 'achievement' ? 'bg-amber-500/20 text-amber-400' : ''}
                    `}>
                                            {notif.type === 'vouch' ? '✓' : '🏆'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-white">{notif.message}</p>
                                            <p className="text-xs text-base-gray-500 mt-1">{notif.time}</p>
                                        </div>
                                        {!notif.read && (
                                            <span className="w-2 h-2 bg-base-blue rounded-full" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 border-t border-base-gray-700">
                            <button
                                onClick={() => setHasUnread(false)}
                                className="w-full text-center text-sm text-base-blue hover:text-base-blue-light transition-colors"
                            >
                                Mark all as read
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
