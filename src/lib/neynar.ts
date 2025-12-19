// Neynar API utilities for Farcaster user data
const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

export interface NeynarUser {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    profile: {
        bio: {
            text: string;
        };
    };
    follower_count: number;
    following_count: number;
    verifications: string[];
    verified_addresses?: {
        eth_addresses: string[];
    };
    active_status: string;
    power_badge: boolean;
    score?: number;
    experimental?: {
        neynar_user_score?: number;
    };
}

export interface NeynarUserResponse {
    users: NeynarUser[];
}

// Fetch user by FID
export async function getUserByFid(fid: number): Promise<NeynarUser | null> {
    if (!NEYNAR_API_KEY) {
        console.warn('Neynar API key not configured');
        return null;
    }

    try {
        const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/bulk?fids=${fid}`, {
            headers: {
                'accept': 'application/json',
                'x-api-key': NEYNAR_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Neynar API error: ${response.status}`);
        }

        const data: NeynarUserResponse = await response.json();
        return data.users[0] || null;
    } catch (error) {
        console.error('Error fetching Neynar user:', error);
        return null;
    }
}

// Fetch user by username
export async function getUserByUsername(username: string): Promise<NeynarUser | null> {
    if (!NEYNAR_API_KEY) {
        console.warn('Neynar API key not configured');
        return null;
    }

    try {
        const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/by_username?username=${username}`, {
            headers: {
                'accept': 'application/json',
                'x-api-key': NEYNAR_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Neynar API error: ${response.status}`);
        }

        const data = await response.json();
        return data.user || null;
    } catch (error) {
        console.error('Error fetching Neynar user by username:', error);
        return null;
    }
}

// Fetch user by wallet address
export async function getUserByAddress(address: string): Promise<NeynarUser | null> {
    if (!NEYNAR_API_KEY) {
        console.warn('Neynar API key not configured');
        return null;
    }

    try {
        const response = await fetch(`${NEYNAR_BASE_URL}/farcaster/user/bulk-by-address?addresses=${address}`, {
            headers: {
                'accept': 'application/json',
                'x-api-key': NEYNAR_API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Neynar API error: ${response.status}`);
        }

        const data = await response.json();
        const users = data[address.toLowerCase()];
        return users?.[0] || null;
    } catch (error) {
        console.error('Error fetching Neynar user by address:', error);
        return null;
    }
}

// Get Neynar score (0-1 scale, multiply by 100 for display)
export function getNeynarScore(user: NeynarUser): number {
    return (user.experimental?.neynar_user_score || 0) * 100;
}
