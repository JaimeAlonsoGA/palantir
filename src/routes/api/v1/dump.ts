import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError } from "@/server/http";
import { dumpAll } from "@/server/lab.server";

export const Route = createFileRoute("/api/v1/dump")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async () => {
        try {
          return json(await dumpAll());
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
    },
  },
});
