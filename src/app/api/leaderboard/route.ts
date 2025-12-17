import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/supabase';

export async function GET() {
    try {
        const leaderboard = await getLeaderboard(50);

        return NextResponse.json({
            leaderboard,
            updatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leaderboard', leaderboard: [] },
            { status: 500 }
        );
    }
}
