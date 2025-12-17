'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFarcaster } from '@/lib/farcaster';
import { FarcasterLoginButton } from '@/components/auth/FarcasterLoginButton';
import { useProfile as useFarcasterAuthProfile } from '@farcaster/auth-kit';
import Link from 'next/link';

interface ProfileFormData {
    displayName: string;
    username: string;
    bio: string;
    xUsername: string;
    xUrl: string;
    githubUsername: string;
    githubUrl: string;
    farcasterUsername: string;
    farcasterUrl: string;
    baseappUsername: string;
    baseappUrl: string;
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
    const { isAuthenticated, profile: authProfile } = useFarcasterAuthProfile();

    const [step, setStep] = useState<'login' | 'form' | 'complete'>('login');
    const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);
    const [formData, setFormData] = useState<ProfileFormData>({
        displayName: '',
        username: '',
        bio: '',
        xUsername: '',
        xUrl: '',
        githubUsername: '',
        githubUrl: '',
        farcasterUsername: '',
        farcasterUrl: '',
        baseappUsername: '',
        baseappUrl: '',
    });

    // Auto-detect if already in Farcaster Frame
    useEffect(() => {
        if (isLoaded && isInFrame && frameUser) {
            setFarcasterUser({
                fid: frameUser.fid,
                username: frameUser.username || '',
                displayName: frameUser.displayName || '',
                pfpUrl: frameUser.pfpUrl || '',
                custody_address: frameUser.custody_address || '',
            });
            setFormData(prev => ({
                ...prev,
                displayName: frameUser.displayName || '',
                username: frameUser.username || '',
                farcasterUsername: frameUser.username || '',
                farcasterUrl: `https://warpcast.com/${frameUser.username}`,
            }));
            setStep('form');
        }
    }, [isLoaded, isInFrame, frameUser]);

    // Handle Farcaster login from QR code
    useEffect(() => {
        if (isAuthenticated && authProfile) {
            setFarcasterUser({
                fid: authProfile.fid!,
                username: authProfile.username || '',
                displayName: authProfile.displayName || '',
                pfpUrl: authProfile.pfpUrl || '',
                custody_address: authProfile.custody || '',
                bio: authProfile.bio,
            });
            setFormData(prev => ({
                ...prev,
                displayName: authProfile.displayName || '',
                username: authProfile.username || '',
                bio: authProfile.bio || '',
                farcasterUsername: authProfile.username || '',
                farcasterUrl: `https://warpcast.com/${authProfile.username}`,
            }));
            setStep('form');
        }
    }, [isAuthenticated, authProfile]);

    const handleInputChange = (field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Auto-generate URLs from usernames
        if (field === 'xUsername' && value) {
            setFormData(prev => ({ ...prev, xUrl: `https://x.com/${value.replace('@', '')}` }));
        }
        if (field === 'githubUsername' && value) {
            setFormData(prev => ({ ...prev, githubUrl: `https://github.com/${value.replace('@', '')}` }));
        }
        if (field === 'farcasterUsername' && value) {
            setFormData(prev => ({ ...prev, farcasterUrl: `https://warpcast.com/${value.replace('@', '')}` }));
        }
        if (field === 'baseappUsername' && value) {
            setFormData(prev => ({ ...prev, baseappUrl: `https://base.org/name/${value.replace('@', '')}` }));
        }
    };

    const handleFarcasterLoginSuccess = (user: FarcasterUser) => {
        setFarcasterUser(user);
        setFormData(prev => ({
            ...prev,
            displayName: user.displayName,
            username: user.username,
            bio: user.bio || '',
            farcasterUsername: user.username,
            farcasterUrl: `https://warpcast.com/${user.username}`,
        }));
        setStep('form');
    };

    const handleSave = async () => {
        if (!farcasterUser) return;

        // Save to local storage (will be replaced with Supabase)
        const profileData = {
            ...formData,
            walletAddress: farcasterUser.custody_address,
            fid: farcasterUser.fid,
            pfpUrl: farcasterUser.pfpUrl,
            createdAt: new Date().toISOString(),
        };

        // Save by both FID and custody address for lookup
        localStorage.setItem(`baseproof_profile_fid_${farcasterUser.fid}`, JSON.stringify(profileData));
        if (farcasterUser.custody_address) {
            localStorage.setItem(`baseproof_profile_${farcasterUser.custody_address}`, JSON.stringify(profileData));
        }

        setStep('complete');

        // Redirect to profile
        setTimeout(() => {
            router.push(`/profile/${farcasterUser.custody_address || farcasterUser.fid}`);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-base-gray-900 via-base-gray-900 to-black">
            {/* Header */}
            <header className="w-full px-6 py-4 border-b border-base-gray-800">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white">BaseProof</span>
                    </Link>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-12">
                {/* Step: Login */}
                {step === 'login' && (
                    <div className="text-center animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="currentColor">
                                <path d="M18.24 4H5.76A1.76 1.76 0 0 0 4 5.76v12.48A1.76 1.76 0 0 0 5.76 20h12.48A1.76 1.76 0 0 0 20 18.24V5.76A1.76 1.76 0 0 0 18.24 4Zm-2.16 12.16a.56.56 0 0 1-.56.56H8.48a.56.56 0 0 1-.56-.56v-4.8a.56.56 0 0 1 .56-.56h7.04a.56.56 0 0 1 .56.56Zm0-6.24a.56.56 0 0 1-.56.56H8.48a.56.56 0 0 1-.56-.56V7.28a.56.56 0 0 1 .56-.56h7.04a.56.56 0 0 1 .56.56Z" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-4">Create Your Profile</h1>
                        <p className="text-base-gray-400 mb-8">Sign in with Farcaster to get started</p>

                        {/* Farcaster Login Button */}
                        <FarcasterLoginButton
                            onSuccess={handleFarcasterLoginSuccess}
                            onError={(error) => console.error('Login error:', error)}
                        />

                        <p className="text-sm text-base-gray-500 mt-6">
                            Your wallet address will be automatically linked from your Farcaster account
                        </p>
                    </div>
                )}

                {/* Step: Form */}
                {step === 'form' && farcasterUser && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
                            <p className="text-base-gray-400">Add your social links to build trust</p>
                        </div>

                        {/* Profile Preview */}
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50 mb-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-base-blue to-purple-600 flex items-center justify-center overflow-hidden">
                                {farcasterUser.pfpUrl ? (
                                    <img src={farcasterUser.pfpUrl} alt={formData.displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-2xl font-bold">
                                        {formData.displayName.slice(0, 2).toUpperCase() || '?'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-white">{formData.displayName || 'Your Name'}</p>
                                <p className="text-sm text-base-gray-400">@{formData.username || 'username'}</p>
                                <p className="text-xs text-green-400 mt-1">✓ Connected via Farcaster</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-base-gray-400">Basic Info</h3>

                                <div>
                                    <label className="block text-sm text-white mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                                        placeholder="Your display name"
                                        className="w-full px-4 py-3 bg-base-gray-800 border border-base-gray-700 rounded-xl text-white placeholder-base-gray-500 focus:outline-none focus:border-base-blue"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        placeholder="@username"
                                        className="w-full px-4 py-3 bg-base-gray-800 border border-base-gray-700 rounded-xl text-white placeholder-base-gray-500 focus:outline-none focus:border-base-blue"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-white mb-2">Bio (optional)</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => handleInputChange('bio', e.target.value)}
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-base-gray-800 border border-base-gray-700 rounded-xl text-white placeholder-base-gray-500 focus:outline-none focus:border-base-blue resize-none"
                                    />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-base-gray-400">Social Links</h3>

                                {/* Farcaster (Auto-filled) */}
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-400" fill="currentColor">
                                                <path d="M18.24 4H5.76A1.76 1.76 0 0 0 4 5.76v12.48A1.76 1.76 0 0 0 5.76 20h12.48A1.76 1.76 0 0 0 20 18.24V5.76A1.76 1.76 0 0 0 18.24 4Z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-white">Farcaster</span>
                                        <span className="ml-auto text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">✓ Connected</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.farcasterUsername}
                                        disabled
                                        className="w-full px-3 py-2 bg-base-gray-700 border border-base-gray-600 rounded-lg text-white text-sm opacity-60"
                                    />
                                </div>

                                {/* BaseApp */}
                                <div className="p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-400" fill="currentColor">
                                                <circle cx="12" cy="12" r="10" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-white">Base / Basename</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.baseappUsername}
                                        onChange={(e) => handleInputChange('baseappUsername', e.target.value)}
                                        placeholder="@username.base"
                                        className="w-full px-3 py-2 bg-base-gray-700 border border-base-gray-600 rounded-lg text-white placeholder-base-gray-500 text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* X (Twitter) */}
                                <div className="p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-white">X (Twitter)</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.xUsername}
                                        onChange={(e) => handleInputChange('xUsername', e.target.value)}
                                        placeholder="@username"
                                        className="w-full px-3 py-2 bg-base-gray-700 border border-base-gray-600 rounded-lg text-white placeholder-base-gray-500 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                {/* GitHub */}
                                <div className="p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-300" fill="currentColor">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium text-white">GitHub</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.githubUsername}
                                        onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                                        placeholder="@username"
                                        className="w-full px-3 py-2 bg-base-gray-700 border border-base-gray-600 rounded-lg text-white placeholder-base-gray-500 text-sm focus:outline-none focus:border-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                className="w-full py-4 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-base-blue/25"
                            >
                                Save Profile
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Complete */}
                {step === 'complete' && (
                    <div className="text-center animate-fade-in">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-4">Profile Created! 🎉</h1>
                        <p className="text-base-gray-400">Redirecting to your profile...</p>
                    </div>
                )}
            </main>
        </div>
    );
}
