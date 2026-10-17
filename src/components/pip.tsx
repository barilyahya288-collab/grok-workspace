import { cn } from "@/lib/cn";
import type { Status } from "@/lib/probe";

const styles: Record<Status, string> = {
  ok: "bg-primary",
  warn: "bg-primary/50",
  fail: "bg-danger",
  blocked: "bg-muted",
  unknown: "bg-border",
};

export function Pip({ status, className }: { status: Status; className?: string }) {
  return <span className={cn("size-2 shrink-0 rounded-full", styles[status], className)} aria-hidden="true" />;
}
