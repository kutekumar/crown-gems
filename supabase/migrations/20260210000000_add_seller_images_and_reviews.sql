-- Add cover_image to sellers table
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Add cover_image to seller_applications table
ALTER TABLE public.seller_applications ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Create product_reviews table for rating system
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(product_id, user_id)
);

-- Enable RLS on product_reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for product_reviews
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

-- Add trigger for updated_at
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
