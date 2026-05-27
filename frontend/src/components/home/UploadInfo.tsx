export function UploadInfo() {
  return (
    <div className="mt-5 flex gap-6 text-[0.65rem] text-muted-foreground/60">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-1 w-1 rounded-full bg-foreground/20" />
        local AI processing
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-1 w-1 rounded-full bg-foreground/20" />
        no API costs
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-1 w-1 rounded-full bg-foreground/20" />
        private & secure
      </span>
    </div>
  );
}
