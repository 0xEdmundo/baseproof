'use client';

import { sdk } from '@farcaster/frame-sdk';
import { useCallback, useEffect, useState } from 'react';

export interface FarcasterContext {
    user?: {
        fid: number;
        username?: string;
        displayName?: string;
        pfpUrl?: string;
    };
    isLoaded: boolean;
    isInFrame: boolean;
}

// Initialize Farcaster SDK and get context
export function useFarcaster() {
    const [context, setContext] = useState<FarcasterContext>({
        isLoaded: false,
        isInFrame: false,
    });

    useEffect(() => {
        const init = async () => {
            try {
                const frameContext = await sdk.context;

                if (frameContext?.user) {
                    setContext({
                        user: {
                            fid: frameContext.user.fid,
                            username: frameContext.user.username,
                            displayName: frameContext.user.displayName,
                            pfpUrl: frameContext.user.pfpUrl,
                        },
                        isLoaded: true,
                        isInFrame: true,
                    });
                } else {
                    setContext({
                        isLoaded: true,
                        isInFrame: false,
                    });
                }

                // Signal that the app is ready
                await sdk.actions.ready();
            } catch (error) {
                console.log('Not in Farcaster frame context:', error);
                setContext({
                    isLoaded: true,
                    isInFrame: false,
                });
            }
        };

        init();
    }, []);

    // Open external URL
    const openUrl = useCallback(async (url: string) => {
        if (context.isInFrame) {
            try {
                await sdk.actions.openUrl(url);
            } catch {
                window.open(url, '_blank');
            }
        } else {
            window.open(url, '_blank');
        }
    }, [context.isInFrame]);

    // Close the frame
    const close = useCallback(async () => {
        if (context.isInFrame) {
            try {
                await sdk.actions.close();
            } catch (error) {
                console.error('Failed to close frame:', error);
            }
        }
    }, [context.isInFrame]);

    return {
        ...context,
        openUrl,
        close,
    };
}

// Add frame to user's app collection
export async function addToFavorites(): Promise<boolean> {
    try {
        const result = await sdk.actions.addFrame();
        // SDK returns the result directly or throws on failure
        return result !== undefined;
    } catch (error) {
        console.error('Failed to add frame:', error);
        return false;
    }
}
