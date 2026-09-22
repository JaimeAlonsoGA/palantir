import { createFileRoute, Link } from "@tanstack/react-router";
import { getTopicFn } from "@/lib/lab.functions";

export const Route = createFileRoute("/topics/$id")({
  loader: ({ params }) => getTopicFn({ data: { id: params.id } }),
  component: TopicPage,
});

function TopicPage() {
  const topic = Route.useLoaderData();
  if (!topic) {
    return (
      <main className="font-mono text-sm">
        <p>not found</p>
        <Link to="/topics">/topics</Link>
      </main>
    );
  }
  return (
    <main className="flex flex-col gap-4">
      <nav className="flex flex-wrap gap-3 font-mono text-xs">
        <Link to="/topics" className="text-ink no-underline">
          /topics
        </Link>
        <span className="text-ink/50">{topic.api}</span>
      </nav>
      <h1 className="text-xl text-ink">{topic.title}</h1>
      <p className="font-mono text-xs text-ink/50">id: {topic.id}</p>
      {topic.summary ? (
        <p className="font-mono text-sm text-ink/80">{topic.summary}</p>
      ) : null}
      <section>
        <h2 className="mb-2 font-mono text-xs lowercase tracking-wide text-ink/60">
          entries
        </h2>
        <ul className="divide-y divide-rule font-mono text-sm">
          {(topic.entries ?? []).map((slug) => (
            <li key={slug} className="py-2">
              <Link to="/entries/$slug" params={{ slug }} className="text-ink">
                {slug}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <pre className="overflow-x-auto rounded-md border border-rule bg-surface p-3 font-mono text-xs">
        {JSON.stringify(topic, null, 2)}
      </pre>
    </main>
  );
}
