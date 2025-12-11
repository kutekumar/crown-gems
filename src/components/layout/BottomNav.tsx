import { Home, Search, Heart, User, Grid3X3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <Home className="w-5 h-5" />, label: "Home", href: "/" },
  { icon: <Search className="w-5 h-5" />, label: "Search", href: "/search" },
  { icon: <Grid3X3 className="w-5 h-5" />, label: "Categories", href: "/categories" },
  { icon: <Heart className="w-5 h-5" />, label: "Saved", href: "/saved" },
  { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all duration-200",
                isActive
                  ? "text-champagne"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "relative transition-transform duration-200",
                  isActive && "scale-110"
                )}
              >
                {item.icon}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-champagne rounded-full animate-pulse-soft" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
