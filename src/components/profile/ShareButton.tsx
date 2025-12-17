'use client';

import { sdk } from '@farcaster/frame-sdk';
import { useFarcaster } from '@/lib/farcaster';

interface ShareButtonProps {
    profileUrl: string;
    username: string;
}

export function ShareButton({ profileUrl, username }: ShareButtonProps) {
    const { isInFrame } = useFarcaster();

    const shareText = `🛡️ Check out my BaseProof profile!

Build your onchain reputation and vouch for trusted builders.

Create your profile and level up your trust score on Base!

Don't forget to vouch for me! 🙏

${profileUrl}`;

    const handleShare = async () => {
        if (isInFrame) {
            // Use Farcaster SDK to compose cast
            try {
                await sdk.actions.openUrl(
                    `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`
                );
            } catch (error) {
                // Fallback to regular URL
                window.open(
                    `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`,
                    '_blank'
                );
            }
        } else {
            // Open in new tab
            window.open(
                `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`,
                '_blank'
            );
        }
    };

    return (
        <button
            onClick={handleShare}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.24 4H5.76A1.76 1.76 0 0 0 4 5.76v12.48A1.76 1.76 0 0 0 5.76 20h12.48A1.76 1.76 0 0 0 20 18.24V5.76A1.76 1.76 0 0 0 18.24 4Zm-2.16 12.16a.56.56 0 0 1-.56.56H8.48a.56.56 0 0 1-.56-.56v-4.8a.56.56 0 0 1 .56-.56h7.04a.56.56 0 0 1 .56.56Zm0-6.24a.56.56 0 0 1-.56.56H8.48a.56.56 0 0 1-.56-.56V7.28a.56.56 0 0 1 .56-.56h7.04a.56.56 0 0 1 .56.56Z" />
            </svg>
            Share on Farcaster
        </button>
    );
}
