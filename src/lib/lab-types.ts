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

export type EntryType = (typeof ENTRY_TYPES)[number];
export type EntryStatus = (typeof ENTRY_STATUSES)[number];
export type Certainty = (typeof CERTAINTIES)[number];
export type RefKind = (typeof REF_KINDS)[number];

export const ENUMS = {
  type: ENTRY_TYPES,
  status: ENTRY_STATUSES,
  certainty: CERTAINTIES,
  kind: REF_KINDS,
} as const;

export const REGISTER = {
  corpus: "citable facts for later evaluation. not instruction, persuasion, or tutorial",
  subject: "one record describes one object",
  prose: "declarative technical statements about that object",
  certainty: "tag every statement measured | reported | inferred | unsourced",
  quantities: {
    name: "string",
    value: "string",
    unit: "string",
    certainty: "measured | reported | inferred | unsourced",
    source: "ref key",
  },
  others: "other objects only via links[] (entry slug) or sources[] (ref key)",
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
};

export type EntryPatch = Partial<Omit<EntryInput, "slug">>;

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

export const AGENT_ENDPOINTS = [
  "GET /api/v1",
  "GET /api/v1/schema",
  "GET /api/v1/dump",
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
  "GET /llms.txt",
  "GET /entries/:slug",
  "GET /refs",
] as const;
