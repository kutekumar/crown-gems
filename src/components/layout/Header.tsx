import { useState, useEffect, useRef } from "react";
import { Search, Heart, User, Menu, X, LayoutDashboard, Store, Shield, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GemIcon } from "@/components/icons/DiamondIcon";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { name: "Shop", path: "/shop" },
  { name: "Collections", path: "/collections" },
  { name: "Sellers", path: "/sellers" },
  { name: "About", path: "/about" },
];

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check if user is seller or admin
  useEffect(() => {
    if (!user) {
      setIsSeller(false);
      setIsAdmin(false);
      return;
    }

    const checkRoles = async () => {
      console.log('🔍 Checking roles for user:', user.email, user.id);
      
      // Check if seller
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      console.log('👔 Seller check:', { sellerData, sellerError });
      setIsSeller(!!sellerData);

      // Check if admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      console.log('🛡️ Admin check:', { adminData, adminError });
      setIsAdmin(!!adminData);
      
      console.log('✅ Final roles:', { isSeller: !!sellerData, isAdmin: !!adminData });
    };

    checkRoles();
  }, [user]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center py-[5px]">
            <img 
              src="https://mingalarmon.com/assets/CGLogo.png" 
              alt="Mingalar Mon" 
              className="h-[calc(5rem-10px)] w-auto object-contain" 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "text-champagne"
                    : "text-foreground/80 hover:text-champagne"
                )}
              >
                {link.name}
              </Link>
            ))}
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
            <ThemeToggle />
            <Button variant="icon" size="icon" onClick={() => navigate("/saved")}>
              <Heart className="w-5 h-5" />
            </Button>
            
            {/* User Menu Dropdown */}
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <Button 
                variant="icon" 
                size="icon"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(isUserMenuOpen && "bg-secondary")}
              >
                <User className="w-5 h-5" />
              </Button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                  {user ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Admin Dashboard */}
                        {isAdmin && (
                          <button
                            onClick={() => {
                              navigate('/admin');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            <span>Admin Dashboard</span>
                          </button>
                        )}

                        {/* Seller Dashboard */}
                        {isSeller && (
                          <button
                            onClick={() => {
                              navigate('/seller/dashboard');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                          >
                            <Store className="w-4 h-4" />
                            <span>Seller Dashboard</span>
                          </button>
                        )}

                        {/* Profile */}
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </button>

                        {/* Saved Items */}
                        <button
                          onClick={() => {
                            navigate('/saved');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Saved Items</span>
                        </button>
                      </div>

                      {/* Sign Out */}
                      <div className="border-t border-border py-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-secondary transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/auth');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Sign In</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
              onFocus={() => navigate("/search")}
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "py-3 px-4 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-champagne/10 text-champagne"
                    : "hover:bg-secondary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
