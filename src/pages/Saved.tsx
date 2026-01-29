import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useSavedProducts } from "@/hooks/useSavedProducts";
import { cn } from "@/lib/utils";

interface SavedProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  seller_name: string;
}

export default function Saved() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleSave, refresh } = useSavedProducts();
  const [savedItems, setSavedItems] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!user) {
        setSavedItems([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch saved products with product details and images
        const { data, error } = await supabase
          .from("saved_products")
          .select(`
            product_id,
            products (
              id,
              name,
              price,
              seller_id,
              product_images (
                image_url,
                is_primary
              ),
              sellers (
                business_name
              )
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedItems: SavedProduct[] = (data || [])
          .filter((item) => item.products)
          .map((item) => {
            const product = item.products as any;
            const primaryImage = product.product_images?.find((img: any) => img.is_primary);
            const firstImage = product.product_images?.[0];
            
            return {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: primaryImage?.image_url || firstImage?.image_url || "/placeholder.svg",
              seller_name: product.sellers?.business_name || "Unknown Seller",
            };
          });

        setSavedItems(formattedItems);
      } catch (error) {
        console.error("Error fetching saved items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, [user]);

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    const success = await toggleSave(productId);
    if (success) {
      setSavedItems((prev) => prev.filter((item) => item.id !== productId));
      refresh();
    }
    setRemovingId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="pt-16">
          <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-champagne-light flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-champagne" />
            </div>
            <h2 className="font-serif text-xl font-medium mb-2 text-center">
              Sign in to view favorites
            </h2>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Save your favorite jewelry pieces and access them from any device
            </p>
            <Button variant="champagne" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="pt-16">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <div className="px-4 py-6 border-b border-border">
          <h1 className="font-serif text-2xl md:text-3xl font-medium">
            Saved Items
          </h1>
          <p className="text-muted-foreground mt-1">
            Your curated collection of favorites
          </p>
        </div>

        {savedItems.length > 0 ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {savedItems.length} saved items
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedItems.map((product, index) => (
                <div
                  key={product.id}
                  className="flex gap-4 bg-card rounded-2xl p-4 shadow-soft animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-secondary cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium text-sm line-clamp-2 cursor-pointer hover:text-champagne transition-colors"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.seller_name}
                    </p>
                    <p className="font-serif font-semibold mt-2">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={removingId === product.id}
                    className={cn(
                      "w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-colors",
                      "hover:bg-destructive/10 text-muted-foreground hover:text-destructive",
                      removingId === product.id && "opacity-50"
                    )}
                  >
                    {removingId === product.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-champagne-light flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-champagne" />
            </div>
            <h2 className="font-serif text-xl font-medium mb-2 text-center">
              No saved items yet
            </h2>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Start exploring and save the pieces that catch your eye. Your
              favorites will appear here.
            </p>
            <Button variant="champagne" onClick={() => navigate("/shop")}>
              Explore Jewelry
            </Button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
