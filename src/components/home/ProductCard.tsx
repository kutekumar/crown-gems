import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/data/mockProducts";
import { RatingDiamond, SparkleIcon } from "@/components/icons/DiamondIcon";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSavedProducts } from "@/hooks/useSavedProducts";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

// Check if string is a valid UUID
const isUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const ProductCard = ({ product, className, style }: ProductCardProps) => {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedProducts();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const canSave = isUUID(product.id);
  const isProductSaved = canSave ? isSaved(product.id) : false;

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
          className={cn(
            i < fullDiamonds ? "text-champagne" : "text-platinum"
          )}
        />
      );
    }
    return diamonds;
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!canSave) {
      toast.info("Demo product - real products can be saved!");
      return;
    }
    
    if (isToggling) return;
    setIsToggling(true);
    await toggleSave(product.id);
    setIsToggling(false);
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 cursor-pointer",
        className
      )}
      style={style}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {!imageLoaded && (
          <div className="absolute inset-0 shimmer" />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2.5 py-1 bg-champagne text-primary-foreground text-[10px] font-semibold uppercase tracking-wide rounded-full flex items-center gap-1">
              <SparkleIcon className="w-3 h-3" />
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2.5 py-1 bg-rose-gold text-primary-foreground text-[10px] font-semibold uppercase tracking-wide rounded-full">
              Sale
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={handleToggleSave}
          disabled={isToggling}
          className="absolute top-3 right-3 w-9 h-9 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isProductSaved ? "fill-rose-gold text-rose-gold" : "text-charcoal-soft"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-muted-foreground truncate">
            {product.seller.name}
          </span>
          {product.seller.verified && (
            <span className="w-3.5 h-3.5 bg-champagne rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                viewBox="0 0 12 12"
                className="w-2 h-2 text-primary-foreground"
                fill="currentColor"
              >
                <path d="M10.28 2.28L4.5 8.06 1.72 5.28a.75.75 0 00-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 00-1.06-1.06z" />
              </svg>
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-serif text-sm font-medium mb-2 line-clamp-2 group-hover:text-champagne transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {renderRating(product.seller.rating)}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            {product.seller.rating}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-base font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mt-2">
          <span className="px-2 py-0.5 bg-secondary text-[10px] text-secondary-foreground rounded-md">
            {product.stone}
          </span>
          <span className="px-2 py-0.5 bg-secondary text-[10px] text-secondary-foreground rounded-md">
            {product.style}
          </span>
        </div>
      </div>
    </div>
  );
};
