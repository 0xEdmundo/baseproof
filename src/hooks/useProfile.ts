'use client';

import { useState, useEffect, useCallback } from 'react';
import { Profile, VouchRecord } from '@/lib/supabase';

interface ProfileData {
    profile: Profile | null;
    vouches: VouchRecord[];
    isNewUser: boolean;
}

export function useProfile(address: string | undefined) {
    const [data, setData] = useState<ProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!address) {
            setData(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/profile/${address}`);

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile: data?.profile,
        vouches: data?.vouches || [],
        isNewUser: data?.isNewUser ?? true,
        isLoading,
        error,
        refetch: fetchProfile,
    };
}

// Calculate tier based on trust score
export function getTrustTier(score: number): {
    name: string;
    color: string;
    emoji: string;
} {
    if (score >= 8000) {
        return { name: 'Legend', color: 'text-purple-500', emoji: '👑' };
    } else if (score >= 5000) {
        return { name: 'Expert', color: 'text-amber-500', emoji: '⭐' };
    } else if (score >= 2000) {
        return { name: 'Trusted', color: 'text-blue-500', emoji: '🛡️' };
    } else if (score >= 500) {
        return { name: 'Rising', color: 'text-green-500', emoji: '📈' };
    } else {
        return { name: 'Newcomer', color: 'text-gray-500', emoji: '🌱' };
    }
}

// Format trust score for display
export function formatTrustScore(score: number): string {
    if (score >= 1000) {
        return (score / 1000).toFixed(1) + 'k';
    }
    return score.toString();
}
