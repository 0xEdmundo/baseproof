// Talent Protocol API utilities for builder/creator scores
// Documentation: https://docs.talentprotocol.com/docs/developers/talent-api/api-reference
const TALENT_API_KEY = process.env.NEXT_PUBLIC_TALENT_API_KEY || '';
const TALENT_BASE_URL = 'https://api.talentprotocol.com';

export interface TalentScoreResponse {
    score: {
        points: number;
        percentile: number;
        last_calculated_at: string;
        calculating: boolean;
    };
}

export interface TalentProfileResponse {
    profile: {
        id: number;
        display_name: string;
        bio: string;
        image_url: string;
        location: string;
        main_wallet_address: string;
        farcaster_primary_wallet_address?: string;
        tags: string[];
        verified: boolean;
    };
}

export interface TalentScores {
    builder_score: number | null;
    creator_score: number | null;
}

/**
 * Get Builder Score for a wallet or FID
 * @param id - Wallet address, Talent ID, or Farcaster FID
 * @param accountSource - 'wallet' or 'farcaster' (use 'farcaster' if id is FID)
 */
export async function getBuilderScore(id: string, accountSource?: 'wallet' | 'farcaster'): Promise<number | null> {
    if (!TALENT_API_KEY || !id) return null;

    try {
        const params = new URLSearchParams({
            id,
            scorer_slug: 'builder_score',
        });
        if (accountSource) params.append('account_source', accountSource);

        const response = await fetch(`${TALENT_BASE_URL}/score?${params.toString()}`, {
            headers: {
                'accept': 'application/json',
                'X-API-KEY': TALENT_API_KEY,
            },
        });

        if (!response.ok) {
            console.log(`[Talent] Builder score not found for ${id}: ${response.status}`);
            return null;
        }

        const data: TalentScoreResponse = await response.json();
        return data.score?.points ?? null;
    } catch (error) {
        console.error('[Talent] Error fetching builder score:', error);
        return null;
    }
}

/**
 * Get Creator Score for a wallet or FID
 * @param id - Wallet address, Talent ID, or Farcaster FID  
 * @param accountSource - 'wallet' or 'farcaster' (use 'farcaster' if id is FID)
 */
export async function getCreatorScore(id: string, accountSource?: 'wallet' | 'farcaster'): Promise<number | null> {
    if (!TALENT_API_KEY || !id) return null;

    try {
        const params = new URLSearchParams({
            id,
            scorer_slug: 'creator_score',
        });
        if (accountSource) params.append('account_source', accountSource);

        const response = await fetch(`${TALENT_BASE_URL}/score?${params.toString()}`, {
            headers: {
                'accept': 'application/json',
                'X-API-KEY': TALENT_API_KEY,
            },
        });

        if (!response.ok) {
            console.log(`[Talent] Creator score not found for ${id}: ${response.status}`);
            return null;
        }

        const data: TalentScoreResponse = await response.json();
        return data.score?.points ?? null;
    } catch (error) {
        console.error('[Talent] Error fetching creator score:', error);
        return null;
    }
}

/**
 * Get both Builder and Creator scores at once
 * Tries wallet first, then falls back to Farcaster FID if provided
 */
export async function getTalentScores(
    wallet: string | undefined,
    fid?: number
): Promise<TalentScores> {
    let builderScore: number | null = null;
    let creatorScore: number | null = null;

    // Try wallet first
    if (wallet) {
        builderScore = await getBuilderScore(wallet);
        creatorScore = await getCreatorScore(wallet);
    }

    // Fallback to FID if wallet didn't work
    if (builderScore === null && fid) {
        console.log('[Talent] Wallet lookup failed, trying FID:', fid);
        builderScore = await getBuilderScore(fid.toString(), 'farcaster');
        creatorScore = await getCreatorScore(fid.toString(), 'farcaster');
    }

    return { builder_score: builderScore, creator_score: creatorScore };
}

/**
 * Get Talent Profile to retrieve linked wallet addresses
 */
export async function getTalentProfile(id: string, accountSource?: 'wallet' | 'farcaster'): Promise<TalentProfileResponse['profile'] | null> {
    if (!TALENT_API_KEY || !id) return null;

    try {
        const params = new URLSearchParams({ id });
        if (accountSource) params.append('account_source', accountSource);

        const response = await fetch(`${TALENT_BASE_URL}/profile?${params.toString()}`, {
            headers: {
                'accept': 'application/json',
                'X-API-KEY': TALENT_API_KEY,
            },
        });

        if (!response.ok) return null;

        const data: TalentProfileResponse = await response.json();
        return data.profile ?? null;
    } catch (error) {
        console.error('[Talent] Error fetching profile:', error);
        return null;
    }
}

// Legacy function for backwards compatibility
export async function getTalentPassport(identifier: string) {
    const scores = await getTalentScores(identifier);
    if (scores.builder_score === null && scores.creator_score === null) {
        return null;
    }
    return {
        builder_score: scores.builder_score,
        creator_score: scores.creator_score,
        score: scores.builder_score, // Legacy field
    };
}
