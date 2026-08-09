# Auditorías y actas

Las auditorías y actas conservan evidencia o decisiones aún citadas. No describen el
estado actual: para eso se usan Git, implementación y tests. Los
[criterios del próximo corte](../roadmap/README.md) impiden abrir trabajo sin evidencia.

Los punteros de estado incluidos dentro de una acta histórica pertenecen a su fecha de
corte y no reemplazan la evidencia viva.

## Decisiones con referencia viva

| Artefacto | Valor que conserva |
|---|---|
| [Flujo dominio ↔ mesa](2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md) | frontera entre producto y modelos externos |
| [Persistencia backend](2026-06-04-persistencia-backend.md) | procedencia de decisiones de IDs, consistencia y operación |
| [Alcance de Anclaje](2026-06-24-acta-alcance-anclaje-gist.md) | contrato citado por kernel y tests |
| [Nominación de reuso](2026-06-24-acta-nominacion-reuso-tipos-opforja.md) | Calcar, Anclar, Pieza y Soltar |
| [Valor del Centinela](2026-06-24-acta-valor-anclaje-centinela-drift.md) | criterio de valor y no-muerte del frente |
| [Arranque del Centinela](2026-06-26-acta-arranque-centinela-drift.md) | decisiones de realización citadas por store y leyes |
| [Firma del Centinela](2026-06-26-acta-quietud-firma-centinela.md) | partición semántica citada por kernel y tests |
| [Drift granular](2026-06-30-acta-c4-drift-granular-pieza.md) | contrato RADIO-1 y `frozenAtPieza` |
| [Manual sanitario](2026-07-09-acta-manual-sanitarios-opm.md) | arquitectura editorial y límites del manual |

## Evidencia técnica conservada

| Artefacto | Uso vigente |
|---|---|
| [Auditoría SSOT/corpus](2026-06-12-auditoria-ssot-corpus.md) | procedencia de enmiendas en puentes, registro y `ui-forja` |

La evidencia técnica no abre trabajo por sí sola. Una brecha solo abre un corte con un
caso, una decisión o un gate afectado.

## Material archivado el 2026-08-09

- auditoría integral del 2026-06-11: sus brechas activas ya viven en el registro de
  conformidad y el roadmap;
- auditoría UX Jobs del 2026-06-12 y reauditoría del 2026-07-07: sus cortes fueron
  implementados y absorbidos por `ui-forja`, specs y tests;
- pendientes de emulación de enlaces OPCloud: mezclaban cierres y backlog sin prioridad;
  las capacidades ausentes generales quedaron en el roadmap.
- acta EQUILIBRIO del 2026-06-04: su decisión vigente se consolidó en
  [decisiones/equilibrio-llm.md](../decisiones/equilibrio-llm.md).

Los archivos se trasladaron sin edición a `_archivo/`; Git conserva su historia.

## Política

Conserva una auditoría o acta solo mientras código, tests, una norma o una decisión
vigente la citen. Git conserva el resto de la historia.
