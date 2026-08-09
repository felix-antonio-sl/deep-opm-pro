# Auditorías y actas

Las auditorías y actas conservan evidencia o decisiones aún citadas. No describen el
estado actual: para eso se usan el [handoff](../../HANDOFF.md) y el
[roadmap](../roadmap/roadmap-2026-08-09.md).

Los punteros de estado incluidos dentro de una acta histórica pertenecen a su fecha de
corte y no reemplazan esos dos documentos vigentes.

## Auditoría vigente

La [auditoría documental del 2026-08-09](auditoria-documental-2026-08-09.md) registra la
clasificación, intervención, archivo, evidencia y límites de este mantenimiento. Es un
corte cerrado: las próximas actualizaciones se crean con fecha nueva y esta versión se
archiva sin editar.

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
| [Alineación OPL](2026-05-26-alineacion-opl/README.md) | procedencia forense de reglas y decisiones OPL aún trazables |
| [Auditoría SSOT/corpus](2026-06-12-auditoria-ssot-corpus.md) | procedencia de enmiendas en puentes, registro y `ui-forja` |

La evidencia técnica no abre trabajo por sí sola. Una brecha solo entra al roadmap con
caso, decisión o gate afectado.

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

Antes de retirar un artefacto, busca su nombre y sus IDs en todo el repositorio. Una
cita en código, tests, una norma o una decisión vigente basta para conservarlo. Para
actualizar una auditoría o acta de la misma especie, crea un archivo nuevo fechado y
archiva el anterior sin modificarlo.
