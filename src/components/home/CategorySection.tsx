import { categories } from "@/data/mockProducts";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CategorySection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/shop?category=${categoryId}`);
  };
  return (
    <section className="py-10 md:py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">
              Shop by Category
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Find your perfect piece
            </p>
          </div>
          <button className="hidden sm:flex items-center gap-1 text-sm font-medium text-champagne hover:underline underline-offset-4 transition-all">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                <h3 className="font-serif text-lg md:text-xl font-semibold text-primary-foreground mb-1">
                  {category.name}
                </h3>
                <p className="text-xs text-primary-foreground/70">
                  {category.productCount} pieces
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-champagne/50 rounded-2xl transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
