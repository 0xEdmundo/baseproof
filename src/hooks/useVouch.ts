'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, ROLE_LIST } from '@/lib/config';

// Contract ABI for vouch function
const VOUCH_ABI = [
    {
        name: 'vouch',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'positive', type: 'bool' },
            { name: 'roles', type: 'uint8[]' },
            { name: 'comment', type: 'string' },
        ],
        outputs: [],
    },
    {
        name: 'mintIdentitySBT',
        type: 'function',
        stateMutability: 'payable',
        inputs: [],
        outputs: [],
    },
    {
        name: 'refreshProfile',
        type: 'function',
        stateMutability: 'payable',
        inputs: [],
        outputs: [],
    },
] as const;

interface UseVouchOptions {
    onSuccess?: (txHash: string) => void;
    onError?: (error: Error) => void;
}

export function useVouch(options: UseVouchOptions = {}) {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);

    const { writeContract, data: txHash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    const sendVouch = useCallback(
        async (recipient: string, positive: boolean, roles: number[], comment: string) => {
            if (!address) {
                options.onError?.(new Error('Wallet not connected'));
                return;
            }

            if (!CONTRACTS.WEIGHTED_REPUTATION) {
                options.onError?.(new Error('Contract not configured'));
                return;
            }

            setIsLoading(true);

            try {
                writeContract({
                    address: CONTRACTS.WEIGHTED_REPUTATION as `0x${string}`,
                    abi: VOUCH_ABI,
                    functionName: 'vouch',
                    args: [recipient as `0x${string}`, positive, roles, comment],
                });
            } catch (err) {
                options.onError?.(err as Error);
            } finally {
                setIsLoading(false);
            }
        },
        [address, writeContract, options]
    );

    const mintSBT = useCallback(
        async (value: bigint) => {
            if (!address) {
                options.onError?.(new Error('Wallet not connected'));
                return;
            }

            if (!CONTRACTS.WEIGHTED_REPUTATION) {
                options.onError?.(new Error('Contract not configured'));
                return;
            }

            setIsLoading(true);

            try {
                writeContract({
                    address: CONTRACTS.WEIGHTED_REPUTATION as `0x${string}`,
                    abi: VOUCH_ABI,
                    functionName: 'mintIdentitySBT',
                    value,
                });
            } catch (err) {
                options.onError?.(err as Error);
            } finally {
                setIsLoading(false);
            }
        },
        [address, writeContract, options]
    );

    const refreshProfile = useCallback(
        async (value: bigint) => {
            if (!address) {
                options.onError?.(new Error('Wallet not connected'));
                return;
            }

            if (!CONTRACTS.WEIGHTED_REPUTATION) {
                options.onError?.(new Error('Contract not configured'));
                return;
            }

            setIsLoading(true);

            try {
                writeContract({
                    address: CONTRACTS.WEIGHTED_REPUTATION as `0x${string}`,
                    abi: VOUCH_ABI,
                    functionName: 'refreshProfile',
                    value,
                });
            } catch (err) {
                options.onError?.(err as Error);
            } finally {
                setIsLoading(false);
            }
        },
        [address, writeContract, options]
    );

    return {
        sendVouch,
        mintSBT,
        refreshProfile,
        isLoading: isLoading || isPending || isConfirming,
        isSuccess,
        error,
        txHash,
    };
}

// Helper to get available roles
export function useRoles() {
    return ROLE_LIST;
}
