-- ========================================
-- Fix: Create only missing tables safely
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

-- RLS policies for user_roles (only create if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' 
        AND policyname = 'Users can view their own roles'
    ) THEN
        CREATE POLICY "Users can view their own roles"
        ON public.user_roles FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' 
        AND policyname = 'Users can insert their own roles'
    ) THEN
        CREATE POLICY "Users can insert their own roles"
        ON public.user_roles FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 2. Create conversations table (if missing)
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

-- Conversations policies (only create if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Users can view their conversations as buyer'
    ) THEN
        CREATE POLICY "Users can view their conversations as buyer"
        ON public.conversations FOR SELECT
        USING (auth.uid() = buyer_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Sellers can view their conversations'
    ) THEN
        CREATE POLICY "Sellers can view their conversations"
        ON public.conversations FOR SELECT
        USING (EXISTS (
            SELECT 1 FROM public.sellers 
            WHERE sellers.id = conversations.seller_id 
            AND sellers.user_id = auth.uid()
        ));
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'conversations' 
        AND policyname = 'Buyers can create conversations'
    ) THEN
        CREATE POLICY "Buyers can create conversations"
        ON public.conversations FOR INSERT
        WITH CHECK (auth.uid() = buyer_id);
    END IF;
END $$;

-- 3. Create messages table (if missing)
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

-- Messages policies (only create if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'messages' 
        AND policyname = 'Users can view messages in their conversations'
    ) THEN
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
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'messages' 
        AND policyname = 'Users can send messages in their conversations'
    ) THEN
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
    END IF;
END $$;

-- 4. Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 5. Create triggers for updated_at (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_conversations_updated_at'
    ) THEN
        CREATE TRIGGER update_conversations_updated_at
        BEFORE UPDATE ON public.conversations
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- 6. Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Run these to verify tables were created:

-- Check user_roles table
SELECT 'user_roles' as table_name, COUNT(*) as row_count FROM public.user_roles;

-- Check conversations table
SELECT 'conversations' as table_name, COUNT(*) as row_count FROM public.conversations;

-- Check messages table
SELECT 'messages' as table_name, COUNT(*) as row_count FROM public.messages;

-- ========================================
-- FIX COMPLETE!
-- ========================================
