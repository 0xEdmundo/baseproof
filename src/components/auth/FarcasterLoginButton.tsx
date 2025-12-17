'use client';

import { SignInButton, StatusAPIResponse } from '@farcaster/auth-kit';
import { useCallback } from 'react';

interface FarcasterUser {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    custody_address: string;
    bio?: string;
}

interface FarcasterLoginButtonProps {
    onSuccess?: (user: FarcasterUser) => void;
    onError?: (error: unknown) => void;
}

export function FarcasterLoginButton({ onSuccess, onError }: FarcasterLoginButtonProps) {
    const handleSuccess = useCallback((res: StatusAPIResponse) => {
        console.log('Farcaster login success:', res);

        if (res.fid) {
            const user: FarcasterUser = {
                fid: res.fid,
                username: res.username || '',
                displayName: res.displayName || '',
                pfpUrl: res.pfpUrl || '',
                custody_address: res.custody || '',
                bio: res.bio,
            };
            onSuccess?.(user);
        }
    }, [onSuccess]);

    return (
        <div className="farcaster-login-wrapper">
            <SignInButton
                onSuccess={handleSuccess}
            />

            <style jsx global>{`
        .farcaster-login-wrapper {
          width: 100%;
        }
        
        .farcaster-login-wrapper .fc-authkit-signin-button {
          width: 100%;
        }
        
        .farcaster-login-wrapper .fc-authkit-signin-button button {
          width: 100% !important;
          padding: 16px 24px !important;
          background: linear-gradient(to right, #8B5CF6, #EC4899) !important;
          border-radius: 12px !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          transition: all 0.2s !important;
        }
        
        .farcaster-login-wrapper .fc-authkit-signin-button button:hover {
          opacity: 0.9 !important;
          transform: scale(1.02) !important;
        }
      `}</style>
        </div>
    );
}
