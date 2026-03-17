import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductCard } from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { RatingDiamond } from "@/components/icons/DiamondIcon";
import { MapPin, Shield, MessageCircle, ArrowLeft, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useMessages } from "@/hooks/useMessages";
import { Product } from "@/data/mockProducts";

interface SellerProfile {
  id: string;
  business_name: string;
  description: string | null;
  location: string | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  specialties: string[] | null;
  logo_url: string | null;
  cover_image_url: string | null;
}

interface ProductWithImages {
  id: string;
  name: string;
  price: number;
  category: string;
  stone: string | null;
  style: string | null;
  is_new: boolean;
  is_featured: boolean;
  images: { url: string }[];
  seller: {
    id: string;
    business_name: string;
    is_verified: boolean;
    rating: number;
  };
}

const convertDbProductToProduct = (dbProduct: any): Product => {
  // Handle images array - the field is image_url not url
  const imageUrl = Array.isArray(dbProduct.images) && dbProduct.images.length > 0
    ? dbProduct.images[0].image_url
    : "/placeholder.svg";
  
  // Handle seller data
  const sellerData = dbProduct.seller || {
    business_name: "Unknown Seller",
    is_verified: false,
    rating: 0
  };

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    price: dbProduct.price,
    image: imageUrl,
    category: dbProduct.category,
    stone: dbProduct.stone || "Unknown",
    style: dbProduct.style || "Classic",
    seller: {
      name: sellerData.business_name,
      verified: sellerData.is_verified,
      rating: sellerData.rating,
    },
    isNew: dbProduct.is_new,
    isFeatured: dbProduct.is_featured,
  };
};

const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startConversation } = useMessages();
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Fetch seller profile
  const { data: seller, isLoading: sellerLoading } = useQuery({
    queryKey: ["seller", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sellers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as SellerProfile;
    },
    enabled: !!id,
  });

  // Fetch seller's products only
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["seller-products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          images:product_images(image_url),
          seller:sellers(id, business_name, is_verified, rating)
        `)
        .eq("seller_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return [];
      }

      return (data as any[]).map(dbProduct => 
        convertDbProductToProduct(dbProduct as ProductWithImages)
      );
    },
    enabled: !!id,
  });

  const handleContactSeller = async () => {
    if (!user) {
      toast.info("Please sign in to contact sellers");
      navigate("/auth");
      return;
    }

    if (!seller) return;

    setIsStartingChat(true);
    try {
      const conversationId = await startConversation(seller.id);
      if (conversationId) {
        navigate("/messages");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    }
    setIsStartingChat(false);
  };

  const renderRating = (rating: number) => {
    const diamonds = [];
    const fullDiamonds = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      diamonds.push(
        <RatingDiamond
          key={i}
          filled={i < fullDiamonds}
          className={cn(i < fullDiamonds ? "text-champagne" : "text-platinum")}
        />
      );
    }
    return diamonds;
  };

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="container max-w-7xl mx-auto px-4 py-6">
          <Skeleton className="w-full h-64 rounded-2xl mb-6" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-20 w-full mb-6" />
        </main>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl mb-4">Seller not found</h2>
          <Button variant="champagne" onClick={() => navigate("/sellers")}>
            Browse Sellers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Cover Image */}
        {seller.cover_image_url && (
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
            <img
              src={seller.cover_image_url}
              alt={`${seller.business_name} cover`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Seller Info Card */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {seller.logo_url ? (
                <img
                  src={seller.logo_url}
                  alt={`${seller.business_name} logo`}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover border-2 border-border"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-champagne-light flex items-center justify-center">
                  <span className="font-serif font-semibold text-4xl text-champagne">
                    {seller.business_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="font-serif text-2xl md:text-3xl font-semibold">
                      {seller.business_name}
                    </h1>
                    {seller.is_verified && (
                      <span className="w-6 h-6 bg-champagne rounded-full flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-primary-foreground" />
                      </span>
                    )}
                  </div>
                  {seller.location && (
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{seller.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    {renderRating(seller.rating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {seller.rating.toFixed(1)} ({seller.review_count} reviews)
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="champagne-outline"
                    size="sm"
                    onClick={handleContactSeller}
                    disabled={isStartingChat}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {isStartingChat ? "Opening..." : "Contact"}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              {seller.description && (
                <p className="text-muted-foreground mb-4">{seller.description}</p>
              )}

              {/* Specialties */}
              {seller.specialties && seller.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {seller.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-secondary text-sm rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold mb-4">
            Products from {seller.business_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {productsLoading
              ? "Loading..."
              : `${products?.length || 0} ${products?.length === 1 ? "product" : "products"} available`}
          </p>
        </div>

        {/* Products Grid */}
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-secondary/30 rounded-2xl">
            <p className="text-muted-foreground">
              This seller hasn't listed any products yet.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default SellerProfile;
