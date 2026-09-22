import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, text } from "@/server/http";
import { llmsText } from "@/server/lab.server";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async () => text(llmsText()),
    },
  },
});
