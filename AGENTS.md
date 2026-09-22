# Palantir — agent contract

Corpus of citable facts for later evaluation. Not instruction, persuasion, or tutorial.

Live: https://palantir.grok.me

## Record

One record describes one object. Other objects only via `links[]` (entry slug) or `sources[]` (ref key). `type=idea` is its own slug.

```
{
  slug, title,
  type: phenomenon | device | principle | material | measurement | idea,
  status: draft | active | superseded,
  certainty: measured | reported | inferred | unsourced,
  claim, mechanism,
  quantities: [{ name, value, unit, certainty, source }],
  limits, inventor_note,
  sources: [{ key, note }],
  links: [slug]
}
```

Prose: declarative technical statements about that object.

Forbidden: pedagogy, comparison, analogy, example, reader-correction, unlinked-entities, conversational-residue.

## API

Base `https://palantir.grok.me`. CORS `*`. No auth.

```
GET  /llms.txt
GET  /api/v1
GET  /api/v1/schema
GET  /api/v1/dump
GET  /api/v1/entries
GET  /api/v1/entries/:slug
POST /api/v1/entries
PUT  /api/v1/entries/:slug
PATCH /api/v1/entries/:slug
DELETE /api/v1/entries/:slug
GET  /api/v1/search?q=
GET  /api/v1/refs
GET  /api/v1/refs/:key
POST /api/v1/refs
PUT  /api/v1/refs/:key
```

Deep links: `entry.href=/entries/:slug`, `entry.api=/api/v1/entries/:slug`.

## Write rules

- PUT upsert by slug/key.
- Tag every quantitative claim with certainty + source key.
- Do not mix objects in one ficha.
- Do not reference session talk, other unpublished devices, or examples that confuse the record.

## Code

Stack: TanStack Start + React 19 + Tailwind v4 + Zod + Postgres.

Schema: `migrations/`. Types: `src/lib/lab-types.ts`. CRUD: `src/server/lab.server.ts`. HTTP: `src/routes/api/v1/`.
