'use client';

import { AuthKitProvider } from '@farcaster/auth-kit';
import '@farcaster/auth-kit/styles.css';

const farcasterConfig = {
    rpcUrl: 'https://mainnet.optimism.io',
    domain: typeof window !== 'undefined' ? window.location.host : 'baseproof.vercel.app',
    siweUri: typeof window !== 'undefined' ? window.location.origin : 'https://baseproof.vercel.app',
};

interface FarcasterAuthProviderProps {
    children: React.ReactNode;
}

export function FarcasterAuthProvider({ children }: FarcasterAuthProviderProps) {
    return (
        <AuthKitProvider config={farcasterConfig}>
            {children}
        </AuthKitProvider>
    );
}
