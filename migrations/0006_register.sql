update refs
set note = 'Primary source. DOI 10.1126/scirobotics.aba0015'
where key = 'yang2020robeetle';

update refs
set note = 'Secondary. One SMA clause inverted relative to yang2020robeetle'
where key = 'ieee2020robeetle';

update entries
set
  claim = 'Empty mass 88 mg. Catalytic oxidation of CH3OH vapor on Pt heats an NiTi wire (Ø 50.8 µm). Martensite→austenite contraction drives forelegs and closes the fuel-tank lid. Instance of methanol-catalytic-combustion-on-pt.',
  inventor_note = '',
  updated_at = now()
where slug = '2020-robeetle-catalytic-muscle';
