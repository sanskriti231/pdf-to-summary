"use client";

interface ChatInputProps {
  value: string;
  sending: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onVoiceClick?: () => void;
  isListening?: boolean;
  voiceSupported?: boolean;
}

export function ChatInput({
  value,
  sending,
  inputRef,
  onChange,
  onSend,
  onKeyDown,
  onVoiceClick,
  isListening,
  voiceSupported,
}: ChatInputProps) {
  return (
    <div className="border-t bg-background px-4 py-3">
      <div className="flex items-center gap-2">
        {/* Voice button */}
        {voiceSupported && onVoiceClick && (
          <button
            onClick={onVoiceClick}
            disabled={sending}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded transition-colors ${
              isListening
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            title={isListening ? "Stop recording" : "Voice input"}
            aria-label={isListening ? "Stop recording" : "Voice input"}
          >
            {isListening ? (
              <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5.5" y="2" width="3" height="7" rx="1.5"/>
                  <path d="M3 6.5v.5a4 4 0 008 0v-.5M7 11v1.5"/>
                </svg>
              </span>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5.5" y="1" width="3" height="8" rx="1.5"/>
                <path d="M2.5 6v.5a4.5 4.5 0 009 0V6M7 12v1"/>
              </svg>
            )}
          </button>
        )}

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={isListening ? "listening..." : "ask a question..."}
          className="flex-1 bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
          disabled={sending || isListening}
        />

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={!value.trim() || sending}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50 disabled:opacity-20 disabled:hover:bg-transparent"
          aria-label="send"
        >
          {sending ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7l3-3 3 3M5 4v7"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
