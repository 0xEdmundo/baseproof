// Talent Protocol API utilities
const TALENT_API_KEY = process.env.NEXT_PUBLIC_TALENT_API_KEY || '';
const TALENT_BASE_URL = 'https://api.talentprotocol.com/api/v2';

export interface TalentPassport {
    passport_id: number;
    main_wallet: string;
    activity_score: number;
    identity_score: number;
    skills_score: number;
    nominations_received_count: number;
    passport_socials: Array<{
        source: string;
        profile_name: string;
        profile_url: string;
    }>;
    score: number;
    human_checkmark: boolean;
    calculating_score: boolean;
}

export interface TalentCredential {
    id: string;
    category: string;
    name: string;
    value: string;
    score: number;
}

// Fetch Talent Passport by wallet
export async function getTalentPassport(address: string): Promise<TalentPassport | null> {
    if (!TALENT_API_KEY) {
        console.warn('Talent API key not configured');
        return null;
    }

    try {
        const response = await fetch(`${TALENT_BASE_URL}/passports/${address}`, {
            headers: {
                'X-API-KEY': TALENT_API_KEY,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Talent API error: ${response.status}`);
        }

        const data = await response.json();
        return data.passport || null;
    } catch (error) {
        console.error('Error fetching Talent passport:', error);
        return null;
    }
}

// Get Builder and Creator scores from credentials
export async function getTalentCredentials(address: string): Promise<{
    builderScore: number;
    creatorScore: number;
}> {
    if (!TALENT_API_KEY) {
        return { builderScore: 0, creatorScore: 0 };
    }

    try {
        const response = await fetch(`${TALENT_BASE_URL}/passports/${address}/credentials`, {
            headers: {
                'X-API-KEY': TALENT_API_KEY,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { builderScore: 0, creatorScore: 0 };
        }

        const data = await response.json();
        const credentials: TalentCredential[] = data.passport_credentials || [];

        let builderScore = 0;
        let creatorScore = 0;

        for (const cred of credentials) {
            if (cred.category === 'Builder' || cred.name.toLowerCase().includes('builder')) {
                builderScore += cred.score;
            }
            if (cred.category === 'Creator' || cred.name.toLowerCase().includes('creator')) {
                creatorScore += cred.score;
            }
        }

        return { builderScore, creatorScore };
    } catch (error) {
        console.error('Error fetching Talent credentials:', error);
        return { builderScore: 0, creatorScore: 0 };
    }
}
