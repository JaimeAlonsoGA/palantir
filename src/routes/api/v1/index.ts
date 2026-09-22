import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError } from "@/server/http";
import { catalog } from "@/server/lab.server";

export const Route = createFileRoute("/api/v1/")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async () => {
        try {
          return json(await catalog());
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
    },
  },
});
