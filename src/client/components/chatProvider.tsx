"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  FormEvent,
} from "react";
import { useChat } from "ai/react";
import { ChatRequestOptions, Message } from "ai";

interface ChatMessage extends Message {
  chatId: string; // Add chatId to identify the chat
}

interface ChatContextValue {
  messages: ChatMessage[];
  currentChatId: string | null;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    chatId: string,
    e: FormEvent<HTMLFormElement>,
    options?: ChatRequestOptions
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  setCurrentChatId: React.Dispatch<React.SetStateAction<string | null>>;
  clearMessages: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

export function ChatProvider({
  children,
  api,
}: {
  children: React.ReactNode;
  api: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { input, handleInputChange, handleSubmit: originalHandleSubmit } = useChat(
    {
      api,
      onFinish: (message: Message) => {
        // Add chatId to the message before storing
        const newMessage: ChatMessage = { ...message, chatId: currentChatId! }; 
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsLoading(false);
      },
      onError: (error) => {
        setError(error.message);
        setIsLoading(false);
      },
    }
  );

  const handleSubmit: ChatContextValue["handleSubmit"] = async (
    chatId,
    e,
    options
  ) => {
    try {
      setIsLoading(true);
      setCurrentChatId(chatId); // Set the current chat ID
      await originalHandleSubmit(e, options);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Error in handleSubmit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = (chatId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((m) => m.chatId !== chatId)
    );
  };

  const filteredMessages = messages.filter((m) => m.chatId === currentChatId); // Filter messages for the current chat

  return (
    <ChatContext.Provider
      value={{
        messages: filteredMessages, 
        currentChatId,
        setCurrentChatId,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        error,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
