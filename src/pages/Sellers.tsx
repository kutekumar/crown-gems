import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { RatingDiamond } from "@/components/icons/DiamondIcon";
import { MapPin, Shield, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SellerApplicationForm } from "@/components/seller/SellerApplicationForm";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const mockSellers = [
  {
    id: 1,
    name: "Lumière Jewels",
    tagline: "Handcrafted elegance since 1985",
    location: "Paris, France",
    rating: 4.9,
    reviewCount: 248,
    productCount: 42,
    verified: true,
    avatar: product1,
    coverImage: product3,
    specialties: ["Diamonds", "Custom Designs"],
  },
  {
    id: 2,
    name: "Heritage Gems",
    tagline: "Traditional craftsmanship, modern designs",
    location: "Mumbai, India",
    rating: 4.8,
    reviewCount: 186,
    productCount: 67,
    verified: true,
    avatar: product2,
    coverImage: product4,
    specialties: ["Sapphires", "Rubies", "Emeralds"],
  },
  {
    id: 3,
    name: "Aurora Fine Jewelry",
    tagline: "Where art meets precious metals",
    location: "Milan, Italy",
    rating: 4.7,
    reviewCount: 124,
    productCount: 35,
    verified: true,
    avatar: product5,
    coverImage: product6,
    specialties: ["Gold", "Art Deco"],
  },
  {
    id: 4,
    name: "Crystal Dreams",
    tagline: "Affordable luxury for every occasion",
    location: "New York, USA",
    rating: 4.6,
    reviewCount: 312,
    productCount: 89,
    verified: false,
    avatar: product4,
    coverImage: product1,
    specialties: ["Pearls", "Minimalist"],
  },
  {
    id: 5,
    name: "Royal Treasures",
    tagline: "Exclusive pieces for discerning collectors",
    location: "London, UK",
    rating: 4.9,
    reviewCount: 156,
    productCount: 28,
    verified: true,
    avatar: product6,
    coverImage: product2,
    specialties: ["Antique", "Estate Jewelry"],
  },
  {
    id: 6,
    name: "Jade Garden",
    tagline: "Celebrating the beauty of jade",
    location: "Hong Kong",
    rating: 4.8,
    reviewCount: 203,
    productCount: 54,
    verified: true,
    avatar: product3,
    coverImage: product5,
    specialties: ["Jade", "Asian Heritage"],
  },
];

const specialtyFilters = ["All", "Diamonds", "Sapphires", "Rubies", "Emeralds", "Pearls", "Gold", "Custom Designs"];

const Sellers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const handleApplyNow = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setShowApplicationForm(true);
  };

  const filteredSellers = mockSellers.filter(seller => {
    const matchesFilter = activeFilter === "All" || seller.specialties.includes(activeFilter);
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          seller.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">Verified Sellers</h1>
          <p className="text-muted-foreground">
            Connect with trusted jewelry artisans and dealers worldwide
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sellers by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-11 pr-4 bg-secondary rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-champagne/30 transition-all"
          />
        </div>

        {/* Specialty Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {specialtyFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all",
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
        <div className="grid grid-cols-3 gap-4 p-6 bg-secondary/50 rounded-2xl mb-8">
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-champagne">150+</p>
            <p className="text-xs md:text-sm text-muted-foreground">Verified Sellers</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-champagne">50+</p>
            <p className="text-xs md:text-sm text-muted-foreground">Countries</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-champagne">10K+</p>
            <p className="text-xs md:text-sm text-muted-foreground">Unique Pieces</p>
          </div>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSellers.map((seller) => (
            <div
              key={seller.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-elegant transition-shadow cursor-pointer group"
              onClick={() => navigate("/shop")}
            >
              {/* Cover Image */}
              <div className="relative h-32">
                <img 
                  src={seller.coverImage} 
                  alt={seller.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Avatar */}
                <div className="absolute -bottom-8 left-4">
                  <div className="w-16 h-16 rounded-full border-4 border-card overflow-hidden">
                    <img 
                      src={seller.avatar} 
                      alt={seller.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Verified Badge */}
                {seller.verified && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-emerald-500/90 text-white text-xs rounded-full">
                    <Shield className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="pt-10 pb-4 px-4">
                <h3 className="font-serif text-lg font-semibold mb-1">{seller.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{seller.tagline}</p>

                {/* Location & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">{seller.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <RatingDiamond filled className="w-3.5 h-3.5 text-champagne" />
                    <span className="text-sm font-medium">{seller.rating}</span>
                    <span className="text-xs text-muted-foreground">({seller.reviewCount})</span>
                  </div>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {seller.specialties.map((specialty) => (
                    <span 
                      key={specialty}
                      className="px-2 py-0.5 bg-secondary text-xs rounded-full text-foreground/70"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {seller.productCount} pieces
                  </span>
                  <div className="flex items-center gap-1 text-champagne text-sm font-medium group-hover:gap-2 transition-all">
                    <span>View Shop</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSellers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No sellers match your search</p>
            <Button variant="champagne-outline" onClick={() => {
              setActiveFilter("All");
              setSearchQuery("");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Become a Seller CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-champagne/10 to-champagne/5 rounded-2xl text-center">
          <h3 className="font-serif text-2xl font-semibold mb-3">Become a Seller</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join our marketplace and showcase your jewelry to buyers worldwide
          </p>
          <Button variant="champagne" onClick={handleApplyNow}>
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
