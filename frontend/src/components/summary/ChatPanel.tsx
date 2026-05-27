"use client";

import { motion, AnimatePresence } from "framer-motion";

import type { ChatMessage as ChatMessageType, SummaryDetail } from "@/app/summary/types";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatPanelProps {
  summary: SummaryDetail;
  messages: ChatMessageType[];
  input: string;
  sending: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Voice integration */
  onVoiceClick?: () => void;
  isListening?: boolean;
  voiceSupported?: boolean;
}

export function ChatPanel({
  summary,
  messages,
  input,
  sending,
  chatEndRef,
  inputRef,
  onInputChange,
  onSend,
  onKeyDown,
  onVoiceClick,
  isListening,
  voiceSupported,
}: ChatPanelProps) {
  const hasMessages = messages.length > 1;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Mobile header */}
      <div className="border-b px-4 py-2.5 lg:hidden">
        <p className="text-sm font-medium text-foreground">{summary.original_filename}</p>
        <p className="text-xs text-muted-foreground">
          {summary.page_count} pages
        </p>
      </div>

      {/* Empty state */}
      {!hasMessages && !sending && (
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted/30">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-muted-foreground/40">
                <rect x="2" y="2" width="16" height="16" rx="2"/>
                <path d="M7 10h6M7 12.5h4" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="mt-3 text-sm text-muted-foreground/50">
              Ask anything about this document
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} index={i} />
            ))}
            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex gap-2.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="1" y="1" width="12" height="12" rx="2"/>
                    <path d="M5 6h4M5 8h3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2 rounded bg-muted/50 px-3 py-2">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40" style={{ animationDelay: "0ms" }} />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40" style={{ animationDelay: "150ms" }} />
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/40" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      <ChatInput
        value={input}
        sending={sending}
        inputRef={inputRef}
        onChange={onInputChange}
        onSend={onSend}
        onKeyDown={onKeyDown}
        onVoiceClick={onVoiceClick}
        isListening={isListening}
        voiceSupported={voiceSupported}
      />
    </div>
  );
}