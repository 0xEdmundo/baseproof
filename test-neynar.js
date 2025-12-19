const NEYNAR_API_KEY = 'FA970633-C89F-40F9-8DBD-B07E5C616F63';
const FID = 923265;

async function getWallet() {
    try {
        console.log('Fetching User for FID:', FID);
        const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${FID}`, {
            headers: {
                'accept': 'application/json',
                'api_key': NEYNAR_API_KEY,
            },
        });

        const data = await response.json();
        const user = data.users[0];

        console.log('User:', user.username);
        console.log('Custody Address:', user.custody_address);
        console.log('Verifications:', user.verifications);
        console.log('Verified Addresses:', JSON.stringify(user.verified_addresses, null, 2));

        const verifiedWallet = user.verifications?.[0] ||
            user.verified_addresses?.eth_addresses?.[0] ||
            user.custody_address;

        console.log('Target Wallet:', verifiedWallet);
        return verifiedWallet;
    } catch (e) {
        console.error('Neynar error:', e);
    }
}

getWallet();
