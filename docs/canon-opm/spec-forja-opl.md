---
_manifest:
  urn: "urn:opforja:kb:spec-forja-opl-bridge"
  provenance:
    created_by: "deep-opm-pro/codex"
    created_at: "2026-05-31"
    source: "urn:fxsl:kb:spec-forja-opl-es"
version: "1.1.0"
status: publicado
tags: [opl, opforja, spec, bridge, kora]
lang: "es"
extensions:
  opforja:
    family: bridge
relations:
  depends:
    - "urn:fxsl:kb:spec-forja-opl-es"
    - "urn:fxsl:kb:reglas-opm-estrictas-es"
    - "urn:fxsl:kb:opl-es"
    - "urn:fxsl:kb:opm-es"
---

# Spec-forja OPL — puente operativo

Este archivo no es la SSOT. La autoridad primaria vive en KORA:

- URN: `urn:fxsl:kb:spec-forja-opl-es`
- Resolución de path: por URN vía `docs/canon-opm/resolutor-urn.json` (re-ancla a la SSOT viva en PNEUMA bajo `KORA_RAIZ`, default `/home/felix/kora-pneuma`; la bestia congelada `/home/felix/kora` queda como último origen histórico). Lector: `app/src/canon/resolutorUrn.ts`.
- Estado: `publicado`

## Rol En Opforja

`spec-forja-opl-es` es la SSOT operativa del lenguaje OPL de opforja:
generación, parseo, presentación, interacción, edición, configuración, manejo
de fallos e invariantes de roundtrip. Queda bajo el canon prescriptivo
`urn:fxsl:kb:reglas-opm-estrictas-es` y bajo las capas OPM-ES nucleares.

## Contrato De Uso

- Para decisiones de **validez de un hecho OPM**, usar
  `urn:fxsl:kb:reglas-opm-estrictas-es` y las capas `opm-es`, `opd-es`,
  `opl-es`.
- Para decisiones de **superficie OPL operativa de opforja**, usar
  `urn:fxsl:kb:spec-forja-opl-es`.
- Para decisiones de **método de modelamiento**, usar
  `urn:fxsl:kb:metodologia-forja-opm-es`.

No copiar contenido de la spec en este archivo. Si la spec cambia, editar la
SSOT KORA, validar con la toolchain KORA, reindexar KORA y mantener este puente
estable.

## Nota De Reconciliación 2026-06-12

La condición flaggeada el 2026-06-11 quedó consumida por la enmienda de
coherencia de la fuente (2026-06-12, versión observada `1.2.0`): cada
superficie validada por `app/src/opl/parser` está ahora legislada en la SSOT
como regla o extensión declarada, y cada derivación sin soporte de la EBNF §18
lleva GAP nombrado en la propia SSOT. Este puente ya no porta condición
correctiva sobre la fuente.

Versión vigente observada: `1.2.2` (2026-06-16, cierra GAP-CX-PARSER y
GAP-FIXTURE-DESCOMPOSICION vía `opd.ordenInzoom`). El dato vivo lo resuelve
`docs/canon-opm/resolutor-urn.json`, no este número.

Residuo abierto (único): la producción de efecto de §18 A.5 sigue sin slot de
multiplicidad, pendiente de la decisión del editor de la capa base
`urn:fxsl:kb:opl-es` (A.5); cuando esa capa resuelva, la fuente debe espejarla
y esta entrada se elimina.

## Acceso Rápido

```bash
KORA_RAIZ="${KORA_RAIZ:-/home/felix/kora-pneuma}"
cat "$KORA_RAIZ/artefactos/conocimiento/fxsl/spec-forja-opl-es.md"   # path resuelto por docs/canon-opm/resolutor-urn.json (SSOT viva en pneuma)
```

## Nota De Enmienda 2026-07-09

Versión observada de la fuente: `1.3.0` (pneuma `4ae6428`). Delta: **excepción
de apunte a R-ENT-2 (R-ENT-2-APUNTE, §2.0)** — en especie apunte los
placeholders emiten OPL en toda la generación, incluida la canónica; neutraliza
GAP-PLACEHOLDER-OBJETO para apuntes. Realización en `app/src/opl/`
(`VisibilidadOpl.esApunte`), origen BUG-76af16.
