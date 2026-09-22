import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { listEntriesFn, listTopicsFn } from "@/lib/lab.functions";
import { Chip } from "@/components/badges";
import { ENUMS } from "@/lib/lab-types";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [entries, topics] = await Promise.all([listEntriesFn(), listTopicsFn()]);
    return { entries, topics };
  },
  component: Home,
});

function Home() {
  const { entries, topics } = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [topic, setTopic] = useState("all");
  const [showDrafts, setShowDrafts] = useState(false);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (!showDrafts && e.status === "draft") return false;
      if (type !== "all" && e.type !== type) return false;
      if (topic !== "all" && !(e.topics ?? []).some((t) => t.id === topic)) return false;
      if (!needle) return true;
      return (
        e.title.toLowerCase().includes(needle) ||
        e.slug.toLowerCase().includes(needle) ||
        e.claim.toLowerCase().includes(needle)
      );
    });
  }, [entries, q, type, topic, showDrafts]);

  return (
    <main>
      <nav className="mb-4 flex flex-wrap gap-3 font-mono text-xs">
        <Link to="/" className="text-sage no-underline">
          /
        </Link>
        <Link to="/topics" className="text-ink/70 no-underline">
          /topics
        </Link>
        <Link to="/refs" className="text-ink/70 no-underline">
          /refs
        </Link>
        <Link to="/new" className="text-ink/70 no-underline">
          /new
        </Link>
        <a href="/api/v1/dump" className="text-ink/50 no-underline">
          /api/v1/dump
        </a>
        <a href="/api/v1/graph" className="text-ink/50 no-underline">
          /api/v1/graph
        </a>
        <a href="/llms.txt" className="text-ink/50 no-underline">
          /llms.txt
        </a>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search"
          className="h-11 min-h-11 flex-1 rounded-md border border-rule bg-surface px-3 font-mono text-sm text-ink outline-none focus:border-sage"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-11 min-h-11 rounded-md border border-rule bg-surface px-3 font-mono text-sm text-ink outline-none focus:border-sage"
        >
          <option value="all">type</option>
          {ENUMS.type.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="h-11 min-h-11 rounded-md border border-rule bg-surface px-3 font-mono text-sm text-ink outline-none focus:border-sage"
        >
          <option value="all">topic</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.id}
            </option>
          ))}
        </select>
        <label className="flex h-11 items-center gap-2 font-mono text-xs text-ink/70">
          <input
            type="checkbox"
            checked={showDrafts}
            onChange={(e) => setShowDrafts(e.target.checked)}
          />
          drafts
        </label>
      </div>

      <ul className="mt-6 divide-y divide-rule">
        {shown.map((e) => (
          <li key={e.slug}>
            <Link
              to="/entries/$slug"
              params={{ slug: e.slug }}
              className="flex flex-col gap-2 py-4 no-underline"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                <span className="font-mono text-xs text-sage">{e.api}</span>
                <span className="flex-1 text-sm text-ink">{e.title}</span>
                <span className="flex flex-wrap gap-1">
                  <Chip kind={e.type}>{e.type}</Chip>
                  <Chip kind={e.status}>{e.status}</Chip>
                  <Chip kind={e.certainty}>{e.certainty}</Chip>
                </span>
              </div>
              <div className="font-mono text-xs text-ink/50">{e.slug}</div>
              <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink/80">
                {e.claim}
              </p>
              <div className="font-mono text-[11px] text-ink/40">
                links:{(e.links ?? []).length} relations:{(e.relations ?? []).length} topics:
                {(e.topics ?? []).map((t) => t.id).join(",") || "—"}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
