import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { BaseProofABI } from '@/lib/abi';
import { CONTRACTS } from '@/lib/config';
import { upsertProfile } from '@/lib/supabase';
import { useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export function useMint() {
    const { user } = useAuth();
    const {
        data: hash,
        error: writeError,
        isPending: isWritePending,
        writeContractAsync
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        data: receipt
    } = useWaitForTransactionReceipt({
        hash
    });

    const mintIdentity = useCallback(async () => {
        if (!user?.wallet_address) throw new Error('No wallet connected');

        try {
            console.log('Minting identity...');
            const tx = await writeContractAsync({
                address: CONTRACTS.WEIGHTED_REPUTATION as `0x${string}`,
                abi: BaseProofABI,
                functionName: 'mintIdentity',
                value: parseEther('0.0001'), // Approx $0.30
            });
            console.log('Mint tx sent:', tx);
            return tx;
        } catch (error) {
            console.error('Mint failed:', error);
            throw error;
        }
    }, [user, writeContractAsync]);

    // Effect to save to Supabase when confirmed
    // Note: We handle this manually in the UI component usually, 
    // but here we provide a helper function to save metadata
    const saveMintData = useCallback(async () => {
        if (!user?.wallet_address) return;

        const timestamp = new Date().toISOString();
        // Generate the dynamic image URL (assuming hosted app url or localhost)
        // Ideally use the deployed URL
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const imageUrl = `${appUrl}/api/image?address=${user.wallet_address}&t=${Date.now()}`;

        try {
            await upsertProfile({
                wallet_address: user.wallet_address,
                last_mint_date: timestamp,
                last_mint_image_url: imageUrl,
                // sbt_token_id: Extract from logs if needed, for now skip or fetch separately
            });
            console.log('[Mint] Saved mint data to Supabase');
        } catch (error) {
            console.error('[Mint] Failed to save mint data:', error);
        }
    }, [user]);

    return {
        mintIdentity,
        saveMintData,
        hash,
        isPending: isWritePending || isConfirming,
        isConfirmed,
        error: writeError,
    };
}
