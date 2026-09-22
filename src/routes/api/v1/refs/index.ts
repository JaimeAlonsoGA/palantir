import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError, readJson } from "@/server/http";
import { createRef, listRefs } from "@/server/lab.server";

export const Route = createFileRoute("/api/v1/refs/")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async () => {
        try {
          return json(await listRefs());
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await readJson(request)) as {
            key?: string;
            kind?: string;
            title?: string;
            authors?: string;
            year?: string;
            journal?: string;
            doi?: string;
            url?: string;
            note?: string;
          };
          if (!body.key) return jsonError("key es obligatorio", 400);
          const created = await createRef({
            key: body.key,
            kind: body.kind ?? "misc",
            title: body.title ?? "",
            authors: body.authors ?? "",
            year: body.year ?? "",
            journal: body.journal ?? "",
            doi: body.doi ?? "",
            url: body.url ?? "",
            note: body.note ?? "",
          });
          return json(created, 201);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 400);
        }
      },
    },
  },
});
