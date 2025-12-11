import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { categories, products } from "@/data/mockProducts";
import { ProductCard } from "@/components/home/ProductCard";
import { cn } from "@/lib/utils";

export default function Categories() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <div className="px-4 py-6 border-b border-border">
          <h1 className="font-serif text-2xl md:text-3xl font-medium">
            Browse Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore our curated collections
          </p>
        </div>

        {/* Category Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === category.id ? null : category.id
                  )
                }
                className={cn(
                  "group relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-300 animate-fade-up",
                  activeCategory === category.id
                    ? "ring-2 ring-champagne ring-offset-2"
                    : "hover:shadow-card"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-serif text-lg text-ivory font-medium">
                    {category.name}
                  </h3>
                  <p className="text-ivory/70 text-xs">
                    {category.productCount} pieces
                  </p>
                </div>
                {activeCategory === category.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-champagne rounded-full flex items-center justify-center">
                    <svg
                      viewBox="0 0 12 12"
                      className="w-3 h-3 text-primary-foreground"
                      fill="currentColor"
                    >
                      <path d="M10.28 2.28L4.5 8.06 1.72 5.28a.75.75 0 00-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00-1.06-1.06z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Products */}
        <div className="px-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-medium">
              {activeCategory
                ? `${categories.find((c) => c.id === activeCategory)?.name}`
                : "All Jewelry"}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {filteredProducts.map((product, index) => (
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
      </main>
      <BottomNav />
    </div>
  );
}
