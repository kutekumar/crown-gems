-- ========================================
-- GemsLink: Admin Setup
-- Run this in your Supabase SQL Editor
-- ========================================

-- Create admin_users table to track admin roles
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin_users table
CREATE POLICY "Only admins can view admin users"
ON public.admin_users FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = user_uuid
    );
$$;

-- Update seller_applications policies to allow admin access
DROP POLICY IF EXISTS "Admins can view all applications" ON public.seller_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.seller_applications;

CREATE POLICY "Admins can view all applications"
ON public.seller_applications FOR SELECT
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Admins can update applications"
ON public.seller_applications FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid()
    )
);

-- Function to approve seller application
CREATE OR REPLACE FUNCTION public.approve_seller_application(application_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    app_record RECORD;
BEGIN
    -- Check if user is admin
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can approve applications';
    END IF;

    -- Get application details
    SELECT * INTO app_record
    FROM public.seller_applications
    WHERE id = application_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found';
    END IF;

    -- Update application status
    UPDATE public.seller_applications
    SET status = 'approved', updated_at = now()
    WHERE id = application_id;

    -- Create seller record
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
    ) VALUES (
        app_record.user_id,
        app_record.business_name,
        app_record.description,
        app_record.location,
        app_record.email,
        app_record.phone,
        app_record.specialties,
        app_record.logo_url,
        app_record.cover_image_url,
        true
    )
    ON CONFLICT (user_id) DO UPDATE
    SET
        business_name = EXCLUDED.business_name,
        description = EXCLUDED.description,
        location = EXCLUDED.location,
        email = EXCLUDED.email,
        phone = EXCLUDED.phone,
        specialties = EXCLUDED.specialties,
        logo_url = EXCLUDED.logo_url,
        cover_image_url = EXCLUDED.cover_image_url,
        is_verified = true,
        updated_at = now();
END;
$$;

-- Function to reject seller application
CREATE OR REPLACE FUNCTION public.reject_seller_application(application_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_admin(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can reject applications';
    END IF;

    -- Update application status
    UPDATE public.seller_applications
    SET status = 'rejected', updated_at = now()
    WHERE id = application_id;
END;
$$;

-- ========================================
-- INSERT YOUR ADMIN USER
-- Replace 'your-email@example.com' with your actual email
-- ========================================

-- First, you need to register an account normally through the app
-- Then come back and run this query with YOUR email:

-- INSERT INTO public.admin_users (user_id, email)
-- SELECT id, email
-- FROM auth.users
-- WHERE email = 'your-email@example.com';

-- ========================================
-- After registering, run this to make yourself admin:
-- Replace 'your-email@example.com' with the email you used to register
-- ========================================

-- Example (UNCOMMENT and replace email):
-- INSERT INTO public.admin_users (user_id, email)
-- SELECT id, email
-- FROM auth.users
-- WHERE email = 'admin@mingalarmon.com';

