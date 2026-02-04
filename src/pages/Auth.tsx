import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Store, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GemIcon } from "@/components/icons/DiamondIcon";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signUp, signIn } = useAuth();
  
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"buyer" | "seller" | null>(null);
  const [step, setStep] = useState<"role" | "form">("role");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const roleParam = searchParams.get("role");
    
    if (modeParam === "signup") {
      setMode("signup");
    }
    if (roleParam === "seller" || roleParam === "buyer") {
      setRole(roleParam);
      setStep("form");
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!role) {
          toast.error("Please select a role");
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, role, fullName, businessName);
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully!");
          navigate(role === "seller" ? "/seller/dashboard" : "/");
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (selectedRole: "buyer" | "seller") => {
    setRole(selectedRole);
    setStep("form");
  };

  const handleBack = () => {
    if (step === "form" && mode === "signup") {
      setStep("role");
      setRole(null);
    } else {
      navigate(-1);
    }
  };

  // Role selection screen for signup
  if (mode === "signup" && step === "role") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="flex items-center h-14 px-4 border-b border-border">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <GemIcon className="w-12 h-12 text-champagne mb-6" />
          <h1 className="font-serif text-2xl font-semibold mb-2">Join Crown Gems</h1>
          <p className="text-muted-foreground text-center mb-8">
            Choose how you want to use Crown Gems
          </p>
          
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => handleRoleSelect("buyer")}
              className="w-full p-6 rounded-2xl border-2 border-border hover:border-champagne bg-card transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-champagne-light flex items-center justify-center group-hover:bg-champagne transition-colors">
                  <User className="w-7 h-7 text-champagne group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium">I'm a Buyer</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse and purchase jewelry
                  </p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => handleRoleSelect("seller")}
              className="w-full p-6 rounded-2xl border-2 border-border hover:border-champagne bg-card transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-champagne-light flex items-center justify-center group-hover:bg-champagne transition-colors">
                  <Store className="w-7 h-7 text-champagne group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium">I'm a Seller</h3>
                  <p className="text-sm text-muted-foreground">
                    List and sell your jewelry
                  </p>
                </div>
              </div>
            </button>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => setMode("signin")}
              className="text-champagne font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center h-14 px-4 border-b border-border">
        <button onClick={handleBack} className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <GemIcon className="w-12 h-12 text-champagne mb-6" />
        <h1 className="font-serif text-2xl font-semibold mb-2">
          {mode === "signin" ? "Welcome Back" : 
           role === "seller" ? "Create Seller Account" : "Create Account"}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {mode === "signin" 
            ? "Sign in to continue to Crown Gems" 
            : role === "seller"
              ? "Start selling your jewelry to thousands"
              : "Join Crown Gems to save favorites and contact sellers"}
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={role === "seller" ? "Your Name" : "Full Name (optional)"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>
          )}
          
          {mode === "signup" && role === "seller" && (
            <div className="relative">
              <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="pl-12 h-12 rounded-xl"
              />
            </div>
          )}
          
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                required
                className={cn("pl-12 h-12 rounded-xl", errors.email && "border-destructive")}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive mt-1 ml-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                required
                className={cn("pl-12 pr-12 h-12 rounded-xl", errors.password && "border-destructive")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive mt-1 ml-1">{errors.password}</p>
            )}
          </div>
          
          <Button
            type="submit"
            variant="champagne"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        
        <p className="mt-6 text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setMode("signup");
                  setStep("role");
                }}
                className="text-champagne font-medium hover:underline"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setMode("signin");
                  setStep("form");
                }}
                className="text-champagne font-medium hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
