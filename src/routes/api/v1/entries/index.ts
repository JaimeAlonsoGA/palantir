import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError, readJson } from "@/server/http";
import { createEntry, listEntries } from "@/server/lab.server";
import type { EntryInput } from "@/lib/lab-types";

export const Route = createFileRoute("/api/v1/entries/")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const type = url.searchParams.get("type") ?? undefined;
          return json(await listEntries(type));
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await readJson(request)) as EntryInput;
          const created = await createEntry(body);
          return json(created, 201);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 400);
        }
      },
    },
  },
});
