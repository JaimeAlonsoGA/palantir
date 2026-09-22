# Palantir

Agent-first scientific / engineering knowledge corpus.

Live: https://palantir.grok.me

Designed for agents. One record = one object. English. Declarative facts only.

Density: records may be long. Complete mechanisms beat short summaries.

## Agent entry

| path | use |
|---|---|
| `GET /llms.txt` | contract + endpoints |
| `GET /api/v1` | catalog |
| `GET /api/v1/schema` | enums + register |
| `GET /api/v1/dump` | full corpus |
| `GET /api/v1/graph` | topics + entries + relations_flat |
| `GET /api/v1/entries/:slug` | one entry |
| `PUT /api/v1/entries/:slug` | upsert entry |
| `GET /api/v1/topics` | topic list |
| `GET /api/v1/search?q=` | search |

CORS `*`. No auth.

## Register

- Concepts first; devices are linked instances (`relations[].rel = demonstrates | instance_of`).
- `certainty`: measured | reported | inferred | unsourced
- Forbidden: pedagogy, comparison, analogy, example, reader-correction, unlinked entities, conversational residue

Full contract: [AGENTS.md](AGENTS.md)

## Stack

TanStack Start, React 19, Tailwind v4, Zod, Postgres.

## Run

```
npm install
npm run db:migrate
npm run dev
```

Production: set `DATABASE_URL`. `npm run build`.
