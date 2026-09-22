import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError } from "@/server/http";
import { searchEntries } from "@/server/lab.server";
import { rankSearchHits } from "@/server/search-rank";

export const Route = createFileRoute("/api/v1/search")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ request }) => {
        try {
          const q = new URL(request.url).searchParams.get("q") ?? "";
          if (!q.trim()) return json([]);
          const hits = await searchEntries(q);
          return json(rankSearchHits(hits, q));
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
    },
  },
});
