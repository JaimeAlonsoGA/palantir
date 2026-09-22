-- Idempotent English reseed (concept-first). Aligns with live palantir.grok.me corpus.

update refs
set note = 'Primary source. DOI 10.1126/scirobotics.aba0015'
where key = 'yang2020robeetle';

update refs
set note = 'Secondary. One SMA clause inverted relative to yang2020robeetle'
where key = 'ieee2020robeetle';

update refs
set note = 'Institutional note'
where key = 'usc2020robeetle';

insert into refs (key, kind, title, authors, year, journal, doi, url, note)
values (
  'vidal2026serious-agentic',
  'web',
  'Serious Agentic Engineering — from first principles: turning tokens into value',
  'Alejandro Vidal (@dobleio)',
  '2026',
  '',
  '',
  'https://doble.io/e0b59cc146a957d083904d036a4f7258/',
  'Talk, Valencia 2026; 117 slides. Primary source for agentic-engineering topic.'
)
on conflict (key) do update set
  kind = excluded.kind,
  title = excluded.title,
  authors = excluded.authors,
  year = excluded.year,
  url = excluded.url,
  note = excluded.note;

-- Drop Spanish/talk-residue drafts if present
delete from topic_entries where entry_slug in ('agentic-alignment-problem', 'agentic-alignment-problem');
delete from entries where slug in ('agentic-alignment-problem', 'agentic-alignment-problem');

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'methanol-catalytic-combustion-on-pt',
  'Methanol catalytic combustion on platinum',
  'principle',
  'active',
  'measured',
  'Flame-less catalytic oxidation of CH3OH(g) on Pt releases heat usable as an actuation energy pathway in microrobotics. Atmospheric O2 is the oxidant. Measured reaction enthalpy ΔH = −676.49 kJ mol⁻¹.',
  $mech$1. Liquid methanol evaporates at ambient temperature; vapor contacts a Pt-coated surface. reported [@yang2020robeetle]
2. Reaction: CH3OH(g) + 3/2 O2(g) → 2 H2O(g) + CO2(g). Flame-less catalytic combustion on Pt. measured [@yang2020robeetle]
3. Heat raises a shape-memory alloy wire through martensite→austenite, producing contractile work. measured [@yang2020robeetle]
4. Pathway applicable where electrical power budgets constrain insect-scale actuators. inferred [@yang2020robeetle]$mech$,
  $qty$[
    {"name":"reaction_enthalpy","value":"−676.49","unit":"kJ mol⁻¹","certainty":"measured","source":"yang2020robeetle"},
    {"name":"methanol_specific_energy","value":"20","unit":"MJ kg⁻¹","certainty":"reported","source":"yang2020robeetle"},
    {"name":"chemical_to_wire_heat_efficiency","value":"~16","unit":"%","certainty":"inferred","source":"yang2020robeetle"},
    {"name":"system_to_work_efficiency","value":"~0.48","unit":"%","certainty":"reported","source":"yang2020robeetle"},
    {"name":"austenite_start","value":"87–99","unit":"°C","certainty":"measured","source":"yang2020robeetle"}
  ]$qty$::jsonb,
  $lim$System-to-work efficiency ~0.48%; most heat dissipates to air. Cycle period set by evaporation and catalyst fouling. Methanol is toxic. Actuation wire temperature ≈ 90–100 °C.$lim$,
  '',
  '[{"key":"yang2020robeetle","note":"primary source"}]'::jsonb,
  '["2020-robeetle-catalytic-muscle"]'::jsonb,
  '[]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, type = excluded.type, status = excluded.status, certainty = excluded.certainty,
  claim = excluded.claim, mechanism = excluded.mechanism, quantities = excluded.quantities,
  limits = excluded.limits, inventor_note = excluded.inventor_note, sources = excluded.sources,
  links = excluded.links, relations = excluded.relations, updated_at = now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  '2020-robeetle-catalytic-muscle',
  'RoBeetle 2020 — 88 mg methanol-catalytic crawling microrobot',
  'device',
  'active',
  'measured',
  'Insect-scale crawler, empty mass 88 mg. Practical instance of methanol catalytic combustion on Pt coupled to an NiTi wire actuator. Contraction drives forelegs and closes the fuel-tank lid.',
  $mech$1. Methanol tank; ambient evaporation; dorsal vapor slits. reported [@yang2020robeetle]
2. Actuator: NiTi wire Ø 50.8 µm with Pt powder coating. measured [@yang2020robeetle]
3. Catalytic combustion on Pt supplies heat for martensite→austenite contraction (As 87–99 °C). measured [@yang2020robeetle]
4. Contraction displaces a leaf spring/transmission to the forelegs and closes the tank lid. reported [@yang2020robeetle]
5. Cooling restores wire length via return spring; lid reopens; cycle repeats. reported [@yang2020robeetle]
6. Locomotion: two-anchor crawl; anisotropic friction. reported [@yang2020robeetle]$mech$,
  $qty$[
    {"name":"empty_mass","value":"88","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"fueled_mass","value":"183","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"fuel_mass","value":"~95","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"length","value":"~20","unit":"mm","certainty":"reported","source":"ieee2020robeetle"},
    {"name":"niti_wire_diameter","value":"50.8","unit":"µm","certainty":"measured","source":"yang2020robeetle"},
    {"name":"max_payload","value":"~2.6","unit":"× empty mass","certainty":"measured","source":"yang2020robeetle"},
    {"name":"stride","value":"~1.2","unit":"mm","certainty":"reported","source":"ieee2020robeetle"},
    {"name":"tank_volume","value":"~120","unit":"µl","certainty":"reported","source":"yang2020robeetle"}
  ]$qty$::jsonb,
  $lim$Chemical→work efficiency ~0.48%. Cycle period set by evaporation and catalyst fouling. Methanol toxic. Wire ≈ 90–100 °C in actuation. No onboard electronics.$lim$,
  '',
  $src$[
    {"key":"yang2020robeetle","note":"primary source"},
    {"key":"ieee2020robeetle","note":"secondary; SMA clause inverted vs yang2020robeetle"},
    {"key":"usc2020robeetle","note":"institutional note"}
  ]$src$::jsonb,
  '["methanol-catalytic-combustion-on-pt"]'::jsonb,
  '[{"slug":"methanol-catalytic-combustion-on-pt","rel":"demonstrates"}]'::jsonb
)
on conflict (slug) do update set
  title = excluded.title, type = excluded.type, status = excluded.status, certainty = excluded.certainty,
  claim = excluded.claim, mechanism = excluded.mechanism, quantities = excluded.quantities,
  limits = excluded.limits, inventor_note = excluded.inventor_note, sources = excluded.sources,
  links = excluded.links, relations = excluded.relations, updated_at = now();

-- SAE idea/principle cluster (English, declarative)
insert into entries (slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations)
values
('agentic-alignment-problem','Agentic alignment problem','idea','active','reported',
 'Agentic engineering is an alignment problem: human intent approximately equals agent output under verification constraints.',
 'reported [@vidal2026serious-agentic] Code generation cost trends toward near-zero. Exhaustive human review of all generated artifacts does not scale. Work shifts from single-shot prompting to loop design that prompts agents.',
 '[]'::jsonb,
 'Formulation from a 2026 talk; not an experimentally measured law.',
 '',
 '[{"key":"vidal2026serious-agentic","note":"primary formulation"}]'::jsonb,
 '["memory-goal-state-loop","harness-equals-agent-minus-model"]'::jsonb,
 '[{"slug":"memory-goal-state-loop","rel":"related"},{"slug":"harness-equals-agent-minus-model","rel":"related"}]'::jsonb),
('memory-goal-state-loop','Memory–Goal–State agent loop','principle','active','reported',
 'An agent loop comprises Memory (persist and iterate), Goal (verifiable or pseudo-verifiable stop criterion), and State (tasks, phases, iterations).',
 'reported [@vidal2026serious-agentic] Memory holds repo state, scratchpads, and traces. Goal defines acceptance. State machines sequence work.',
 '[]'::jsonb, 'Structural model; implementation varies by harness.', '',
 '[{"key":"vidal2026serious-agentic","note":"loop anatomy"}]'::jsonb,
 '["agentic-alignment-problem"]'::jsonb,
 '[{"slug":"agentic-alignment-problem","rel":"applies"}]'::jsonb),
('harness-equals-agent-minus-model','Harness equals agent minus model','principle','active','reported',
 'Agent = model + harness. Harness is the durable control surface: tools, memory, verification, orchestration, permissions.',
 'reported [@vidal2026serious-agentic] Model weights are interchangeable relative to harness design. Quality and alignment gains concentrate in harness loops.',
 '[]'::jsonb, 'Definitional framing from talk discourse; not a formal equation.', '',
 '[{"key":"vidal2026serious-agentic","note":"harness framing"}]'::jsonb,
 '["implementer-verifier-separation","agentic-alignment-problem"]'::jsonb,
 '[{"slug":"implementer-verifier-separation","rel":"related"},{"slug":"agentic-alignment-problem","rel":"related"}]'::jsonb),
('implementer-verifier-separation','Implementer–verifier separation','principle','active','reported',
 'Implementation and verification are distinct roles. A single pass that both writes and accepts its own output weakens alignment pressure.',
 'reported [@vidal2026serious-agentic] Implementer proposes changes. Verifier checks against goal criteria (tests, rubrics, secondary model, human).',
 '[]'::jsonb, 'Operational heuristic; verifier quality bounds system quality.', '',
 '[{"key":"vidal2026serious-agentic","note":"role split"}]'::jsonb,
 '["harness-equals-agent-minus-model","memory-goal-state-loop"]'::jsonb,
 '[{"slug":"harness-equals-agent-minus-model","rel":"part_of"},{"slug":"memory-goal-state-loop","rel":"applies"}]'::jsonb),
('verifiable-goals-prerequisite','Verifiable goals as alignment prerequisite','principle','active','reported',
 'Alignment requires goals that are verifiable (objective metric) or pseudo-verifiable (judge model / rubric). Unverifiable goals cannot be aligned reliably.',
 'reported [@vidal2026serious-agentic] Software crossed the threshold early because tests and types provide oracles. Domains without oracles need constructed pseudo-verification before agent leverage scales.',
 '[]'::jsonb, 'Pseudo-verification inherits judge bias and reward-hacking risk.', '',
 '[{"key":"vidal2026serious-agentic","note":"verification prerequisite"}]'::jsonb,
 '["agentic-alignment-problem","memory-goal-state-loop"]'::jsonb,
 '[{"slug":"agentic-alignment-problem","rel":"applies"},{"slug":"memory-goal-state-loop","rel":"part_of"}]'::jsonb)
on conflict (slug) do update set
  title = excluded.title, type = excluded.type, status = excluded.status, certainty = excluded.certainty,
  claim = excluded.claim, mechanism = excluded.mechanism, limits = excluded.limits,
  sources = excluded.sources, links = excluded.links, relations = excluded.relations, updated_at = now();

insert into topics (id, title, parent_id, summary) values
  ('micro-robotics', 'Micro-robotics', null, 'Insect-scale locomotion, actuators, and energy pathways.'),
  ('agentic-engineering', 'Agentic engineering', null, 'Agent-built systems; alignment between intent and artifact.')
on conflict (id) do update set title = excluded.title, summary = excluded.summary;

insert into topic_entries (topic_id, entry_slug) values
  ('micro-robotics', 'methanol-catalytic-combustion-on-pt'),
  ('micro-robotics', '2020-robeetle-catalytic-muscle'),
  ('agentic-engineering', 'agentic-alignment-problem'),
  ('agentic-engineering', 'memory-goal-state-loop'),
  ('agentic-engineering', 'harness-equals-agent-minus-model'),
  ('agentic-engineering', 'implementer-verifier-separation'),
  ('agentic-engineering', 'verifiable-goals-prerequisite')
on conflict do nothing;
