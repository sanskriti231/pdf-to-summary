"use client";

import { AnimatePresence } from "framer-motion";

import type { ChatMessage as ChatMessageType, SummaryDetail } from "@/app/summary/types";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";

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
}: ChatPanelProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Mobile header */}
      <div className="border-b px-4 py-2 lg:hidden">
        <p className="text-xs font-medium text-foreground">{summary.original_filename}</p>
        <p className="text-[10px] text-muted-foreground">
          {summary.page_count} pages &middot; {formatDate(summary.created_at)}
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-4">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} index={i} />
            ))}
            {sending && (
              <div className="mb-4 flex gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="1" y="1" width="10" height="10" rx="2"/>
                    <path d="M4 5h4M4 7h3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2 rounded bg-muted/50 px-3 py-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary/50" />
                  <span className="text-xs text-muted-foreground">thinking</span>
                </div>
              </div>
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
      />
    </div>
  );
}
