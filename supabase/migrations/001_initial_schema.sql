-- Supabase Schema for BaseProof
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  basename TEXT,
  farcaster_username TEXT,
  farcaster_fid INTEGER,
  trust_score INTEGER DEFAULT 100,
  influence_multiplier INTEGER DEFAULT 1,
  sbt_token_id INTEGER,
  total_vouches_received INTEGER DEFAULT 0,
  total_vouches_given INTEGER DEFAULT 0,
  positive_vouches INTEGER DEFAULT 0,
  negative_vouches INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on wallet_address for fast lookups
CREATE INDEX idx_profiles_wallet ON profiles(wallet_address);
CREATE INDEX idx_profiles_basename ON profiles(basename);
CREATE INDEX idx_profiles_farcaster ON profiles(farcaster_username);
CREATE INDEX idx_profiles_trust_score ON profiles(trust_score DESC);

-- Vouches table
CREATE TABLE vouches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vouch_id INTEGER NOT NULL,
  sender_address TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  positive BOOLEAN NOT NULL,
  roles TEXT[] NOT NULL,
  comment TEXT,
  weighted_points INTEGER NOT NULL,
  tx_hash TEXT,
  block_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for vouch queries
CREATE INDEX idx_vouches_recipient ON vouches(recipient_address);
CREATE INDEX idx_vouches_sender ON vouches(sender_address);
CREATE INDEX idx_vouches_created ON vouches(created_at DESC);

-- Full-text search index for profiles
CREATE INDEX idx_profiles_search ON profiles USING gin(
  to_tsvector('english', 
    COALESCE(wallet_address, '') || ' ' || 
    COALESCE(basename, '') || ' ' || 
    COALESCE(farcaster_username, '')
  )
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouches ENABLE ROW LEVEL SECURITY;

-- Public read access for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

-- Public read access for vouches
CREATE POLICY "Vouches are viewable by everyone" 
  ON vouches FOR SELECT USING (true);

-- Insert policy for authenticated service role only
CREATE POLICY "Service role can insert profiles" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update profiles" 
  ON profiles FOR UPDATE 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can insert vouches" 
  ON vouches FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
