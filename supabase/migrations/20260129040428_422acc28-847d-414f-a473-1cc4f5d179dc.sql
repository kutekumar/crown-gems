-- Create conversations table for buyer-seller messaging
CREATE TABLE public.conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(buyer_id, seller_id)
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversations policies: users can view their own conversations
CREATE POLICY "Users can view their conversations as buyer"
ON public.conversations FOR SELECT
USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view their conversations"
ON public.conversations FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.sellers 
    WHERE sellers.id = conversations.seller_id 
    AND sellers.user_id = auth.uid()
));

CREATE POLICY "Buyers can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
ON public.messages FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (
        c.buyer_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM public.sellers s 
            WHERE s.id = c.seller_id 
            AND s.user_id = auth.uid()
        )
    )
));

CREATE POLICY "Users can send messages in their conversations"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
        SELECT 1 FROM public.conversations c
        WHERE c.id = messages.conversation_id
        AND (
            c.buyer_id = auth.uid() 
            OR EXISTS (
                SELECT 1 FROM public.sellers s 
                WHERE s.id = c.seller_id 
                AND s.user_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Users can mark messages as read in their conversations"
ON public.messages FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = messages.conversation_id
    AND (
        c.buyer_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM public.sellers s 
            WHERE s.id = c.seller_id 
            AND s.user_id = auth.uid()
        )
    )
));

-- Add triggers for updated_at
CREATE TRIGGER update_conversations_updated_at
BEFORE UPDATE ON public.conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;