# Solicitud upstream a custodio-kora — reconciliación SSOT opforja

Fecha: 2026-06-11

## Motivo

La auditoría integral OPFORJA detectó deriva documental entre la realización
vigente de `deep-opm-pro` y artefactos KORA/puentes locales:

- `opm-categorial-es.md:7,136` apunta a `docs/capa-categorial.md`, archivo
  eliminado en `2a83c1c5`.
- `spec-forja-opd-es` §18.2 y `ui-forja/08` conservan prescripciones visuales
  superadas por la implementación actual del canvas.
- `spec-forja-opl-es` EBNF §18 no describe de forma consistente la superficie
  reverse vigente (`[etiqueta: ...]`, `se descompone en`, `se despliega en`,
  multiplicidad/ruta/condición) y enumera formas sin handler operativo.

## Propuesta

1. Reapuntar `opm-categorial-es.md:136` hacia el artefacto categorial vigente
   o degradarlo a referencia histórica explícita.
2. En `spec-forja-opd-es`, declarar que canal de selección, pins/current,
   `Pr = p`, badges de modificador y perfil `canon-diagrama` son autoridad OPD,
   dejando `ui-forja/08` solo como estética/chrome/tokens.
3. En `spec-forja-opl-es` §18, reconciliar la EBNF con el parser/generador
   validado: estados usan `puede estar`; `puede ser` no crea estados; reverse
   estructural admite `se descompone en` y `se despliega en`; las formas sin
   handler deben quedar como GAP explícito.

## Evidencia local

- `app/src/opl/parser/parsear.ts`
- `app/src/opl/parser/planificar.ts`
- `app/src/modelo/composicion/linealidad.ts`
- `app/src/render/jointjs/proyeccion.ts`
- `app/src/render/jointjs/jointCanvasAdapter.ts`
- `docs/canon-opm/spec-forja-opd.md`
- `docs/canon-opm/spec-forja-opl.md`
