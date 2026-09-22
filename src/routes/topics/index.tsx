import { createFileRoute, Link } from "@tanstack/react-router";
import { listTopicsFn } from "@/lib/lab.functions";

export const Route = createFileRoute("/topics/")({
  loader: () => listTopicsFn(),
  component: TopicsPage,
});

function TopicsPage() {
  const topics = Route.useLoaderData();
  return (
    <main className="flex flex-col gap-4">
      <nav className="flex flex-wrap gap-3 font-mono text-xs">
        <Link to="/" className="text-ink no-underline">
          /
        </Link>
        <a href="/api/v1/topics" className="text-ink/50 no-underline">
          /api/v1/topics
        </a>
        <a href="/api/v1/graph" className="text-ink/50 no-underline">
          /api/v1/graph
        </a>
      </nav>
      <h1 className="font-mono text-sm lowercase tracking-widest">topics</h1>
      {topics.length === 0 ? (
        <p className="font-mono text-sm text-muted">no topics yet</p>
      ) : null}
      <ul className="divide-y divide-rule">
        {topics.map((t) => (
          <li key={t.id} className="py-3">
            <Link
              to="/topics/$id"
              params={{ id: t.id }}
              className="flex flex-col gap-1 no-underline sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="font-mono text-xs text-ink">{t.api}</span>
              <span className="flex-1 text-sm text-ink">{t.title}</span>
              <span className="font-mono text-xs text-ink/50">
                {(t.entries ?? []).length} entries
              </span>
            </Link>
            {t.summary ? (
              <p className="mt-1 font-mono text-xs text-ink/60">{t.summary}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
