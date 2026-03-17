-- ========================================
-- Fix Sellers Table RLS Policy
-- Allow admins to create seller records
-- Run this in your Supabase SQL Editor
-- ========================================

-- Add policy to allow admins to insert sellers
CREATE POLICY "Admins can insert sellers"
ON public.sellers FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'sellers';

-- ========================================
-- After running this, try approving again!
-- ========================================
