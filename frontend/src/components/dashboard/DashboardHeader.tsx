interface DashboardHeaderProps {
  count: number;
}

export function DashboardHeader({ count }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h1 className="text-lg font-medium tracking-tight text-foreground">
          History
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {count > 0
            ? `${count} summar${count === 1 ? "y" : "ies"}`
            : "Your summarized documents"}
        </p>
      </div>
    </div>
  );
}
