'use client';

interface SocialLinksProps {
    farcasterUsername?: string;
    baseappUsername?: string;
    xUsername?: string;
    githubUsername?: string;
}

export function SocialLinks({
    farcasterUsername,
    baseappUsername,
    xUsername,
    githubUsername
}: SocialLinksProps) {
    const links = [
        {
            name: 'Farcaster',
            username: farcasterUsername,
            url: farcasterUsername ? `https://warpcast.com/${farcasterUsername}` : null,
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M18.24 4H5.76A1.76 1.76 0 0 0 4 5.76v12.48A1.76 1.76 0 0 0 5.76 20h12.48A1.76 1.76 0 0 0 20 18.24V5.76A1.76 1.76 0 0 0 18.24 4Zm-2.16 12.16a.56.56 0 0 1-.56.56H8.48a.56.56 0 0 1-.56-.56v-4.8a.56.56 0 0 1 .56-.56h7.04a.56.56 0 0 1 .56.56Zm0-6.24a.56.56 0 0 1-.56.56H8.48a.56.56 0 0 1-.56-.56V7.28a.56.56 0 0 1 .56-.56h7.04a.56.56 0 0 1 .56.56Z" />
                </svg>
            ),
            color: 'hover:text-purple-400 hover:border-purple-400/50',
        },
        {
            name: 'Base',
            username: baseappUsername,
            url: baseappUsername ? `https://base.org/name/${baseappUsername}` : null,
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            ),
            color: 'hover:text-blue-400 hover:border-blue-400/50',
        },
        {
            name: 'X',
            username: xUsername,
            url: xUsername ? `https://x.com/${xUsername}` : null,
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            color: 'hover:text-white hover:border-white/50',
        },
        {
            name: 'GitHub',
            username: githubUsername,
            url: githubUsername ? `https://github.com/${githubUsername}` : null,
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            ),
            color: 'hover:text-gray-300 hover:border-gray-300/50',
        },
    ];

    const validLinks = links.filter(l => l.username && l.url);

    if (validLinks.length === 0) return null;

    return (
        <div className="bg-base-gray-800/50 rounded-2xl border border-base-gray-700/50 p-4">
            <h3 className="text-sm font-medium text-base-gray-400 mb-3">Social Links</h3>
            <div className="grid grid-cols-2 gap-3">
                {validLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 p-3 rounded-xl bg-base-gray-700/50 border border-base-gray-600/50 text-base-gray-300 transition-all ${link.color}`}
                    >
                        {link.icon}
                        <div className="min-w-0">
                            <p className="text-xs text-base-gray-500">{link.name}</p>
                            <p className="font-medium truncate text-sm">{link.username}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
