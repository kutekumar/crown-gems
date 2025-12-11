import { products } from "@/data/mockProducts";
import { ProductCard } from "./ProductCard";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FeaturedProducts = () => {
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <section className="py-10 md:py-16 bg-ivory-dark">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-champagne-light rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold">
                Featured Pieces
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                Handpicked by our curators
              </p>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-sm font-medium text-champagne hover:underline underline-offset-4 transition-all">
            See All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 flex justify-center sm:hidden">
          <Button variant="champagne-outline" size="default">
            View All Featured
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
