'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useProfile as useFarcasterAuthProfile } from '@farcaster/auth-kit';
import { useFarcaster } from '@/lib/farcaster';
import { getUserByFid } from '@/lib/neynar';

interface UserProfile {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    wallet_address: string; // Verified Farcaster wallet (NOT custody)
    bio?: string;
    xUsername?: string;
    githubUsername?: string;
    baseappUsername?: string;
    trustScore: number;
    rank: number;
    vouchesGiven: number;
    vouchesReceived: number;
    weeklyVouchesUsed: number;
    dailyVouchesUsed: number;
    lastVouchReset: string;
    lastDailyReset: string;
}

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: Partial<UserProfile>) => void;
    logout: () => void;
    updateProfile: (data: Partial<UserProfile>) => void;
    canVouch: () => { allowed: boolean; dailyRemaining: number; weeklyRemaining: number; };
    useVouch: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const WEEKLY_VOUCH_LIMIT = 35;
const DAILY_VOUCH_LIMIT = 5;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated: fcAuthAuthenticated, profile: fcAuthProfile } = useFarcasterAuthProfile();
    const { isInFrame, isLoaded: fcLoaded, user: fcFrameUser } = useFarcaster();

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = () => {
            try {
                const saved = localStorage.getItem('baseproof_current_user');
                if (saved) {
                    const userData = JSON.parse(saved);
                    // Reset daily/weekly vouches if needed
                    const now = new Date();
                    const lastDaily = new Date(userData.lastDailyReset || 0);
                    const lastWeekly = new Date(userData.lastVouchReset || 0);

                    // Reset daily if new day
                    if (now.toDateString() !== lastDaily.toDateString()) {
                        userData.dailyVouchesUsed = 0;
                        userData.lastDailyReset = now.toISOString();
                    }

                    // Reset weekly if 7+ days passed
                    const daysSinceReset = (now.getTime() - lastWeekly.getTime()) / (1000 * 60 * 60 * 24);
                    if (daysSinceReset >= 7) {
                        userData.weeklyVouchesUsed = 0;
                        userData.lastVouchReset = now.toISOString();
                    }

                    setUser(userData);
                }
            } catch (e) {
                console.error('Error loading user:', e);
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    // Sync with Farcaster auth-kit when authenticated
    useEffect(() => {
        if (fcAuthAuthenticated && fcAuthProfile && !user) {
            login({
                fid: fcAuthProfile.fid!,
                username: fcAuthProfile.username || '',
                displayName: fcAuthProfile.displayName || '',
                pfpUrl: fcAuthProfile.pfpUrl || '',
                wallet_address: fcAuthProfile.custody || '', // Will be replaced with verified wallet in login()
                bio: fcAuthProfile.bio,
            });
        }
    }, [fcAuthAuthenticated, fcAuthProfile]);

    // Sync with Farcaster Frame SDK
    useEffect(() => {
        if (fcLoaded && isInFrame && fcFrameUser && !user) {
            login({
                fid: fcFrameUser.fid,
                username: fcFrameUser.username || '',
                displayName: fcFrameUser.displayName || '',
                pfpUrl: fcFrameUser.pfpUrl || '',
                wallet_address: fcFrameUser.wallet_address || '', // Will be replaced with verified wallet in login()
            });
        }
    }, [fcLoaded, isInFrame, fcFrameUser]);

    const login = useCallback(async (userData: Partial<UserProfile>) => {
        const now = new Date().toISOString();

        // Fetch verified address from Neynar if we have FID
        let verifiedAddress = userData.wallet_address || '';
        if (userData.fid) {
            try {
                const neynarUser = await getUserByFid(userData.fid);
                if (neynarUser && neynarUser.verifications && neynarUser.verifications.length > 0) {
                    // Use the first verified address (primary wallet)
                    verifiedAddress = neynarUser.verifications[0];
                    console.log('Using verified address from Neynar:', verifiedAddress);
                }
                // Also get bio and other data from Neynar if not provided
                if (!userData.bio && neynarUser?.profile?.bio?.text) {
                    userData.bio = neynarUser.profile.bio.text;
                }
            } catch (error) {
                console.warn('Could not fetch Neynar data, using custody address:', error);
            }
        }

        const newUser: UserProfile = {
            fid: userData.fid || 0,
            username: userData.username || '',
            displayName: userData.displayName || '',
            pfpUrl: userData.pfpUrl || '',
            bio: userData.bio,
            trustScore: userData.trustScore || 100,
            rank: userData.rank || 0,
            vouchesGiven: userData.vouchesGiven || 0,
            vouchesReceived: userData.vouchesReceived || 0,
            weeklyVouchesUsed: userData.weeklyVouchesUsed || 0,
            dailyVouchesUsed: userData.dailyVouchesUsed || 0,
            lastVouchReset: userData.lastVouchReset || now,
            lastDailyReset: userData.lastDailyReset || now,
            ...userData,
            wallet_address: verifiedAddress, // Verified Farcaster wallet from Neynar
        };

        setUser(newUser);
        localStorage.setItem('baseproof_current_user', JSON.stringify(newUser));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('baseproof_current_user');
    }, []);

    const updateProfile = useCallback((data: Partial<UserProfile>) => {
        if (!user) return;
        const updated = { ...user, ...data };
        setUser(updated);
        localStorage.setItem('baseproof_current_user', JSON.stringify(updated));
    }, [user]);

    const canVouch = useCallback(() => {
        if (!user) return { allowed: false, dailyRemaining: 0, weeklyRemaining: 0 };

        const dailyRemaining = DAILY_VOUCH_LIMIT - user.dailyVouchesUsed;
        const weeklyRemaining = WEEKLY_VOUCH_LIMIT - user.weeklyVouchesUsed;

        return {
            allowed: dailyRemaining > 0 && weeklyRemaining > 0,
            dailyRemaining: Math.max(0, dailyRemaining),
            weeklyRemaining: Math.max(0, weeklyRemaining),
        };
    }, [user]);

    const useVouch = useCallback(() => {
        if (!user) return false;

        const { allowed } = canVouch();
        if (!allowed) return false;

        updateProfile({
            dailyVouchesUsed: user.dailyVouchesUsed + 1,
            weeklyVouchesUsed: user.weeklyVouchesUsed + 1,
            vouchesGiven: user.vouchesGiven + 1,
        });

        return true;
    }, [user, canVouch, updateProfile]);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            logout,
            updateProfile,
            canVouch,
            useVouch,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
