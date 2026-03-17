-- ========================================
-- Check Seller Login Details
-- Run this in your Supabase SQL Editor
-- ========================================

-- 1. Find the approved seller application
SELECT 
    sa.id as application_id,
    sa.user_id,
    sa.business_name,
    sa.email as business_email,
    sa.status,
    au.email as login_email
FROM public.seller_applications sa
JOIN auth.users au ON sa.user_id = au.id
WHERE sa.status = 'approved';

-- 2. Check if seller record exists for this user
SELECT 
    s.*,
    au.email as login_email
FROM public.sellers s
JOIN auth.users au ON s.user_id = au.id;

-- 3. Get the login email from auth.users
SELECT id, email, created_at, last_sign_in_at
FROM auth.users
WHERE id IN (
    SELECT user_id FROM public.seller_applications WHERE status = 'approved'
);

-- ========================================
-- The email shown in step 3 is what you use to LOGIN
-- The business_name is just your seller profile name
-- ========================================
