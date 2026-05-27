"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { SummaryDetail } from "@/app/summary/types";

interface AnalyticsChartsProps {
  summary: SummaryDetail;
}

const COLORS = ["oklch(0.45 0.06 260)", "oklch(0.6 0.12 200)", "oklch(0.55 0.12 330)"];

export function AnalyticsCharts({ summary }: AnalyticsChartsProps) {
  const compressionRatio =
    summary.compression_ratio ??
    Math.round((summary.summary_word_count / summary.original_word_count) * 100);

  // Word comparison chart
  const wordData = [
    {
      name: "Original",
      words: summary.original_word_count,
      fill: "oklch(0.45 0.06 260)",
    },
    {
      name: "Summary",
      words: summary.summary_word_count,
      fill: "oklch(0.6 0.12 200)",
    },
  ];

  // Timing data
  const timingData = [
    {
      name: "Generation",
      value: summary.gen_time ?? 0,
      fill: "oklch(0.45 0.06 260)",
    },
  ];

  // Compression pie
  const pieData = [
    { name: "Summarized", value: compressionRatio },
    { name: "Reduced", value: 100 - compressionRatio },
  ];

  const chunkData = [
    { name: "Chunks\nProcessed", value: summary.chunks_processed },
  ];

  return (
    <div className="space-y-6 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Word count bar chart */}
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Word Count
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wordData} barSize={48}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.52 0.008 285)" }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "oklch(0.52 0.008 285)" }} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.15 0.008 285)",
                    border: "1px solid oklch(1 0 0 / 6%)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "oklch(0.92 0.004 285)",
                  }}
                  formatter={(value: any) => [Number(value).toLocaleString(), "Words"]}
                />
                <Bar dataKey="words" radius={[4, 4, 0, 0]}>
                  {wordData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compression ratio pie chart */}
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Compression Ratio
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={58}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.15 0.008 285)",
                    border: "1px solid oklch(1 0 0 / 6%)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "oklch(0.92 0.004 285)",
                  }}
                  formatter={(value: any) => [`${Number(value).toFixed(1)}%`, undefined]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "oklch(0.52 0.008 285)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Processing time */}
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Processing Time
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timingData} barSize={48}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.52 0.008 285)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "oklch(0.52 0.008 285)" }}
                  label={{
                    value: "seconds",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 10, fill: "oklch(0.52 0.008 285)" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.15 0.008 285)",
                    border: "1px solid oklch(1 0 0 / 6%)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "oklch(0.92 0.004 285)",
                  }}
                  formatter={(value: any) => `${Number(value).toFixed(2)}s`}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="oklch(0.55 0.12 330)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chunks processed */}
        <div className="rounded-lg border p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Chunks Processed
          </p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chunkData} barSize={48}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "oklch(0.52 0.008 285)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "oklch(0.52 0.008 285)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.15 0.008 285)",
                    border: "1px solid oklch(1 0 0 / 6%)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "oklch(0.92 0.004 285)",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="oklch(0.6 0.12 200)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model info row */}
      <div className="flex flex-wrap gap-3 rounded-lg border bg-muted/20 px-4 py-3">
        <div className="text-xs">
          <span className="text-muted-foreground/50">Model: </span>
          <span className="font-medium text-foreground">T5-small (local)</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground/50">Chunk size: </span>
          <span className="font-medium text-foreground">240 words</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground/50">Total time: </span>
          <span className="font-medium text-foreground">
            {summary.total_time ? `${summary.total_time.toFixed(2)}s` : "N/A"}
          </span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground/50">Gen time: </span>
          <span className="font-medium text-foreground">
            {summary.gen_time ? `${summary.gen_time.toFixed(2)}s` : "N/A"}
          </span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground/50">File size: </span>
          <span className="font-medium text-foreground">
            {(summary.file_size / 1024).toFixed(0)} KB
          </span>
        </div>
      </div>
    </div>
  );
}
