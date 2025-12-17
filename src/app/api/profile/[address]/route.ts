import { NextRequest, NextResponse } from 'next/server';
import { getProfile, getVouchesForUser } from '@/lib/supabase';

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
        const [profile, vouches] = await Promise.all([
            getProfile(address),
            getVouchesForUser(address),
        ]);

        if (!profile) {
            // Return default profile for new users
            return NextResponse.json({
                profile: {
                    wallet_address: address.toLowerCase(),
                    trust_score: 100,
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
