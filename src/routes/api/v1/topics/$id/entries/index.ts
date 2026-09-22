import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError, readJson } from "@/server/http";
import { attachEntryToTopic } from "@/server/lab.server";

export const Route = createFileRoute("/api/v1/topics/$id/entries/")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      POST: async ({ params, request }) => {
        try {
          const body = (await readJson(request)) as { slug?: string };
          if (!body.slug) return jsonError("slug is required", 400);
          const topic = await attachEntryToTopic(params.id, body.slug);
          return json(topic);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "error";
          const status = msg.includes("not found") ? 404 : 400;
          return jsonError(msg, status);
        }
      },
    },
  },
});
