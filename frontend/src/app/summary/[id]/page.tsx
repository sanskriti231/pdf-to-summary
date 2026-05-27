"use client";

import { useParams } from "next/navigation";

import { useSummary } from "@/hooks/use-summary";
import { useChat } from "@/hooks/use-chat";
import { SummaryNavbar } from "@/components/summary/SummaryNavbar";
import { SummaryPanel } from "@/components/summary/SummaryPanel";
import { ChatPanel } from "@/components/summary/ChatPanel";
import { SummarySkeleton } from "@/components/summary/SummarySkeleton";
import { SummaryErrorState } from "@/components/summary/SummaryErrorState";

export default function SummaryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    summary,
    loading,
    error,
    copied,
    handleCopySummary,
  } = useSummary(id);

  const {
    messages,
    input,
    sending,
    chatEndRef,
    inputRef,
    setInput,
    handleSend,
    handleKeyDown,
  } = useChat(id);

  if (loading) {
    return <SummarySkeleton />;
  }

  // Error state
  if (error && !summary) {
    return <SummaryErrorState message={error} />;
  }

  // Data loaded
  if (!summary) return null;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <SummaryNavbar
        summary={summary}
        copied={copied}
        onCopy={handleCopySummary}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <SummaryPanel summary={summary} />

        <ChatPanel
          summary={summary}
          messages={messages}
          input={input}
          sending={sending}
          chatEndRef={chatEndRef}
          inputRef={inputRef}
          onInputChange={setInput}
          onSend={handleSend}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
