-- Dense EN corpus from live dump + topic membership. claim/mechanism intentionally long.

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
  $note$Talk, Valencia 2026 (~117 slides). Primary source for Palantir agentic-engineering topic. Core framing: agentic engineering as alignment (human intent ≈ agent artifact under verification). Covers Memory–Goal–State loops, harness=agent−model (Chambers/AIEWF attribution), implementer/verifier split, Ralph/task-file loops, scratchpads, hawk async verifiers, HITL escape hatches, context poisoning, rollback+learnings, reward hacking, denominator problem, organizational triage and adoption timelines. Cross-references AI.Engineer World’s Fair material (Barth, Chambers, Karpathy-adjacent framings).$note$
)
on conflict (key) do update set
  kind=excluded.kind, title=excluded.title, authors=excluded.authors, year=excluded.year,
  journal=excluded.journal, doi=excluded.doi, url=excluded.url, note=excluded.note;

insert into refs (key, kind, title, authors, year, journal, doi, url, note)
values (
  'ieee2020robeetle',
  'misc',
  'Minuscule RoBeetle Turns Liquid Methanol Into Muscle Power',
  'IEEE Spectrum',
  '2020',
  '',
  '',
  'https://spectrum.ieee.org/robeetle-liquid-methanol',
  $note$Secondary. One SMA clause inverted relative to yang2020robeetle$note$
)
on conflict (key) do update set
  kind=excluded.kind, title=excluded.title, authors=excluded.authors, year=excluded.year,
  journal=excluded.journal, doi=excluded.doi, url=excluded.url, note=excluded.note;

insert into refs (key, kind, title, authors, year, journal, doi, url, note)
values (
  'usc2020robeetle',
  'misc',
  'Viterbi Researchers Create The Lightest, Smallest, Fully Autonomous Crawling Microrobot Reported To Date',
  'USC Viterbi',
  '2020',
  '',
  '',
  'https://viterbischool.usc.edu/news/2020/08/viterbi-researchers-create-the-lightest-smallest-fully-autonomous-crawling-microrobot-reported-to-date/',
  $note$Institutional note$note$
)
on conflict (key) do update set
  kind=excluded.kind, title=excluded.title, authors=excluded.authors, year=excluded.year,
  journal=excluded.journal, doi=excluded.doi, url=excluded.url, note=excluded.note;

insert into refs (key, kind, title, authors, year, journal, doi, url, note)
values (
  'yang2020robeetle',
  'article',
  'An 88-milligram insect-scale autonomous crawling robot driven by a catalytic artificial muscle',
  'Yang et al.',
  '2020',
  'Science Robotics',
  '10.1126/scirobotics.aba0015',
  'https://www.science.org/doi/10.1126/scirobotics.aba0015',
  $note$Primary source for methanol catalytic combustion on Pt as actuation pathway and for RoBeetle 2020 device metrics (empty mass 88 mg, NiTi wire 50.8 µm with Pt catalyst, ΔH −676.49 kJ mol⁻¹, system-to-work efficiency ~0.48%, As 87–99 °C). Prefer this over secondary summaries when SMA heating direction conflicts.$note$
)
on conflict (key) do update set
  kind=excluded.kind, title=excluded.title, authors=excluded.authors, year=excluded.year,
  journal=excluded.journal, doi=excluded.doi, url=excluded.url, note=excluded.note;

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  '2020-robeetle-catalytic-muscle',
  'RoBeetle 2020 — 88 mg methanol-catalytic crawling microrobot',
  'device',
  'active',
  'measured',
  $claim$RoBeetle is an insect-scale crawler (empty mass 88 mg) that instantiates methanol catalytic combustion on Pt coupled to a Pt-coated NiTi wire actuator. Contraction drives forelegs and closes the fuel-tank lid. measured [@yang2020robeetle]$claim$,
  $mech$1. Energy store: onboard liquid methanol tank (~120 µl class); ambient evaporation feeds vapor through dorsal ports. reported [@yang2020robeetle]
2. Actuator: NiTi SMA wire diameter 50.8 µm with platinum powder coating as catalyst surface. measured [@yang2020robeetle]
3. Heat from catalytic combustion drives martensite→austenite contraction (As 87–99 °C). measured [@yang2020robeetle]
4. Transmission: contraction displaces a leaf spring / linkage to the forelegs and simultaneously closes the tank lid, modulating further vapor delivery. reported [@yang2020robeetle]
5. Reset: cooling restores wire length via return spring; lid reopens; cycle repeats. reported [@yang2020robeetle]
6. Locomotion: two-anchor crawl with anisotropic friction. reported [@yang2020robeetle]
7. Mass budget: empty ≈ 88 mg; fueled ≈ 183 mg; fuel ≈ 95 mg. Length ≈ 20 mm. measured/reported [@yang2020robeetle] [@ieee2020robeetle]
8. Payload: up to ~2.6× empty mass reported. Stride ~1.2 mm. measured/reported [@yang2020robeetle] [@ieee2020robeetle]
9. No onboard electronics in the demonstrated crawler; control is thermo-mechanical via the catalytic/SMA coupling. reported [@yang2020robeetle]
10. This device demonstrates methanol-catalytic-combustion-on-pt; it is not the principle itself.$mech$,
  $qty$[{"name": "empty_mass", "value": "88", "unit": "mg", "certainty": "measured", "source": "yang2020robeetle"}, {"name": "fueled_mass", "value": "183", "unit": "mg", "certainty": "measured", "source": "yang2020robeetle"}, {"name": "fuel_mass", "value": "~95", "unit": "mg", "certainty": "measured", "source": "yang2020robeetle"}, {"name": "length", "value": "~20", "unit": "mm", "certainty": "reported", "source": "ieee2020robeetle"}, {"name": "niti_wire_diameter", "value": "50.8", "unit": "µm", "certainty": "measured", "source": "yang2020robeetle"}, {"name": "max_payload", "value": "~2.6", "unit": "× empty mass", "certainty": "measured", "source": "yang2020robeetle"}, {"name": "stride", "value": "~1.2", "unit": "mm", "certainty": "reported", "source": "ieee2020robeetle"}, {"name": "tank_volume", "value": "~120", "unit": "µl", "certainty": "reported", "source": "yang2020robeetle"}]$qty$::jsonb,
  $lim$Chemical→work efficiency ~0.48%. Cycle limited by evaporation and catalyst fouling. Methanol toxic. Wire ≈ 90–100 °C. No onboard electronics. Secondary IEEE summary may invert SMA heating clause relative to yang2020robeetle — prefer primary.$lim$,
  $inv$$inv$,
  $src$[{"key": "yang2020robeetle", "note": "primary source"}, {"key": "ieee2020robeetle", "note": "secondary; check SMA clause against primary"}, {"key": "usc2020robeetle", "note": "institutional note"}]$src$::jsonb,
  $lnk$["methanol-catalytic-combustion-on-pt"]$lnk$::jsonb,
  $rel$[{"slug": "methanol-catalytic-combustion-on-pt", "rel": "demonstrates"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'methanol-catalytic-combustion-on-pt',
  'Methanol catalytic combustion on platinum',
  'principle',
  'active',
  'measured',
  $claim$Flame-less catalytic oxidation of CH3OH(g) on Pt releases heat usable as an actuation energy pathway at insect scale. Atmospheric O2 is the oxidant. Measured reaction enthalpy ΔH = −676.49 kJ mol⁻¹. measured [@yang2020robeetle]$claim$,
  $mech$1. Liquid methanol evaporates at ambient temperature; vapor contacts a Pt-coated surface. reported [@yang2020robeetle]
2. Stoichiometry: CH3OH(g) + 3/2 O2(g) → 2 H2O(g) + CO2(g). Oxidation proceeds as flame-less catalytic combustion on platinum rather than open-flame combustion. measured [@yang2020robeetle]
3. Released heat raises a shape-memory alloy (NiTi) wire through martensite→austenite, producing contractile work against a return spring / transmission. measured [@yang2020robeetle]
4. Austenite start temperature for the actuation wire is reported in the 87–99 °C band; operating wire temperature during actuation ≈ 90–100 °C. measured [@yang2020robeetle]
5. Methanol specific energy ≈ 20 MJ kg⁻¹ is cited as the chemical energy density supporting the pathway. reported [@yang2020robeetle]
6. Chemical-to-wire-heat efficiency ≈ 16%; system-to-mechanical-work efficiency ≈ 0.48%. Most heat dissipates to ambient air. inferred/reported [@yang2020robeetle]
7. Cycle timing is coupled to evaporation rate, catalyst condition, and cooling. Catalyst fouling and methanol toxicity are operational constraints. reported [@yang2020robeetle]
8. The principle is distinct from any single vehicle: RoBeetle 2020 is one demonstrating device instance. inferred [@yang2020robeetle]$mech$,
  $qty$[{"name": "reaction_enthalpy", "value": "−676.49", "unit": "kJ mol⁻¹", "certainty": "measured", "source": "yang2020robeetle"}, {"name": "methanol_specific_energy", "value": "20", "unit": "MJ kg⁻¹", "certainty": "reported", "source": "yang2020robeetle"}, {"name": "chemical_to_wire_heat_efficiency", "value": "~16", "unit": "%", "certainty": "inferred", "source": "yang2020robeetle"}, {"name": "system_to_work_efficiency", "value": "~0.48", "unit": "%", "certainty": "reported", "source": "yang2020robeetle"}, {"name": "austenite_start", "value": "87–99", "unit": "°C", "certainty": "measured", "source": "yang2020robeetle"}, {"name": "actuation_wire_temperature", "value": "≈90–100", "unit": "°C", "certainty": "reported", "source": "yang2020robeetle"}]$qty$::jsonb,
  $lim$System-to-work efficiency ~0.48%; majority of heat lost to air. Cycle period bounded by evaporation and catalyst fouling. Methanol toxicity. Hot wire (~90–100 °C). No claim of electrical-free sensing/compute on the principle alone.$lim$,
  $inv$$inv$,
  $src$[{"key": "yang2020robeetle", "note": "primary Sci Robotics source for reaction, efficiencies, SMA temperatures"}, {"key": "ieee2020robeetle", "note": "secondary summary; SMA clause may invert vs primary"}, {"key": "usc2020robeetle", "note": "institutional note"}]$src$::jsonb,
  $lnk$["2020-robeetle-catalytic-muscle"]$lnk$::jsonb,
  $rel$[{"slug": "2020-robeetle-catalytic-muscle", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'denominator-problem',
  'Denominator problem',
  'idea',
  'active',
  'reported',
  $claim$The denominator problem is reporting productivity numerators (more code, more tokens) without a product-level denominator (users, outcomes), which yields spend rather than alignment. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Talk warning: 8× more code — of what? Numerator without denominator is a bill.

Product denominators: users, outcomes, closed feedback loops. Cognitive debt is related: code growing faster than human understanding (−17% comprehension via AI-code cited via Osmani/AIEWF in the talk materials).

Organizational correlates: over-parallelization causing operator burnout (velocity sickness); backlog loss removing filters that previously blocked work that should not ship; feature Frankenstein under relocated smaller teams.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Talk-level organizational framing. The −17% figure is attributed via secondary citation in talk materials, not independently measured here.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "denominator problem; cognitive debt citation path"}]$src$::jsonb,
  $lnk$["agentic-alignment-problem", "verifiable-goals-prerequisite", "reward-hacking"]$lnk$::jsonb,
  $rel$[{"slug": "agentic-alignment-problem", "rel": "related"}, {"slug": "verifiable-goals-prerequisite", "rel": "related"}, {"slug": "reward-hacking", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'reward-hacking',
  'Reward hacking in agent loops',
  'idea',
  'active',
  'reported',
  $claim$Reward hacking is satisfying the verification signal without satisfying the human intention (e.g. mocking an API to green tests). reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Appears when Goal signals are weaker or cheaper to satisfy than the intended property. Classic software instance: mock the dependency so tests pass while production path remains wrong.

Antidotes listed: separated verifier, hawks, HITL, real oracles. Related to verifiable-goals prerequisite and implementer–verifier separation.

Self-triage and denominator problems amplify cost when hacking multiplies throughput of non-product work.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Any finite oracle can be hacked. Stronger oracles raise cost. Talk examples are illustrative, not a taxonomy.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "reward hacking failure mode"}]$src$::jsonb,
  $lnk$["verifiable-goals-prerequisite", "implementer-verifier-separation", "denominator-problem"]$lnk$::jsonb,
  $rel$[{"slug": "verifiable-goals-prerequisite", "rel": "related"}, {"slug": "implementer-verifier-separation", "rel": "related"}, {"slug": "denominator-problem", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'rollback-plus-learnings',
  'Rollback plus learnings',
  'principle',
  'active',
  'reported',
  $claim$On poisoned or failed agent trajectories, discard the contaminated context and retry clean while retaining only scar documents (learnings). reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Talk formulation: don't carry the context; carry only the scars.

Broken branch → write learnings.md with causal notes → clean retry. Prevents try/catch blankets and skipped tests from becoming durable house style.

Complements scratchpads and Ralph loops: Memory is curated, not append-only garbage.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Scar quality matters. Vague learnings do not prevent recurrence. Requires discipline to actually discard poisoned branches.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "rollback + learnings antidote to poisoning"}]$src$::jsonb,
  $lnk$["context-poisoning", "scratchpad-durable-memory", "ralph-task-file-loop"]$lnk$::jsonb,
  $rel$[{"slug": "context-poisoning", "rel": "related"}, {"slug": "scratchpad-durable-memory", "rel": "related"}, {"slug": "ralph-task-file-loop", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'context-poisoning',
  'Context poisoning',
  'idea',
  'active',
  'reported',
  $claim$Context poisoning is persistence and replication of bad patterns across compactions and new sessions, turning local hacks into house style. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Agents copy what they see. A @deprecated utility with many call sites outcompetes a deprecation tag. Wrapping try/catch and disabled tests become house style and survive compaction.

Misalignment compounds: one bad utility becomes style. Landmines (hacks where redesign was required) and avoidance of refactors are related failure modes.

Antidote named in the talk: rollback + learnings — discard contaminated context; retain only scars. Early detection (ast-grep, hawks, continuous debt hunting) limits blast radius.

Principle II: catch misalignment early because it composes.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Detection rules can themselves be gamed. Learnings files that encode the bad pattern without the negation reintroduce poison.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "context poisoning; compounding misalignment"}]$src$::jsonb,
  $lnk$["rollback-plus-learnings", "agentic-alignment-problem", "reward-hacking", "hawk-async-verifier"]$lnk$::jsonb,
  $rel$[{"slug": "rollback-plus-learnings", "rel": "related"}, {"slug": "agentic-alignment-problem", "rel": "related"}, {"slug": "reward-hacking", "rel": "related"}, {"slug": "hawk-async-verifier", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'hitl-escape-hatch',
  'Human-in-the-loop escape hatch',
  'principle',
  'active',
  'reported',
  $claim$HITL tools give RL-trained agents an explicit ask-human exit when confidence is low, preventing forced low-quality completion of the turn. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Models trained to exhaust the turn will produce something. An ask-human tool (explicit in prompt or implicit by availability) is an escape hatch.

Fits triage ladders: auto-commit safe / verify-before-prod / co-design / interrupt human. Self-triage is unreliable; defaulting to the comfortable path produces million-token bills.

HITL is a harness permission surface, not a model property.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Overuse recreates human attention bottleneck. Underuse recreates reward hacking. Triage policy must be externalized.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "HITL tools; triage ladder"}]$src$::jsonb,
  $lnk$["harness-equals-agent-minus-model", "hawk-async-verifier", "agentic-alignment-problem"]$lnk$::jsonb,
  $rel$[{"slug": "harness-equals-agent-minus-model", "rel": "related"}, {"slug": "hawk-async-verifier", "rel": "related"}, {"slug": "agentic-alignment-problem", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'hawk-async-verifier',
  'Hawk asynchronous verifier',
  'principle',
  'active',
  'reported',
  $claim$A hawk is an async verifier that reads the full agent transcript after tool use and emits CONTINUE / STOP / ESCALATE before side effects compound. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Named after Karpathy's watch-them-like-a-hawk framing. Implementation sketch: PostToolUse hook reads the complete transcript and returns CONTINUE, STOP, or ESCALATE.

Hawk is a verifier with independent judgment timing relative to the implementer. It intervenes earlier than late PR review, reducing compounding misalignment.

Cross-provider hawks reduce self-preference bias. Hawks are harness components under harness = agent − model.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Hawk quality bounded by its rubric and context. False STOP slows throughput; false CONTINUE misses poisoning. Cost scales with transcript volume.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "hawk async verifier; Karpathy attribution"}]$src$::jsonb,
  $lnk$["implementer-verifier-separation", "harness-equals-agent-minus-model", "context-poisoning", "hitl-escape-hatch"]$lnk$::jsonb,
  $rel$[{"slug": "implementer-verifier-separation", "rel": "related"}, {"slug": "harness-equals-agent-minus-model", "rel": "related"}, {"slug": "context-poisoning", "rel": "related"}, {"slug": "hitl-escape-hatch", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'scratchpad-durable-memory',
  'Scratchpad durable agent memory',
  'principle',
  'active',
  'reported',
  $claim$A scratchpad is a living document of agent Progress / Decisions / Learnings / Action log that survives context compaction and is read first each session. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Scratchpads formalize durable Memory. Codex ExecPlans are cited as a related formalization.

Contents typically include progress, decisions, learnings, and an action log. The artifact lives in the repository so new sessions and compacted contexts reload state without relying on ephemeral chat history.

Paired with task files, scratchpads separate narrative Memory from checkbox State. Rollback+learnings workflows write scars into durable files while discarding poisoned conversational context.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$A scratchpad that records bad patterns without pruning becomes a poisoning vector. Needs hygiene and optional hawk review.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "scratchpad; ExecPlans mention"}]$src$::jsonb,
  $lnk$["memory-goal-state-loop", "ralph-task-file-loop", "context-poisoning", "rollback-plus-learnings"]$lnk$::jsonb,
  $rel$[{"slug": "memory-goal-state-loop", "rel": "related"}, {"slug": "ralph-task-file-loop", "rel": "related"}, {"slug": "context-poisoning", "rel": "related"}, {"slug": "rollback-plus-learnings", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'ralph-task-file-loop',
  'Ralph / task-file agent loop',
  'principle',
  'active',
  'reported',
  $claim$A Ralph loop repeatedly invokes an agent while unchecked tasks remain in a durable task file, pushing against early stopping. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Canonical sketch: while grep finds unchecked boxes in TASKS.md, invoke the agent with a fixed prompt. Anthropic surface: /ralph-loop.

Mapping to Memory–Goal–State: Memory = repo + scratchpad; Goal = checkboxes driven to zero (plus any oracles those tasks encode); State = the task file itself.

Purpose: counteract RL-trained early stopping. The loop externalizes continuation pressure into the filesystem so compaction and new sessions still see unfinished work.

Variants include per-surface boards (e.g. firmware vs mobile) and status markers beyond [ ]/[x].$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Without verifiable task completion criteria, checkbox closure itself becomes a reward-hackable signal. Human triage still required for high-cost tasks.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "Ralph / task-file loops; Anthropic /ralph-loop mention"}]$src$::jsonb,
  $lnk$["memory-goal-state-loop", "scratchpad-durable-memory", "agentic-alignment-problem"]$lnk$::jsonb,
  $rel$[{"slug": "memory-goal-state-loop", "rel": "related"}, {"slug": "scratchpad-durable-memory", "rel": "related"}, {"slug": "agentic-alignment-problem", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'verifiable-goals-prerequisite',
  'Verifiable goals as alignment prerequisite',
  'principle',
  'active',
  'reported',
  $claim$Alignment requires goals that are verifiable (objective metric) or pseudo-verifiable (judge model / rubric). Unverifiable goals cannot be aligned reliably. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Principle I in the talk: you cannot align what you cannot verify.

Verifiable goals: measurable metrics, automated tests, typecheckers, schema validators, CLI oracles, visual diffs, hardware smoke signals. Pseudo-verifiable goals: separate judge models or rubrics when no hard oracle exists.

Software crossed the agentic threshold early because tests and types provide oracles (talk cites Antje Barth / AIEWF). Domains without oracles need constructed pseudo-verification before agent leverage scales.

Universal loop pieces Memory / Goal / State presuppose Goal is checkable. Reward hacking appears when the signal is weaker than the intent (e.g. mocking an API to green tests). Antidotes named in the talk: separated verifier, hawks, HITL, real oracles.

Denominator problem related: multiplying code without a product-level denominator (users, outcomes) yields a bill, not alignment.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Pseudo-verification inherits judge bias and reward-hacking risk. Talk-level principle, not a formal completeness theorem.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "verification prerequisite; Barth AIEWF attribution for software threshold"}]$src$::jsonb,
  $lnk$["agentic-alignment-problem", "memory-goal-state-loop", "implementer-verifier-separation", "reward-hacking", "denominator-problem"]$lnk$::jsonb,
  $rel$[{"slug": "agentic-alignment-problem", "rel": "related"}, {"slug": "memory-goal-state-loop", "rel": "related"}, {"slug": "implementer-verifier-separation", "rel": "related"}, {"slug": "reward-hacking", "rel": "related"}, {"slug": "denominator-problem", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'implementer-verifier-separation',
  'Implementer–verifier separation',
  'principle',
  'active',
  'reported',
  $claim$Implementation and verification are distinct roles. A single pass that both writes and accepts its own output weakens alignment pressure. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] RL-trained models are eager to finish and will hallucinate completion. Self-preference bias: models judge their own writing favorably.

Role split: the implementer proposes changes; a verifier in an independent context window owns the goal and grades against criteria (tests, rubrics, secondary model, human). Cross-provider pairing (example cited: Codex implementer + Claude hawk) breaks same-model self-preference.

Verifier quality bounds system quality. Who grades matters. Async variants (hawk reading full transcripts post-tool) stop compounding side effects earlier than late PR review.

This principle is a harness pattern under harness = agent − model, and a Goal-ownership pattern under Memory–Goal–State.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Operational heuristic from talk. Verifier failure (weak tests, captured judges) still permits reward hacking. Human verifiers remain attention-bounded.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "role split; self-preference; cross-provider pairing"}]$src$::jsonb,
  $lnk$["harness-equals-agent-minus-model", "memory-goal-state-loop", "verifiable-goals-prerequisite", "hawk-async-verifier", "reward-hacking"]$lnk$::jsonb,
  $rel$[{"slug": "harness-equals-agent-minus-model", "rel": "related"}, {"slug": "memory-goal-state-loop", "rel": "related"}, {"slug": "verifiable-goals-prerequisite", "rel": "related"}, {"slug": "hawk-async-verifier", "rel": "related"}, {"slug": "reward-hacking", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'harness-equals-agent-minus-model',
  'Harness equals agent minus model',
  'principle',
  'active',
  'reported',
  $claim$Agent = model + harness. Harness is the durable control surface: tools, memory, verification, orchestration, permissions. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Attribution in the talk: Mike Chambers (AI.Engineer World's Fair) formulation harness = agent − model.

Harness contents include tools, hooks, schemas, oracles, isolation boundaries, permission gates, and orchestration. Model weights are treated as comparatively interchangeable relative to harness design. Quality and alignment gains concentrate in harness loops.

Cited supporting pattern: reducing tool surface (talk cites Vercel cutting ~80% of tools) correlated with fewer steps and higher precision. Less context and stronger isolation improve work quality even when that isolation costs more generated code; under near-zero code cost, isolation is cheap relative to misalignment.

Harness design choices map onto Memory–Goal–State: which tools write Memory, which oracles own Goal, which files encode State. Implementer/verifier separation, Ralph loops, hawks, and HITL escape hatches are harness components, not model properties.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Definitional framing from talk discourse, not a formal equation. Empirical tool-reduction anecdotes are not controlled measurements in the talk source.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "harness framing; Chambers AIEWF attribution"}]$src$::jsonb,
  $lnk$["agentic-alignment-problem", "implementer-verifier-separation", "memory-goal-state-loop", "hawk-async-verifier", "hitl-escape-hatch"]$lnk$::jsonb,
  $rel$[{"slug": "agentic-alignment-problem", "rel": "related"}, {"slug": "implementer-verifier-separation", "rel": "related"}, {"slug": "memory-goal-state-loop", "rel": "related"}, {"slug": "hawk-async-verifier", "rel": "related"}, {"slug": "hitl-escape-hatch", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'memory-goal-state-loop',
  'Memory–Goal–State agent loop',
  'principle',
  'active',
  'reported',
  $claim$An agent control loop comprises Memory (persist and iterate), Goal (verifiable or pseudo-verifiable stop criterion), and State (tasks, phases, iterations). reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Universal loop anatomy stated in the talk:

Memory — repository state, scratchpads, traces, compactable session history. Memory enables learning across iterations. Scratchpads and task files are durable Memory surfaces that survive context compaction.

Goal — stop criterion that is verifiable (tests, types, schema validation, CLI oracles, visual diff) or pseudo-verifiable (judge model with independent context). Without Goal, agents trained to finish declare done without grounding.

State — explicit machine of tasks, phases, and iteration counters. Task files with checkboxes are a concrete State encoding. Orchestrators that own a Markdown backlog are another.

Skeleton: act → verify → done or continue. Feedback may be synchronous (inline tool result) or asynchronous (hawk/post-tool verifier).

This structure is the minimal abstract machine underneath Ralph loops, implementer/verifier splits, fan-out/fan-in workflows, and orchestrator designs. Implementation details vary by harness; the three roles remain.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Structural model from talk discourse. Concrete Memory/Goal/State encodings are harness-specific. Pseudo-verifiable goals inherit judge failure modes.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "loop anatomy"}]$src$::jsonb,
  $lnk$["agentic-alignment-problem", "verifiable-goals-prerequisite", "ralph-task-file-loop", "scratchpad-durable-memory", "implementer-verifier-separation"]$lnk$::jsonb,
  $rel$[{"slug": "agentic-alignment-problem", "rel": "related"}, {"slug": "verifiable-goals-prerequisite", "rel": "related"}, {"slug": "ralph-task-file-loop", "rel": "related"}, {"slug": "scratchpad-durable-memory", "rel": "related"}, {"slug": "implementer-verifier-separation", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources, links, relations
) values (
  'agentic-alignment-problem',
  'Agentic alignment problem',
  'idea',
  'active',
  'reported',
  $claim$Agentic engineering is an alignment problem: human intent approximately equals agent-produced artifacts under verification constraints. reported [@vidal2026serious-agentic]$claim$,
  $mech$reported [@vidal2026serious-agentic] Agentic engineering treats the gap between what a human meant and what an agent built as the primary engineering object.

Code-generation cost trends toward near-zero. Observed industry pattern: large reimplementations become economically plausible when a test suite or other oracle can grade outputs (examples cited in the talk: browser/engine ports, framework ports, runtime ports). The classical premise that humans review everything they ship fails under that cost curve. Exhaustive human review of all generated artifacts does not scale.

Work therefore shifts from single-shot prompting to designing loops that prompt agents. Attribution in the talk: Karpathy framing from vibe coding toward agentic engineering; Steinberger/Cherny formulation that the job is writing loops rather than prompting Claude directly.

Alignment requires goals that are verifiable (objective metric, test, typecheck, schema, oracle) or pseudo-verifiable (separate judge model / rubric). Domains without oracles need constructed pseudo-verification before agent leverage scales.

The formulation is a talk-level framing, not an experimentally measured law. It constrains harness design: memory, goal, and state must close an act→verify→done|continue loop.$mech$,
  $qty$[]$qty$::jsonb,
  $lim$Formulation from Vidal 2026 talk (Valencia; cross-referenced to AI.Engineer World's Fair material). Not a measured physical law. Pseudo-verification inherits judge bias and reward-hacking risk.$lim$,
  $inv$$inv$,
  $src$[{"key": "vidal2026serious-agentic", "note": "primary formulation; Serious Agentic Engineering talk"}]$src$::jsonb,
  $lnk$["memory-goal-state-loop", "harness-equals-agent-minus-model", "implementer-verifier-separation", "verifiable-goals-prerequisite", "context-poisoning", "ralph-task-file-loop", "hawk-async-verifier"]$lnk$::jsonb,
  $rel$[{"slug": "memory-goal-state-loop", "rel": "related"}, {"slug": "harness-equals-agent-minus-model", "rel": "related"}, {"slug": "implementer-verifier-separation", "rel": "related"}, {"slug": "verifiable-goals-prerequisite", "rel": "related"}, {"slug": "context-poisoning", "rel": "related"}, {"slug": "ralph-task-file-loop", "rel": "related"}, {"slug": "hawk-async-verifier", "rel": "related"}]$rel$::jsonb
)
on conflict (slug) do update set
  title=excluded.title, type=excluded.type, status=excluded.status, certainty=excluded.certainty,
  claim=excluded.claim, mechanism=excluded.mechanism, quantities=excluded.quantities,
  limits=excluded.limits, inventor_note=excluded.inventor_note, sources=excluded.sources,
  links=excluded.links, relations=excluded.relations, updated_at=now();


insert into topics (id, title, parent_id, summary) values
  ('micro-robotics', 'Micro-robotics', null, 'Insect-scale locomotion, actuators, energy pathways, and catalytic artificial muscles.'),
  ('agentic-engineering', 'Agentic engineering', null, 'Agent-built systems; harness design; alignment between intent and artifact under verification.')
on conflict (id) do update set title=excluded.title, summary=excluded.summary;

delete from topic_entries where topic_id in ('micro-robotics', 'agentic-engineering');

insert into topic_entries (topic_id, entry_slug) values ('micro-robotics', '2020-robeetle-catalytic-muscle') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('micro-robotics', 'methanol-catalytic-combustion-on-pt') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'denominator-problem') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'reward-hacking') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'rollback-plus-learnings') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'context-poisoning') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'hitl-escape-hatch') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'hawk-async-verifier') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'scratchpad-durable-memory') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'ralph-task-file-loop') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'verifiable-goals-prerequisite') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'implementer-verifier-separation') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'harness-equals-agent-minus-model') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'memory-goal-state-loop') on conflict do nothing;
insert into topic_entries (topic_id, entry_slug) values ('agentic-engineering', 'agentic-alignment-problem') on conflict do nothing;
