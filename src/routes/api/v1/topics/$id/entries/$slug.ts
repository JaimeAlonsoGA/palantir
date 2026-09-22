import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError } from "@/server/http";
import { detachEntryFromTopic } from "@/server/lab.server";

export const Route = createFileRoute("/api/v1/topics/$id/entries/$slug")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      DELETE: async ({ params }) => {
        try {
          const topic = await detachEntryFromTopic(params.id, params.slug);
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
