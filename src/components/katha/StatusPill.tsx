import { STATUS_META, type Status } from "@/lib/katha-data";
import { cn } from "@/lib/utils";

const TONE: Record<Status, string> = {
  understood: "bg-status-good-soft text-status-good",
  practice: "bg-status-warn-soft text-status-warn",
  attention: "bg-status-bad-soft text-status-bad",
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONE[status],
        className,
      )}
    >
      <span aria-hidden>{meta.dot}</span>
      {meta.label}
    </span>
  );
}

export function LanguageChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">{children}</span>
  );
}
