import { getSql } from "@/lib/db";
import {
  AGENT_ENDPOINTS,
  ENUMS,
  REGISTER,
  isCertainty,
  isEntryStatus,
  isEntryType,
  isRefKind,
  isRelationKind,
  type Certainty,
  type EntryInput,
  type EntryPatch,
  type EntryRelation,
  type EntryStatus,
  type EntryType,
  type LabEntry,
  type LabRef,
  type LabTopic,
  type Quantity,
  type TopicInput,
  type TopicPatch,
  type TopicSummary,
} from "@/lib/lab-types";

function asIso(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  const s = String(value);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toISOString();
}

function parseRelations(raw: unknown): EntryRelation[] {
  if (!Array.isArray(raw)) return [];
  const out: EntryRelation[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const slug = String((item as { slug?: unknown }).slug ?? "").trim();
    const rel = String((item as { rel?: unknown }).rel ?? "").trim();
    if (!slug || !isRelationKind(rel)) continue;
    out.push({ slug, rel });
  }
  return out;
}

function mergeLinks(explicit: string[] | undefined, relations: EntryRelation[]): string[] {
  const set = new Set<string>();
  for (const s of explicit ?? []) {
    const t = s.trim();
    if (t) set.add(t);
  }
  for (const r of relations) set.add(r.slug);
  return [...set];
}

function normalizeRelations(raw: unknown): EntryRelation[] {
  return parseRelations(raw);
}

async function topicsForSlug(slug: string): Promise<TopicSummary[]> {
  const sql = await getSql();
  const rows = await sql`
    select t.id, t.title
    from topic_entries te
    join topics t on t.id = te.topic_id
    where te.entry_slug = ${slug}
    order by t.title asc
  `;
  return rows.map((r) => ({ id: String(r.id), title: String(r.title) }));
}

async function mapEntry(row: Record<string, unknown>): Promise<LabEntry> {
  const slug = String(row.slug);
  const relations = parseRelations(row.relations);
  const links = Array.isArray(row.links)
    ? row.links.filter((s): s is string => typeof s === "string")
    : [];
  const topics = await topicsForSlug(slug);
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
    links,
    relations,
    topics,
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

async function mapTopic(row: Record<string, unknown>): Promise<LabTopic> {
  const id = String(row.id);
  const sql = await getSql();
  const entryRows = await sql`
    select entry_slug from topic_entries where topic_id = ${id} order by entry_slug asc
  `;
  return {
    id,
    href: `/topics/${id}`,
    api: `/api/v1/topics/${id}`,
    title: String(row.title),
    parent_id: row.parent_id == null ? null : String(row.parent_id),
    summary: String(row.summary ?? ""),
    entries: entryRows.map((r) => String(r.entry_slug)),
    created_at: asIso(row.created_at),
  };
}

function requireSlug(raw: string) {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  if (!s) throw new Error("slug: use lowercase, numbers, and hyphens");
  return s;
}

function requireTopicId(raw: string) {
  const s = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
  if (!s) throw new Error("topic id: use lowercase, numbers, and hyphens");
  return s;
}

async function syncTopicEntries(slug: string, topicIds: string[]) {
  const sql = await getSql();
  await sql`delete from topic_entries where entry_slug = ${slug}`;
  for (const raw of topicIds) {
    const id = requireTopicId(raw);
    const exists = await sql`select id from topics where id = ${id} limit 1`;
    if (!exists[0]) throw new Error(`topic not found: ${id}`);
    await sql`
      insert into topic_entries (topic_id, entry_slug)
      values (${id}, ${slug})
      on conflict do nothing
    `;
  }
}

export async function listEntries(type?: string, topic?: string): Promise<LabEntry[]> {
  const sql = await getSql();
  let rows: Record<string, unknown>[];
  if (type && topic) {
    if (!isEntryType(type)) throw new Error(`invalid type. use: ${ENUMS.type.join(" | ")}`);
    rows = await sql`
      select e.* from entries e
      join topic_entries te on te.entry_slug = e.slug
      where e.type = ${type} and te.topic_id = ${topic}
      order by e.updated_at desc
    `;
  } else if (type) {
    if (!isEntryType(type)) throw new Error(`invalid type. use: ${ENUMS.type.join(" | ")}`);
    rows = await sql`select * from entries where type = ${type} order by updated_at desc`;
  } else if (topic) {
    rows = await sql`
      select e.* from entries e
      join topic_entries te on te.entry_slug = e.slug
      where te.topic_id = ${topic}
      order by e.updated_at desc
    `;
  } else {
    rows = await sql`select * from entries order by updated_at desc`;
  }
  return Promise.all(rows.map(mapEntry));
}

export async function getEntry(slug: string): Promise<LabEntry | null> {
  const sql = await getSql();
  const rows = await sql`select * from entries where slug = ${slug} limit 1`;
  return rows[0] ? mapEntry(rows[0]) : null;
}

export async function searchEntries(q: string): Promise<LabEntry[]> {
  const sql = await getSql();
  const needle = `%${q.trim()}%`;
  const rows = await sql`
    select * from entries
    where title ilike ${needle}
       or claim ilike ${needle}
       or mechanism ilike ${needle}
       or slug ilike ${needle}
    order by updated_at desc
  `;
  return Promise.all(rows.map(mapEntry));
}

export async function createEntry(input: EntryInput): Promise<LabEntry> {
  const result = await upsertEntry(input);
  if (!result.created) throw new Error("slug already exists");
  return result.entry;
}

export async function patchEntry(slug: string, patch: EntryPatch): Promise<LabEntry> {
  const current = await getEntry(slug);
  if (!current) throw new Error("not found");
  const relations =
    patch.relations !== undefined
      ? normalizeRelations(patch.relations)
      : current.relations;
  const links = mergeLinks(
    patch.links !== undefined ? patch.links : current.links,
    relations,
  );
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
    links,
    relations,
  };
  if (!next.title) throw new Error("title is required");
  if (!isEntryType(next.type)) throw new Error(`invalid type. use: ${ENUMS.type.join(" | ")}`);
  if (!isEntryStatus(next.status))
    throw new Error(`invalid status. use: ${ENUMS.status.join(" | ")}`);
  if (!isCertainty(next.certainty))
    throw new Error(`invalid certainty. use: ${ENUMS.certainty.join(" | ")}`);
  const sql = await getSql();
  await sql`
    update entries set
      title=${next.title},
      type=${next.type},
      status=${next.status},
      certainty=${next.certainty},
      claim=${next.claim},
      mechanism=${next.mechanism},
      quantities=${JSON.stringify(next.quantities)}::jsonb,
      limits=${next.limits},
      inventor_note=${next.inventor_note},
      sources=${JSON.stringify(next.sources)}::jsonb,
      links=${JSON.stringify(next.links)}::jsonb,
      relations=${JSON.stringify(next.relations)}::jsonb,
      updated_at=now()
    where slug=${slug}
  `;
  if (patch.topics !== undefined) {
    await syncTopicEntries(slug, patch.topics);
  }
  const updated = await getEntry(slug);
  if (!updated) throw new Error("update failed");
  return updated;
}

export async function upsertEntry(
  input: EntryInput,
): Promise<{ entry: LabEntry; created: boolean }> {
  const slug = requireSlug(input.slug);
  const existing = await getEntry(slug);
  if (existing) {
    const entry = await patchEntry(slug, input);
    return { entry, created: false };
  }
  const title = input.title?.trim();
  if (!title) throw new Error("title is required");
  const type = isEntryType(String(input.type ?? "principle"))
    ? (input.type ?? "principle")
    : "principle";
  const status = isEntryStatus(String(input.status ?? "draft"))
    ? (input.status ?? "draft")
    : "draft";
  const certainty = isCertainty(String(input.certainty ?? "unsourced"))
    ? (input.certainty ?? "unsourced")
    : "unsourced";
  const relations = normalizeRelations(input.relations ?? []);
  const links = mergeLinks(input.links, relations);
  const sql = await getSql();
  await sql`
    insert into entries (
      slug,title,type,status,certainty,claim,mechanism,quantities,limits,inventor_note,sources,links,relations
    ) values (
      ${slug},${title},${type},${status},${certainty},
      ${input.claim ?? ""},${input.mechanism ?? ""},
      ${JSON.stringify(input.quantities ?? [])}::jsonb,
      ${input.limits ?? ""},${input.inventor_note ?? ""},
      ${JSON.stringify(input.sources ?? [])}::jsonb,
      ${JSON.stringify(links)}::jsonb,
      ${JSON.stringify(relations)}::jsonb
    )
  `;
  if (input.topics?.length) {
    await syncTopicEntries(slug, input.topics);
  }
  const created = await getEntry(slug);
  if (!created) throw new Error("create failed");
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

export async function createRef(input: {
  key: string;
  kind?: string;
  title?: string;
  authors?: string;
  year?: string;
  journal?: string;
  doi?: string;
  url?: string;
  note?: string;
}): Promise<LabRef> {
  const result = await upsertRef(input);
  if (!result.created) throw new Error("key already exists");
  return result.ref;
}

export async function upsertRef(input: {
  key: string;
  kind?: string;
  title?: string;
  authors?: string;
  year?: string;
  journal?: string;
  doi?: string;
  url?: string;
  note?: string;
}): Promise<{ ref: LabRef; created: boolean }> {
  const key = input.key.trim();
  if (!key) throw new Error("key is required");
  const existing = await getRef(key);
  const kind = isRefKind(String(input.kind ?? existing?.kind ?? "misc"))
    ? String(input.kind ?? existing?.kind ?? "misc")
    : "misc";
  const sql = await getSql();
  if (!existing) {
    await sql`
      insert into refs (key,kind,title,authors,year,journal,doi,url,note)
      values (
        ${key},${kind},${input.title ?? ""},${input.authors ?? ""},
        ${input.year ?? ""},${input.journal ?? ""},${input.doi ?? ""},
        ${input.url ?? ""},${input.note ?? ""}
      )
    `;
    const created = await getRef(key);
    if (!created) throw new Error("create failed");
    return { ref: created, created: true };
  }
  await sql`
    update refs set
      kind=${kind},
      title=${input.title ?? existing.title},
      authors=${input.authors ?? existing.authors},
      year=${input.year ?? existing.year},
      journal=${input.journal ?? existing.journal},
      doi=${input.doi ?? existing.doi},
      url=${input.url ?? existing.url},
      note=${input.note ?? existing.note}
    where key=${key}
  `;
  const updated = await getRef(key);
  if (!updated) throw new Error("update failed");
  return { ref: updated, created: false };
}

export async function listTopics(): Promise<LabTopic[]> {
  const sql = await getSql();
  const rows = await sql`select * from topics order by title asc`;
  return Promise.all(rows.map(mapTopic));
}

export async function getTopic(id: string): Promise<LabTopic | null> {
  const sql = await getSql();
  const rows = await sql`select * from topics where id = ${id} limit 1`;
  return rows[0] ? mapTopic(rows[0]) : null;
}

export async function createTopic(input: TopicInput): Promise<LabTopic> {
  const result = await upsertTopic(input);
  if (!result.created) throw new Error("topic already exists");
  return result.topic;
}

export async function upsertTopic(
  input: TopicInput,
): Promise<{ topic: LabTopic; created: boolean }> {
  const id = requireTopicId(input.id);
  const title = input.title?.trim();
  if (!title) throw new Error("title is required");
  const existing = await getTopic(id);
  const parent_id =
    input.parent_id === undefined
      ? (existing?.parent_id ?? null)
      : input.parent_id
        ? requireTopicId(input.parent_id)
        : null;
  const summary =
    input.summary !== undefined ? input.summary : (existing?.summary ?? "");
  const sql = await getSql();
  if (!existing) {
    await sql`
      insert into topics (id, title, parent_id, summary)
      values (${id}, ${title}, ${parent_id}, ${summary})
    `;
  } else {
    await sql`
      update topics set title=${title}, parent_id=${parent_id}, summary=${summary}
      where id=${id}
    `;
  }
  if (input.entries) {
    await sql`delete from topic_entries where topic_id = ${id}`;
    for (const slug of input.entries) {
      const s = requireSlug(slug);
      await sql`
        insert into topic_entries (topic_id, entry_slug)
        values (${id}, ${s})
        on conflict do nothing
      `;
    }
  }
  const topic = await getTopic(id);
  if (!topic) throw new Error(existing ? "update failed" : "create failed");
  return { topic, created: !existing };
}

export async function patchTopic(id: string, patch: TopicPatch): Promise<LabTopic> {
  const current = await getTopic(id);
  if (!current) throw new Error("not found");
  return (
    await upsertTopic({
      id,
      title: patch.title ?? current.title,
      parent_id: patch.parent_id !== undefined ? patch.parent_id : current.parent_id,
      summary: patch.summary ?? current.summary,
      entries: patch.entries,
    })
  ).topic;
}

export async function deleteTopic(id: string): Promise<boolean> {
  const sql = await getSql();
  const rows = await sql`delete from topics where id = ${id} returning id`;
  return rows.length > 0;
}

export async function attachEntryToTopic(
  topicId: string,
  entrySlug: string,
): Promise<LabTopic> {
  const topic = await getTopic(topicId);
  if (!topic) throw new Error("topic not found");
  const entry = await getEntry(entrySlug);
  if (!entry) throw new Error("entry not found");
  const sql = await getSql();
  await sql`
    insert into topic_entries (topic_id, entry_slug)
    values (${topic.id}, ${entry.slug})
    on conflict do nothing
  `;
  const updated = await getTopic(topicId);
  if (!updated) throw new Error("attach failed");
  return updated;
}

export async function detachEntryFromTopic(
  topicId: string,
  entrySlug: string,
): Promise<LabTopic> {
  const topic = await getTopic(topicId);
  if (!topic) throw new Error("topic not found");
  const sql = await getSql();
  await sql`
    delete from topic_entries
    where topic_id = ${topicId} and entry_slug = ${entrySlug}
  `;
  const updated = await getTopic(topicId);
  if (!updated) throw new Error("detach failed");
  return updated;
}

export async function graphDump() {
  const [topics, entries, refs] = await Promise.all([
    listTopics(),
    listEntries(),
    listRefs(),
  ]);
  const relations_flat = entries.flatMap((e) =>
    e.relations.map((r) => ({
      from: e.slug,
      to: r.slug,
      rel: r.rel,
    })),
  );
  return { topics, entries, refs, relations_flat };
}

export async function dumpAll() {
  const [entries, refs, topics] = await Promise.all([
    listEntries(),
    listRefs(),
    listTopics(),
  ]);
  return {
    name: "Palantir",
    version: "2",
    language: "English",
    audience: "agents",
    enums: ENUMS,
    register: REGISTER,
    entries,
    refs,
    topics,
  };
}

export function schemaDoc() {
  return {
    name: "Palantir",
    version: "2",
    language: "English",
    audience: "agents",
    enums: ENUMS,
    register: REGISTER,
    entry: {
      slug: "string",
      title: "string",
      type: ENUMS.type,
      status: ENUMS.status,
      certainty: ENUMS.certainty,
      claim: "string",
      mechanism: "string",
      quantities: [
        {
          name: "string",
          value: "string",
          unit: "string",
          certainty: ENUMS.certainty,
          source: "string",
        },
      ],
      limits: "string",
      inventor_note: "string",
      sources: [{ key: "string", note: "string" }],
      links: ["slug"],
      relations: [{ slug: "string", rel: ENUMS.relation }],
      topics: [{ id: "string", title: "string" }],
      href: "/entries/:slug",
      api: "/api/v1/entries/:slug",
    },
    topic: {
      id: "string",
      title: "string",
      parent_id: "string|null",
      summary: "string",
      entries: ["slug"],
      href: "/topics/:id",
      api: "/api/v1/topics/:id",
    },
    ref: {
      key: "string",
      kind: ENUMS.kind,
      title: "string",
      authors: "string",
      year: "string",
      journal: "string",
      doi: "string",
      url: "string",
      note: "string",
      href: "/refs#:key",
      api: "/api/v1/refs/:key",
    },
    graph: {
      path: "/api/v1/graph",
      shape: "{topics, entries, refs, relations_flat}",
    },
    rule: "one record, one object. concepts first; devices are linked instances. declarative facts. no pedagogy, comparison, example, or reader-correction. language=English. audience=agents.",
  };
}

export async function catalog() {
  const [entries, refs, topics] = await Promise.all([
    listEntries(),
    listRefs(),
    listTopics(),
  ]);
  return {
    name: "Palantir",
    version: "2",
    language: "English",
    audience: "agents",
    entries: entries.length,
    refs: refs.length,
    topics: topics.length,
    enums: ENUMS,
    register: REGISTER,
    endpoints: AGENT_ENDPOINTS,
  };
}

export function llmsText() {
  return `Palantir
language: English
audience: agents
GET /api/v1/dump
GET /api/v1/graph
GET /api/v1/schema
GET /api/v1/entries/:slug
PUT /api/v1/entries/:slug
PATCH /api/v1/entries/:slug
DELETE /api/v1/entries/:slug
GET /api/v1/search?q=
GET /api/v1/refs
PUT /api/v1/refs/:key
GET /api/v1/topics
POST /api/v1/topics
GET /api/v1/topics/:id
PUT /api/v1/topics/:id
PATCH /api/v1/topics/:id
DELETE /api/v1/topics/:id
POST /api/v1/topics/:id/entries
DELETE /api/v1/topics/:id/entries/:slug
GET /entries/:slug
GET /topics
GET /llms.txt
Content-Type: application/json
CORS *

type: ${ENUMS.type.join(" | ")}
status: ${ENUMS.status.join(" | ")}
certainty: ${ENUMS.certainty.join(" | ")}
kind: ${ENUMS.kind.join(" | ")}
relation: ${ENUMS.relation.join(" | ")}

fields: slug title type status certainty claim mechanism quantities[] limits inventor_note sources[] links[] relations[] topics[]
quantities[]: name value unit certainty source
relations[]: {slug, rel}
links[] = entry slugs (mirrors relation targets on write)
sources[].key = ref key
topics[] = topic ids on write; topic summaries on read

register:
corpus = citable facts for later evaluation. not instruction
subject = one record, one object; concepts first; devices are linked instances
prose = declarative technical statements
certainty = tag every statement measured | reported | inferred | unsourced
others = relations[] | links[] | sources[] | topics[]
idea = type=idea, own slug
forbidden = pedagogy, comparison, analogy, example, reader-correction, unlinked-entities, conversational-residue
`;
}
