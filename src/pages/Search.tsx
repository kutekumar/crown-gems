import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, TrendingUp } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { products, stones, styles } from "@/data/mockProducts";
import { ProductCard } from "@/components/home/ProductCard";
import { cn } from "@/lib/utils";

const trendingSearches = [
  "Diamond Rings",
  "Pearl Earrings",
  "Gold Necklace",
  "Sapphire",
  "Vintage",
];

const recentSearches = ["Emerald", "Tennis Bracelet", "Solitaire"];

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const searchTerm = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.stone.toLowerCase().includes(searchTerm) ||
        p.style.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        p.seller.name.toLowerCase().includes(searchTerm)
    );
  }, [query]);

  const handleSearch = (term: string) => {
    setQuery(term);
    setIsFocused(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="pt-16">
        {/* Search Header */}
        <div className="sticky top-14 z-30 bg-background border-b border-border">
          <div className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jewelry, stones, sellers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                className="w-full h-12 pl-12 pr-12 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-champagne transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Content */}
        <div className="p-4">
          {!query ? (
            <div className="space-y-8 animate-fade-in">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <h2 className="font-serif text-lg font-medium mb-3">
                    Recent Searches
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 bg-secondary rounded-full text-sm hover:bg-champagne-light transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending */}
              <div>
                <h2 className="font-serif text-lg font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-champagne" />
                  Trending Now
                </h2>
                <div className="space-y-2">
                  {trendingSearches.map((term, index) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-secondary transition-colors text-left"
                    >
                      <span className="w-6 h-6 rounded-full bg-champagne-light flex items-center justify-center text-xs font-medium text-champagne">
                        {index + 1}
                      </span>
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h2 className="font-serif text-lg font-medium mb-3">
                  Browse by Stone
                </h2>
                <div className="flex flex-wrap gap-2">
                  {stones.slice(1).map((stone) => (
                    <button
                      key={stone}
                      onClick={() => handleSearch(stone)}
                      className="px-4 py-2 border border-border rounded-full text-sm hover:border-champagne hover:text-champagne transition-colors"
                    >
                      {stone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-lg font-medium mb-3">
                  Browse by Style
                </h2>
                <div className="flex flex-wrap gap-2">
                  {styles.slice(1).map((style) => (
                    <button
                      key={style}
                      onClick={() => handleSearch(style)}
                      className="px-4 py-2 border border-border rounded-full text-sm hover:border-champagne hover:text-champagne transition-colors"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="animate-fade-in">
              <p className="text-sm text-muted-foreground mb-4">
                {searchResults.length} results for "{query}"
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-4">
                {searchResults.map((product, index) => (
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
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-serif text-lg font-medium mb-1">
                No results found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try searching for something else
              </p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
