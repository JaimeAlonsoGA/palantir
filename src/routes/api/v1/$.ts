import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, jsonError } from "@/server/http";

function splatOf(params: Record<string, string | undefined>): string {
  return params._splat ?? params["$"] ?? "";
}

/** Catch-all under /api/v1 so unknown paths return JSON 404, never SPA HTML. */
export const Route = createFileRoute("/api/v1/$")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ params }) =>
        jsonError(`not found: /api/v1/${splatOf(params)}`, 404),
      POST: async ({ params }) =>
        jsonError(`not found: /api/v1/${splatOf(params)}`, 404),
      PUT: async ({ params }) =>
        jsonError(`not found: /api/v1/${splatOf(params)}`, 404),
      PATCH: async ({ params }) =>
        jsonError(`not found: /api/v1/${splatOf(params)}`, 404),
      DELETE: async ({ params }) =>
        jsonError(`not found: /api/v1/${splatOf(params)}`, 404),
    },
  },
});
