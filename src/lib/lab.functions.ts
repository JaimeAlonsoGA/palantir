import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  CERTAINTIES,
  ENTRY_STATUSES,
  ENTRY_TYPES,
  REF_KINDS,
  type EntryInput,
  type EntryPatch,
} from "./lab-types";

const quantitySchema = z.object({
  name: z.string(),
  value: z.string(),
  unit: z.string(),
  certainty: z.enum(CERTAINTIES),
  source: z.string(),
});

const sourceSchema = z.object({
  key: z.string(),
  note: z.string(),
});

const entryInputSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(ENTRY_TYPES).optional(),
  status: z.enum(ENTRY_STATUSES).optional(),
  certainty: z.enum(CERTAINTIES).optional(),
  claim: z.string().optional(),
  mechanism: z.string().optional(),
  quantities: z.array(quantitySchema).optional(),
  limits: z.string().optional(),
  inventor_note: z.string().optional(),
  sources: z.array(sourceSchema).optional(),
  links: z.array(z.string()).optional(),
});

const entryPatchSchema = z.object({
  slug: z.string().min(1),
  title: z.string().optional(),
  type: z.enum(ENTRY_TYPES).optional(),
  status: z.enum(ENTRY_STATUSES).optional(),
  certainty: z.enum(CERTAINTIES).optional(),
  claim: z.string().optional(),
  mechanism: z.string().optional(),
  quantities: z.array(quantitySchema).optional(),
  limits: z.string().optional(),
  inventor_note: z.string().optional(),
  sources: z.array(sourceSchema).optional(),
  links: z.array(z.string()).optional(),
});

export const listEntriesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const { listEntries } = await import("@/server/lab.server");
    return listEntries();
  },
);

export const getEntryFn = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { getEntry } = await import("@/server/lab.server");
    return getEntry(data.slug);
  });

export const createEntryFn = createServerFn({ method: "POST" })
  .validator(entryInputSchema)
  .handler(async ({ data }) => {
    const { createEntry } = await import("@/server/lab.server");
    return createEntry(data as EntryInput);
  });

export const patchEntryFn = createServerFn({ method: "POST" })
  .validator(entryPatchSchema)
  .handler(async ({ data }) => {
    const { patchEntry } = await import("@/server/lab.server");
    const { slug, ...patch } = data;
    return patchEntry(slug, patch as EntryPatch);
  });

export const deleteEntryFn = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { deleteEntry } = await import("@/server/lab.server");
    return deleteEntry(data.slug);
  });

export const listRefsFn = createServerFn({ method: "GET" }).handler(async () => {
  const { listRefs } = await import("@/server/lab.server");
  return listRefs();
});

export const createRefFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      key: z.string().min(1),
      kind: z.enum(REF_KINDS).optional(),
      title: z.string().optional(),
      authors: z.string().optional(),
      year: z.string().optional(),
      journal: z.string().optional(),
      doi: z.string().optional(),
      url: z.string().optional(),
      note: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { createRef } = await import("@/server/lab.server");
    return createRef({
      key: data.key,
      kind: data.kind ?? "misc",
      title: data.title ?? "",
      authors: data.authors ?? "",
      year: data.year ?? "",
      journal: data.journal ?? "",
      doi: data.doi ?? "",
      url: data.url ?? "",
      note: data.note ?? "",
    });
  });

export const searchEntriesFn = createServerFn({ method: "GET" })
  .validator(z.object({ q: z.string() }))
  .handler(async ({ data }) => {
    const { searchEntries } = await import("@/server/lab.server");
    return searchEntries(data.q);
  });
