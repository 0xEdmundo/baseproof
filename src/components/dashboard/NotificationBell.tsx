'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';

interface Notification {
    id: string;
    type: 'vouch' | 'achievement' | 'system';
    message: string;
    time: string;
    read: boolean;
    // For vouch notifications - contains the vouch ID or related data for navigation
    vouchId?: string;
    fromAddress?: string;
}

export function NotificationBell() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    // In a real app, this would come from an API/state
    // For now, only show notifications for authenticated users
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasUnread, setHasUnread] = useState(false);

    // Handle notification click - navigate to vouch if applicable
    const handleNotificationClick = (notification: Notification) => {
        // Mark as read
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );

        // Navigate based on notification type
        if (notification.type === 'vouch' && notification.vouchId) {
            // Navigate to the specific vouch
            // The vouch section on user's profile with the vouch highlighted
            const path = user?.wallet_address
                ? `/profile/${user.wallet_address}?vouch=${notification.vouchId}`
                : `/profile/${user?.fid}?vouch=${notification.vouchId}`;
            router.push(path);
            setIsOpen(false);
        }
    };

    // Mark all as read
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setHasUnread(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-base-gray-800 transition-colors"
            >
                <svg className="w-6 h-6 text-base-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {hasUnread && isAuthenticated && (
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
                            {!isAuthenticated ? (
                                // Not logged in - show sign in prompt
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-base-gray-700/50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-base-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </div>
                                    <p className="text-base-gray-400 text-sm mb-3">Sign in to see your notifications</p>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            router.push('/profile/setup');
                                        }}
                                        className="text-base-blue hover:text-base-blue-light text-sm font-medium transition-colors"
                                    >
                                        Sign In →
                                    </button>
                                </div>
                            ) : notifications.length === 0 ? (
                                // Logged in but no notifications
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-base-gray-700/50 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-base-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-base-gray-400 text-sm">No notifications yet</p>
                                    <p className="text-base-gray-500 text-xs mt-1">You'll see vouches and updates here</p>
                                </div>
                            ) : (
                                // Show notifications
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 border-b border-base-gray-700/50 hover:bg-base-gray-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-base-blue/5' : ''
                                            } ${notification.type === 'vouch' ? 'hover:bg-green-500/10' : ''}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0
                                                ${notification.type === 'vouch' ? 'bg-green-500/20 text-green-400' : ''}
                                                ${notification.type === 'achievement' ? 'bg-amber-500/20 text-amber-400' : ''}
                                                ${notification.type === 'system' ? 'bg-base-blue/20 text-base-blue' : ''}
                                            `}>
                                                {notification.type === 'vouch' && '✓'}
                                                {notification.type === 'achievement' && '🏆'}
                                                {notification.type === 'system' && 'ℹ'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white">{notification.message}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-base-gray-500">{notification.time}</p>
                                                    {notification.type === 'vouch' && (
                                                        <span className="text-xs text-green-400">Tap to view →</span>
                                                    )}
                                                </div>
                                            </div>
                                            {!notification.read && (
                                                <span className="w-2 h-2 bg-base-blue rounded-full shrink-0" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {isAuthenticated && notifications.length > 0 && (
                            <div className="p-3 border-t border-base-gray-700">
                                <button
                                    onClick={markAllAsRead}
                                    className="w-full text-center text-sm text-base-blue hover:text-base-blue-light transition-colors"
                                >
                                    Mark all as read
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
