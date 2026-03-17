-- ========================================
-- Fix Admin Users RLS Policy
-- The current policy has a circular dependency
-- Run this in your Supabase SQL Editor
-- ========================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "Only admins can view admin users" ON public.admin_users;

-- Create a new policy that allows users to check if THEY are admin
CREATE POLICY "Users can check their own admin status"
ON public.admin_users FOR SELECT
USING (user_id = auth.uid());

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'admin_users';

-- Test query (should work now)
SELECT * FROM public.admin_users WHERE user_id = auth.uid();

-- ========================================
-- After running this, refresh your app!
-- The Admin Dashboard link will appear.
-- ========================================
