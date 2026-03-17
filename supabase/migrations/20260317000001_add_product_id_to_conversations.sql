-- Add product_id column to conversations table
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE SET NULL;
