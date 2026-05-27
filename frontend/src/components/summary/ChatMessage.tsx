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
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 }}
      className={`mb-4 flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {isUser ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6.5A2.5 2.5 0 106 1.5a2.5 2.5 0 000 5zM1.5 11c.5-1.5 2-2.5 4.5-2.5s4 1 4.5 2.5"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="10" height="10" rx="2"/>
            <path d="M4 5h4M4 7h3"/>
          </svg>
        )}
      </div>
      <div
        className={`max-w-[80%] rounded px-3 py-2 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted/50 text-foreground"
        }`}
      >
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
