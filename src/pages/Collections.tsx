import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/mockProducts";

import categoryRings from "@/assets/category-rings.jpg";
import categoryNecklace from "@/assets/category-necklace.jpg";
import categoryEarrings from "@/assets/category-earrings.jpg";
import categoryBracelet from "@/assets/category-bracelet.jpg";
import heroRing from "@/assets/hero-ring.jpg";

const collections = [
  {
    id: 1,
    name: "Eternal Diamonds",
    description: "Timeless diamond pieces that capture light and hearts",
    image: heroRing,
    itemCount: products.filter(p => p.stone === "Diamond").length,
    filter: { stone: "Diamond" },
  },
  {
    id: 2,
    name: "Bridal Collection",
    description: "Perfect pieces for your perfect day",
    image: categoryRings,
    itemCount: products.filter(p => p.style === "Classic").length,
    filter: { style: "Classic" },
  },
  {
    id: 3,
    name: "Statement Necklaces",
    description: "Bold designs that demand attention",
    image: categoryNecklace,
    itemCount: products.filter(p => p.category === "necklaces").length,
    filter: { category: "Necklaces" },
  },
  {
    id: 4,
    name: "Elegant Earrings",
    description: "From studs to drops, find your signature style",
    image: categoryEarrings,
    itemCount: products.filter(p => p.category === "earrings").length,
    filter: { category: "Earrings" },
  },
  {
    id: 5,
    name: "Luxe Bracelets",
    description: "Adorn your wrist with elegance",
    image: categoryBracelet,
    itemCount: products.filter(p => p.category === "bracelets").length,
    filter: { category: "Bracelets" },
  },
  {
    id: 6,
    name: "Sapphire Dreams",
    description: "Deep blue beauty for the sophisticated soul",
    image: categoryNecklace,
    itemCount: products.filter(p => p.stone === "Sapphire").length,
    filter: { stone: "Sapphire" },
  },
];

const Collections = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">Curated Collections</h1>
          <p className="text-muted-foreground">
            Explore our handpicked collections for every occasion
          </p>
        </div>

        {/* Featured Collection */}
        <div 
          className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-8 cursor-pointer group"
          onClick={() => navigate("/shop")}
        >
          <img 
            src={heroRing} 
            alt="Featured Collection" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className="inline-block px-3 py-1 bg-champagne/90 text-champagne-foreground text-xs font-medium rounded-full mb-3">
              Featured
            </span>
            <h2 className="font-serif text-2xl md:text-4xl text-white font-semibold mb-2">
              The Signature Edit
            </h2>
            <p className="text-white/80 mb-4 max-w-md">
              Our most coveted pieces, selected for those who appreciate exceptional craftsmanship
            </p>
            <div className="flex items-center gap-2 text-champagne font-medium group-hover:gap-3 transition-all">
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group cursor-pointer"
              onClick={() => navigate("/shop")}
            >
              <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <img 
                  src={collection.image} 
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-xl text-white font-semibold mb-1">
                    {collection.name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {collection.itemCount} pieces
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                {collection.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 py-12 border-t border-border">
          <h3 className="font-serif text-2xl font-semibold mb-3">Can't Find What You're Looking For?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Our sellers offer custom pieces tailored to your preferences
          </p>
          <button 
            onClick={() => navigate("/sellers")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-champagne text-champagne-foreground rounded-full font-medium hover:bg-champagne/90 transition-colors"
          >
            Browse Sellers
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Collections;
