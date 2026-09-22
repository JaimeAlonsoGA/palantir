import { createFileRoute, Link } from "@tanstack/react-router";
import { getEntryFn } from "@/lib/lab.functions";
import { Chip } from "@/components/badges";

export const Route = createFileRoute("/entries/$slug")({
  loader: ({ params }) => getEntryFn({ data: { slug: params.slug } }),
  component: EntryPage,
});

function EntryPage() {
  const entry = Route.useLoaderData();
  if (!entry) {
    return (
      <main className="font-mono text-sm">
        <p>not found</p>
        <Link to="/">/</Link>
      </main>
    );
  }
  return (
    <main className="flex flex-col gap-4">
      <nav className="flex flex-wrap gap-3 font-mono text-xs">
        <Link to="/" className="text-sage no-underline">
          /
        </Link>
        <span className="text-ink/50">{entry.api}</span>
        <a href={entry.api} className="text-ink/50 no-underline">
          raw
        </a>
      </nav>
      <h1 className="text-xl text-ink">{entry.title}</h1>
      <div className="flex flex-wrap gap-1">
        <Chip kind={entry.type}>{entry.type}</Chip>
        <Chip kind={entry.status}>{entry.status}</Chip>
        <Chip kind={entry.certainty}>{entry.certainty}</Chip>
      </div>
      <section className="grid gap-2 font-mono text-sm">
        <Field label="slug" value={entry.slug} />
        <Field label="claim" value={entry.claim} />
        <Field label="mechanism" value={entry.mechanism} />
        <Field label="limits" value={entry.limits} />
        {entry.inventor_note ? (
          <Field label="inventor_note" value={entry.inventor_note} />
        ) : null}
      </section>
      {entry.quantities?.length ? (
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/60">
            quantities
          </h2>
          <ul className="divide-y divide-rule font-mono text-sm">
            {entry.quantities.map((q) => (
              <li key={q.name} className="flex flex-wrap gap-2 py-1">
                <span>{q.name}</span>
                <span>
                  {q.value} {q.unit}
                </span>
                <span className="text-ink/50">{q.certainty}</span>
                <span className="text-ink/50">@{q.source}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {entry.relations?.length ? (
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/60">
            relations
          </h2>
          <ul className="font-mono text-sm">
            {entry.relations.map((r) => (
              <li key={`${r.rel}:${r.slug}`}>
                <span className="text-ink/50">{r.rel}</span>{" "}
                <Link to="/entries/$slug" params={{ slug: r.slug }} className="text-sage">
                  {r.slug}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {entry.topics?.length ? (
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/60">topics</h2>
          <ul className="font-mono text-sm">
            {entry.topics.map((t) => (
              <li key={t.id}>
                <Link to="/topics/$id" params={{ id: t.id }} className="text-sage">
                  {t.id}
                </Link>{" "}
                <span className="text-ink/50">{t.title}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {entry.sources?.length ? (
        <section>
          <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/60">sources</h2>
          <ul className="font-mono text-sm">
            {entry.sources.map((s) => (
              <li key={s.key}>
                <span className="text-sage">{s.key}</span>
                {s.note ? <span className="text-ink/50"> — {s.note}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section>
        <h2 className="mb-2 font-mono text-xs uppercase tracking-wide text-ink/60">json</h2>
        <pre className="overflow-x-auto rounded-md border border-rule bg-surface p-3 font-mono text-xs text-ink">
          {JSON.stringify(entry, null, 2)}
        </pre>
      </section>
    </main>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-ink/50">{label}</div>
      <div className="whitespace-pre-wrap">{value}</div>
    </div>
  );
}
