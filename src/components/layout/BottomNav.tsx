import { Home, Search, Heart, User, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GemIcon } from "@/components/icons/DiamondIcon";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", active: true },
  { icon: <Search className="w-5 h-5" />, label: "Search" },
  { icon: <Grid3X3 className="w-5 h-5" />, label: "Categories" },
  { icon: <Heart className="w-5 h-5" />, label: "Saved" },
  { icon: <User className="w-5 h-5" />, label: "Profile" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-200",
              item.active
                ? "text-champagne"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div
              className={cn(
                "relative transition-transform duration-200",
                item.active && "scale-110"
              )}
            >
              {item.icon}
              {item.active && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-champagne rounded-full animate-pulse-soft" />
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
