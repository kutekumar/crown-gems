-- Fix: Add product_id column to conversations table
-- Run this in your Supabase SQL Editor

ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversations' 
AND table_schema = 'public';
