import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError } from "@/server/http";
import { searchEntries } from "@/server/lab.server";

export const Route = createFileRoute("/api/v1/search")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ request }) => {
        try {
          const q = new URL(request.url).searchParams.get("q") ?? "";
          if (!q.trim()) return json([]);
          return json(await searchEntries(q));
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
    },
  },
});
