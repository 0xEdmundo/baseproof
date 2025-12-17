import { base, baseSepolia } from 'wagmi/chains';

// Chain configuration
export const SUPPORTED_CHAINS = [base, baseSepolia] as const;

export const DEFAULT_CHAIN = base;

// Contract addresses (to be deployed)
export const CONTRACTS = {
    // WeightedReputation contract (deploy and update)
    WEIGHTED_REPUTATION: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
    // EAS Contract on Base
    EAS_CONTRACT: '0x4200000000000000000000000000000000000021',
    // EAS Schema Registry on Base
    SCHEMA_REGISTRY: '0x4200000000000000000000000000000000000020',
} as const;

// EAS Schema IDs (to be created and configured)
export const EAS_SCHEMAS = {
    VOUCH_SCHEMA: process.env.NEXT_PUBLIC_EAS_VOUCH_SCHEMA_ID || '',
} as const;

// App configuration
export const APP_CONFIG = {
    name: 'BaseProof',
    description: 'Onchain Reputation & Vouching Protocol on Base',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    icon: '/icon.png',
} as const;

// RPC URLs
export const RPC_URLS = {
    [base.id]: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    [baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
} as const;

// Reputation System Constants
export const REPUTATION = {
    MIN_SCORE: 0,
    MAX_SCORE: 10000,
    INITIAL_SCORE: 100,
    POSITIVE_VOUCH_BASE: 10,
    NEGATIVE_VOUCH_BASE: 25,
} as const;

// Role definitions
export const ROLES = {
    BUILDER: { id: 0, name: 'Builder', emoji: '🛠️' },
    CREATOR: { id: 1, name: 'Creator', emoji: '🎨' },
    DEVELOPER: { id: 2, name: 'Developer', emoji: '💻' },
    COMMUNITY_LEADER: { id: 3, name: 'Community Leader', emoji: '👥' },
    INVESTOR: { id: 4, name: 'Investor', emoji: '💰' },
} as const;

export const ROLE_LIST = Object.values(ROLES);

// Pricing (in USD, converted to ETH via Chainlink)
export const PRICING = {
    MINT_SBT_USD: 0.30,
    REFRESH_PROFILE_USD: 0.15,
} as const;
