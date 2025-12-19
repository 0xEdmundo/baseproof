import { NextRequest, NextResponse } from 'next/server';
import { getProfile, getVouchesForUser, upsertProfile } from '@/lib/supabase';
import { getUserByFid } from '@/lib/neynar';

// Check if profile needs refresh (older than 24 hours)
function needsRefresh(updatedAt: string | undefined): boolean {
    if (!updatedAt) return true;
    const lastUpdate = new Date(updatedAt);
    const now = new Date();
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate >= 24;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { address: string } }
) {
    const address = params.address;

    if (!address || !address.startsWith('0x')) {
        return NextResponse.json(
            { error: 'Invalid address' },
            { status: 400 }
        );
    }

    try {
        let [profile, vouches] = await Promise.all([
            getProfile(address),
            getVouchesForUser(address),
        ]);

        // If profile exists and needs refresh (>24h), fetch fresh data from APIs
        if (profile && needsRefresh(profile.updated_at)) {
            console.log('[Profile] Refreshing scores for', address);

            // Initialize with current values
            let neynarScore = profile.neynar_score || 0;
            let builderScore = profile.builder_score;
            let creatorScore = profile.creator_score;

            // 1. Fetch Neynar score (Safe)
            try {
                if (profile.fid) {
                    const neynarData = await getUserByFid(profile.fid);
                    if (neynarData) {
                        neynarScore = neynarData.score || neynarData.experimental?.neynar_user_score || 0;
                    }
                }
            } catch (e) {
                console.error('[Profile] Failed to refresh Neynar data:', e);
            }

            // 2. Fetch Talent Protocol scores (Safe)
            try {
                // Use new API with wallet + FID fallback
                const { getTalentScores } = await import('@/lib/talent');
                const talentScores = await getTalentScores(address, profile.fid);

                if (talentScores.builder_score !== null) {
                    builderScore = talentScores.builder_score;
                }
                if (talentScores.creator_score !== null) {
                    creatorScore = talentScores.creator_score;
                }
                console.log('[Profile] Talent scores:', builderScore, creatorScore);
            } catch (e) {
                console.error('[Profile] Failed to refresh Talent data:', e);
            }

            // 3. Update profile with fresh API scores ONLY
            // IMPORTANT: trust_score is NEVER updated here - it's vouch-based only
            // Only neynar_score, builder_score, creator_score are refreshed from APIs
            try {
                const updatedProfile = await upsertProfile({
                    wallet_address: profile.wallet_address,
                    neynar_score: neynarScore,
                    // trust_score is NOT updated here - only vouch operations can change it
                    builder_score: builderScore,
                    creator_score: creatorScore,
                });

                if (updatedProfile) {
                    profile = updatedProfile;
                    console.log('[Profile] Refreshed all scores');
                }
            } catch (e) {
                console.error('[Profile] Failed to refresh scores:', e);
            }
        }

        if (!profile) {
            return NextResponse.json({
                profile: {
                    wallet_address: address.toLowerCase(),
                    trust_score: 100, // Base vouch score for new users
                    influence_multiplier: 1,
                    total_vouches_received: 0,
                    total_vouches_given: 0,
                    positive_vouches: 0,
                    negative_vouches: 0,
                },
                vouches: [],
                isNewUser: true,
            });
        }

        return NextResponse.json({
            profile,
            vouches,
            isNewUser: false,
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
