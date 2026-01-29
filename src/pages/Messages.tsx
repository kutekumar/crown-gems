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
  const { user } = useAuth();
  const { conversations, loading } = useMessages();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

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

  if (loading) {
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

  // Mobile: show either list or chat
  if (selectedConversationId) {
    return (
      <div className="min-h-screen bg-background flex flex-col md:hidden">
        <div className="flex-1">
          <ChatWindow
            conversationId={selectedConversationId}
            onClose={() => setSelectedConversationId(null)}
            isFullPage
          />
        </div>
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
            Your conversations with {conversations.length > 0 ? "sellers" : "jewelry sellers"}
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
          <div className="flex-1 p-6">
            {selectedConversationId ? (
              <ChatWindow
                conversationId={selectedConversationId}
                onClose={() => setSelectedConversationId(null)}
              />
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

        {/* Mobile: List only */}
        <div className="md:hidden">
          <ConversationList
            conversations={conversations}
            onSelect={setSelectedConversationId}
          />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
