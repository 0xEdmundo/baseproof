# BaseProof

**Onchain Reputation & Vouching Protocol on Base**

BaseProof enables users to create cryptographic vouches for each other's skills and reliability using the Ethereum Attestation Service (EAS) on the Base network.

## Features

- 🛡️ **Onchain Reputation**: Build a permanent, verifiable reputation on Base
- 🤝 **Vouching System**: Create attestations via EAS to vouch for trusted users
- ⚡ **Builder Points**: Earn points by participating in the reputation ecosystem
- 📱 **Farcaster v2**: Native Mini App integration with frame-sdk
- 💼 **Smart Wallet**: Seamless Coinbase Smart Wallet connection via OnchainKit

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with Coinbase-style design
- **Wallet**: OnchainKit + Wagmi/Viem
- **Attestations**: Ethereum Attestation Service (EAS)
- **Network**: Base Mainnet / Sepolia

## Getting Started

### Prerequisites

- Node.js 18.17+ 
- npm, pnpm, or yarn
- Coinbase OnchainKit API Key ([Get one here](https://portal.cdp.coinbase.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/0xEdmundo/baseproof.git
cd baseproof

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your OnchainKit API key to .env.local
# NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | Coinbase OnchainKit API key | Yes |
| `NEXT_PUBLIC_BASE_RPC_URL` | Base Mainnet RPC URL | No |
| `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL` | Base Sepolia RPC URL | No |
| `NEXT_PUBLIC_EAS_VOUCH_SCHEMA_ID` | EAS schema for vouches | No |
| `NEXT_PUBLIC_BUILDER_CODE` | Base Builder Code | No |

## Farcaster v2 Integration

This app is configured as a Farcaster Mini App. The manifest is available at:

```
/.well-known/farcaster.json
```

To test in Farcaster:
1. Deploy to Vercel
2. Enable Developer Mode in Farcaster settings
3. Use the Mini App previewer to test your app

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xEdmundo/baseproof)

1. Click the button above or import from GitHub
2. Add your environment variables
3. Deploy!

## Project Structure

```
baseproof/
├── public/
│   └── .well-known/
│       └── farcaster.json    # Farcaster v2 manifest
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Onboarding page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── onboarding/       # Stepper and step components
│   ├── lib/
│   │   ├── config.ts         # Chain & app config
│   │   └── farcaster.ts      # Farcaster SDK utilities
│   └── providers/
│       └── AppProviders.tsx  # OnchainKit + Wagmi setup
└── ...
```

## Base Builder Code

This project includes Base Builder Code `bc_4w7idbu8` for transaction attribution to track contributions in the Base ecosystem.

## License

MIT

---

Built with 💙 on Base
