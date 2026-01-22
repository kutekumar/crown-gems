import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MessageCircle, Shield, Truck, RotateCcw, ChevronLeft, ChevronRight, X, ZoomIn, Lock } from "lucide-react";
import { products, Product } from "@/data/mockProducts";
import { RatingDiamond, SparkleIcon } from "@/components/icons/DiamondIcon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mock gallery images - in real app these would come from the product data
const getGalleryImages = (product: Product) => [
  product.image,
  product.image,
  product.image,
  product.image,
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleContactSeller = () => {
    if (!user) {
      toast.info("Please sign in to contact sellers");
      navigate("/auth");
      return;
    }
    toast.success("Contact feature coming soon!");
  };

  const product = products.find((p) => p.id === id);
  const galleryImages = product ? getGalleryImages(product) : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl mb-4">Product not found</h2>
          <Button variant="champagne" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderRating = (rating: number) => {
    const diamonds = [];
    const fullDiamonds = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      diamonds.push(
        <RatingDiamond
          key={i}
          filled={i < fullDiamonds}
          className={cn(i < fullDiamonds ? "text-champagne" : "text-platinum")}
        />
      );
    }
    return diamonds;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50;

    if (isSwipe) {
      if (distance > 0 && currentImageIndex < galleryImages.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
      } else if (distance < 0 && currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < galleryImages.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : galleryImages.length - 1
    );
  };

  return (
    <>
      <div className="min-h-screen bg-background pb-32 md:pb-8">
        {/* Immersive Gallery Modal */}
        {isGalleryOpen && (
          <div className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-xl animate-fade-in">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="w-12 h-12 rounded-full bg-background/10 backdrop-blur-md flex items-center justify-center text-ivory hover:bg-background/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="h-full flex items-center justify-center p-4">
              <button
                onClick={prevImage}
                className="absolute left-4 w-12 h-12 rounded-full bg-background/10 backdrop-blur-md flex items-center justify-center text-ivory hover:bg-background/20 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div
                className="max-w-4xl w-full h-[80vh] relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={galleryImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain animate-scale-in"
                />
              </div>

              <button
                onClick={nextImage}
                className="absolute right-4 w-12 h-12 rounded-full bg-background/10 backdrop-blur-md flex items-center justify-center text-ivory hover:bg-background/20 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    currentImageIndex === index
                      ? "border-champagne scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between h-14 px-4">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isLiked ? "fill-rose-gold text-rose-gold" : "text-foreground"
                  )}
                />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-14">
          {/* Image Gallery */}
          <div
            className="relative aspect-square bg-secondary cursor-zoom-in"
            onClick={() => setIsGalleryOpen(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={galleryImages[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500"
            />

            {/* Zoom Hint */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full flex items-center gap-1.5 text-xs">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Tap to zoom</span>
            </div>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentImageIndex === index
                      ? "bg-champagne w-6"
                      : "bg-background/60"
                  )}
                />
              ))}
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <span className="px-3 py-1.5 bg-champagne text-primary-foreground text-xs font-semibold uppercase tracking-wide rounded-full flex items-center gap-1.5">
                  <SparkleIcon className="w-3.5 h-3.5" />
                  New Arrival
                </span>
              )}
              {product.originalPrice && (
                <span className="px-3 py-1.5 bg-rose-gold text-primary-foreground text-xs font-semibold uppercase tracking-wide rounded-full">
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
                      100
                  )}
                  % Off
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="px-4 py-6 space-y-6 animate-fade-up">
            {/* Seller */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-champagne-light flex items-center justify-center">
                <span className="font-serif font-semibold text-champagne">
                  {product.seller.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {product.seller.name}
                  </span>
                  {product.seller.verified && (
                    <span className="w-4 h-4 bg-champagne rounded-full flex items-center justify-center">
                      <svg
                        viewBox="0 0 12 12"
                        className="w-2.5 h-2.5 text-primary-foreground"
                        fill="currentColor"
                      >
                        <path d="M10.28 2.28L4.5 8.06 1.72 5.28a.75.75 0 00-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00-1.06-1.06z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  {renderRating(product.seller.rating)}
                  <span className="text-xs text-muted-foreground ml-1">
                    {product.seller.rating} rating
                  </span>
                </div>
              </div>
              <Button variant="champagne-outline" size="sm" onClick={handleContactSeller}>
                {user ? (
                  <>
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    Contact
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-1.5" />
                    Sign in to Contact
                  </>
                )}
              </Button>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-medium mb-3">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-semibold text-champagne">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-secondary text-sm rounded-full">
                {product.stone}
              </span>
              <span className="px-3 py-1.5 bg-secondary text-sm rounded-full">
                {product.style}
              </span>
              <span className="px-3 py-1.5 bg-secondary text-sm rounded-full capitalize">
                {product.category}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-medium">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                Exquisite craftsmanship meets timeless elegance in this stunning{" "}
                {product.name.toLowerCase()}. Each piece is meticulously
                handcrafted by skilled artisans, featuring premium{" "}
                {product.stone.toLowerCase()} stones set in the finest metals.
                Perfect for those who appreciate the finer things in life.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-medium">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Stone Type
                  </span>
                  <p className="font-medium mt-1">{product.stone}</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Style
                  </span>
                  <p className="font-medium mt-1">{product.style}</p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Category
                  </span>
                  <p className="font-medium mt-1 capitalize">
                    {product.category}
                  </p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-xl">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Condition
                  </span>
                  <p className="font-medium mt-1">New</p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-champagne-light flex items-center justify-center">
                  <Shield className="w-5 h-5 text-champagne" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Verified Seller
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-champagne-light flex items-center justify-center">
                  <Truck className="w-5 h-5 text-champagne" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Secure Shipping
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-champagne-light flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-champagne" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Easy Returns
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Fixed Bottom CTA */}
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-border safe-area-inset-bottom z-40">
          <div className="flex gap-3 max-w-lg mx-auto">
            <Button
              variant="champagne-outline"
              size="lg"
              className="flex-1"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={cn(
                  "w-5 h-5 mr-2",
                  isLiked && "fill-rose-gold text-rose-gold"
                )}
              />
              Save
            </Button>
            <Button variant="champagne" size="lg" className="flex-[2]" onClick={handleContactSeller}>
              {user ? (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Seller
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Sign in to Contact
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
