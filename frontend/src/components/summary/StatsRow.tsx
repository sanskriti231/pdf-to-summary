import type { SummaryDetail } from "@/app/summary/types";
import { formatDate } from "@/lib/utils";

interface StatsRowProps {
  summary: SummaryDetail;
}

export function StatsRow({ summary }: StatsRowProps) {
  const stats = [
    { label: "words", value: summary.original_word_count.toLocaleString() },
    { label: "summary", value: summary.summary_word_count.toLocaleString() },
    { label: "pages", value: `${summary.page_count}` },
    { label: "created", value: formatDate(summary.created_at) },
  ];

  return (
    <div className="flex border-b">
      {stats.map((stat) => (
        <div key={stat.label} className="flex-1 px-4 py-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-0.5 text-sm font-medium text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
