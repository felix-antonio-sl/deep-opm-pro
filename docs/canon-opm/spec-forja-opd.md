---
_manifest:
  urn: "urn:opforja:kb:spec-forja-opd-bridge"
  provenance:
    created_by: "deep-opm-pro/claude"
    created_at: "2026-06-04"
    source: "urn:fxsl:kb:spec-forja-opd-es"
version: "1.0.0"
status: publicado
tags: [opd, opforja, spec, visual, bridge, kora]
lang: "es"
extensions:
  opforja:
    family: bridge
relations:
  depends:
    - "urn:fxsl:kb:spec-forja-opd-es"
    - "urn:fxsl:kb:reglas-opm-estrictas-es"
    - "urn:fxsl:kb:opd-es"
    - "urn:fxsl:kb:opm-es"
---

# Spec-forja OPD — puente operativo

Este archivo no es la SSOT. La autoridad primaria vive en KORA:

- URN: `urn:fxsl:kb:spec-forja-opd-es`
- Path: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/spec-forja-opd-es.md`
- Estado: `publicado`

## Rol En Opforja

`spec-forja-opd-es` es la SSOT operativa de la realización visual/OPD de
opforja: gramática gráfica (cosas, estados, enlaces, control, estructurales,
refinamiento), catálogo formal de geometría, layout/routing, canvas e
interacción, edición visual, validación visual, simulación visual,
exportación canónica, equivalencia bimodal y la tabla de gaps spec↔app
(`GAP-OPD-*`, §22). Queda bajo `urn:fxsl:kb:reglas-opm-estrictas-es` y bajo
las capas OPM-ES nucleares, y manda sobre `ui-forja/GOVERNANCE.md` en todo lo
visualmente significativo OPM (ui-forja conserva estética/chrome/tokens).

## Contrato De Uso

- Para decisiones de **validez de un hecho OPM**, usar
  `urn:fxsl:kb:reglas-opm-estrictas-es` y las capas `opm-es`, `opd-es`,
  `opl-es`.
- Para decisiones de **realización visual/OPD operativa de opforja**, usar
  `urn:fxsl:kb:spec-forja-opd-es`.
- Para decisiones de **superficie OPL operativa**, usar
  `urn:fxsl:kb:spec-forja-opl-es`.
- Para decisiones de **método de modelamiento**, usar
  `urn:fxsl:kb:metodologia-forja-opm-es`.

No copiar contenido de la spec en este archivo. Si la spec cambia, editar la
SSOT KORA, validar con la toolchain KORA, reindexar KORA y mantener este puente
estable.

## Nota De Reconciliación 2026-06-11

La realización vigente del canvas usa canal de selección crimson desacoplado de
la escena persistente, `Pr = p` en ramas probabilísticas, badges de modificador
junto al proceso modificado, perfil `canon-diagrama` con gate de densidad y
notas de mesa visibles sobre el canvas. Si `spec-forja-opd-es` §18.2 o
`ui-forja/08-jointjs-styling.md` divergen, el re-apuntado debe hacerse en KORA:
OPD manda semántica visual; `ui-forja/08` queda limitado a estética/chrome.

## Acceso Rápido

```bash
cd /home/felix/kora
python3 toolchain/kora resolve urn:fxsl:kb:spec-forja-opd-es
```
