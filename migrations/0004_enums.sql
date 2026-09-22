create type entry_type as enum (
  'phenomenon',
  'device',
  'principle',
  'material',
  'measurement'
);

create type entry_status as enum (
  'draft',
  'active',
  'superseded'
);

create type certainty as enum (
  'measured',
  'reported',
  'inferred',
  'unsourced'
);

create type ref_kind as enum (
  'article',
  'book',
  'thesis',
  'web',
  'misc'
);

alter table entries alter column type drop default;
alter table entries alter column type type entry_type using type::entry_type;
alter table entries alter column type set default 'principle'::entry_type;

alter table entries alter column status drop default;
alter table entries alter column status type entry_status using status::entry_status;
alter table entries alter column status set default 'draft'::entry_status;

alter table entries alter column certainty drop default;
alter table entries alter column certainty type certainty using certainty::certainty;
alter table entries alter column certainty set default 'unsourced'::certainty;

alter table refs alter column kind drop default;
alter table refs alter column kind type ref_kind using kind::ref_kind;
alter table refs alter column kind set default 'misc'::ref_kind;
