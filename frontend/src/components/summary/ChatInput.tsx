"use client";

interface ChatInputProps {
  value: string;
  sending: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ChatInput({
  value,
  sending,
  inputRef,
  onChange,
  onSend,
  onKeyDown,
}: ChatInputProps) {
  return (
    <div className="border-t px-4 py-3">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="ask a question..."
          className="flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          disabled={sending}
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || sending}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          aria-label="send"
        >
          {sending ? (
            <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7l3-3 3 3M5 4v7"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
