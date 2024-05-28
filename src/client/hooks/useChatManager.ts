// useChatManager.ts
import { useState } from "react";
import { useChat, Message } from "ai/react"; // Adjust import if needed
import { ChatRequestOptions } from "ai";

export function useChatManager(api: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setInput,
  } = useChat({
    api,
    onFinish: (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setIsLoading(false);
    },
    onError: (error) => {
      setError(error.message);
      setIsLoading(false);
    },
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    options?: ChatRequestOptions
  ) => {
    try {
      setIsLoading(true);
      setError(null); // Clear previous error
      await originalHandleSubmit(e, options);
      console.log("handleSubmit successfully called");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      console.error("Error in handleSubmit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    setInput,
  };
}
