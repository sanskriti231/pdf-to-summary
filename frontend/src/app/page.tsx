"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useUpload } from "@/hooks/use-upload";
import { HomeNavbar } from "@/components/home/HomeNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { UploadArea } from "@/components/home/UploadArea";
import { UploadInfo } from "@/components/home/UploadInfo";
import { ResultsSection } from "@/components/home/ResultsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhySection } from "@/components/home/WhySection";
import { HomeFooter } from "@/components/home/HomeFooter";

export default function Home() {
  const {
    isLoaded,
    isDragging,
    file,
    processing,
    processResult,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileSelect,
    handleReset,
  } = useUpload();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="h-4 w-4 rounded-full bg-primary/30 skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <HomeNavbar />

      <div className="h-14" />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8">
        <HeroSection>
          <UploadArea
            isDragging={isDragging}
            processing={processing}
            processingFileName={file?.name ?? null}
            processResult={processResult}
            fileInputRef={fileInputRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
            onAreaClick={() => fileInputRef.current?.click()}
          />
          <UploadInfo />
        </HeroSection>

        <AnimatePresence>
          {processResult && (
            <ResultsSection
              processResult={processResult}
              onNewFile={handleReset}
            />
          )}
        </AnimatePresence>

        <HowItWorksSection />

        <WhySection />

        <HomeFooter />
      </main>
    </div>
  );
}
