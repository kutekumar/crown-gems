import { useState } from "react";
import { Search, Heart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GemIcon } from "@/components/icons/DiamondIcon";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GemIcon className="w-6 h-6 text-champagne" />
            <span className="font-serif text-xl font-semibold tracking-tight">
              Gemora
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-champagne transition-colors">
              Shop
            </a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-champagne transition-colors">
              Collections
            </a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-champagne transition-colors">
              Sellers
            </a>
            <a href="#" className="text-sm font-medium text-foreground/80 hover:text-champagne transition-colors">
              About
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="icon"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="icon" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="icon" size="icon" className="hidden sm:flex">
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="icon"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            isSearchOpen ? "max-h-16 pb-4" : "max-h-0"
          )}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for jewelry, gemstones, sellers..."
              className="w-full h-11 pl-11 pr-4 bg-secondary rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-champagne/30 transition-all"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-out",
            isMobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-2">
            <a href="#" className="py-3 px-4 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
              Shop
            </a>
            <a href="#" className="py-3 px-4 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
              Collections
            </a>
            <a href="#" className="py-3 px-4 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
              Sellers
            </a>
            <a href="#" className="py-3 px-4 rounded-lg text-sm font-medium hover:bg-secondary transition-colors">
              About
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};
