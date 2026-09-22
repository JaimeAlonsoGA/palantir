import type { LabEntry } from "@/lib/lab-types";

function normalizeQuery(q: string): {
  raw: string;
  lower: string;
  slugish: string;
  tokens: string[];
} {
  const raw = q.trim();
  const lower = raw.toLowerCase();
  const slugish = lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const tokens = lower
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
  return { raw, lower, slugish, tokens };
}

/** Rank: exact slug >> title token >> claim early >> mechanism. Stable by slug. */
export function scoreSearchHit(entry: LabEntry, q: string): number {
  const { lower, slugish, tokens } = normalizeQuery(q);
  if (!lower) return 0;
  const slug = entry.slug.toLowerCase();
  const title = entry.title.toLowerCase();
  const claim = entry.claim.toLowerCase();
  const mechanism = entry.mechanism.toLowerCase();
  const slugParts = new Set(slug.split("-").filter(Boolean));
  const titleTokens = title.split(/[^a-z0-9]+/).filter(Boolean);

  let score = 0;

  if (slug === lower || slug === slugish) score += 100_000;
  else if (slug.startsWith(slugish) && slugish.length >= 3) score += 50_000;
  else if (slug.includes(slugish) && slugish.length >= 3) score += 25_000;

  if (title === lower) score += 20_000;
  else if (title.includes(lower)) score += 12_000;
  for (const t of tokens) {
    if (slugParts.has(t)) score += 8_000;
    if (titleTokens.includes(t)) score += 5_000;
    else if (title.includes(t)) score += 2_500;
  }

  const claimHead = claim.slice(0, 240);
  if (claimHead.includes(lower)) score += 4_000;
  else {
    for (const t of tokens) {
      if (claimHead.includes(t)) score += 1_500;
    }
  }
  if (claim.includes(lower)) score += 800;
  else {
    for (const t of tokens) {
      if (claim.includes(t)) score += 200;
    }
  }

  if (mechanism.includes(lower)) score += 100;
  for (const t of tokens) {
    const n = mechanism.split(t).length - 1;
    if (n > 0) score += Math.min(40, n * 8);
  }

  return score;
}

export function rankSearchHits(entries: LabEntry[], q: string): LabEntry[] {
  const scored = entries.map((entry) => ({
    entry,
    score: scoreSearchHit(entry, q),
  }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.slug.localeCompare(b.entry.slug);
  });
  return scored.map((s) => s.entry);
}
