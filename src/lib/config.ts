import { base, baseSepolia } from 'wagmi/chains';

// Chain configuration
export const SUPPORTED_CHAINS = [base, baseSepolia] as const;

export const DEFAULT_CHAIN = base;

// Base Builder Code for transaction attribution
export const BUILDER_CODE = 'bc_4w7idbu8';

// Contract addresses (to be configured)
export const CONTRACTS = {
    // EAS Contract on Base
    EAS_CONTRACT: '0x4200000000000000000000000000000000000021',
    // EAS Schema Registry on Base
    SCHEMA_REGISTRY: '0x4200000000000000000000000000000000000020',
} as const;

// EAS Schema IDs (to be created and configured)
export const EAS_SCHEMAS = {
    VOUCH_SCHEMA: process.env.NEXT_PUBLIC_EAS_VOUCH_SCHEMA_ID || '',
    REPUTATION_SCHEMA: process.env.NEXT_PUBLIC_EAS_REPUTATION_SCHEMA_ID || '',
} as const;

// App configuration
export const APP_CONFIG = {
    name: 'BaseProof',
    description: 'Onchain Reputation & Vouching Protocol on Base',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://baseproof.vercel.app',
    icon: '/icon.png',
} as const;

// RPC URLs
export const RPC_URLS = {
    [base.id]: process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org',
    [baseSepolia.id]: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
} as const;
