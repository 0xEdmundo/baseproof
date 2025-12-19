const TALENT_API_KEY = '5a0266249b9f0fc1e5819329ac368ca53844345fdc407cffdc09cfbe004b';
const WALLET = '0xd15b7af51bba85292f73255633b993c036ea2de3';
const FID = '923265';
const BASE_URL = 'https://api.talentprotocol.com';

async function testEndpoint(label, path) {
    try {
        console.log(`\n=== ${label} ===`);
        console.log(`GET ${BASE_URL}${path}`);

        const response = await fetch(`${BASE_URL}${path}`, {
            headers: {
                'accept': 'application/json',
                'X-API-KEY': TALENT_API_KEY,
            },
        });

        console.log(`Status: ${response.status}`);
        if (response.ok) {
            const data = await response.json();
            console.log('Response:', JSON.stringify(data, null, 2).substring(0, 800));
            return data;
        } else {
            const text = await response.text();
            console.log('Error:', text.substring(0, 200));
        }
    } catch (e) {
        console.error('Fetch error:', e.message);
    }
    return null;
}

async function runTests() {
    // Test Builder Score by wallet
    await testEndpoint('Builder Score (Wallet)', `/score?id=${WALLET}&scorer_slug=builder_score`);

    // Test Creator Score by wallet
    await testEndpoint('Creator Score (Wallet)', `/score?id=${WALLET}&scorer_slug=creator_score`);

    // Test Builder Score by FID with account_source
    await testEndpoint('Builder Score (FID)', `/score?id=${FID}&account_source=farcaster&scorer_slug=builder_score`);

    // Test Profile by FID
    await testEndpoint('Profile (FID)', `/profile?id=${FID}&account_source=farcaster`);
}

runTests();
