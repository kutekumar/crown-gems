import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SavedProductsContextType {
  savedProductIds: Set<string>;
  loading: boolean;
  toggleSave: (productId: string) => Promise<boolean>;
  isSaved: (productId: string) => boolean;
  refresh: () => Promise<void>;
}

const SavedProductsContext = createContext<SavedProductsContextType | undefined>(undefined);

export function SavedProductsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchSavedProducts = useCallback(async () => {
    if (!user) {
      setSavedProductIds(new Set());
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("saved_products")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) throw error;

      setSavedProductIds(new Set(data.map((item) => item.product_id)));
    } catch (error) {
      console.error("Error fetching saved products:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedProducts();
  }, [fetchSavedProducts]);

  const toggleSave = async (productId: string) => {
    if (!user) {
      toast.info("Please sign in to save products");
      return false;
    }

    const isSavedProduct = savedProductIds.has(productId);

    try {
      if (isSavedProduct) {
        // Remove from saved
        const { error } = await supabase
          .from("saved_products")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;

        setSavedProductIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success("Removed from favorites");
      } else {
        // Add to saved
        const { error } = await supabase
          .from("saved_products")
          .insert({
            user_id: user.id,
            product_id: productId,
          });

        if (error) throw error;

        setSavedProductIds((prev) => new Set([...prev, productId]));
        toast.success("Added to favorites");
      }
      return true;
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Failed to update favorites");
      return false;
    }
  };

  const isSaved = (productId: string) => savedProductIds.has(productId);

  return (
    <SavedProductsContext.Provider value={{ savedProductIds, loading, toggleSave, isSaved, refresh: fetchSavedProducts }}>
      {children}
    </SavedProductsContext.Provider>
  );
}

export function useSavedProducts() {
  const context = useContext(SavedProductsContext);
  if (context === undefined) {
    throw new Error("useSavedProducts must be used within a SavedProductsProvider");
  }
  return context;
}
