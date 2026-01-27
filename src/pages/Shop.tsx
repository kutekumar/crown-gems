import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ProductCard } from "@/components/home/ProductCard";
import { products, categories, stones, styles } from "@/data/mockProducts";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const priceRanges = [
  { label: "All Prices", value: "all" },
  { label: "Under $500", value: "0-500" },
  { label: "$500 - $1,000", value: "500-1000" },
  { label: "$1,000 - $2,500", value: "1000-2500" },
  { label: "$2,500+", value: "2500+" },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popular" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStone, setActiveStone] = useState<string | null>(null);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [activePriceRange, setActivePriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Handle URL category parameter
  useEffect(() => {
    if (categoryFromUrl) {
      const matchedCategory = categories.find(
        c => c.id.toLowerCase() === categoryFromUrl.toLowerCase()
      );
      if (matchedCategory) {
        setActiveCategory(matchedCategory.name);
      }
    }
  }, [categoryFromUrl]);

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      const cat = categories.find(c => c.name === category);
      if (cat) {
        searchParams.set("category", cat.id);
      }
    }
    setSearchParams(searchParams);
  };

  const allCategories = ["All", ...categories.map(c => c.name)];

  const filteredProducts = products.filter(product => {
    // Match category by name (categories in products use lowercase like "rings", "necklaces")
    if (activeCategory !== "All") {
      const categoryObj = categories.find(c => c.name === activeCategory);
      if (categoryObj && product.category !== categoryObj.id) return false;
    }
    if (activeStone && product.stone !== activeStone) return false;
    if (activeStyle && product.style !== activeStyle) return false;
    if (activePriceRange !== "all") {
      const [min, max] = activePriceRange.split("-").map(Number);
      if (max && (product.price < min || product.price > max)) return false;
      if (!max && product.price < min) return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "popular":
        return b.seller.rating - a.seller.rating;
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    handleCategoryChange("All");
    setActiveStone(null);
    setActiveStyle(null);
    setActivePriceRange("all");
  };

  const hasActiveFilters = activeCategory !== "All" || activeStone || activeStyle || activePriceRange !== "all";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">Shop All Jewelry</h1>
          <p className="text-muted-foreground">
            Discover exquisite pieces from verified sellers worldwide
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="champagne-outline" size="sm" className="md:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 w-5 h-5 rounded-full bg-champagne text-champagne-foreground text-xs flex items-center justify-center">
                      !
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle className="font-serif text-xl">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                  {/* Categories */}
                  <div>
                    <h3 className="font-medium mb-3">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      {allCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryChange(category)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm transition-all",
                            activeCategory === category
                              ? "bg-champagne text-champagne-foreground"
                              : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stones */}
                  <div>
                    <h3 className="font-medium mb-3">Stone Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {stones.map((stone) => (
                        <button
                          key={stone}
                          onClick={() => setActiveStone(activeStone === stone ? null : stone)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm transition-all",
                            activeStone === stone
                              ? "bg-champagne text-champagne-foreground"
                              : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                          )}
                        >
                          {stone}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Styles */}
                  <div>
                    <h3 className="font-medium mb-3">Style</h3>
                    <div className="flex flex-wrap gap-2">
                      {styles.map((style) => (
                        <button
                          key={style}
                          onClick={() => setActiveStyle(activeStyle === style ? null : style)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm transition-all",
                            activeStyle === style
                              ? "bg-champagne text-champagne-foreground"
                              : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="flex flex-wrap gap-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.value}
                          onClick={() => setActivePriceRange(range.value)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm transition-all",
                            activePriceRange === range.value
                              ? "bg-champagne text-champagne-foreground"
                              : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button variant="subtle" onClick={clearFilters} className="w-full">
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Category Pills */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all",
                    activeCategory === category
                      ? "bg-champagne text-champagne-foreground"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <span className="hidden sm:inline">Sort by:</span>
              <span className="font-medium">{sortOptions.find(o => o.value === sortBy)?.label}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showSortDropdown && "rotate-180")} />
            </button>
            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-elegant border border-border z-50 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors",
                        sortBy === option.value && "bg-champagne/10 text-champagne"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-4 mb-6 flex-wrap">
          {/* Stone Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Stone:</span>
            <div className="flex gap-1">
              {stones.slice(0, 4).map((stone) => (
                <button
                  key={stone}
                  onClick={() => setActiveStone(activeStone === stone ? null : stone)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs transition-all",
                    activeStone === stone
                      ? "bg-champagne text-champagne-foreground"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                  )}
                >
                  {stone}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Price:</span>
            <div className="flex gap-1">
              {priceRanges.slice(1).map((range) => (
                <button
                  key={range.value}
                  onClick={() => setActivePriceRange(activePriceRange === range.value ? "all" : range.value)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs transition-all",
                    activePriceRange === range.value
                      ? "bg-champagne text-champagne-foreground"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <Button variant="subtle" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {sortedProducts.length} {sortedProducts.length === 1 ? "piece" : "pieces"} found
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No pieces match your filters</p>
            <Button variant="champagne-outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Shop;
