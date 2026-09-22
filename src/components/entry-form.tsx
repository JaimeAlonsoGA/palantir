import { useState } from "react";
import type { EntryInput } from "@/lib/lab-types";
import { ENUMS } from "@/lib/lab-types";

const empty: EntryInput = {
  slug: "",
  title: "",
  type: "principle",
  status: "active",
  certainty: "reported",
  claim: "",
  mechanism: "",
  quantities: [],
  limits: "",
  inventor_note: "",
  sources: [],
  links: [],
  relations: [],
  topics: [],
};

export function EntryForm({
  submitLabel = "save",
  initial,
  onSubmit,
}: {
  submitLabel?: string;
  initial?: Partial<EntryInput>;
  onSubmit: (data: EntryInput) => Promise<void>;
}) {
  const [form, setForm] = useState<EntryInput>({ ...empty, ...initial });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof EntryInput>(key: K, value: EntryInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <form
      className="flex flex-col gap-3 font-mono text-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        try {
          const relations = (form.relations ?? []).length
            ? form.relations
            : (form.links ?? []).map((slug) => ({ slug, rel: "related" as const }));
          await onSubmit({ ...form, relations });
        } catch (ex) {
          setErr(ex instanceof Error ? ex.message : "error");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="grid gap-1">
        <span className="text-xs text-ink/50">slug</span>
        <input
          required
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          className="rounded-md border border-rule bg-surface px-3 py-2"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs text-ink/50">title</span>
        <input
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="rounded-md border border-rule bg-surface px-3 py-2"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        {(["type", "status", "certainty"] as const).map((key) => (
          <label key={key} className="grid gap-1">
            <span className="text-xs text-ink/50">{key}</span>
            <select
              value={String(form[key])}
              onChange={(e) => set(key, e.target.value as never)}
              className="rounded-md border border-rule bg-surface px-3 py-2"
            >
              {ENUMS[key].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <label className="grid gap-1">
        <span className="text-xs text-ink/50">claim (full; do not shorten)</span>
        <textarea
          required
          rows={6}
          value={form.claim}
          onChange={(e) => set("claim", e.target.value)}
          className="rounded-md border border-rule bg-surface px-3 py-2"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs text-ink/50">mechanism (full; do not shorten)</span>
        <textarea
          rows={12}
          value={form.mechanism}
          onChange={(e) => set("mechanism", e.target.value)}
          className="rounded-md border border-rule bg-surface px-3 py-2"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs text-ink/50">limits</span>
        <textarea
          rows={3}
          value={form.limits}
          onChange={(e) => set("limits", e.target.value)}
          className="rounded-md border border-rule bg-surface px-3 py-2"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs text-ink/50">links (slugs, comma-separated)</span>
        <input
          value={(form.links ?? []).join(", ")}
          onChange={(e) =>
            set(
              "links",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          className="rounded-md border border-rule bg-surface px-3 py-2"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs text-ink/50">topics (ids, comma-separated)</span>
        <input
          value={(form.topics ?? []).join(", ")}
          onChange={(e) =>
            set(
              "topics",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            )
          }
          className="rounded-md border border-rule bg-surface px-3 py-2"
        />
      </label>
      {err ? <p className="text-xs text-ink">{err}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="h-11 rounded-md bg-ink px-4 font-mono text-sm lowercase text-paper disabled:opacity-50"
      >
        {busy ? "…" : submitLabel}
      </button>
    </form>
  );
}
