"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ChatMessage as ChatMessageType } from "@/app/summary/types";

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
}

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 }}
      className={`mb-4 flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 7.5A3 3 0 107 1.5a3 3 0 000 6zM1.5 12.5c.7-2 2.5-3.5 5.5-3.5s4.8 1.5 5.5 3.5"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="12" height="12" rx="2"/>
            <path d="M5 6h4M5 8.5h3"/>
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] rounded-lg px-3.5 py-2.5 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "border bg-background text-foreground"
        }`}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-code:rounded prose-code:bg-muted/50 prose-code:px-1 prose-code:text-xs">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
