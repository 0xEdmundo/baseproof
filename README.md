# BaseProof

**Onchain Reputation & Vouching Protocol on Base**

BaseProof enables users to create cryptographic vouches for each other's skills and reliability using the Ethereum Attestation Service (EAS) on the Base network.

## Features

- 🛡️ **Weighted Reputation**: Vouch power based on Trust Score
- 🤝 **Builder Identity**: Tag users as Builder, Creator, Developer, etc.
- ⚡ **Deep Profiles**: View all vouches with comments
- 🔍 **Omni-Search**: Find users by wallet, Basename, or Farcaster
- 📱 **Farcaster v2**: Native Mini App integration
- 💼 **Smart Wallet**: Seamless Coinbase Smart Wallet connection

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Wallet**: OnchainKit + Wagmi/Viem
- **Attestations**: Ethereum Attestation Service (EAS)
- **Network**: Base Mainnet / Sepolia
- **Database**: Supabase (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js 18.17+ 
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/baseproof.git
cd baseproof

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Required
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key

# Optional - defaults provided
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

## How It Works

### Weighted Reputation
Not all votes are equal. Users with higher Trust Scores have more influence when vouching for others.

### Builder Identity
When vouching, select one or more roles for the recipient:
- 🛠️ Builder
- 🎨 Creator  
- 💻 Developer
- 👥 Community Leader
- 💰 Investor

### The Wall of Trust
Every vouch is public and transparent. View the full history of vouches with comments on any profile.

### Onchain Passport
Mint your reputation as a dynamic SBT (Soulbound Token) that updates with your Trust Score.

## Project Structure

```
baseproof/
├── public/
│   └── .well-known/
│       └── farcaster.json    # Farcaster v2 manifest
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   └── providers/            # Context providers
├── contracts/                # Solidity contracts
└── ...
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/baseproof)

## License

MIT

---

Built with 💙 on Base
