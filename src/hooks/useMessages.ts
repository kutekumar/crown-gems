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
          )
        `)
        .order("updated_at", { ascending: false });

      const { data, error } = await query;

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

          return {
            ...conv,
            buyer: buyerProfile,
            last_message: messages?.[0],
            unread_count: count || 0,
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error fetching conversations:", error);
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
        .select("id")
        .eq("buyer_id", user.id)
        .eq("seller_id", sellerId)
        .maybeSingle();

      if (existing) {
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
          )
        `)
        .eq("id", conversationId)
        .single();

      if (convError) throw convError;

      // Fetch buyer profile
      const { data: buyerProfile } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("user_id", convData.buyer_id)
        .maybeSingle();

      setConversation({
        ...convData,
        buyer: buyerProfile,
      });

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

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
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  useEffect(() => {
    fetchMessages();

    // Set up realtime subscription
    let channel: RealtimeChannel | null = null;

    if (conversationId && user) {
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
            const newMessage = payload.new as Message;
            setMessages((prev) => [...prev, newMessage]);

            // Mark as read if not from current user
            if (newMessage.sender_id !== user.id) {
              supabase
                .from("messages")
                .update({ is_read: true })
                .eq("id", newMessage.id);
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [conversationId, user, fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !user || !content.trim()) return false;

    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;

      // Update conversation's updated_at
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      return true;
    } catch (error) {
      console.error("Error sending message:", error);
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
