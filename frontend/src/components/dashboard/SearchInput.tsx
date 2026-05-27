"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative mt-4">
      <input
        type="text"
        placeholder="search by filename..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-foreground/30 focus:outline-none"
      />
    </div>
  );
}
