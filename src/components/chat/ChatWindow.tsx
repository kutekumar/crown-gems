import { useState, useRef, useEffect } from "react";
import { X, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useConversation } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";

interface ChatWindowProps {
  conversationId: string | null;
  onClose: () => void;
  isFullPage?: boolean;
}

export function ChatWindow({ conversationId, onClose, isFullPage = false }: ChatWindowProps) {
  const { user, role } = useAuth();
  const { messages, conversation, loading, sendMessage } = useConversation(conversationId);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage("");
    }
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getOtherPartyName = () => {
    if (!conversation) return "Chat";
    if (role === "seller") {
      return conversation.buyer?.full_name || "Buyer";
    }
    return conversation.seller?.business_name || "Seller";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString();
  };

  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {};
    messages.forEach((msg) => {
      const date = formatDate(msg.created_at);
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className={cn(
        "flex flex-col bg-background",
        isFullPage ? "h-full" : "h-[500px] rounded-2xl shadow-lg border border-border"
      )}>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-champagne border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate();

  return (
    <div className={cn(
      "flex flex-col bg-background",
      isFullPage ? "h-full" : "h-[500px] rounded-2xl shadow-lg border border-border overflow-hidden"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
        >
          {isFullPage ? <ArrowLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{getOtherPartyName()}</h3>
          <p className="text-xs text-muted-foreground">
            {role === "seller" ? "Buyer" : "Seller"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center justify-center mb-4">
                <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>
              <div className="space-y-2">
                {msgs.map((message) => {
                  const isOwn = message.sender_id === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        isOwn ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5",
                          isOwn
                            ? "bg-champagne text-primary-foreground rounded-br-md"
                            : "bg-secondary rounded-bl-md"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}
                        >
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending}
          />
          <Button
            variant="champagne"
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
