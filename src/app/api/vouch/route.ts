import { NextRequest, NextResponse } from 'next/server';
import { getProfile, upsertProfile, insertVouch } from '@/lib/supabase';

// Tier-based vouch weights
const TIER_WEIGHTS = {
    PLATINUM: { minScore: 8000, positive: 80, negative: 200 },
    GOLD: { minScore: 5000, positive: 50, negative: 125 },
    ELITE: { minScore: 2500, positive: 25, negative: 62 },
    SILVER: { minScore: 1000, positive: 15, negative: 37 },
    BASIC: { minScore: 0, positive: 10, negative: 25 },
};

function getVouchWeight(senderTrustScore: number, isPositive: boolean): number {
    if (senderTrustScore >= TIER_WEIGHTS.PLATINUM.minScore) {
        return isPositive ? TIER_WEIGHTS.PLATINUM.positive : TIER_WEIGHTS.PLATINUM.negative;
    }
    if (senderTrustScore >= TIER_WEIGHTS.GOLD.minScore) {
        return isPositive ? TIER_WEIGHTS.GOLD.positive : TIER_WEIGHTS.GOLD.negative;
    }
    if (senderTrustScore >= TIER_WEIGHTS.ELITE.minScore) {
        return isPositive ? TIER_WEIGHTS.ELITE.positive : TIER_WEIGHTS.ELITE.negative;
    }
    if (senderTrustScore >= TIER_WEIGHTS.SILVER.minScore) {
        return isPositive ? TIER_WEIGHTS.SILVER.positive : TIER_WEIGHTS.SILVER.negative;
    }
    return isPositive ? TIER_WEIGHTS.BASIC.positive : TIER_WEIGHTS.BASIC.negative;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sender_address, recipient_address, positive, roles, comment } = body;

        // Validate required fields
        if (!sender_address || !recipient_address) {
            return NextResponse.json(
                { error: 'sender_address and recipient_address are required' },
                { status: 400 }
            );
        }

        // Cannot vouch for yourself
        if (sender_address.toLowerCase() === recipient_address.toLowerCase()) {
            return NextResponse.json(
                { error: 'Cannot vouch for yourself' },
                { status: 400 }
            );
        }

        // Get sender profile to determine vouch weight
        const senderProfile = await getProfile(sender_address);
        if (!senderProfile) {
            return NextResponse.json(
                { error: 'Sender profile not found. Please create a profile first.' },
                { status: 404 }
            );
        }

        // Get recipient profile
        const recipientProfile = await getProfile(recipient_address);
        if (!recipientProfile) {
            return NextResponse.json(
                { error: 'Recipient profile not found' },
                { status: 404 }
            );
        }

        // Calculate weighted points based on sender's tier
        const senderTrustScore = senderProfile.trust_score || 100;
        const isPositive = positive !== false; // Default to positive
        const weightedPoints = getVouchWeight(senderTrustScore, isPositive);

        // Create vouch record
        const vouch = await insertVouch({
            sender_address: sender_address.toLowerCase(),
            recipient_address: recipient_address.toLowerCase(),
            positive: isPositive,
            roles: roles || [],
            comment: comment || '',
            weighted_points: weightedPoints,
        });

        if (!vouch) {
            return NextResponse.json(
                { error: 'Failed to create vouch' },
                { status: 500 }
            );
        }

        // Update recipient's trust_score and vouch counts
        const currentTrustScore = recipientProfile.trust_score || 100;
        const currentPositiveVouches = recipientProfile.positive_vouches || 0;
        const currentNegativeVouches = recipientProfile.negative_vouches || 0;

        const newTrustScore = isPositive
            ? Math.min(10000, currentTrustScore + weightedPoints)
            : Math.max(0, currentTrustScore - weightedPoints);

        await upsertProfile({
            wallet_address: recipient_address.toLowerCase(),
            trust_score: newTrustScore,
            positive_vouches: isPositive ? currentPositiveVouches + 1 : currentPositiveVouches,
            negative_vouches: !isPositive ? currentNegativeVouches + 1 : currentNegativeVouches,
            total_vouches_received: (recipientProfile.total_vouches_received || 0) + 1,
        });

        // Update sender's vouches given count
        await upsertProfile({
            wallet_address: sender_address.toLowerCase(),
            total_vouches_given: (senderProfile.total_vouches_given || 0) + 1,
        });

        console.log(`[Vouch] ${sender_address.slice(0, 8)} → ${recipient_address.slice(0, 8)}: ${isPositive ? '+' : '-'}${weightedPoints} pts`);

        return NextResponse.json({
            success: true,
            vouch,
            weightedPoints,
            newTrustScore,
            message: `Vouch created! ${isPositive ? '+' : '-'}${weightedPoints} points`,
        });

    } catch (error) {
        console.error('[Vouch] Error:', error);
        return NextResponse.json(
            { error: 'Failed to process vouch' },
            { status: 500 }
        );
    }
}
