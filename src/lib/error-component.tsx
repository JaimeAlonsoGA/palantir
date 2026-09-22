import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "unexpected error. reload the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main
      className={
        "flex min-h-dvh flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink"
      }
    >
      <span className="text-ink" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-medium lowercase">something went wrong</h1>
      <p className="max-w-md break-words text-sm text-muted">{errorMessage(error)}</p>
    </main>
  );
}
