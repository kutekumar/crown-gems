-- ========================================
-- Check and Add Admin User
-- Run this in your Supabase SQL Editor
-- ========================================

-- STEP 1: Check if admin_users table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_users'
);

-- STEP 2: Check if your user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@mingalarmon.com';

-- STEP 3: Check if you're already in admin_users table
SELECT * FROM public.admin_users 
WHERE email = 'admin@mingalarmon.com';

-- STEP 4: If table exists but you're not in it, run this to add yourself:
-- (Only run this if the above query returns no results)

INSERT INTO public.admin_users (user_id, email)
SELECT id, email 
FROM auth.users 
WHERE email = 'admin@mingalarmon.com'
ON CONFLICT (user_id) DO NOTHING;

-- STEP 5: Verify you were added
SELECT * FROM public.admin_users;

-- ========================================
-- After running this, refresh your app and 
-- the Admin Dashboard link should appear!
-- ========================================
