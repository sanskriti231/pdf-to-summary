import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "PDF to Summary",
  description:
    "Upload PDFs, get AI-powered summaries, and chat with your documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors closeButton expand />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
