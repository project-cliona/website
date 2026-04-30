import { cn } from "@/lib/utils";

type StatusTone = "indigo" | "violet" | "green" | "red" | "slate";

const toneStyles: Record<StatusTone, string> = {
  indigo: "bg-primary-100 text-primary-800",
  violet: "bg-violet-100 text-violet-800",
  green: "bg-success/15 text-success",
  red: "bg-destructive/15 text-destructive",
  slate: "bg-slate-100 text-slate-700",
};

const STATUS_TO_TONE: Record<string, StatusTone> = {
  subscribed: "indigo",
  active: "indigo",
  automated: "indigo",
  scheduled: "violet",
  sending: "violet",
  completed: "green",
  sent: "green",
  delivered: "green",
  unsubscribed: "red",
  failed: "red",
  rejected: "red",
  draft: "slate",
  pending: "slate",
  inactive: "slate",
};

interface StatusPillProps {
  status?: string;
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
}

export function StatusPill({ status, tone, children, className }: StatusPillProps) {
  const resolved = tone ?? (status ? STATUS_TO_TONE[status.toLowerCase()] ?? "slate" : "slate");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneStyles[resolved],
        className,
      )}
    >
      {children}
    </span>
  );
}
