-- ========================================
-- Fix: Create all missing tables
-- Run this in your Supabase SQL Editor
-- ========================================

-- 1. Create user_roles table (MISSING - causing 404 errors)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2. Create profiles table (if missing)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Create sellers table (if missing)
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    business_name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    rating NUMERIC(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    specialties TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sellers
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- RLS policies for sellers
CREATE POLICY "Anyone can view sellers"
ON public.sellers FOR SELECT
USING (true);

CREATE POLICY "Sellers can update their own info"
ON public.sellers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Sellers can insert their own info"
ON public.sellers FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Create products table (if missing)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    category TEXT NOT NULL,
    stone TEXT,
    style TEXT,
    material TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT true,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS policies for products
CREATE POLICY "Anyone can view products"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Sellers can insert their own products"
ON public.products FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.sellers 
        WHERE id = seller_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Sellers can update their own products"
ON public.products FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.sellers 
        WHERE id = seller_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Sellers can delete their own products"
ON public.products FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.sellers 
        WHERE id = seller_id AND user_id = auth.uid()
    )
);

-- 5. Create conversations table (if missing)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(buyer_id, seller_id)
);

-- Enable RLS on conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their conversations as buyer"
ON public.conversations FOR SELECT
USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view their conversations"
ON public.conversations FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.sellers 
    WHERE sellers.id = conversations.seller_id 
    AND sellers.user_id = auth.uid()
));

CREATE POLICY "Buyers can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- 6. Create messages table (if missing)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (
        c.buyer_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM public.sellers s 
            WHERE s.id = c.seller_id 
            AND s.user_id = auth.uid()
        )
    )
));

CREATE POLICY "Users can send messages in their conversations"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND (
            c.buyer_id = auth.uid() 
            OR EXISTS (
                SELECT 1 FROM public.sellers s 
                WHERE s.id = c.seller_id 
                AND s.user_id = auth.uid()
            )
        )
    )
);

-- 7. Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 8. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_sellers_updated_at ON public.sellers;
CREATE TRIGGER update_sellers_updated_at
BEFORE UPDATE ON public.sellers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify tables were created:

-- Check user_roles table
SELECT 'user_roles' as table_name, COUNT(*) as row_count FROM public.user_roles;

-- Check profiles table
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM public.profiles;

-- Check sellers table
SELECT 'sellers' as table_name, COUNT(*) as row_count FROM public.sellers;

-- Check products table
SELECT 'products' as table_name, COUNT(*) as row_count FROM public.products;

-- Check conversations table
SELECT 'conversations' as table_name, COUNT(*) as row_count FROM public.conversations;

-- Check messages table
SELECT 'messages' as table_name, COUNT(*) as row_count FROM public.messages;

-- ========================================
-- FIX COMPLETE!
-- ========================================
