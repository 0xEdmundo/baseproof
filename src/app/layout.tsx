import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@coinbase/onchainkit/styles.css';
import { AppProviders } from '@/providers/AppProviders';
import { APP_CONFIG } from '@/lib/config';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

export const metadata: Metadata = {
    title: `${APP_CONFIG.name} - Onchain Reputation & Vouching`,
    description: APP_CONFIG.description,
    openGraph: {
        title: `${APP_CONFIG.name} - Onchain Reputation & Vouching`,
        description: APP_CONFIG.description,
        images: ['/og-image.png'],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: `${APP_CONFIG.name} - Onchain Reputation & Vouching`,
        description: APP_CONFIG.description,
    },
    other: {
        'fc:frame': 'vNext',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
    themeColor: '#09090B',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased bg-base-gray-900 text-white`}>
                <AppProviders>
                    {children}
                </AppProviders>
            </body>
        </html>
    );
}
