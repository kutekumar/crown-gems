import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductWithImages {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stone: string | null;
  style: string | null;
  is_featured: boolean;
  is_new: boolean;
  tags: string[] | null;
  created_at: string;
  seller: {
    id: string;
    business_name: string;
    is_verified: boolean;
    rating: number;
    location: string | null;
    phone: string | null;
    email: string | null;
  };
  images: {
    id: string;
    url: string;
    is_primary: boolean;
  }[];
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<ProductWithImages[]> => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          sellers (id, business_name, is_verified, rating, location, phone, email),
          product_images (id, image_url, is_primary, display_order)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        category: p.category,
        stone: p.stone,
        style: p.style,
        is_featured: p.is_featured || false,
        is_new: p.is_new || false,
        tags: p.tags,
        created_at: p.created_at,
        seller: {
          id: p.sellers?.id || "",
          business_name: p.sellers?.business_name || "Unknown Seller",
          is_verified: p.sellers?.is_verified || false,
          rating: Number(p.sellers?.rating) || 0,
          location: p.sellers?.location,
          phone: p.sellers?.phone,
          email: p.sellers?.email,
        },
        images: (p.product_images || [])
          .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
          .map((img: any) => ({
            id: img.id,
            url: img.image_url,
            is_primary: img.is_primary,
          })),
      }));
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<ProductWithImages | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          sellers (id, business_name, is_verified, rating, location, phone, email),
          product_images (id, image_url, is_primary, display_order)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        stone: data.stone,
        style: data.style,
        is_featured: data.is_featured || false,
        is_new: data.is_new || false,
        tags: data.tags,
        created_at: data.created_at,
        seller: {
          id: data.sellers?.id || "",
          business_name: data.sellers?.business_name || "Unknown Seller",
          is_verified: data.sellers?.is_verified || false,
          rating: Number(data.sellers?.rating) || 0,
          location: data.sellers?.location,
          phone: data.sellers?.phone,
          email: data.sellers?.email,
        },
        images: (data.product_images || [])
          .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
          .map((img: any) => ({
            id: img.id,
            url: img.image_url,
            is_primary: img.is_primary,
          })),
      };
    },
    enabled: !!id,
  });
}
