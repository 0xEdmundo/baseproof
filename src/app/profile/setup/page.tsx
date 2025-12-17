'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFarcaster } from '@/lib/farcaster';
import { FarcasterLoginButton } from '@/components/auth/FarcasterLoginButton';
import { useAuth } from '@/providers/AuthProvider';
import Link from 'next/link';

interface ProfileFormData {
    displayName: string;
    username: string;
    bio: string;
    xUsername: string;
    githubUsername: string;
    baseappUsername: string;
}

interface FarcasterUser {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    custody_address: string;
    bio?: string;
}

export default function ProfileSetupPage() {
    const router = useRouter();
    const { isInFrame, isLoaded, user: frameUser } = useFarcaster();
    const { login, isAuthenticated, user } = useAuth();

    const [step, setStep] = useState<'login' | 'form' | 'complete'>(isAuthenticated ? 'form' : 'login');
    const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(
        isAuthenticated && user ? {
            fid: user.fid,
            username: user.username,
            displayName: user.displayName,
            pfpUrl: user.pfpUrl,
            custody_address: user.custody_address,
        } : null
    );
    const [formData, setFormData] = useState<ProfileFormData>({
        displayName: user?.displayName || '',
        username: user?.username || '',
        bio: '',
        xUsername: '',
        githubUsername: '',
        baseappUsername: '',
    });

    const handleInputChange = (field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFarcasterLoginSuccess = useCallback((fcUser: FarcasterUser) => {
        setFarcasterUser(fcUser);
        login({
            fid: fcUser.fid,
            username: fcUser.username,
            displayName: fcUser.displayName,
            pfpUrl: fcUser.pfpUrl,
            custody_address: fcUser.custody_address,
        });
        setFormData(prev => ({
            ...prev,
            displayName: fcUser.displayName,
            username: fcUser.username,
            bio: fcUser.bio || '',
        }));
        setStep('form');
    }, [login]);

    const handleSave = async () => {
        if (!farcasterUser) return;

        const profileData = {
            ...formData,
            farcasterUsername: formData.username,
            farcasterUrl: `https://warpcast.com/${formData.username}`,
            xUrl: formData.xUsername ? `https://x.com/${formData.xUsername.replace('@', '')}` : '',
            githubUrl: formData.githubUsername ? `https://github.com/${formData.githubUsername.replace('@', '')}` : '',
            baseappUrl: formData.baseappUsername ? `https://base.org/name/${formData.baseappUsername.replace('@', '')}` : '',
            walletAddress: farcasterUser.custody_address,
            fid: farcasterUser.fid,
            pfpUrl: farcasterUser.pfpUrl,
        };

        localStorage.setItem(`baseproof_profile_fid_${farcasterUser.fid}`, JSON.stringify(profileData));
        if (farcasterUser.custody_address) {
            localStorage.setItem(`baseproof_profile_${farcasterUser.custody_address}`, JSON.stringify(profileData));
        }

        setStep('complete');
        setTimeout(() => {
            router.push(`/profile/${farcasterUser.custody_address || farcasterUser.fid}`);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-base-gray-900 flex flex-col">
            {/* Header */}
            <header className="px-4 py-3 border-b border-base-gray-800">
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="text-base font-bold text-white">BaseProof</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex flex-col justify-center px-4 py-6 max-w-lg mx-auto w-full">
                {/* Login Step */}
                {step === 'login' && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
                                <path d="M18.24 4H5.76A1.76 1.76 0 0 0 4 5.76v12.48A1.76 1.76 0 0 0 5.76 20h12.48A1.76 1.76 0 0 0 20 18.24V5.76A1.76 1.76 0 0 0 18.24 4Z" />
                            </svg>
                        </div>

                        <h1 className="text-xl font-bold text-white mb-2">Create Profile</h1>
                        <p className="text-base-gray-400 text-sm mb-6">Sign in with Farcaster</p>

                        <FarcasterLoginButton onSuccess={handleFarcasterLoginSuccess} />

                        <p className="text-xs text-base-gray-500 mt-4">
                            Scan QR with Warpcast
                        </p>
                    </div>
                )}

                {/* Form Step */}
                {step === 'form' && farcasterUser && (
                    <div>
                        {/* Profile Preview */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50 mb-6">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-base-blue to-purple-600">
                                {farcasterUser.pfpUrl ? (
                                    <img src={farcasterUser.pfpUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                        {formData.displayName?.slice(0, 1).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm">{formData.displayName}</p>
                                <p className="text-xs text-green-400">✓ Farcaster connected</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-base-gray-400 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                                    className="w-full px-3 py-2 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-base-gray-400 mb-1">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={2}
                                    className="w-full px-3 py-2 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white text-sm resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-base-gray-400 mb-1">X (Twitter)</label>
                                    <input
                                        type="text"
                                        value={formData.xUsername}
                                        onChange={(e) => handleInputChange('xUsername', e.target.value)}
                                        placeholder="@username"
                                        className="w-full px-3 py-2 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-base-gray-400 mb-1">GitHub</label>
                                    <input
                                        type="text"
                                        value={formData.githubUsername}
                                        onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                                        placeholder="@username"
                                        className="w-full px-3 py-2 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-base-gray-400 mb-1">Basename</label>
                                <input
                                    type="text"
                                    value={formData.baseappUsername}
                                    onChange={(e) => handleInputChange('baseappUsername', e.target.value)}
                                    placeholder="name.base"
                                    className="w-full px-3 py-2 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white text-sm"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full py-3 bg-gradient-to-r from-base-blue to-purple-600 text-white font-semibold rounded-xl text-sm"
                            >
                                Save Profile
                            </button>
                        </div>
                    </div>
                )}

                {/* Complete Step */}
                {step === 'complete' && (
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2">Profile Created! 🎉</h1>
                        <p className="text-base-gray-400 text-sm">Redirecting...</p>
                    </div>
                )}
            </main>
        </div>
    );
}
