import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const { catalog } = await import("@/server/lab.server");
  return catalog();
});

export const Route = createFileRoute("/docs")({
  loader: () => getCatalog(),
  component: Docs,
});

function Docs() {
  const data = Route.useLoaderData();
  return (
    <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-ink">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
