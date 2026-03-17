import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

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
  product_id: string | null;
  created_at: string;
  updated_at: string;
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
  last_message?: Message;
  unread_count?: number;
}

export function useMessages() {
  const { user, role } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // If role is null, assume buyer (default role)
    const effectiveRole = role || "buyer";

    console.log("Fetching conversations for user:", user.id, "role:", effectiveRole);

    try {
      // Fetch conversations based on role
      let query = supabase
        .from("conversations")
        .select(`
          *,
          seller:sellers!conversations_seller_id_fkey (
            id,
            business_name,
            user_id
          ),
          product:products (
            id,
            name,
            price
          )
        `)
        .order("created_at", { ascending: false });

      // Filter by role - buyers see their conversations, sellers see theirs
      if (effectiveRole === "seller") {
        // For sellers, find their seller record first
        const { data: sellerRecord, error: sellerError } = await supabase
          .from("sellers")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        
        console.log("Seller record lookup:", sellerRecord, sellerError);
        
        if (sellerRecord) {
          query = query.eq("seller_id", sellerRecord.id);
        } else {
          // Seller account but no seller record yet
          console.log("No seller record found for user");
          setConversations([]);
          setLoading(false);
          return;
        }
      } else {
        // For buyers, filter by buyer_id
        query = query.eq("buyer_id", user.id);
      }

      const { data, error } = await query;

      console.log("Conversations query result:", data, error);

      if (error) throw error;

      // Fetch last message and unread count for each conversation
      const conversationsWithMessages = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1);

          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", conv.id)
            .eq("is_read", false)
            .neq("sender_id", user.id);

          // Fetch buyer profile
          const { data: buyerProfile } = await supabase
            .from("profiles")
            .select("id, full_name")
            .eq("user_id", conv.buyer_id)
            .maybeSingle();

          // Fetch product image if product exists
          let productWithImage = conv.product;
          if (conv.product_id) {
            const { data: productImages } = await supabase
              .from("product_images")
              .select("image_url")
              .eq("product_id", conv.product_id)
              .eq("is_primary", true)
              .maybeSingle();

            if (productImages && conv.product) {
              productWithImage = {
                ...conv.product,
                image_url: productImages.image_url,
              };
            }
          }

          return {
            ...conv,
            buyer: buyerProfile,
            product: productWithImage,
            last_message: messages?.[0],
            unread_count: count || 0,
          };
        })
      );

      console.log("Final conversations with messages:", conversationsWithMessages);
      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      // Don't show toast error immediately - tables might not exist yet
      // Just set loading to false and show empty conversations
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [user, role]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const startConversation = async (sellerId: string, productId?: string) => {
    if (!user) {
      toast.info("Please sign in to message sellers");
      return null;
    }

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from("conversations")
        .select("id, product_id")
        .eq("buyer_id", user.id)
        .eq("seller_id", sellerId)
        .maybeSingle();

      if (existing) {
        // If conversation exists but doesn't have a product_id, update it
        if (productId && !existing.product_id) {
          await supabase
            .from("conversations")
            .update({ product_id: productId })
            .eq("id", existing.id);
          
          console.log("Updated existing conversation with product_id:", productId);
        }
        return existing.id;
      }

      // Create new conversation
      const { data, error } = await supabase
        .from("conversations")
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          product_id: productId || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Created new conversation with product_id:", productId);
      await fetchConversations();
      return data.id;
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
      return null;
    }
  };

  const getUnreadCount = () => {
    return conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
  };

  return {
    conversations,
    loading,
    startConversation,
    refresh: fetchConversations,
    getUnreadCount,
  };
}

export function useConversation(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) {
      setMessages([]);
      setLoading(false);
      return;
    }

    console.log("Fetching messages for conversation:", conversationId);

    try {
      // Fetch conversation details
      const { data: convData, error: convError } = await supabase
        .from("conversations")
        .select(`
          *,
          seller:sellers!conversations_seller_id_fkey (
            id,
            business_name,
            user_id
          ),
          product:products (
            id,
            name,
            price
          )
        `)
        .eq("id", conversationId)
        .maybeSingle();

      console.log("Conversation data:", convData, convError);

      if (convError) throw convError;
      
      if (!convData) {
        console.error("Conversation not found for ID:", conversationId);
        toast.error("Conversation not found");
        setLoading(false);
        return;
      }

      // Fetch buyer profile
      const { data: buyerProfile } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("user_id", convData.buyer_id)
        .maybeSingle();

      // Fetch product image if product exists
      let productWithImage = convData.product;
      if (convData.product_id && convData.product) {
        const { data: productImages } = await supabase
          .from("product_images")
          .select("image_url")
          .eq("product_id", convData.product_id)
          .eq("is_primary", true)
          .maybeSingle();

        if (productImages) {
          productWithImage = {
            ...convData.product,
            image_url: productImages.image_url,
          };
        }
      }

      setConversation({
        ...convData,
        buyer: buyerProfile,
        product: productWithImage,
      });

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      console.log("Messages fetched:", messagesData);
      setMessages(messagesData || []);

      // Mark messages as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", user.id)
        .eq("is_read", false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  useEffect(() => {
    fetchMessages();

    // Set up realtime subscription
    let channel: RealtimeChannel | null = null;

    if (conversationId && user) {
      console.log("Setting up realtime subscription for conversation:", conversationId);
      
      channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            console.log("Realtime message received:", payload);
            const newMessage = payload.new as Message;
            
            // Don't add if it's our own message (already added optimistically)
            if (newMessage.sender_id === user.id) {
              console.log("Skipping own message from realtime (already added optimistically)");
              return;
            }
            
            // Only add messages from other users
            setMessages((prev) => {
              // Check if message already exists
              const exists = prev.some(msg => msg.id === newMessage.id);
              if (exists) {
                console.log("Message already exists, skipping");
                return prev;
              }
              console.log("Adding new message from other user:", newMessage);
              return [...prev, newMessage];
            });

            // Mark as read if not from current user
            supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMessage.id);
          }
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
        });
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId, user, fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !user || !content.trim()) return false;

    // Create optimistic message
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim(),
      is_read: false,
      created_at: new Date().toISOString(),
    };

    // Add optimistic message immediately
    setMessages((prev) => [...prev, optimisticMessage]);
    console.log("Added optimistic message:", optimisticMessage);

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Message sent successfully:", data);

      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticMessage.id ? data : msg
        )
      );

      // Update conversation's updated_at
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
      toast.error("Failed to send message");
      return false;
    }
  };

  return {
    messages,
    conversation,
    loading,
    sendMessage,
    refresh: fetchMessages,
  };
}
