import { NextRequest, NextResponse } from 'next/server';
import { searchUsers, SearchResult, supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';

    if (!query || query.length < 2) {
        return NextResponse.json({
            results: [],
            message: 'Query must be at least 2 characters'
        });
    }

    try {
        const normalizedQuery = query.toLowerCase().trim();
        let results: SearchResult[] = [];

        // Step 1: Search in our Supabase database first (registered users)
        const supabaseResults = await searchUsers(query);
        if (supabaseResults.length > 0) {
            // Mark all Supabase results as registered
            results = supabaseResults.map(r => ({ ...r, isRegistered: true }));
        }

        // Step 2: If not enough local results, search Neynar for more users
        if (results.length < 5 && NEYNAR_API_KEY) {
            try {
                const searchUrl = `https://api.neynar.com/v2/farcaster/user/search?q=${encodeURIComponent(normalizedQuery)}&limit=10`;

                const response = await fetch(searchUrl, {
                    headers: {
                        'accept': 'application/json',
                        'x-api-key': NEYNAR_API_KEY,
                    },
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.result?.users && data.result.users.length > 0) {
                        // Check each Neynar user against our database
                        for (const user of data.result.users) {
                            const walletAddress = user.verifications?.[0] || user.wallet_address || '';

                            // Skip if already in results
                            const alreadyExists = results.some(r =>
                                r.wallet_address === walletAddress ||
                                r.farcaster_username === user.username
                            );

                            if (!alreadyExists) {
                                // Check if user is registered in our database
                                let isRegistered = false;
                                if (supabase && walletAddress) {
                                    const { data: existingProfile } = await supabase
                                        .from('profiles')
                                        .select('wallet_address')
                                        .eq('wallet_address', walletAddress.toLowerCase())
                                        .single();
                                    isRegistered = !!existingProfile;
                                }

                                results.push({
                                    wallet_address: walletAddress,
                                    basename: null,
                                    farcaster_username: user.username,
                                    fid: user.fid,
                                    pfp_url: user.pfp_url,
                                    trust_score: 100, // Base trust score for display (vouch-based, not neynar)
                                    match_type: 'farcaster',
                                    isRegistered
                                });
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('Neynar search failed:', e);
            }
        }

        // Limit to 8 results
        results = results.slice(0, 8);

        return NextResponse.json({
            results,
            query,
            count: results.length,
        });
    } catch (error) {
        console.error('[Search] Error:', error);
        return NextResponse.json(
            { error: 'Search failed', results: [] },
            { status: 500 }
        );
    }
}
