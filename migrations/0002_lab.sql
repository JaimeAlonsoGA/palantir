create table if not exists entries (
  slug text primary key,
  title text not null,
  type text not null default 'principle',
  status text not null default 'draft',
  certainty text not null default 'unsourced',
  claim text not null default '',
  mechanism text not null default '',
  quantities jsonb not null default '[]'::jsonb,
  limits text not null default '',
  inventor_note text not null default '',
  sources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists refs (
  key text primary key,
  kind text not null default 'misc',
  title text not null default '',
  authors text not null default '',
  year text not null default '',
  journal text not null default '',
  doi text not null default '',
  url text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists entries_updated_at_idx on entries (updated_at desc);
create index if not exists entries_type_idx on entries (type);
