-- =====================================================
-- OWNER ACCOUNT SETUP
-- Run this AFTER the user has registered via the app
-- =====================================================

-- Step 1: Update the profile to owner role
UPDATE profiles 
SET 
    role = 'owner',
    tier = 'enterprise'
WHERE email = 'amarathuridhaa@gmail.com';

-- Step 2: Update the API key to enterprise tier
UPDATE api_keys
SET 
    tier = 'enterprise',
    requests_limit = 999999,
    name = 'Owner Master Key'
WHERE user_email = 'amarathuridhaa@gmail.com';

-- Verify the setup
SELECT 
    p.email,
    p.full_name,
    p.role,
    p.tier as profile_tier,
    a.key as api_key,
    a.tier as key_tier,
    a.requests_limit
FROM profiles p
LEFT JOIN api_keys a ON a.user_id = p.id
WHERE p.email = 'amarathuridhaa@gmail.com';
