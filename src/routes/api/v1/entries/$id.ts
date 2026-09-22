import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError, readJson } from "@/server/http";
import { deleteEntry, getEntry, patchEntry, upsertEntry } from "@/server/lab.server";
import type { EntryInput, EntryPatch } from "@/lib/lab-types";

export const Route = createFileRoute("/api/v1/entries/$id")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ params }) => {
        try {
          const entry = await getEntry(params.id);
          if (!entry) return jsonError("no encontrado", 404);
          return json(entry);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const body = (await readJson(request)) as EntryInput;
          const result = await upsertEntry({
            ...body,
            slug: params.id,
            title: body.title || params.id,
          });
          return json(result, result.created ? 201 : 200);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 400);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const body = (await readJson(request)) as EntryPatch;
          const updated = await patchEntry(params.id, body);
          return json(updated);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "error";
          const status = msg === "no encontrado" ? 404 : 400;
          return jsonError(msg, status);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const ok = await deleteEntry(params.id);
          if (!ok) return jsonError("no encontrado", 404);
          return json({ ok: true, slug: params.id });
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
    },
  },
});
