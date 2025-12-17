'use client';

import { useSignIn, QRCode, useProfile as useFarcasterProfile } from '@farcaster/auth-kit';
import { useCallback, useEffect, useState } from 'react';

interface FarcasterUser {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    custody_address: string;
    bio?: string;
}

interface FarcasterLoginButtonProps {
    onSuccess?: (user: FarcasterUser) => void;
    onError?: (error: Error) => void;
}

export function FarcasterLoginButton({ onSuccess, onError }: FarcasterLoginButtonProps) {
    const [showQR, setShowQR] = useState(false);

    const {
        signIn,
        signOut,
        connect,
        reconnect,
        isSuccess,
        isError,
        error,
        channelToken,
        url,
        data,
        validSignature,
    } = useSignIn({
        onSuccess: ({ fid, username }) => {
            console.log('Farcaster login success:', { fid, username });
        },
        onError: (err) => {
            console.error('Farcaster login error:', err);
            onError?.(err as Error);
        },
    });

    const { isAuthenticated, profile } = useFarcasterProfile();

    useEffect(() => {
        if (isSuccess && data && profile) {
            const user: FarcasterUser = {
                fid: data.fid!,
                username: data.username || profile.username || '',
                displayName: data.displayName || profile.displayName || '',
                pfpUrl: data.pfpUrl || profile.pfpUrl || '',
                custody_address: data.custody?.toString() || '',
                bio: profile.bio,
            };
            onSuccess?.(user);
            setShowQR(false);
        }
    }, [isSuccess, data, profile, onSuccess]);

    useEffect(() => {
        if (isError && error) {
            onError?.(error as Error);
        }
    }, [isError, error, onError]);

    const handleClick = useCallback(() => {
        if (isAuthenticated) {
            signOut();
        } else {
            setShowQR(true);
            signIn();
        }
    }, [isAuthenticated, signIn, signOut]);

    if (isAuthenticated && profile) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-purple-500/20">
                    {profile.pfpUrl && (
                        <img src={profile.pfpUrl} alt={profile.displayName} className="w-full h-full object-cover" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-white">{profile.displayName}</p>
                    <p className="text-sm text-base-gray-400">@{profile.username}</p>
                </div>
                <button
                    onClick={() => signOut()}
                    className="px-3 py-1.5 text-sm bg-base-gray-700 hover:bg-base-gray-600 text-white rounded-lg transition-colors"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Login Button */}
            <button
                onClick={handleClick}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M18.24 4H5.76A1.76 1.76 0 0 0 4 5.76v12.48A1.76 1.76 0 0 0 5.76 20h12.48A1.76 1.76 0 0 0 20 18.24V5.76A1.76 1.76 0 0 0 18.24 4Zm-2.16 12.16a.56.56 0 0 1-.56.56H8.48a.56.56 0 0 1-.56-.56v-4.8a.56.56 0 0 1 .56-.56h7.04a.56.56 0 0 1 .56.56Zm0-6.24a.56.56 0 0 1-.56.56H8.48a.56.56 0 0 1-.56-.56V7.28a.56.56 0 0 1 .56-.56h7.04a.56.56 0 0 1 .56.56Z" />
                </svg>
                Sign in with Farcaster
            </button>

            {/* QR Code Modal */}
            {showQR && url && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-base-gray-800 rounded-2xl p-6 max-w-sm mx-4 border border-base-gray-700">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-white mb-2">Scan with Warpcast</h3>
                            <p className="text-sm text-base-gray-400">
                                Open Warpcast on your phone and scan this QR code to sign in
                            </p>
                        </div>

                        <div className="bg-white p-4 rounded-xl mb-4">
                            <QRCode uri={url} />
                        </div>

                        <div className="space-y-3">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-center transition-all"
                            >
                                Open in Warpcast
                            </a>

                            <button
                                onClick={() => setShowQR(false)}
                                className="w-full py-3 bg-base-gray-700 hover:bg-base-gray-600 text-white font-semibold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
