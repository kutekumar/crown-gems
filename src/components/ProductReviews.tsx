import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { RatingDiamond } from "@/components/icons/DiamondIcon";
import { Star, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductReviewForm } from "@/components/ProductReviewForm";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
}

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Fetch reviews
  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  // Check if user has already reviewed
  const userReview = reviews?.find((r) => r.user_id === user?.id);

  // Calculate average rating
  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleDeleteReview = async () => {
    if (!deletingReviewId) return;

    try {
      const { error } = await supabase
        .from("product_reviews")
        .delete()
        .eq("id", deletingReviewId);

      if (error) throw error;

      toast.success("Review deleted successfully");
      refetch();
      setDeletingReviewId(null);
    } catch (error: any) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
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
            "w-4 h-4",
            i < fullDiamonds ? "text-champagne" : "text-platinum"
          )}
        />
      );
    }
    return diamonds;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-medium mb-2">
            Customer Reviews
          </h2>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {renderRating(averageRating)}
              </div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} out of 5 ({reviews.length}{" "}
                {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {user && !userReview && (
          <Button
            variant="champagne-outline"
            size="sm"
            onClick={() => setShowReviewForm(true)}
          >
            <Star className="w-4 h-4 mr-2" />
            Write Review
          </Button>
        )}
      </div>

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 bg-secondary/30 rounded-xl border border-border"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      Customer
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderRating(review.rating)}
                  </div>
                </div>

                {user?.id === review.user_id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingReview(review);
                        setShowReviewForm(true);
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingReviewId(review.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {review.comment && (
                <p className="text-sm text-muted-foreground mt-2">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-secondary/30 rounded-xl">
          <p className="text-muted-foreground mb-4">No reviews yet</p>
          {user && (
            <Button
              variant="champagne"
              size="sm"
              onClick={() => setShowReviewForm(true)}
            >
              Be the first to review
            </Button>
          )}
        </div>
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ProductReviewForm
          productId={productId}
          onClose={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
          onSuccess={refetch}
          existingReview={
            editingReview
              ? { rating: editingReview.rating, comment: editingReview.comment }
              : userReview
              ? { rating: userReview.rating, comment: userReview.comment }
              : null
          }
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingReviewId}
        onOpenChange={(open) => !open && setDeletingReviewId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReview}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
