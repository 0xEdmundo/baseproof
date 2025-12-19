'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';

interface ProfileFormData {
    displayName: string;
    username: string;
    bio: string;
    xUsername: string;
    githubUsername: string;
    baseappUsername: string;
    talentUsername: string;
}

export default function EditProfilePage() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
        displayName: '',
        username: '',
        bio: '',
        xUsername: '',
        githubUsername: '',
        baseappUsername: '',
        talentUsername: '',
    });

    // Load saved profile on mount
    useEffect(() => {
        if (!isAuthenticated || !user) {
            router.push('/profile/setup');
            return;
        }

        const savedKey = user.wallet_address
            ? `baseproof_profile_${user.wallet_address}`
            : `baseproof_profile_fid_${user.fid}`;
        const saved = localStorage.getItem(savedKey);

        if (saved) {
            const savedProfile = JSON.parse(saved);
            setFormData({
                displayName: savedProfile.displayName || user.displayName || '',
                username: savedProfile.username || user.username || '',
                bio: savedProfile.bio || '',
                xUsername: savedProfile.xUsername || '',
                githubUsername: savedProfile.githubUsername || '',
                baseappUsername: savedProfile.baseappUsername || '',
                talentUsername: savedProfile.talentUsername || '',
            });
        } else {
            setFormData({
                displayName: user.displayName || '',
                username: user.username || '',
                bio: '',
                xUsername: '',
                githubUsername: '',
                baseappUsername: '',
                talentUsername: '',
            });
        }
    }, [isAuthenticated, user, router]);

    const handleInputChange = (field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);

        const profileData = {
            ...formData,
            farcasterUsername: formData.username,
            farcasterUrl: `https://warpcast.com/${formData.username}`,
            xUrl: formData.xUsername ? `https://x.com/${formData.xUsername.replace('@', '')}` : '',
            githubUrl: formData.githubUsername ? `https://github.com/${formData.githubUsername.replace('@', '')}` : '',
            baseappUrl: formData.baseappUsername ? `https://base.org/name/${formData.baseappUsername.replace('@', '')}` : '',
            talentUrl: formData.talentUsername ? `https://talent.app/u/${formData.talentUsername.replace('@', '')}` : '',
            walletAddress: user.wallet_address,
            fid: user.fid,
            pfpUrl: user.pfpUrl,
        };

        // Save to localStorage
        localStorage.setItem(`baseproof_profile_fid_${user.fid}`, JSON.stringify(profileData));
        if (user.wallet_address) {
            localStorage.setItem(`baseproof_profile_${user.wallet_address}`, JSON.stringify(profileData));
        }

        setTimeout(() => {
            setIsSaving(false);
            router.push(`/profile/${user.wallet_address || user.fid}`);
        }, 500);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-base-gray-900 flex items-center justify-center">
                <p className="text-base-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-gray-900 pb-24 md:pb-8">
            <Header />

            <main className="max-w-lg mx-auto px-4 py-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                    <p className="text-base-gray-400 text-sm mt-1">Update your BaseProof identity</p>
                </div>

                {/* Profile Preview */}
                {user && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-base-gray-800/50 border border-base-gray-700/50 mb-6">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-base-blue to-purple-600">
                            {user.pfpUrl ? (
                                <img src={user.pfpUrl} alt={user.displayName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                                    {formData.displayName?.slice(0, 1).toUpperCase() || '?'}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-white">{formData.displayName || user.displayName}</p>
                            <p className="text-base-gray-400 text-sm">@{formData.username || user.username}</p>
                            <p className="text-base-gray-500 text-xs">FID #{user.fid}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-base-gray-300 mb-1.5">Display Name</label>
                        <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => handleInputChange('displayName', e.target.value)}
                            className="w-full px-4 py-3 bg-base-gray-800 border border-base-gray-700 rounded-xl text-white placeholder-base-gray-500 focus:border-base-blue focus:ring-1 focus:ring-base-blue outline-none transition-all"
                            placeholder="Your display name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-base-gray-300 mb-1.5">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="w-full px-4 py-3 bg-base-gray-800 border border-base-gray-700 rounded-xl text-white placeholder-base-gray-500 focus:border-base-blue focus:ring-1 focus:ring-base-blue outline-none transition-all"
                            placeholder="username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-base-gray-300 mb-1.5">Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-base-gray-800 border border-base-gray-700 rounded-xl text-white placeholder-base-gray-500 focus:border-base-blue focus:ring-1 focus:ring-base-blue outline-none transition-all resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="border-t border-base-gray-700 pt-4 mt-4">
                        <p className="text-sm font-medium text-base-gray-300 mb-3">Social Links</p>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-base-gray-400 mb-1">X (Twitter)</label>
                                <input
                                    type="text"
                                    value={formData.xUsername}
                                    onChange={(e) => handleInputChange('xUsername', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white placeholder-base-gray-500 focus:border-base-blue outline-none text-sm"
                                    placeholder="@username"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-base-gray-400 mb-1">GitHub</label>
                                <input
                                    type="text"
                                    value={formData.githubUsername}
                                    onChange={(e) => handleInputChange('githubUsername', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white placeholder-base-gray-500 focus:border-base-blue outline-none text-sm"
                                    placeholder="@username"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-base-gray-400 mb-1">Basename</label>
                                <input
                                    type="text"
                                    value={formData.baseappUsername}
                                    onChange={(e) => handleInputChange('baseappUsername', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white placeholder-base-gray-500 focus:border-base-blue outline-none text-sm"
                                    placeholder="yourname.base"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-base-gray-400 mb-1">Talent Protocol</label>
                                <input
                                    type="text"
                                    value={formData.talentUsername}
                                    onChange={(e) => handleInputChange('talentUsername', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-base-gray-800 border border-base-gray-700 rounded-lg text-white placeholder-base-gray-500 focus:border-base-blue outline-none text-sm"
                                    placeholder="@username"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8">
                    <Link
                        href={`/profile/${user?.wallet_address || user?.fid}`}
                        className="flex-1 py-3 bg-base-gray-800 hover:bg-base-gray-700 border border-base-gray-700 text-white font-medium rounded-xl transition-all text-center"
                    >
                        Cancel
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 py-3 bg-gradient-to-r from-base-blue to-purple-600 hover:from-base-blue-light hover:to-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </main>

            <MobileNav />
        </div>
    );
}
