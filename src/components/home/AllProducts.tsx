import { useState } from "react";
import { products, stones, styles, priceRanges, categories } from "@/data/mockProducts";
import { ProductCard } from "./ProductCard";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStone, setSelectedStone] = useState("All Stones");
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
    const stoneMatch = selectedStone === "All Stones" || product.stone === selectedStone;
    const styleMatch = selectedStyle === "All Styles" || product.style === selectedStyle;
    const priceMatch = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
    return categoryMatch && stoneMatch && styleMatch && priceMatch;
  });

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedStone !== "All Stones" ||
    selectedStyle !== "All Styles" ||
    selectedPriceRange.label !== "All Prices";

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedStone("All Stones");
    setSelectedStyle("All Styles");
    setSelectedPriceRange(priceRanges[0]);
  };

  return (
    <section className="py-10 md:py-16">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">
              Browse All Jewelry
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {filteredProducts.length} pieces available
            </p>
          </div>
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-5 h-5 bg-champagne text-primary-foreground text-xs rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Category Pills - Horizontal Scroll */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === "all"
                ? "bg-champagne text-primary-foreground shadow-soft"
                : "bg-secondary text-secondary-foreground hover:bg-champagne-light"
            )}
          >
            All Jewelry
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === category.id
                  ? "bg-champagne text-primary-foreground shadow-soft"
                  : "bg-secondary text-secondary-foreground hover:bg-champagne-light"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-3 mb-6">
          {/* Stone Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-xl text-sm hover:bg-champagne-light transition-colors">
              <span className="text-muted-foreground">Stone:</span>
              <span className="font-medium">{selectedStone}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2">
                {stones.map((stone) => (
                  <button
                    key={stone}
                    onClick={() => setSelectedStone(stone)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedStone === stone
                        ? "bg-champagne-light text-champagne font-medium"
                        : "hover:bg-secondary"
                    )}
                  >
                    {stone}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Style Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-xl text-sm hover:bg-champagne-light transition-colors">
              <span className="text-muted-foreground">Style:</span>
              <span className="font-medium">{selectedStyle}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedStyle === style
                        ? "bg-champagne-light text-champagne font-medium"
                        : "hover:bg-secondary"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-xl text-sm hover:bg-champagne-light transition-colors">
              <span className="text-muted-foreground">Price:</span>
              <span className="font-medium">{selectedPriceRange.label}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-xl shadow-elevated border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="p-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceRange(range)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedPriceRange.label === range.label
                        ? "bg-champagne-light text-champagne font-medium"
                        : "hover:bg-secondary"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Mobile Filter Drawer */}
        <div
          className={cn(
            "fixed inset-0 z-50 md:hidden transition-all duration-300",
            isFilterOpen ? "visible" : "invisible"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-charcoal/50 transition-opacity",
              isFilterOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setIsFilterOpen(false)}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6 pb-10 transition-transform duration-300",
              isFilterOpen ? "translate-y-0" : "translate-y-full"
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-semibold">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stone */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Gemstone
              </label>
              <div className="flex flex-wrap gap-2">
                {stones.map((stone) => (
                  <button
                    key={stone}
                    onClick={() => setSelectedStone(stone)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all",
                      selectedStone === stone
                        ? "bg-champagne text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {stone}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="mb-6">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Style
              </label>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all",
                      selectedStyle === style
                        ? "bg-champagne text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Price Range
              </label>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceRange(range)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all",
                      selectedPriceRange.label === range.label
                        ? "bg-champagne text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearFilters}
              >
                Clear All
              </Button>
              <Button
                variant="champagne"
                className="flex-1"
                onClick={() => setIsFilterOpen(false)}
              >
                Show {filteredProducts.length} Results
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                className="animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No products match your filters
            </p>
            <Button variant="champagne-outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
