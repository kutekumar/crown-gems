-- ========================================
-- GemsLink: COMPLETE DATABASE MIGRATION
-- For New Supabase Instance: vhuenludpazuzmsylnxa.supabase.co
-- Run this in your NEW Supabase SQL Editor
-- ========================================

-- ========================================
-- 1. PROFILES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ========================================
-- 2. SELLER APPLICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.seller_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    specialties TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    logo_url TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own applications"
ON public.seller_applications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications"
ON public.seller_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications"
ON public.seller_applications FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND email LIKE '%admin%'
    )
);

-- ========================================
-- 3. SELLERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    email TEXT,
    phone TEXT,
    rating NUMERIC(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    specialties TEXT[],
    logo_url TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sellers"
ON public.sellers FOR SELECT
USING (true);

CREATE POLICY "Sellers can update their own profile"
ON public.sellers FOR UPDATE
USING (auth.uid() = user_id);

-- ========================================
-- 4. PRODUCTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    category TEXT NOT NULL,
    stone TEXT,
    style TEXT,
    metal_type TEXT,
    weight NUMERIC(10,2),
    dimensions TEXT,
    is_new BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

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

-- ========================================
-- 5. PRODUCT IMAGES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images"
ON public.product_images FOR SELECT
USING (true);

CREATE POLICY "Sellers can manage their product images"
ON public.product_images FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.products p
        JOIN public.sellers s ON p.seller_id = s.id
        WHERE p.id = product_id AND s.user_id = auth.uid()
    )
);

-- ========================================
-- 6. SAVED PRODUCTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.saved_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved products"
ON public.saved_products FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved products"
ON public.saved_products FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved products"
ON public.saved_products FOR DELETE
USING (auth.uid() = user_id);

-- ========================================
-- 7. CONVERSATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(buyer_id, seller_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
ON public.conversations FOR SELECT
USING (
    auth.uid() = buyer_id OR 
    EXISTS (
        SELECT 1 FROM public.sellers
        WHERE id = seller_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Users can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their conversations"
ON public.conversations FOR UPDATE
USING (
    auth.uid() = buyer_id OR 
    EXISTS (
        SELECT 1 FROM public.sellers
        WHERE id = seller_id AND user_id = auth.uid()
    )
);

-- ========================================
-- 8. MESSAGES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = conversation_id AND (
            c.buyer_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.sellers
                WHERE id = c.seller_id AND user_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = conversation_id AND (
            c.buyer_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM public.sellers
                WHERE id = c.seller_id AND user_id = auth.uid()
            )
        )
    )
);

-- ========================================
-- 9. PRODUCT REVIEWS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(product_id, user_id)
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product reviews"
ON public.product_reviews FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.product_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON public.product_reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.product_reviews FOR DELETE
USING (auth.uid() = user_id);

-- ========================================
-- 10. FUNCTIONS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seller_applications_updated_at
BEFORE UPDATE ON public.seller_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sellers_updated_at
BEFORE UPDATE ON public.sellers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate average rating for a product
CREATE OR REPLACE FUNCTION public.calculate_product_rating(product_uuid UUID)
RETURNS NUMERIC(2,1)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
  FROM public.product_reviews
  WHERE product_id = product_uuid
$$;

-- Function to calculate seller rating based on all their products
CREATE OR REPLACE FUNCTION public.update_seller_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update seller rating and review count when a review is added/updated/deleted
  UPDATE public.sellers s
  SET 
    rating = COALESCE((
      SELECT ROUND(AVG(pr.rating)::numeric, 1)
      FROM public.product_reviews pr
      JOIN public.products p ON pr.product_id = p.id
      WHERE p.seller_id = (
        SELECT seller_id FROM public.products WHERE id = COALESCE(NEW.product_id, OLD.product_id)
      )
    ), 0),
    review_count = COALESCE((
      SELECT COUNT(*)
      FROM public.product_reviews pr
      JOIN public.products p ON pr.product_id = p.id
      WHERE p.seller_id = (
        SELECT seller_id FROM public.products WHERE id = COALESCE(NEW.product_id, OLD.product_id)
      )
    ), 0)
  WHERE s.id = (
    SELECT seller_id FROM public.products WHERE id = COALESCE(NEW.product_id, OLD.product_id)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers to update seller rating
CREATE TRIGGER update_seller_rating_on_review_insert
AFTER INSERT ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_seller_rating();

CREATE TRIGGER update_seller_rating_on_review_update
AFTER UPDATE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_seller_rating();

CREATE TRIGGER update_seller_rating_on_review_delete
AFTER DELETE ON public.product_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_seller_rating();

-- ========================================
-- 11. STORAGE BUCKETS
-- ========================================

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage bucket for seller images (logo and cover)
INSERT INTO storage.buckets (id, name, public)
VALUES ('seller-images', 'seller-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for seller images
CREATE POLICY "Anyone can view seller images"
ON storage.objects FOR SELECT
USING (bucket_id = 'seller-images');

CREATE POLICY "Authenticated users can upload seller images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'seller-images' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own seller images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'seller-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own seller images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'seller-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ========================================
-- MIGRATION COMPLETE!
-- ========================================
-- Next steps:
-- 1. Update your .env file with new credentials
-- 2. Restart your development server
-- 3. Test authentication and features
-- ========================================
