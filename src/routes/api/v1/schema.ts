import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json } from "@/server/http";
import { schemaDoc } from "@/server/lab.server";

export const Route = createFileRoute("/api/v1/schema")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async () => json(schemaDoc()),
    },
  },
});
