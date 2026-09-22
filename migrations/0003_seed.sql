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
    'Fuente primaria. DOI 10.1126/scirobotics.aba0015'
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
    'Secundaria. Una cláusula sobre el SMA está invertida respecto a yang2020robeetle'
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
    'Nota institucional USC Viterbi'
  )
on conflict (key) do nothing;

insert into entries (
  slug, title, type, status, certainty, claim, mechanism, quantities, limits, inventor_note, sources
) values (
  '2020-robeetle-catalytic-muscle',
  'RoBeetle — microrobot de 88 mg accionado por combustión catalítica de metanol',
  'device',
  'active',
  'measured',
  'Crawler de masa vacía 88 mg. Oxidación catalítica de vapor de CH3OH sobre Pt. El calor induce contracción martensita→austenita de un hilo NiTi. La contracción acciona las patas delanteras y cierra la tapa del depósito de combustible.',
  $mech$1. Depósito de metanol líquido. A temperatura ambiente el líquido evapora. El vapor sale por rendijas dorsales. reported [@yang2020robeetle]
2. Actuador: hilo NiTi Ø 50.8 µm con recubrimiento de polvo de platino. measured [@yang2020robeetle]
3. Combustión catalítica sin llama sobre Pt: CH3OH(g) + 3/2 O2(g) → 2 H2O(g) + CO2(g). ΔH = −676.49 kJ mol⁻¹. O2 atmosférico. measured [@yang2020robeetle]
4. Transición martensita → austenita bajo el calor de la reacción. Contracción del hilo. As = 87–99 °C. measured [@yang2020robeetle]
5. La contracción desplaza un muelle de hoja y una transmisión a las patas delanteras, y cierra la tapa del tanque. Cesa el flujo de vapor. reported [@yang2020robeetle]
6. Al cesar el vapor cesa la reacción. El hilo se enfría. Un muelle de retorno restaura la longitud. La tapa se abre. El ciclo se repite. reported [@yang2020robeetle]
7. Locomoción: crawl de dos anclas. Patas delanteras móviles; traseras de mayor anclaje. Fricción anisótropa. reported [@yang2020robeetle]$mech$,
  $qty$[
    {"name":"masa vacía","value":"88","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"masa tanque lleno","value":"183","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"masa de combustible","value":"~95","unit":"mg","certainty":"measured","source":"yang2020robeetle"},
    {"name":"longitud","value":"~20","unit":"mm","certainty":"reported","source":"ieee2020robeetle"},
    {"name":"Ø hilo NiTi","value":"50.8","unit":"µm","certainty":"measured","source":"yang2020robeetle"},
    {"name":"energía específica metanol","value":"20","unit":"MJ kg⁻¹","certainty":"reported","source":"yang2020robeetle"},
    {"name":"ΔH reacción","value":"−676.49","unit":"kJ mol⁻¹","certainty":"measured","source":"yang2020robeetle"},
    {"name":"eficiencia química→calor en hilo","value":"~16","unit":"%","certainty":"inferred","source":"yang2020robeetle"},
    {"name":"eficiencia sistema→trabajo","value":"~0.48","unit":"%","certainty":"reported","source":"yang2020robeetle"},
    {"name":"carga máxima","value":"~2.6","unit":"× masa vacía","certainty":"measured","source":"yang2020robeetle"},
    {"name":"paso","value":"~1.2","unit":"mm","certainty":"reported","source":"ieee2020robeetle"},
    {"name":"transición austenita","value":"87–99","unit":"°C","certainty":"measured","source":"yang2020robeetle"},
    {"name":"transición martensita","value":"70–58","unit":"°C","certainty":"measured","source":"yang2020robeetle"},
    {"name":"tanque","value":"~120","unit":"µl","certainty":"reported","source":"yang2020robeetle"}
  ]$qty$::jsonb,
  $lim$- Eficiencia química→trabajo ~0.48 %. La mayor parte del calor se disipa al aire.
- Periodo de ciclo determinado por evaporación y ensuciamiento del catalizador.
- Metanol: tóxico. Temperatura del hilo en actuación ≈ 90–100 °C.
- Sin electrónica a bordo.$lim$,
  '',
  $src$[
    {"key":"yang2020robeetle","note":"fuente primaria"},
    {"key":"ieee2020robeetle","note":"secundaria; cláusula SMA invertida vs yang2020robeetle"},
    {"key":"usc2020robeetle","note":"nota institucional"}
  ]$src$::jsonb
)
on conflict (slug) do nothing;
