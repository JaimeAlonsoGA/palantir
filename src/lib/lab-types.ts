export const ENTRY_TYPES = [
  "phenomenon",
  "device",
  "principle",
  "material",
  "measurement",
  "idea",
] as const;

export const ENTRY_STATUSES = ["draft", "active", "superseded"] as const;

export const CERTAINTIES = [
  "measured",
  "reported",
  "inferred",
  "unsourced",
] as const;

export const REF_KINDS = ["article", "book", "thesis", "web", "misc"] as const;

export const RELATION_KINDS = [
  "instance_of",
  "demonstrates",
  "applies",
  "part_of",
  "related",
  "cites",
] as const;

export type EntryType = (typeof ENTRY_TYPES)[number];
export type EntryStatus = (typeof ENTRY_STATUSES)[number];
export type Certainty = (typeof CERTAINTIES)[number];
export type RefKind = (typeof REF_KINDS)[number];
export type RelationKind = (typeof RELATION_KINDS)[number];

export const ENUMS = {
  type: ENTRY_TYPES,
  status: ENTRY_STATUSES,
  certainty: CERTAINTIES,
  kind: REF_KINDS,
  relation: RELATION_KINDS,
} as const;

export const REGISTER = {
  language: "English",
  audience: "agents",
  corpus:
    "citable facts for later evaluation. not instruction, persuasion, or tutorial",
  subject: "one record describes one object; concepts first, named devices are linked instances",
  prose: "declarative technical statements about that object",
  certainty: "tag every statement measured | reported | inferred | unsourced",
  quantities: {
    name: "string",
    value: "string",
    unit: "string",
    certainty: "measured | reported | inferred | unsourced",
    source: "ref key",
  },
  others:
    "other objects via relations[] ({slug,rel}), links[] (entry slug mirror), sources[] (ref key), topics[]",
  relations: "[{slug, rel}] rel in instance_of|demonstrates|applies|part_of|related|cites",
  topics: "topic ids; membership via topic_entries",
  idea: "type=idea, own slug",
  forbidden: [
    "pedagogy",
    "comparison",
    "analogy",
    "example",
    "reader-correction",
    "unlinked-entities",
    "conversational-residue",
  ],
} as const;

export type Quantity = {
  name: string;
  value: string;
  unit: string;
  certainty: Certainty;
  source: string;
};

export type SourceLink = {
  key: string;
  note: string;
};

export type EntryRelation = {
  slug: string;
  rel: RelationKind;
};

export type TopicSummary = {
  id: string;
  title: string;
};

export type LabTopic = {
  id: string;
  href: string;
  api: string;
  title: string;
  parent_id: string | null;
  summary: string;
  entries: string[];
  created_at: string;
};

export type LabEntry = {
  slug: string;
  href: string;
  api: string;
  title: string;
  type: EntryType;
  status: EntryStatus;
  certainty: Certainty;
  claim: string;
  mechanism: string;
  quantities: Quantity[];
  limits: string;
  inventor_note: string;
  sources: SourceLink[];
  links: string[];
  relations: EntryRelation[];
  topics: TopicSummary[];
  created_at: string;
  updated_at: string;
};

export type LabRef = {
  key: string;
  href: string;
  api: string;
  kind: RefKind;
  title: string;
  authors: string;
  year: string;
  journal: string;
  doi: string;
  url: string;
  note: string;
  created_at: string;
};

export type EntryInput = {
  slug: string;
  title: string;
  type?: EntryType;
  status?: EntryStatus;
  certainty?: Certainty;
  claim?: string;
  mechanism?: string;
  quantities?: Quantity[];
  limits?: string;
  inventor_note?: string;
  sources?: SourceLink[];
  links?: string[];
  relations?: EntryRelation[];
  topics?: string[];
};

export type EntryPatch = Partial<Omit<EntryInput, "slug">>;

export type TopicInput = {
  id: string;
  title: string;
  parent_id?: string | null;
  summary?: string;
  entries?: string[];
};

export type TopicPatch = Partial<Omit<TopicInput, "id">>;

export function isEntryType(v: string): v is EntryType {
  return (ENTRY_TYPES as readonly string[]).includes(v);
}
export function isEntryStatus(v: string): v is EntryStatus {
  return (ENTRY_STATUSES as readonly string[]).includes(v);
}
export function isCertainty(v: string): v is Certainty {
  return (CERTAINTIES as readonly string[]).includes(v);
}
export function isRefKind(v: string): v is RefKind {
  return (REF_KINDS as readonly string[]).includes(v);
}
export function isRelationKind(v: string): v is RelationKind {
  return (RELATION_KINDS as readonly string[]).includes(v);
}

export const AGENT_ENDPOINTS = [
  "GET /api/v1",
  "GET /api/v1/schema",
  "GET /api/v1/dump",
  "GET /api/v1/graph",
  "GET /api/v1/entries",
  "GET /api/v1/entries/:slug",
  "POST /api/v1/entries",
  "PUT /api/v1/entries/:slug",
  "PATCH /api/v1/entries/:slug",
  "DELETE /api/v1/entries/:slug",
  "GET /api/v1/search?q=",
  "GET /api/v1/refs",
  "GET /api/v1/refs/:key",
  "POST /api/v1/refs",
  "PUT /api/v1/refs/:key",
  "GET /api/v1/topics",
  "POST /api/v1/topics",
  "GET /api/v1/topics/:id",
  "PUT /api/v1/topics/:id",
  "PATCH /api/v1/topics/:id",
  "DELETE /api/v1/topics/:id",
  "POST /api/v1/topics/:id/entries",
  "DELETE /api/v1/topics/:id/entries/:slug",
  "GET /llms.txt",
  "GET /entries/:slug",
  "GET /topics",
  "GET /topics/:id",
  "GET /refs",
] as const;
