// Test Supabase direct query
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ytogzzeatcjuuqdcgmlw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0b2d6emVhdGNqdXVxZGNnbWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzkxMjEsImV4cCI6MjA4MTY1NTEyMX0.PfNANwUjxmtMKe4HxPPvOPEtzM5fYy7mKSV6l5hCY6E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const wallet = '0xd15b7af51bba85292f73255633b993c036ea2de3';

    console.log('Querying profile for:', wallet);

    const { data, error } = await supabase
        .from('profiles')
        .select('wallet_address, trust_score, neynar_score, builder_score, creator_score, updated_at')
        .eq('wallet_address', wallet.toLowerCase())
        .single();

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Profile data:', JSON.stringify(data, null, 2));
    }
}

test();
