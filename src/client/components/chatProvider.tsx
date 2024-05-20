"use client"; // For client-side rendering in Next.js 13+

import { createContext, useContext, useState, useEffect } from "react";
import { useChat, Message } from "ai/react"; // Update if your library has a different import path

interface ChatContextValue {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: ReturnType<typeof useChat>["handleSubmit"]; // Infer type from useChat hook
  isLoading: boolean; // Add isLoading state
  error: string | null; // Add error state
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

// ChatProvider Component
export function ChatProvider({ children, api }: { children: React.ReactNode, api: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api,
    onFinish: (message) => {
      setIsLoading(false);
    },
    onError: (error) => {
      setError(error.message);
      setIsLoading(false);
    },
  });

  return (
    <ChatContext.Provider value={{ messages, input, handleInputChange, handleSubmit, isLoading, error }}>
      {children}
    </ChatContext.Provider>
  );
}
