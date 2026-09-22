import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError, readJson } from "@/server/http";
import { getRef, upsertRef } from "@/server/lab.server";

export const Route = createFileRoute("/api/v1/refs/$key")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ params }) => {
        try {
          const ref = await getRef(params.key);
          if (!ref) return jsonError("no encontrado", 404);
          return json(ref);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const body = (await readJson(request)) as {
            kind?: string;
            title?: string;
            authors?: string;
            year?: string;
            journal?: string;
            doi?: string;
            url?: string;
            note?: string;
          };
          const result = await upsertRef({
            key: params.key,
            kind: body.kind,
            title: body.title ?? "",
            authors: body.authors ?? "",
            year: body.year ?? "",
            journal: body.journal ?? "",
            doi: body.doi ?? "",
            url: body.url ?? "",
            note: body.note ?? "",
          });
          return json(result, result.created ? 201 : 200);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 400);
        }
      },
    },
  },
});
