import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Users, 
  Store, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Mail, 
  Phone,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SellerApplication {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  specialties: string[];
  status: string;
  logo_url: string | null;
  cover_image_url: string | null;
  created_at: string;
}

interface Seller {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  location: string | null;
  is_verified: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    checkAdminAccess();
  }, [user, navigate]);

  const checkAdminAccess = async () => {
    if (!user) return;
    
    // Check if user is in admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error || !data) {
      // Also check old role-based system for backwards compatibility
      if (role === "admin") {
        setIsAdmin(true);
        fetchData();
        return;
      }
      
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    setIsAdmin(true);
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [applicationsRes, sellersRes] = await Promise.all([
        supabase
          .from("seller_applications")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("sellers")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (applicationsRes.data) setApplications(applicationsRes.data);
      if (sellersRes.data) setSellers(sellersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (application: SellerApplication) => {
    setProcessingId(application.id);
    try {
      // Update application status
      const { error: updateError } = await supabase
        .from("seller_applications")
        .update({
          status: "approved",
        })
        .eq("id", application.id);

      if (updateError) throw updateError;

      // Create seller record
      const { error: sellerError } = await supabase.from("sellers").insert({
        user_id: application.user_id,
        business_name: application.business_name,
        description: application.description,
        location: application.location,
        phone: application.phone,
        email: application.email,
        specialties: application.specialties,
        logo_url: application.logo_url,
        cover_image_url: application.cover_image_url,
        is_verified: true,
      });

      if (sellerError) {
        // If seller already exists, update it
        if (sellerError.code === '23505') {
          const { error: updateError } = await supabase
            .from("sellers")
            .update({
              business_name: application.business_name,
              description: application.description,
              location: application.location,
              phone: application.phone,
              email: application.email,
              specialties: application.specialties,
              logo_url: application.logo_url,
              cover_image_url: application.cover_image_url,
              is_verified: true,
            })
            .eq("user_id", application.user_id);
          
          if (updateError) throw updateError;
        } else {
          throw sellerError;
        }
      }

      toast({
        title: "Application Approved",
        description: `${application.business_name} is now a verified seller.`,
      });

      setSelectedApplication(null);
      setAdminNotes("");
      fetchData();
    } catch (error: any) {
      console.error("Error approving application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (application: SellerApplication) => {
    setProcessingId(application.id);
    try {
      const { error } = await supabase
        .from("seller_applications")
        .update({
          status: "rejected",
        })
        .eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: `${application.business_name}'s application has been rejected.`,
      });

      setSelectedApplication(null);
      setAdminNotes("");
      fetchData();
    } catch (error: any) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to reject application",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveSeller = async (seller: Seller) => {
    if (!confirm(`Are you sure you want to remove ${seller.business_name}?`)) return;
    
    try {
      // Remove seller record
      const { error: sellerError } = await supabase
        .from("sellers")
        .delete()
        .eq("id", seller.id);

      if (sellerError) throw sellerError;

      // Remove seller role
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", seller.user_id)
        .eq("role", "seller");

      if (roleError) throw roleError;

      toast({
        title: "Seller Removed",
        description: `${seller.business_name} has been removed.`,
      });

      fetchData();
    } catch (error: any) {
      console.error("Error removing seller:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove seller",
        variant: "destructive",
      });
    }
  };

  const pendingApplications = applications.filter(a => a.status === "pending");
  const processedApplications = applications.filter(a => a.status !== "pending");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-champagne/10 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-champagne" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage sellers and applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Pending</span>
            </div>
            <p className="font-serif text-2xl font-semibold text-amber-500">
              {pendingApplications.length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Approved</span>
            </div>
            <p className="font-serif text-2xl font-semibold text-emerald-500">
              {applications.filter(a => a.status === "approved").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">Rejected</span>
            </div>
            <p className="font-serif text-2xl font-semibold text-red-500">
              {applications.filter(a => a.status === "rejected").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Store className="w-4 h-4" />
              <span className="text-sm">Active Sellers</span>
            </div>
            <p className="font-serif text-2xl font-semibold text-champagne">
              {sellers.length}
            </p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="pending" className="data-[state=active]:bg-champagne data-[state=active]:text-champagne-foreground">
              Pending ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-champagne data-[state=active]:text-champagne-foreground">
              History
            </TabsTrigger>
            <TabsTrigger value="sellers" className="data-[state=active]:bg-champagne data-[state=active]:text-champagne-foreground">
              Sellers ({sellers.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Applications */}
          <TabsContent value="pending" className="space-y-4">
            {pendingApplications.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending applications</p>
              </div>
            ) : (
              pendingApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif text-lg font-semibold">
                          {application.business_name}
                        </h3>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                          Pending
                        </span>
                      </div>
                      
                      {application.description && (
                        <p className="text-muted-foreground text-sm mb-3">
                          {application.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        {application.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {application.location}
                          </div>
                        )}
                        {application.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {application.email}
                          </div>
                        )}
                        {application.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {application.phone}
                          </div>
                        )}
                      </div>

                      {application.specialties && application.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {application.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2 py-0.5 bg-secondary text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Applied {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[200px]">
                      {selectedApplication?.id === application.id ? (
                        <>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Admin notes (optional)..."
                            className="w-full p-3 bg-secondary rounded-lg text-sm resize-none h-20"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="champagne"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleApprove(application)}
                              disabled={processingId === application.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleReject(application)}
                              disabled={processingId === application.id}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                          <Button
                            variant="subtle"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(null);
                              setAdminNotes("");
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="champagne-outline"
                          onClick={() => setSelectedApplication(application)}
                        >
                          Review Application
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Application History */}
          <TabsContent value="history" className="space-y-4">
            {processedApplications.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No processed applications yet</p>
              </div>
            ) : (
              processedApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{application.business_name}</h3>
                        <span
                          className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            application.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(application.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Active Sellers */}
          <TabsContent value="sellers" className="space-y-4">
            {sellers.length === 0 ? (
              <div className="text-center py-12 bg-card border border-border rounded-xl">
                <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active sellers</p>
              </div>
            ) : (
              sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{seller.business_name}</h3>
                        {seller.is_verified && (
                          <Shield className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {seller.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {seller.location}
                          </span>
                        )}
                        <span>Joined {new Date(seller.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveSeller(seller)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default AdminDashboard;