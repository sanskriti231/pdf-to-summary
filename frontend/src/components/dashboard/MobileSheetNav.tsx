"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileSheetNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSheetNav({ open, onOpenChange }: MobileSheetNavProps) {
  const { user } = useUser();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const userInitials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger className="flex md:hidden">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-muted-foreground">
          <path d="M3 9h12M3 4.5h12M3 13.5h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </SheetTrigger>
      <SheetContent side="right" className="w-[220px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-sm font-medium tracking-tight">pdf to summary</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {user && (
            <div className="flex items-center gap-2.5 border-b pb-3 mb-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                <AvatarFallback className="text-[10px]">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-medium text-foreground">{user.fullName}</p>
                <p className="text-muted-foreground truncate max-w-[140px]">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => { router.push("/"); onOpenChange(false); }}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            new summary
          </button>
          <button
            onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); onOpenChange(false); }}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {theme === "dark" ? "light" : "dark"} mode
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
