import { NextRequest, NextResponse } from 'next/server';
import { searchUsers } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json({
            results: [],
            message: 'Query must be at least 2 characters'
        });
    }

    try {
        const results = await searchUsers(query);

        return NextResponse.json({
            results,
            query,
            count: results.length,
        });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Search failed', results: [] },
            { status: 500 }
        );
    }
}
