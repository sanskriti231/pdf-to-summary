"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { useSummary } from "@/hooks/use-summary";
import { useChat } from "@/hooks/use-chat";
import { useVoice } from "@/hooks/use-voice";
import { SummaryNavbar, type TabId } from "@/components/summary/SummaryNavbar";
import { SummaryPanel } from "@/components/summary/SummaryPanel";
import { ChatPanel } from "@/components/summary/ChatPanel";
import { QuizPanel } from "@/components/summary/QuizPanel";
import { FlashcardPanel } from "@/components/summary/FlashcardPanel";
import { AnalyticsCharts } from "@/components/summary/AnalyticsCharts";
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

  const {
    isListening,
    isSupported: voiceSupported,
    transcript,
    startListening,
    stopListening,
  } = useVoice();

  const [activeTab, setActiveTab] = useState<TabId>("chat");

  // When voice transcript changes, update the input field
  useEffect(() => {
    if (transcript) {
      setInput((prev) => {
        if (prev.includes(transcript.trim()) && prev.length > transcript.trim().length) {
          return prev;
        }
        return (prev + " " + transcript).trim();
      });
    }
  }, [transcript, setInput]);

  // Auto-send when voice recording finishes
  useEffect(() => {
    if (!isListening && transcript.trim() && !sending && input.trim() === "") {
      const timer = setTimeout(() => {
        handleSend();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (loading) {
    return <SummarySkeleton />;
  }

  if (error && !summary) {
    return <SummaryErrorState message={error} />;
  }

  if (!summary) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1"
          >
            <SummaryPanel summary={summary} fullWidth />
          </motion.div>
        );
      case "chat":
        return (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1"
          >
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
              onVoiceClick={handleVoiceClick}
              isListening={isListening}
              voiceSupported={voiceSupported}
            />
          </motion.div>
        );
      case "quiz":
        return (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-1"
          >
            <SummaryPanel summary={summary} />
            <QuizPanel summary={summary} />
          </motion.div>
        );
      case "flashcards":
        return (
          <motion.div
            key="flashcards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-1"
          >
            <SummaryPanel summary={summary} />
            <FlashcardPanel summary={summary} />
          </motion.div>
        );
      case "analytics":
        return (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-1 overflow-y-auto"
          >
            <SummaryPanel summary={summary} />
            <div className="flex flex-1 flex-col">
              <AnalyticsCharts summary={summary} />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <SummaryNavbar
        summary={summary}
        copied={copied}
        onCopy={handleCopySummary}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}
