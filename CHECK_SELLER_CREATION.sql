-- ========================================
-- Check if seller was created
-- Run this in your Supabase SQL Editor
-- ========================================

-- 1. Check approved applications
SELECT id, user_id, business_name, status, created_at 
FROM public.seller_applications 
WHERE status = 'approved';

-- 2. Check if corresponding seller exists
SELECT s.id, s.user_id, s.business_name, s.is_verified, s.created_at
FROM public.sellers s
JOIN public.seller_applications sa ON s.user_id = sa.user_id
WHERE sa.status = 'approved';

-- 3. Check all sellers
SELECT * FROM public.sellers;

-- 4. If no seller exists, manually create it from the approved application
-- Replace the user_id with the one from step 1

/*
INSERT INTO public.sellers (
    user_id, 
    business_name, 
    description, 
    location, 
    email, 
    phone, 
    specialties, 
    logo_url, 
    cover_image_url, 
    is_verified
)
SELECT 
    user_id,
    business_name,
    description,
    location,
    email,
    phone,
    specialties,
    logo_url,
    cover_image_url,
    true
FROM public.seller_applications
WHERE status = 'approved'
AND user_id NOT IN (SELECT user_id FROM public.sellers);
*/

-- ========================================
-- Uncomment and run the INSERT above 
-- to manually create the seller
-- ========================================
