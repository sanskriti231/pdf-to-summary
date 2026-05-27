"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import type { ChatMessage } from "@/app/summary/types";
import { chatWithPdf } from "@/app/summary/api";

export function useChat(summaryId: string) {
  const { getToken } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "I've read your document. Ask me anything about it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setSending(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication failed");
      const result = await chatWithPdf(summaryId, userMessage, token);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.response },
      ]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to get response";
      toast.error(message);
    } finally {
      setSending(false);
    }
  }, [input, sending, summaryId, getToken]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return {
    // State
    messages,
    input,
    sending,
    chatEndRef,
    inputRef,

    // Actions
    setInput,
    handleSend,
    handleKeyDown,
  };
}
