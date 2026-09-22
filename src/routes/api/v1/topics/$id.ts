import { createFileRoute } from "@tanstack/react-router";
import { corsPreflight, json, jsonError, readJson } from "@/server/http";
import {
  deleteTopic,
  getTopic,
  patchTopic,
  upsertTopic,
} from "@/server/lab.server";
import type { TopicInput, TopicPatch } from "@/lib/lab-types";

export const Route = createFileRoute("/api/v1/topics/$id")({
  server: {
    handlers: {
      OPTIONS: async () => corsPreflight(),
      GET: async ({ params }) => {
        try {
          const topic = await getTopic(params.id);
          if (!topic) return jsonError("not found", 404);
          return json(topic);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const body = (await readJson(request)) as TopicInput;
          const result = await upsertTopic({
            ...body,
            id: params.id,
            title: body.title || params.id,
          });
          return json(result.topic, result.created ? 201 : 200);
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 400);
        }
      },
      PATCH: async ({ params, request }) => {
        try {
          const body = (await readJson(request)) as TopicPatch;
          const updated = await patchTopic(params.id, body);
          return json(updated);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "error";
          return jsonError(msg, msg === "not found" ? 404 : 400);
        }
      },
      DELETE: async ({ params }) => {
        try {
          const ok = await deleteTopic(params.id);
          if (!ok) return jsonError("not found", 404);
          return json({ ok: true, id: params.id });
        } catch (err) {
          return jsonError(err instanceof Error ? err.message : "error", 500);
        }
      },
    },
  },
});
