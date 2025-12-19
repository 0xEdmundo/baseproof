import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase client for browser (public anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client if both URL and key are provided
export const supabase: SupabaseClient | null =
    supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : null;

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => supabase !== null;

// Database types
export interface Profile {
    id?: string;
    wallet_address: string;
    fid?: number;
    username?: string;
    display_name?: string;
    pfp_url?: string;
    bio?: string;

    // Social Links
    farcaster_url?: string;
    x_url?: string;
    github_url?: string;
    basename_url?: string;
    talent_url?: string;

    // Scores
    trust_score?: number;
    neynar_score?: number;
    builder_score?: number;
    creator_score?: number;
    influence_multiplier?: number;

    // Vouches
    positive_vouches?: number;
    negative_vouches?: number;
    total_vouches_received?: number;
    total_vouches_given?: number;

    // Mint
    sbt_token_id?: number;
    last_mint_image_url?: string;
    last_mint_date?: string;

    created_at?: string;
    updated_at?: string;
}

export interface VouchRecord {
    id: string;
    sender_address: string;
    recipient_address: string;
    positive: boolean;
    roles?: string[];
    comment?: string;
    weighted_points?: number;
    tx_hash?: string;
    created_at: string;
}

export interface SearchResult {
    wallet_address: string;
    basename: string | null;
    farcaster_username: string | null;
    fid?: number;
    pfp_url?: string;
    trust_score: number;
    match_type: 'wallet' | 'basename' | 'farcaster';
    isRegistered?: boolean; // True if user exists in our database
}

// Profile functions
export async function getProfile(walletAddress: string): Promise<Profile | null> {
    if (!supabase) {
        console.warn('Supabase not configured');
        return null;
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return data;
}

export async function upsertProfile(profile: Partial<Profile>): Promise<Profile | null> {
    if (!supabase) {
        console.warn('Supabase not configured');
        return null;
    }

    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            ...profile,
            wallet_address: profile.wallet_address?.toLowerCase(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting profile:', error);
        return null;
    }

    return data;
}

// Vouch functions
export async function getVouchesForUser(walletAddress: string): Promise<VouchRecord[]> {
    if (!supabase) {
        console.warn('Supabase not configured');
        return [];
    }

    const { data, error } = await supabase
        .from('vouches')
        .select('*')
        .eq('recipient_address', walletAddress.toLowerCase())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching vouches:', error);
        return [];
    }

    return data || [];
}

export async function insertVouch(vouch: Omit<VouchRecord, 'id' | 'created_at'>): Promise<VouchRecord | null> {
    if (!supabase) {
        console.warn('Supabase not configured');
        return null;
    }

    const { data, error } = await supabase
        .from('vouches')
        .insert({
            ...vouch,
            sender_address: vouch.sender_address.toLowerCase(),
            recipient_address: vouch.recipient_address.toLowerCase(),
        })
        .select()
        .single();

    if (error) {
        console.error('Error inserting vouch:', error);
        return null;
    }

    return data;
}

// Search functions
export async function searchUsers(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];
    if (!supabase) {
        console.warn('Supabase not configured');
        return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search by wallet address (if looks like address)
    if (normalizedQuery.startsWith('0x') && normalizedQuery.length >= 6) {
        const { data: walletResults } = await supabase
            .from('profiles')
            .select('wallet_address, basename, farcaster_username, trust_score')
            .ilike('wallet_address', `${normalizedQuery}%`)
            .limit(5);

        if (walletResults) {
            results.push(...walletResults.map((r: any) => ({ ...r, match_type: 'wallet' as const })));
        }
    }

    // Search by basename
    const { data: basenameResults } = await supabase
        .from('profiles')
        .select('wallet_address, basename, farcaster_username, trust_score')
        .ilike('basename', `%${normalizedQuery}%`)
        .limit(5);

    if (basenameResults) {
        results.push(...basenameResults.map((r: any) => ({ ...r, match_type: 'basename' as const })));
    }

    // Search by farcaster username
    const { data: farcasterResults } = await supabase
        .from('profiles')
        .select('wallet_address, basename, farcaster_username, trust_score')
        .ilike('farcaster_username', `%${normalizedQuery}%`)
        .limit(5);

    if (farcasterResults) {
        results.push(...farcasterResults.map((r: any) => ({ ...r, match_type: 'farcaster' as const })));
    }

    // Deduplicate by wallet address
    const seen = new Set<string>();
    return results.filter(r => {
        if (seen.has(r.wallet_address)) return false;
        seen.add(r.wallet_address);
        return true;
    });
}

// Leaderboard
export async function getLeaderboard(limit = 50): Promise<Profile[]> {
    if (!supabase) {
        console.warn('Supabase not configured');
        return [];
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('trust_score', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }

    return data || [];
}
