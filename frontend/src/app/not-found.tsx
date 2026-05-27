import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4">
      <p className="text-sm font-medium tracking-tight text-foreground">
        page not found
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-4 text-xs text-primary underline underline-offset-2 transition-colors hover:text-foreground"
      >
        back to home
      </Link>
    </div>
  );
}
