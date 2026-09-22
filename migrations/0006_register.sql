update refs
set note = 'Fuente primaria. DOI 10.1126/scirobotics.aba0015'
where key = 'yang2020robeetle';

update refs
set note = 'Secundaria. Una cláusula sobre el SMA está invertida respecto a yang2020robeetle'
where key = 'ieee2020robeetle';

update entries
set
  claim = 'Crawler de masa vacía 88 mg. Oxidación catalítica de vapor de CH3OH sobre Pt. El calor induce contracción martensita→austenita de un hilo NiTi. La contracción acciona las patas delanteras y cierra la tapa del depósito de combustible.',
  inventor_note = '',
  updated_at = now()
where slug = '2020-robeetle-catalytic-muscle';
