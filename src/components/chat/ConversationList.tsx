import { MessageCircle, ChevronRight, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  seller?: {
    id: string;
    business_name: string;
    user_id: string;
  };
  buyer?: {
    id: string;
    full_name: string | null;
  };
  product?: Product;
  last_message?: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversationId: string) => void;
  selectedId?: string | null;
}

export function ConversationList({ conversations, onSelect, selectedId }: ConversationListProps) {
  const { role } = useAuth();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getDisplayName = (conv: Conversation) => {
    if (role === "seller") {
      return conv.buyer?.full_name || "Anonymous Buyer";
    }
    return conv.seller?.business_name || "Seller";
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-champagne-light flex items-center justify-center mb-4">
          <MessageCircle className="w-8 h-8 text-champagne" />
        </div>
        <h3 className="font-serif text-lg font-medium mb-2">No conversations yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          {role === "seller"
            ? "When buyers contact you about your products, their messages will appear here."
            : "Browse products and click 'Contact Seller' on any item you're interested in to start a conversation."}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            "w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left",
            selectedId === conv.id && "bg-secondary"
          )}
        >
          <div className="w-12 h-12 rounded-full bg-champagne-light flex items-center justify-center flex-shrink-0">
            <span className="font-serif font-semibold text-champagne">
              {getDisplayName(conv).charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium truncate">{getDisplayName(conv)}</span>
              {conv.last_message && (
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {formatTime(conv.last_message.created_at)}
                </span>
              )}
            </div>
            
            {/* Product indicator for sellers */}
            {role === "seller" && conv.product && (
              <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                <Package className="w-3 h-3 text-champagne flex-shrink-0" />
                <span className="text-xs text-champagne truncate font-medium">
                  {conv.product.name}
                </span>
              </div>
            )}
            
            {conv.last_message ? (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {conv.last_message.content}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                No messages yet
              </p>
            )}
          </div>
          {(conv.unread_count ?? 0) > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-gold text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">
              {conv.unread_count}
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      ))}
    </div>
  );
}
