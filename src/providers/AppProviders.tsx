'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { ReactNode, useState } from 'react';
import { APP_CONFIG, RPC_URLS } from '@/lib/config';
import { FarcasterAuthProvider } from './FarcasterAuthProvider';
import { AuthProvider } from './AuthProvider';

// Wagmi configuration
const wagmiConfig = createConfig({
    chains: [base, baseSepolia],
    connectors: [
        coinbaseWallet({
            appName: APP_CONFIG.name,
            preference: 'smartWalletOnly',
        }),
    ],
    transports: {
        [base.id]: http(RPC_URLS[base.id]),
        [baseSepolia.id]: http(RPC_URLS[baseSepolia.id]),
    },
    ssr: true,
});

interface AppProvidersProps {
    children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                gcTime: 1000 * 60 * 30, // 30 minutes
            },
        },
    }));

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={base}
                    config={{
                        appearance: {
                            mode: 'auto',
                            theme: 'base',
                        },
                    }}
                >
                    <FarcasterAuthProvider>
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </FarcasterAuthProvider>
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
