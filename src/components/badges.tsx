import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  measured: "bg-sage text-sage-fg",
  reported: "bg-ink text-paper",
  inferred: "bg-inset text-amber",
  unsourced: "bg-inset text-rust",
  active: "bg-sage/15 text-sage",
  draft: "bg-inset text-muted",
  superseded: "bg-inset text-rust",
  device: "bg-paper-2 text-ink-soft",
  phenomenon: "bg-paper-2 text-ink-soft",
  principle: "bg-paper-2 text-ink-soft",
  idea: "bg-inset text-sage",
  material: "bg-paper-2 text-ink-soft",
  measurement: "bg-paper-2 text-ink-soft",
  article: "bg-paper-2 text-ink-soft",
  book: "bg-paper-2 text-ink-soft",
  thesis: "bg-paper-2 text-ink-soft",
  web: "bg-paper-2 text-ink-soft",
  misc: "bg-inset text-muted",
};

export function Chip({
  children,
  kind,
}: {
  children: string;
  kind?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[11px] tracking-wide uppercase",
        TONE[kind ?? ""] ?? "bg-inset text-muted",
      )}
    >
      {children}
    </span>
  );
}
