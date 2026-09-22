alter type entry_type add value if not exists 'idea';

alter table entries add column if not exists links jsonb not null default '[]'::jsonb;

update entries
set inventor_note = ''
where slug = '2020-robeetle-catalytic-muscle';

delete from entries where slug = 'niti-phase-change';
