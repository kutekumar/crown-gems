import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ConversationList } from "@/components/chat/ConversationList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function Messages() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const { conversations, loading } = useMessages();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  console.log("Messages page - user:", user?.id, "role:", role, "authLoading:", authLoading, "conversations:", conversations.length, "loading:", loading);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="pt-16">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="pt-16">
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-champagne-light flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-champagne" />
            </div>
            <h2 className="font-serif text-xl font-medium mb-2 text-center">
              Sign in to view messages
            </h2>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Connect with sellers and manage your conversations
            </p>
            <Button variant="champagne" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (loading && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="pt-16">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  // Show helpful message for sellers without seller records
  if (role === "seller" && conversations.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <main className="pt-16">
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-champagne-light flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-champagne" />
            </div>
            <h2 className="font-serif text-xl font-medium mb-2 text-center">
              No messages yet
            </h2>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              When buyers contact you about your products, their messages will appear here.
            </p>
            {/* Check if user has seller application or products */}
            <Button variant="champagne-outline" onClick={() => navigate("/seller/dashboard")}>
              Go to Seller Dashboard
            </Button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <div className="px-4 py-6 border-b border-border">
          <h1 className="font-serif text-2xl md:text-3xl font-medium">Messages</h1>
          <p className="text-muted-foreground mt-1">
            {conversations.length > 0 
              ? `${conversations.length} active conversation${conversations.length > 1 ? 's' : ''}`
              : "No conversations yet"}
          </p>
        </div>

        {/* Desktop: Split view */}
        <div className="hidden md:flex h-[calc(100vh-180px)]">
          <div className="w-80 border-r border-border overflow-y-auto">
            <ConversationList
              conversations={conversations}
              onSelect={setSelectedConversationId}
              selectedId={selectedConversationId}
            />
          </div>
          <div className="flex-1">
            {selectedConversationId ? (
              <div className="h-full flex items-center justify-center p-6">
                <div className="w-full max-w-4xl h-full">
                  <ChatWindow
                    conversationId={selectedConversationId}
                    onClose={() => setSelectedConversationId(null)}
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: List or Chat */}
        <div className="md:hidden">
          {selectedConversationId ? (
            <div className="h-[calc(100vh-180px)]">
              <ChatWindow
                conversationId={selectedConversationId}
                onClose={() => setSelectedConversationId(null)}
                isFullPage
              />
            </div>
          ) : (
            <ConversationList
              conversations={conversations}
              onSelect={setSelectedConversationId}
            />
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
