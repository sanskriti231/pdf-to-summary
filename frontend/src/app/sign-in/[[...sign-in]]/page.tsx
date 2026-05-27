import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium tracking-tight text-foreground">pdf to summary</p>
        <p className="mt-1 text-xs text-muted-foreground">Sign in to get started</p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-sm",
            card: "shadow-none border-none bg-transparent p-0",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "border border-border text-sm text-foreground bg-background hover:bg-accent transition-colors rounded",
            formFieldLabel: "text-xs text-muted-foreground font-normal",
            formFieldInput: "border-b border-border bg-transparent px-0 py-2 text-sm text-foreground rounded-none focus:border-foreground/30 focus:ring-0 focus:outline-none shadow-none",
            formButtonPrimary: "bg-foreground text-background hover:bg-foreground/90 text-sm font-medium rounded transition-colors",
            footerActionLink: "text-xs text-muted-foreground hover:text-foreground transition-colors",
            footerActionText: "text-xs text-muted-foreground",
            dividerLine: "bg-border",
            dividerText: "text-xs text-muted-foreground",
            identityPreviewEditButton: "text-xs text-muted-foreground",
            formFieldHintText: "text-xs text-muted-foreground",
            formFieldErrorText: "text-xs text-destructive",
            otpCodeFieldInput: "border-border",
          },
        }}
      />
      <p className="mt-6 text-[10px] text-muted-foreground">
        <a href="/" className="underline underline-offset-2 hover:text-foreground transition-colors">back to home</a>
      </p>
    </div>
  );
}
