import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { RatingDiamond } from "@/components/icons/DiamondIcon";
import { MapPin, Shield, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SellerApplicationForm } from "@/components/seller/SellerApplicationForm";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

interface Seller {
  id: string;
  business_name: string;
  description: string | null;
  location: string | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  specialties: string[] | null;
  logo_url: string | null;
  product_count?: number;
}

const defaultImages = [product1, product2, product3, product4, product5, product6];

const specialtyFilters = ["All", "Diamonds", "Sapphires", "Rubies", "Emeralds", "Pearls", "Gold", "Custom Designs"];

const Sellers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Fetch sellers from database
  const { data: dbSellers, isLoading } = useQuery({
    queryKey: ["sellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sellers")
        .select("*")
        .order("rating", { ascending: false });

      if (error) throw error;

      // Fetch product count for each seller
      const sellersWithCount = await Promise.all(
        (data || []).map(async (seller) => {
          const { count } = await supabase
            .from("products")
            .select("*", { count: "exact", head: true })
            .eq("seller_id", seller.id);

          return {
            ...seller,
            product_count: count || 0,
          };
        })
      );

      return sellersWithCount as Seller[];
    },
  });

  const handleApplyNow = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShowApplicationForm(true);
  };

  const sellers = dbSellers || [];

  const filteredSellers = sellers.filter(seller => {
    const matchesFilter = activeFilter === "All" || 
      (seller.specialties && seller.specialties.some(s => 
        s.toLowerCase().includes(activeFilter.toLowerCase())
      ));
    const matchesSearch = seller.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (seller.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  // Get a consistent image for each seller based on their ID
  const getSellerImage = (sellerId: string, index: number) => {
    const hash = sellerId.charCodeAt(0) + sellerId.charCodeAt(sellerId.length - 1);
    return defaultImages[(hash + index) % defaultImages.length];
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold mb-1">Our Sellers</h1>
          <p className="text-sm text-muted-foreground">
            Connect with trusted jewelry artisans and dealers
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-secondary rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-champagne/30 transition-all"
          />
        </div>

        {/* Specialty Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {specialtyFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
                activeFilter === filter
                  ? "bg-champagne text-champagne-foreground"
                  : "bg-secondary text-foreground/70 hover:bg-secondary/80"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-3 gap-4 p-5 bg-secondary/50 rounded-2xl mb-6">
          <div className="text-center">
            <p className="font-serif text-xl md:text-2xl font-semibold text-champagne">
              {sellers.length || "0"}
            </p>
            <p className="text-xs text-muted-foreground">Sellers</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="font-serif text-xl md:text-2xl font-semibold text-champagne">
              {sellers.filter(s => s.is_verified).length || "0"}
            </p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-xl md:text-2xl font-semibold text-champagne">
              {sellers.reduce((sum, s) => sum + (s.product_count || 0), 0)}
            </p>
            <p className="text-xs text-muted-foreground">Products</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sellers Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map((seller, index) => (
              <div
                key={seller.id}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-elegant transition-shadow cursor-pointer group"
                onClick={() => navigate(`/shop?seller=${seller.id}`)}
              >
                {/* Cover Image */}
                <div className="relative h-28">
                  <img 
                    src={getSellerImage(seller.id, 0)} 
                    alt={seller.business_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Avatar */}
                  <div className="absolute -bottom-7 left-4">
                    <div className="w-14 h-14 rounded-full border-4 border-card overflow-hidden bg-champagne-light flex items-center justify-center">
                      {seller.logo_url ? (
                        <img 
                          src={seller.logo_url} 
                          alt={seller.business_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-serif text-lg font-semibold text-champagne">
                          {seller.business_name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Verified Badge */}
                  {seller.is_verified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-emerald-500/90 text-white text-xs rounded-full">
                      <Shield className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-9 pb-4 px-4">
                  <h3 className="font-serif text-base font-semibold mb-1 truncate">{seller.business_name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                    {seller.description || "Quality jewelry from trusted artisans"}
                  </p>

                  {/* Location & Rating */}
                  <div className="flex items-center justify-between mb-3">
                    {seller.location && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs truncate max-w-[120px]">{seller.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <RatingDiamond filled className="w-3 h-3 text-champagne" />
                      <span className="text-sm font-medium">{Number(seller.rating).toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({seller.review_count})</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  {seller.specialties && seller.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {seller.specialties.slice(0, 3).map((specialty) => (
                        <span 
                          key={specialty}
                          className="px-2 py-0.5 bg-secondary text-xs rounded-full text-foreground/70"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {seller.product_count} {seller.product_count === 1 ? "piece" : "pieces"}
                    </span>
                    <div className="flex items-center gap-1 text-champagne text-xs font-medium group-hover:gap-2 transition-all">
                      <span>View Shop</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredSellers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              {sellers.length === 0 
                ? "No sellers yet. Be the first to join!" 
                : "No sellers match your search"}
            </p>
            {sellers.length > 0 && (
              <Button variant="champagne-outline" onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Become a Seller CTA */}
        <div className="mt-10 p-6 bg-gradient-to-r from-champagne/10 to-champagne/5 rounded-2xl text-center">
          <h3 className="font-serif text-xl font-semibold mb-2">Become a Seller</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Join our marketplace and showcase your jewelry to buyers worldwide
          </p>
          <Button variant="champagne" size="sm" onClick={handleApplyNow}>
            Apply Now
          </Button>
        </div>
      </main>

      <BottomNav />

      {/* Application Form Modal */}
      {showApplicationForm && (
        <SellerApplicationForm onClose={() => setShowApplicationForm(false)} />
      )}
    </div>
  );
};

export default Sellers;
