---
_manifest:
  urn: "urn:opforja:kb:spec-forja-opl-bridge"
  provenance:
    created_by: "deep-opm-pro/codex"
    created_at: "2026-05-31"
    source: "urn:fxsl:kb:spec-forja-opl-es"
version: "1.0.0"
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
- Path: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/spec-forja-opl-es.md`
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

## Nota De Reconciliación 2026-06-11

La implementación vigente acepta `puede estar` solo para estados y reserva
`puede ser` para especialización XOR o rechazo explícito; además mantiene
etiquetas estructurales con sufijo `[etiqueta: ...]`, modificadores reverse de
multiplicidad/ruta/condición y refinamiento reverse `se descompone en` /
`se despliega en`. Si la EBNF §18 no deriva estas superficies o deriva formas
no soportadas (`donde ...`, recomposición/rangos textuales), debe actualizarse
la SSOT KORA o marcar el gap explícito; este puente refleja la conducta validada
en `app/src/opl/parser`.

## Acceso Rápido

```bash
cd /home/felix/kora
python3 toolchain/kora resolve urn:fxsl:kb:spec-forja-opl-es
```
