import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Heart,
  Package,
  MessageCircle,
  Star,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { DiamondIcon } from "@/components/icons/DiamondIcon";

const menuItems = [
  {
    icon: Heart,
    label: "Saved Items",
    description: "Your favorites",
    href: "/saved",
  },
  {
    icon: Package,
    label: "My Orders",
    description: "Track your purchases",
    href: "#",
  },
  {
    icon: MessageCircle,
    label: "Messages",
    description: "Chat with sellers",
    href: "#",
    badge: 3,
  },
  {
    icon: Star,
    label: "Reviews",
    description: "Your ratings & reviews",
    href: "#",
  },
];

const settingsItems = [
  { icon: Settings, label: "Account Settings", href: "#" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: CreditCard, label: "Payment Methods", href: "#" },
  { icon: HelpCircle, label: "Help & Support", href: "#" },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="pt-16">
        {/* Profile Header */}
        <div className="px-4 py-8 bg-gradient-to-b from-champagne-light to-background">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-champagne flex items-center justify-center">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="font-serif text-xl font-medium">Welcome Back</h1>
              <p className="text-muted-foreground text-sm">
                Sign in to access your account
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="champagne" className="flex-1">
              Sign In
            </Button>
            <Button variant="champagne-outline" className="flex-1">
              Create Account
            </Button>
          </div>
        </div>

        {/* Stats (for demo - would show real data when logged in) */}
        <div className="grid grid-cols-3 gap-px bg-border mx-4 rounded-xl overflow-hidden mb-6">
          <div className="bg-card p-4 text-center">
            <span className="block font-serif text-2xl font-semibold text-champagne">
              0
            </span>
            <span className="text-xs text-muted-foreground">Saved</span>
          </div>
          <div className="bg-card p-4 text-center">
            <span className="block font-serif text-2xl font-semibold text-champagne">
              0
            </span>
            <span className="text-xs text-muted-foreground">Orders</span>
          </div>
          <div className="bg-card p-4 text-center">
            <span className="block font-serif text-2xl font-semibold text-champagne">
              0
            </span>
            <span className="text-xs text-muted-foreground">Reviews</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 space-y-6">
          <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => item.href !== "#" && navigate(item.href)}
                className="flex items-center gap-4 w-full p-4 hover:bg-secondary/50 transition-colors text-left border-b border-border last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-champagne-light flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-champagne" />
                </div>
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-rose-gold text-primary-foreground text-xs flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Settings */}
          <div>
            <h2 className="text-xs uppercase tracking-wide text-muted-foreground mb-3 px-1">
              Settings
            </h2>
            <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
              {settingsItems.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center gap-4 w-full p-4 hover:bg-secondary/50 transition-colors text-left border-b border-border last:border-0"
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* Become a Seller */}
          <div className="bg-gradient-to-r from-champagne to-rose-gold p-6 rounded-2xl text-primary-foreground">
            <div className="flex items-center gap-3 mb-3">
              <DiamondIcon className="w-8 h-8" />
              <h3 className="font-serif text-lg font-medium">
                Become a Seller
              </h3>
            </div>
            <p className="text-sm opacity-90 mb-4">
              Start selling your jewelry pieces to thousands of buyers
              worldwide.
            </p>
            <Button
              variant="outline"
              className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Learn More
            </Button>
          </div>

          {/* Sign Out */}
          <button className="flex items-center gap-3 w-full p-4 text-destructive hover:bg-destructive/5 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center py-8">
          <p className="text-xs text-muted-foreground">Gemora v1.0.0</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
