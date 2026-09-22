import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, text } from "@/server/http";
import { agentLlmsText } from "@/server/agent-llms";

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async () => text(agentLlmsText()),
    },
  },
});
