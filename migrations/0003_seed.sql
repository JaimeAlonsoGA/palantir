insert into refs (key, kind, title, authors, year, journal, doi, url, note)
values
  (
    'yang2020robeetle',
    'article',
    'An 88-milligram insect-scale autonomous crawling robot driven by a catalytic artificial muscle',
    'Yang, Xiufeng; Chang, Longlong; Pérez-Arancibia, Néstor O.',
    '2020',
    'Science Robotics',
    '10.1126/scirobotics.aba0015',
    '',
    'Primary source. DOI 10.1126/scirobotics.aba0015'
  ),
  (
    'ieee2020robeetle',
    'misc',
    'Minuscule RoBeetle Turns Liquid Methanol Into Muscle Power',
    'IEEE Spectrum',
    '2020',
    '',
    '',
    'https://spectrum.ieee.org/robeetle-liquid-methanol',
    'Secondary. One SMA clause inverted relative to yang2020robeetle'
  ),
  (
    'usc2020robeetle',
    'misc',
    'Viterbi Researchers Create The Lightest, Smallest, Fully Autonomous Crawling Microrobot Reported To Date',
    'USC Viterbi',
    '2020',
    '',
    '',
    'https://viterbischool.usc.edu/news/2020/08/viterbi-researchers-create-the-lightest-smallest-fully-autonomous-crawling-microrobot-reported-to-date/',
    'Institutional note, USC Viterbi'
  )
on conflict (key) do nothing;

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources
) values (
  'methanol-catalytic-combustion-on-pt',
  'Methanol catalytic combustion on platinum as heat-actuation pathway',
  'principle',
  'active',
  'measured',
  'Flame-less catalytic oxidation of CH3OH(g) on Pt yields heat that can drive a shape-memory alloy phase change for mechanical work. Atmospheric O2 is the oxidant. Measured reaction enthalpy ΔH = −676.49 kJ mol⁻¹ (yang2020robeetle).',
  $mech$1. Fuel: liquid methanol evaporates at ambient temperature; vapor contacts a Pt-coated surface. reported [@yang2020robeetle]
2. Reaction: CH3OH(g) + 3/2 O2(g) → 2 H2O(g) + CO2(g). Flame-less catalytic combustion on Pt. measured [@yang2020robeetle]
3. Heat release: ΔH = −676.49 kJ mol⁻¹. Specific energy of methanol ≈ 20 MJ kg⁻¹. measured/reported [@yang2020robeetle]
4. Actuation coupling: heat raises an NiTi wire through martensite→austenite (As ≈ 87–99 °C), producing contractile stroke. measured [@yang2020robeetle]
5. Cycle: vapor cutoff cools the wire; martensite return + bias spring restores length. reported [@yang2020robeetle]$mech$,
  $qty$[
    {"name":"reaction_enthalpy","value":"−676.49","unit":"kJ mol⁻¹","certainty":"measured","source":"yang2020robeetle"},
    {"name":"methanol_specific_energy","value":"20","unit":"MJ kg⁻¹","certainty":"reported","source":"yang2020robeetle"},
    {"name":"austenite_start","value":"87–99","unit":"°C","certainty":"measured","source":"yang2020robeetle"},
    {"name":"martensite_finish_range","value":"70–58","unit":"°C","certainty":"measured","source":"yang2020robeetle"}
  ]$qty$::jsonb,
  $lim$- Chemical→mechanical efficiency is low when heat dissipates to air.
- Cycle period set by evaporation rate and catalyst fouling.
- Methanol toxicity; wire surface temperature ≈ 90–100 °C during actuation.$lim$,
  '',
  $src$[{"key":"yang2020robeetle","note":"primary source"}]$src$::jsonb
)
on conflict (slug) do nothing;

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources
) values (
  '2020-robeetle-catalytic-muscle',
  'RoBeetle — 88 mg insect-scale autonomous crawler with catalytic artificial muscle',
  'device',
  'active',
  'measured',
  'Empty mass 88 mg. Catalytic oxidation of CH3OH vapor on Pt heats an NiTi wire (Ø 50.8 µm). Martensite→austenite contraction drives forelegs and closes the fuel-tank lid. Instance of methanol-catalytic-combustion-on-pt.',
  $mech$1. Liquid methanol tank. Ambient evaporation; vapor exits dorsal slits. reported [@yang2020robeetle]
2. Actuator: NiTi wire Ø 50.8 µm coated with platinum powder. measured [@yang2020robeetle]
3. Flame-less catalytic combustion on Pt: CH3OH(g) + 3/2 O2(g) → 2 H2O(g) + CO2(g). ΔH = −676.49 kJ mol⁻¹. Atmospheric O2. measured [@yang2020robeetle]
4. Martensite → austenite under reaction heat. Wire contracts. As = 87–99 °C. measured [@yang2020robeetle]
5. Contraction displaces a leaf spring and transmission to the forelegs and closes the tank lid; vapor flow stops. reported [@yang2020robeetle]
6. Without vapor the reaction ceases; wire cools; return spring restores length; lid opens; cycle repeats. reported [@yang2020robeetle]
7. Locomotion: two-anchor crawl. Mobile forelegs; higher-grip hind legs. Anisotropic friction. reported [@yang2020robeetle]$mech$,
  $qty$[
    {"name":"empty_mass","value":"88","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"full_tank_mass","value":"183","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"fuel_mass","value":"~95","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"length","value":"~20","unit":"mm","certainty":"reported","source":"ieee2020robeetle"},
    {"name":"niti_wire_diameter","value":"50.8","unit":"µm","certainty":"measured","source":"yang2020robeetle"},
    {"name":"methanol_specific_energy","value":"20","unit":"MJ kg⁻¹","certainty":"reported","source":"yang2020robeetle"},
    {"name":"reaction_enthalpy","value":"−676.49","unit":"kJ mol⁻¹","certainty":"measured","source":"yang2020robeetle"},
    {"name":"chemical_to_wire_heat_efficiency","value":"~16","unit":"%","certainty":"inferred","source":"yang2020robeetle"},
    {"name":"system_to_work_efficiency","value":"~0.48","unit":"%","certainty":"reported","source":"yang2020robeetle"},
    {"name":"max_payload","value":"~2.6","unit":"× empty mass","certainty":"measured","source":"yang2020robeetle"},
    {"name":"stride","value":"~1.2","unit":"mm","certainty":"reported","source":"ieee2020robeetle"},
    {"name":"austenite_transition","value":"87–99","unit":"°C","certainty":"measured","source":"yang2020robeetle"},
    {"name":"martensite_transition","value":"70–58","unit":"°C","certainty":"measured","source":"yang2020robeetle"},
    {"name":"tank_volume","value":"~120","unit":"µl","certainty":"reported","source":"yang2020robeetle"}
  ]$qty$::jsonb,
  $lim$- Chemical→work efficiency ~0.48 %. Most heat dissipates to air.
- Cycle period set by evaporation and catalyst fouling.
- Methanol: toxic. Wire temperature during actuation ≈ 90–100 °C.
- No onboard electronics.$lim$,
  '',
  $src$[
    {"key":"yang2020robeetle","note":"primary source"},
    {"key":"ieee2020robeetle","note":"secondary; SMA clause inverted vs yang2020robeetle"},
    {"key":"usc2020robeetle","note":"institutional note"}
  ]$src$::jsonb
)
on conflict (slug) do nothing;
