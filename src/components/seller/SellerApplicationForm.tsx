import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Store, 
  MapPin, 
  Mail, 
  Phone, 
  X,
  CheckCircle,
  Loader2
} from "lucide-react";
import { z } from "zod";

const applicationSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters").max(100),
  description: z.string().min(20, "Please provide a more detailed description").max(500),
  location: z.string().min(2, "Location is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number is required").max(20),
});

interface SellerApplicationFormProps {
  onClose: () => void;
}

const specialtyOptions = [
  "Diamonds",
  "Sapphires",
  "Rubies",
  "Emeralds",
  "Pearls",
  "Gold",
  "Silver",
  "Platinum",
  "Custom Designs",
  "Vintage",
  "Art Deco",
  "Minimalist",
];

export const SellerApplicationForm = ({ onClose }: SellerApplicationFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    business_name: "",
    description: "",
    location: "",
    email: "",
    phone: "",
    specialties: [] as string[],
  });

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to apply as a seller.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Validate form
    try {
      applicationSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setLoading(true);
    try {
      // Check if user already has a pending application
      const { data: existingApp } = await supabase
        .from("seller_applications")
        .select("id, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingApp) {
        toast({
          title: "Application exists",
          description: `You already have a ${existingApp.status} application.`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Check if user is already a seller
      const { data: existingSeller } = await supabase
        .from("sellers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingSeller) {
        toast({
          title: "Already a seller",
          description: "You are already registered as a seller.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Submit application
      const { error } = await supabase.from("seller_applications").insert({
        user_id: user.id,
        business_name: formData.business_name.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        specialties: formData.specialties,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
      });
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl max-w-md w-full p-8 text-center animate-fade-up">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to become a seller on Crown Gems. Our team will review your 
            application and get back to you within 2-3 business days.
          </p>
          <Button variant="champagne" onClick={onClose}>
            Got It
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-up">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-champagne/10 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-champagne" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold">Become a Seller</h2>
              <p className="text-sm text-muted-foreground">Join our marketplace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Business Name *
            </label>
            <Input
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              placeholder="Your jewelry business name"
              className={errors.business_name ? "border-red-500" : ""}
            />
            {errors.business_name && (
              <p className="text-red-500 text-xs mt-1">{errors.business_name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Business Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell us about your jewelry business, your story, and what makes your pieces special..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location *
            </label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, Country"
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Business Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="business@example.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number *
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Specialties (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    formData.specialties.includes(specialty)
                      ? "bg-champagne text-champagne-foreground"
                      : "bg-secondary text-foreground/70 hover:bg-secondary/80"
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="champagne"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              By submitting, you agree to our seller terms and conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};