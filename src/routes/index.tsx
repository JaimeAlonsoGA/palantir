import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { listEntriesFn } from "@/lib/lab.functions";
import { Chip } from "@/components/badges";
import { ENUMS } from "@/lib/lab-types";

export const Route = createFileRoute("/")({
  loader: () => listEntriesFn(),
  component: Home,
});

function Home() {
  const entries = Route.useLoaderData();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (type !== "all" && e.type !== type) return false;
      if (!needle) return true;
      return (
        e.title.toLowerCase().includes(needle) ||
        e.slug.toLowerCase().includes(needle) ||
        e.claim.toLowerCase().includes(needle)
      );
    });
  }, [entries, q, type]);

  return (
    <main>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
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
      </div>

      <ul className="mt-6 divide-y divide-rule">
        {shown.map((e) => (
          <li key={e.slug}>
            <Link
              to="/entries/$slug"
              params={{ slug: e.slug }}
              className="flex flex-col gap-1 py-3 no-underline sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="font-mono text-xs text-sage">{e.api}</span>
              <span className="flex-1 text-sm text-ink">{e.title}</span>
              <span className="flex gap-1">
                <Chip kind={e.type}>{e.type}</Chip>
                <Chip kind={e.certainty}>{e.certainty}</Chip>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
