import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Package, Settings, BarChart3, LogOut, 
  ChevronRight, Edit, Trash2, Image, X, Upload, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GemIcon } from "@/components/icons/DiamondIcon";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMessages } from "@/hooks/useMessages";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SellerInfo {
  id: string;
  business_name: string;
  description: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  is_verified: boolean;
}

interface ProductImage {
  id?: string;
  url: string;
  file?: File;
  isPrimary: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stone: string | null;
  style: string | null;
  is_featured: boolean;
  is_new: boolean;
  images: ProductImage[];
}

const categories = ["rings", "necklaces", "bracelets", "earrings"];
const stones = ["Diamond", "Emerald", "Sapphire", "Ruby", "Gold", "Pearl", "Other"];
const styles = ["Classic", "Modern", "Minimalist", "Vintage", "Elegant"];

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { user, role, signOut, loading: authLoading } = useAuth();
  
  const [seller, setSeller] = useState<SellerInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "messages" | "settings">("products");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { conversations, getUnreadCount, refresh: refreshMessages } = useMessages();
  
  // Product form state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "rings",
    stone: "",
    style: "",
    is_featured: false,
    is_new: true,
  });
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (role && role !== "seller") {
        navigate("/");
        toast.error("Access denied. Seller account required.");
      } else if (role === "seller") {
        fetchSellerData();
      }
    }
  }, [user, role, authLoading, navigate]);

  const fetchSellerData = async () => {
    if (!user) return;
    
    try {
      // Fetch seller info
      const { data: sellerData, error: sellerError } = await supabase
        .from("sellers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (sellerError) throw sellerError;
      if (!sellerData) {
        toast.error("Seller profile not found");
        navigate("/");
        return;
      }
      
      setSeller(sellerData);

      // Fetch products with images
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          product_images (id, image_url, is_primary, display_order)
        `)
        .eq("seller_id", sellerData.id)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      const formattedProducts: Product[] = (productsData || []).map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        category: p.category,
        stone: p.stone,
        style: p.style,
        is_featured: p.is_featured || false,
        is_new: p.is_new || false,
        images: (p.product_images || []).map((img: any) => ({
          id: img.id,
          url: img.image_url,
          isPrimary: img.is_primary,
        })),
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching seller data:", error);
      toast.error("Failed to load seller data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    const newImages: ProductImage[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({
        url,
        file,
        isPrimary: productImages.length === 0 && i === 0,
      });
    }
    
    setProductImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setProductImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // If we removed the primary, make the first one primary
      if (prev[index].isPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const setPrimaryImage = (index: number) => {
    setProductImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const openAddProductDialog = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "rings",
      stone: "",
      style: "",
      is_featured: false,
      is_new: true,
    });
    setProductImages([]);
    setIsProductDialogOpen(true);
  };

  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      stone: product.stone || "",
      style: product.style || "",
      is_featured: product.is_featured,
      is_new: product.is_new,
    });
    setProductImages(product.images);
    setIsProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!seller) return;
    if (!productForm.name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    if (!productForm.price || isNaN(Number(productForm.price))) {
      toast.error("Please enter a valid price");
      return;
    }
    if (productImages.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    setSaving(true);

    try {
      // Upload new images to storage
      const uploadedImages: { url: string; isPrimary: boolean; order: number }[] = [];
      
      for (let i = 0; i < productImages.length; i++) {
        const img = productImages[i];
        
        if (img.file) {
          // New image - upload to storage
          const fileExt = img.file.name.split(".").pop();
          const fileName = `${user!.id}/${Date.now()}-${i}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, img.file);

          if (uploadError) throw uploadError;

          const { data: publicUrl } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

          uploadedImages.push({
            url: publicUrl.publicUrl,
            isPrimary: img.isPrimary,
            order: i,
          });
        } else {
          // Existing image
          uploadedImages.push({
            url: img.url,
            isPrimary: img.isPrimary,
            order: i,
          });
        }
      }

      if (editingProduct) {
        // Update existing product
        const { error: updateError } = await supabase
          .from("products")
          .update({
            name: productForm.name,
            description: productForm.description || null,
            price: Number(productForm.price),
            category: productForm.category,
            stone: productForm.stone || null,
            style: productForm.style || null,
            is_featured: productForm.is_featured,
            is_new: productForm.is_new,
          })
          .eq("id", editingProduct.id);

        if (updateError) throw updateError;

        // Delete old images and insert new ones
        await supabase
          .from("product_images")
          .delete()
          .eq("product_id", editingProduct.id);

        const imageInserts = uploadedImages.map((img) => ({
          product_id: editingProduct.id,
          image_url: img.url,
          is_primary: img.isPrimary,
          display_order: img.order,
        }));

        const { error: imageError } = await supabase
          .from("product_images")
          .insert(imageInserts);

        if (imageError) throw imageError;

        toast.success("Product updated successfully");
      } else {
        // Create new product
        const { data: newProduct, error: insertError } = await supabase
          .from("products")
          .insert({
            seller_id: seller.id,
            name: productForm.name,
            description: productForm.description || null,
            price: Number(productForm.price),
            category: productForm.category,
            stone: productForm.stone || null,
            style: productForm.style || null,
            is_featured: productForm.is_featured,
            is_new: productForm.is_new,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Insert images
        const imageInserts = uploadedImages.map((img) => ({
          product_id: newProduct.id,
          image_url: img.url,
          is_primary: img.isPrimary,
          display_order: img.order,
        }));

        const { error: imageError } = await supabase
          .from("product_images")
          .insert(imageInserts);

        if (imageError) throw imageError;

        toast.success("Product added successfully");
      }

      setIsProductDialogOpen(false);
      fetchSellerData();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <GemIcon className="w-6 h-6 text-champagne" />
              <div>
                <span className="font-serif text-lg font-semibold">Seller Dashboard</span>
                <p className="text-xs text-muted-foreground">{seller?.business_name}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <Package className="w-6 h-6 text-champagne mb-2" />
            <span className="block font-serif text-2xl font-semibold">{products.length}</span>
            <span className="text-sm text-muted-foreground">Products</span>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <BarChart3 className="w-6 h-6 text-champagne mb-2" />
            <span className="block font-serif text-2xl font-semibold">0</span>
            <span className="text-sm text-muted-foreground">Views</span>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-soft">
            <GemIcon className="w-6 h-6 text-champagne mb-2" />
            <span className="block font-serif text-2xl font-semibold">{seller?.is_verified ? "Yes" : "No"}</span>
            <span className="text-sm text-muted-foreground">Verified</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "products" ? "champagne" : "ghost"}
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-4 h-4 mr-2" />
            Products
          </Button>
          <Button
            variant={activeTab === "messages" ? "champagne" : "ghost"}
            onClick={() => {
              setActiveTab("messages");
              refreshMessages();
            }}
            className="relative"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages
            {getUnreadCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-gold text-primary-foreground text-xs flex items-center justify-center">
                {getUnreadCount()}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === "settings" ? "champagne" : "ghost"}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-medium">Your Products</h2>
              <Button variant="champagne" onClick={openAddProductDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-serif text-lg mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first jewelry piece</p>
                <Button variant="champagne" onClick={openAddProductDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-soft group">
                    <div className="aspect-square relative">
                      {product.images.length > 0 ? (
                        <img
                          src={product.images.find((i) => i.isPrimary)?.url || product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Image className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openEditProductDialog(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {product.images.length > 1 && (
                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 rounded-full text-xs">
                          {product.images.length} photos
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-champagne font-semibold">
                        ${product.price.toLocaleString()}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-secondary rounded-full capitalize">
                          {product.category}
                        </span>
                        {product.is_new && (
                          <span className="text-xs px-2 py-1 bg-champagne/10 text-champagne rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl overflow-hidden shadow-soft md:col-span-1">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">Conversations</h3>
              </div>
              <ConversationList
                conversations={conversations}
                onSelect={setSelectedConversationId}
                selectedId={selectedConversationId}
              />
            </div>
            <div className="md:col-span-2">
              {selectedConversationId ? (
                <ChatWindow
                  conversationId={selectedConversationId}
                  onClose={() => setSelectedConversationId(null)}
                />
              ) : (
                <div className="h-[500px] bg-card rounded-2xl flex flex-col items-center justify-center text-center p-6">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Select a conversation to view messages
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && seller && (
          <div className="max-w-xl">
            <h2 className="font-serif text-xl font-medium mb-6">Business Settings</h2>
            <div className="space-y-4 bg-card rounded-2xl p-6">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Business Name</label>
                <Input value={seller.business_name} readOnly className="bg-secondary" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <Input value={seller.email || ""} readOnly className="bg-secondary" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Location</label>
                <Input value={seller.location || "Not set"} readOnly className="bg-secondary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Contact support to update your business information.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Image Upload */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Product Images ({productImages.length}/10)
              </label>
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer",
                      img.isPrimary ? "border-champagne" : "border-transparent"
                    )}
                    onClick={() => setPrimaryImage(index)}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {img.isPrimary && (
                      <span className="absolute bottom-1 left-1 text-xs bg-champagne text-white px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
                {productImages.length < 10 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-champagne transition-colors">
                    <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Click on an image to set it as primary. Primary image will be shown in listings.
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">Product Name *</label>
                <Input
                  value={productForm.name}
                  onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g., Diamond Solitaire Ring"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Price (USD) *</label>
                <Input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Category *</label>
                <Select
                  value={productForm.category}
                  onValueChange={(v) => setProductForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Stone Type</label>
                <Select
                  value={productForm.stone}
                  onValueChange={(v) => setProductForm((f) => ({ ...f, stone: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stone" />
                  </SelectTrigger>
                  <SelectContent>
                    {stones.map((stone) => (
                      <SelectItem key={stone} value={stone}>
                        {stone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Style</label>
                <Select
                  value={productForm.style}
                  onValueChange={(v) => setProductForm((f) => ({ ...f, style: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your jewelry piece..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setIsProductDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="champagne" onClick={handleSaveProduct} disabled={saving}>
                {saving ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : editingProduct ? (
                  "Save Changes"
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
