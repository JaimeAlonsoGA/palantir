import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError, readJson } from "@/server/http";
import { createTopic, listTopics } from "@/server/lab.server";
import type { TopicInput } from "@/lib/lab-types";

export const Route = createFileRoute("/api/v1/topics/")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async () => {
        try {
          return json(await listTopics());
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await readJson(request)) as TopicInput;
          const created = await createTopic(body);
          return json(created, 201);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 400);
        }
      },
    },
  },
});
