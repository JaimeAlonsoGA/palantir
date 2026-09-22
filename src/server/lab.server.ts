import { getSql } from "@/lib/db";
import {
  AGENT_ENDPOINTS,
  ENUMS,
  REGISTER,
  isCertainty,
  isEntryStatus,
  isEntryType,
  isRefKind,
  type Certainty,
  type EntryInput,
  type EntryPatch,
  type EntryStatus,
  type EntryType,
  type LabEntry,
  type LabRef,
  type Quantity,
} from "@/lib/lab-types";

function asIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  const s = String(value);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toISOString();
}

function mapEntry(row: Record<string, unknown>): LabEntry {
  const slug = String(row.slug);
  return {
    slug,
    href: `/entries/${slug}`,
    api: `/api/v1/entries/${slug}`,
    title: String(row.title),
    type: isEntryType(String(row.type)) ? (row.type as EntryType) : "principle",
    status: isEntryStatus(String(row.status)) ? (row.status as EntryStatus) : "draft",
    certainty: isCertainty(String(row.certainty)) ? (row.certainty as Certainty) : "unsourced",
    claim: String(row.claim ?? ""),
    mechanism: String(row.mechanism ?? ""),
    quantities: (Array.isArray(row.quantities) ? row.quantities : []) as Quantity[],
    limits: String(row.limits ?? ""),
    inventor_note: String(row.inventor_note ?? ""),
    sources: Array.isArray(row.sources) ? (row.sources as LabEntry["sources"]) : [],
    links: Array.isArray(row.links) ? row.links.filter((s): s is string => typeof s === "string") : [],
    created_at: asIso(row.created_at),
    updated_at: asIso(row.updated_at),
  };
}

function mapRef(row: Record<string, unknown>): LabRef {
  return {
    key: String(row.key),
    href: `/refs#${row.key}`,
    api: `/api/v1/refs/${row.key}`,
    kind: isRefKind(String(row.kind)) ? (row.kind as LabRef["kind"]) : "misc",
    title: String(row.title ?? ""),
    authors: String(row.authors ?? ""),
    year: String(row.year ?? ""),
    journal: String(row.journal ?? ""),
    doi: String(row.doi ?? ""),
    url: String(row.url ?? ""),
    note: String(row.note ?? ""),
    created_at: asIso(row.created_at),
  };
}

function requireSlug(raw: string) {
  const s = raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 96);
  if (!s) throw new Error("slug: usa minúsculas, números y guiones");
  return s;
}

export async function listEntries(type?: string): Promise<LabEntry[]> {
  const sql = await getSql();
  if (type) {
    if (!isEntryType(type)) throw new Error(`type inválido. usa: ${ENUMS.type.join(" | ")}`);
    const rows = await sql`select * from entries where type = ${type} order by updated_at desc`;
    return rows.map(mapEntry);
  }
  const rows = await sql`select * from entries order by updated_at desc`;
  return rows.map(mapEntry);
}

export async function getEntry(slug: string): Promise<LabEntry | null> {
  const sql = await getSql();
  const rows = await sql`select * from entries where slug = ${slug} limit 1`;
  return rows[0] ? mapEntry(rows[0]) : null;
}

export async function searchEntries(q: string): Promise<LabEntry[]> {
  const sql = await getSql();
  const needle = `%${q.trim()}%`;
  const rows = await sql`select * from entries where title ilike ${needle} or claim ilike ${needle} or mechanism ilike ${needle} or slug ilike ${needle} order by updated_at desc`;
  return rows.map(mapEntry);
}

export async function createEntry(input: EntryInput): Promise<LabEntry> {
  const result = await upsertEntry(input);
  if (!result.created) throw new Error("slug ya existe");
  return result.entry;
}

export async function patchEntry(slug: string, patch: EntryPatch): Promise<LabEntry> {
  const current = await getEntry(slug);
  if (!current) throw new Error("no encontrado");
  const next = {
    title: patch.title?.trim() ?? current.title,
    type: patch.type ?? current.type,
    status: patch.status ?? current.status,
    certainty: patch.certainty ?? current.certainty,
    claim: patch.claim ?? current.claim,
    mechanism: patch.mechanism ?? current.mechanism,
    quantities: patch.quantities ?? current.quantities,
    limits: patch.limits ?? current.limits,
    inventor_note: patch.inventor_note ?? current.inventor_note,
    sources: patch.sources ?? current.sources,
    links: patch.links ?? current.links,
  };
  if (!next.title) throw new Error("title es obligatorio");
  if (!isEntryType(next.type)) throw new Error(`type inválido. usa: ${ENUMS.type.join(" | ")}`);
  if (!isEntryStatus(next.status)) throw new Error(`status inválido. usa: ${ENUMS.status.join(" | ")}`);
  if (!isCertainty(next.certainty)) throw new Error(`certainty inválida. usa: ${ENUMS.certainty.join(" | ")}`);
  const sql = await getSql();
  await sql`update entries set title=${next.title}, type=${next.type}, status=${next.status}, certainty=${next.certainty}, claim=${next.claim}, mechanism=${next.mechanism}, quantities=${JSON.stringify(next.quantities)}::jsonb, limits=${next.limits}, inventor_note=${next.inventor_note}, sources=${JSON.stringify(next.sources)}::jsonb, links=${JSON.stringify(next.links)}::jsonb, updated_at=now() where slug=${slug}`;
  const updated = await getEntry(slug);
  if (!updated) throw new Error("no se pudo actualizar");
  return updated;
}

export async function upsertEntry(input: EntryInput): Promise<{ entry: LabEntry; created: boolean }> {
  const slug = requireSlug(input.slug);
  const existing = await getEntry(slug);
  if (existing) return { entry: await patchEntry(slug, input), created: false };
  const title = input.title?.trim();
  if (!title) throw new Error("title es obligatorio");
  const type = isEntryType(String(input.type ?? "principle")) ? (input.type ?? "principle") : "principle";
  const status = isEntryStatus(String(input.status ?? "draft")) ? (input.status ?? "draft") : "draft";
  const certainty = isCertainty(String(input.certainty ?? "unsourced")) ? (input.certainty ?? "unsourced") : "unsourced";
  const sql = await getSql();
  await sql`insert into entries (slug,title,type,status,certainty,claim,mechanism,quantities,limits,inventor_note,sources,links) values (${slug},${title},${type},${status},${certainty},${input.claim ?? ""},${input.mechanism ?? ""},${JSON.stringify(input.quantities ?? [])}::jsonb,${input.limits ?? ""},${input.inventor_note ?? ""},${JSON.stringify(input.sources ?? [])}::jsonb,${JSON.stringify(input.links ?? [])}::jsonb)`;
  const created = await getEntry(slug);
  if (!created) throw new Error("no se pudo crear");
  return { entry: created, created: true };
}

export async function deleteEntry(slug: string): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql`delete from entries where slug = ${slug} returning slug`;
  return rows.length > 0;
}

export async function listRefs(): Promise<LabRef[]> {
  const sql = await getSql();
  return (await sql`select * from refs order by year desc, key asc`).map(mapRef);
}

export async function getRef(key: string): Promise<LabRef | null> {
  const sql = await getSql();
  const rows = await sql`select * from refs where key = ${key} limit 1`;
  return rows[0] ? mapRef(rows[0]) : null;
}

export async function createRef(input: { key: string; kind?: string; title?: string; authors?: string; year?: string; journal?: string; doi?: string; url?: string; note?: string }): Promise<LabRef> {
  const result = await upsertRef(input);
  if (!result.created) throw new Error("key ya existe");
  return result.ref;
}

export async function upsertRef(input: { key: string; kind?: string; title?: string; authors?: string; year?: string; journal?: string; doi?: string; url?: string; note?: string }): Promise<{ ref: LabRef; created: boolean }> {
  const key = input.key.trim();
  if (!key) throw new Error("key es obligatorio");
  const existing = await getRef(key);
  const kind = isRefKind(String(input.kind ?? existing?.kind ?? "misc")) ? String(input.kind ?? existing?.kind ?? "misc") : "misc";
  const sql = await getSql();
  if (!existing) {
    await sql`insert into refs (key,kind,title,authors,year,journal,doi,url,note) values (${key},${kind},${input.title ?? ""},${input.authors ?? ""},${input.year ?? ""},${input.journal ?? ""},${input.doi ?? ""},${input.url ?? ""},${input.note ?? ""})`;
    const created = await getRef(key);
    if (!created) throw new Error("no se pudo crear");
    return { ref: created, created: true };
  }
  await sql`update refs set kind=${kind}, title=${input.title ?? existing.title}, authors=${input.authors ?? existing.authors}, year=${input.year ?? existing.year}, journal=${input.journal ?? existing.journal}, doi=${input.doi ?? existing.doi}, url=${input.url ?? existing.url}, note=${input.note ?? existing.note} where key=${key}`;
  const updated = await getRef(key);
  if (!updated) throw new Error("no se pudo actualizar");
  return { ref: updated, created: false };
}

export async function dumpAll() {
  const [entries, refs] = await Promise.all([listEntries(), listRefs()]);
  return { name: "Palantir", version: "1", enums: ENUMS, register: REGISTER, entries, refs };
}

export function schemaDoc() {
  return {
    name: "Palantir",
    version: "1",
    enums: ENUMS,
    register: REGISTER,
    entry: {
      slug: "string", title: "string", type: ENUMS.type, status: ENUMS.status, certainty: ENUMS.certainty,
      claim: "string", mechanism: "string",
      quantities: [{ name: "string", value: "string", unit: "string", certainty: ENUMS.certainty, source: "string" }],
      limits: "string", inventor_note: "string",
      sources: [{ key: "string", note: "string" }], links: ["slug"],
      href: "/entries/:slug", api: "/api/v1/entries/:slug",
    },
    ref: {
      key: "string", kind: ENUMS.kind, title: "string", authors: "string", year: "string",
      journal: "string", doi: "string", url: "string", note: "string",
      href: "/refs#:key", api: "/api/v1/refs/:key",
    },
    rule: "one record, one object. declarative facts. no pedagogy, comparison, example, or reader-correction. idea = type=idea.",
  };
}

export async function catalog() {
  const [entries, refs] = await Promise.all([listEntries(), listRefs()]);
  return { name: "Palantir", version: "1", entries: entries.length, refs: refs.length, enums: ENUMS, register: REGISTER, endpoints: AGENT_ENDPOINTS };
}

export function llmsText() {
  return `Palantir
GET /api/v1/dump
GET /api/v1/schema
GET /api/v1/entries/:slug
PUT /api/v1/entries/:slug
PATCH /api/v1/entries/:slug
DELETE /api/v1/entries/:slug
GET /api/v1/search?q=
GET /api/v1/refs
PUT /api/v1/refs/:key
GET /entries/:slug
GET /llms.txt
Content-Type: application/json
CORS *

type: ${ENUMS.type.join(" | ")}
status: ${ENUMS.status.join(" | ")}
certainty: ${ENUMS.certainty.join(" | ")}
kind: ${ENUMS.kind.join(" | ")}

fields: slug title type status certainty claim mechanism quantities[] limits inventor_note sources[] links[]
quantities[]: name value unit certainty source
links[] = entry slugs
sources[].key = ref key

register:
corpus = citable facts for later evaluation. not instruction
subject = one record, one object
prose = declarative technical statements
certainty = tag every statement measured | reported | inferred | unsourced
others = links[] | sources[]
idea = type=idea, own slug
forbidden = pedagogy, comparison, analogy, example, reader-correction, unlinked-entities, conversational-residue
`;
}
