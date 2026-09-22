import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json } from "@/server/http";

export const Route = createFileRoute("/api/")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async () =>
        json({
          name: "Palantir",
          current: "/api/v1",
        }),
    },
  },
});
