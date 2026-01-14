-- =====================================================
-- SUPABASE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'owner')),
    tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'pro', 'enterprise')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- API KEYS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    key VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'Default API Key',
    user_email VARCHAR(255),
    requests_count INTEGER DEFAULT 0,
    requests_limit INTEGER DEFAULT 50,
    tier VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'pro', 'enterprise')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster API key lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- =====================================================
-- PROPERTIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    url VARCHAR(1000) UNIQUE NOT NULL,
    price VARCHAR(100),
    price_numeric BIGINT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    building_area INTEGER,
    location VARCHAR(255),
    posting_date VARCHAR(50),
    image_url TEXT,
    mode VARCHAR(10) CHECK (mode IN ('jual', 'sewa')),
    slug VARCHAR(100),
    prop_type VARCHAR(50),
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_mode ON properties(mode);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_numeric);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);

-- =====================================================
-- REQUEST LOGS TABLE (for analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS request_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INTEGER,
    response_time_ms INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_request_logs_api_key ON request_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_request_logs_created ON request_logs(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable" ON profiles
    FOR SELECT USING (true);

-- API Keys policies
CREATE POLICY "Users can view own API keys" ON api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own API keys" ON api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON api_keys
    FOR UPDATE USING (auth.uid() = user_id);

-- Properties policies (public read for API)
CREATE POLICY "Anyone can read properties" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Service role can insert properties" ON properties
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update properties" ON properties
    FOR UPDATE USING (true);

-- Request logs policies
CREATE POLICY "Users can view own request logs" ON request_logs
    FOR SELECT USING (
        api_key_id IN (SELECT id FROM api_keys WHERE user_id = auth.uid())
    );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to reset monthly request counts
CREATE OR REPLACE FUNCTION reset_monthly_requests()
RETURNS void AS $$
BEGIN
    UPDATE api_keys SET requests_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to extract numeric price from string
CREATE OR REPLACE FUNCTION extract_price_numeric(price_str VARCHAR)
RETURNS BIGINT AS $$
DECLARE
    cleaned VARCHAR;
    result BIGINT;
BEGIN
    -- Remove non-numeric characters except for 'jt' (juta) and 'M' (million)
    cleaned := regexp_replace(price_str, '[^0-9jtJTmM\.]', '', 'g');
    
    -- Handle 'jt' or 'juta' (millions)
    IF cleaned ~* 'jt' THEN
        cleaned := regexp_replace(cleaned, '[^0-9\.]', '', 'g');
        result := COALESCE(NULLIF(cleaned, '')::NUMERIC * 1000000, NULL)::BIGINT;
    ELSE
        cleaned := regexp_replace(cleaned, '[^0-9]', '', 'g');
        result := COALESCE(NULLIF(cleaned, '')::BIGINT, NULL);
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (optional, for testing)
-- =====================================================
-- INSERT INTO properties (title, url, price, price_numeric, bedrooms, bathrooms, building_area, location, mode, slug)
-- VALUES 
--     ('Rumah Mewah di Menteng', 'https://olx.co.id/item/test-1-iid-123', 'Rp 15.000.000.000', 15000000000, 5, 4, 500, 'Jakarta Pusat', 'jual', 'jakarta-pusat'),
--     ('Apartemen 2BR Sudirman', 'https://olx.co.id/item/test-2-iid-124', 'Rp 2.500.000.000', 2500000000, 2, 1, 65, 'Jakarta Selatan', 'jual', 'jakarta-selatan');

-- =====================================================
-- SETUP OWNER ACCOUNT (run after user registers)
-- Replace USER_ID with actual user id from auth.users
-- =====================================================
-- UPDATE profiles SET role = 'owner' WHERE email = 'amarathuridhaa@gmail.com';
-- 
-- INSERT INTO api_keys (user_id, key, name, user_email, requests_count, requests_limit, tier, is_active)
-- SELECT id, 'olx_owner_xxxxxxxxxxxxxxxxxxxxxxxx', 'Owner API Key', 'amarathuridhaa@gmail.com', 0, 999999, 'enterprise', true
-- FROM auth.users WHERE email = 'amarathuridhaa@gmail.com';
