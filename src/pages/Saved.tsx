import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { products } from "@/data/mockProducts";
import { ProductCard } from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";

export default function Saved() {
  const navigate = useNavigate();
  // Mock saved items - in real app this would come from state/database
  const [savedItems] = useState(products.slice(0, 3));

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

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
              {savedItems.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
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
            <Button variant="champagne" onClick={() => navigate("/")}>
              Explore Jewelry
            </Button>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
