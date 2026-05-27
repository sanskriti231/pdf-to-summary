import type { SummaryDetail } from "@/app/summary/types";
import { StatsRow } from "./StatsRow";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SummaryPanelProps {
  summary: SummaryDetail;
}

export function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <div className="hidden w-1/2 flex-col border-r lg:flex">
      <StatsRow summary={summary} />

      <ScrollArea className="flex-1">
        <div className="px-5 py-5">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {summary.summary}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
