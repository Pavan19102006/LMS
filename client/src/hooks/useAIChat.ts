import { useState, useCallback, useRef, useEffect } from 'react';
import { aiService, AIMessage } from '../services/aiService';

export interface UseAIChat {
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
  retryLastMessage: () => Promise<void>;
}

export const useAIChat = (conversationId: string = 'default'): UseAIChat => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUserMessage = useRef<string>('');

  
  useEffect(() => {
    const history = aiService.getConversation(conversationId);
    setMessages(history);
  }, [conversationId]);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    lastUserMessage.current = userMessage;

    
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await aiService.sendMessage(conversationId, userMessage);
      
      
      const assistantMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      
      
      const errorMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, isLoading]);

  const clearConversation = useCallback(() => {
    aiService.clearConversation(conversationId);
    setMessages([]);
    setError(null);
  }, [conversationId]);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage.current) {
      
      setMessages(prev => {
        const filtered = prev.filter(msg => 
          !(msg.role === 'assistant' && msg.content.includes('Sorry, I encountered an error'))
        );
        return filtered;
      });
      
      await sendMessage(lastUserMessage.current);
    }
  }, [sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    retryLastMessage
  };
};
