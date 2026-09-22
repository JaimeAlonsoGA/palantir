-- Agent graph: topics, topic_entries, entry relations

create table if not exists topics (
  id text primary key,
  title text not null,
  parent_id text null references topics(id) on delete set null,
  summary text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists topic_entries (
  topic_id text not null references topics(id) on delete cascade,
  entry_slug text not null references entries(slug) on delete cascade,
  primary key (topic_id, entry_slug)
);

create index if not exists topic_entries_entry_slug_idx on topic_entries (entry_slug);
create index if not exists topics_parent_id_idx on topics (parent_id);

alter table entries add column if not exists relations jsonb not null default '[]'::jsonb;
