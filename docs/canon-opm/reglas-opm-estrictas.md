---
_manifest:
  urn: "urn:opforja:kb:reglas-opm-estrictas-bridge"
  provenance:
    created_by: "deep-opm-pro/codex"
    created_at: "2026-05-31"
    source: "urn:fxsl:kb:reglas-opm-estrictas-es"
version: "1.0.0"
status: publicado
tags: [opm, opforja, canon, bridge, kora]
lang: "es"
extensions:
  opforja:
    family: bridge
relations:
  depends:
    - "urn:fxsl:kb:reglas-opm-estrictas-es"
    - "urn:fxsl:kb:opm-es"
    - "urn:fxsl:kb:opd-es"
    - "urn:fxsl:kb:opl-es"
---

# Reglas OPM estrictas — puente operativo

Este archivo no es la SSOT. La autoridad primaria vive en KORA:

- URN: `urn:fxsl:kb:reglas-opm-estrictas-es`
- Path: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/reglas-opm-estrictas-es.md`
- Estado: `publicado`

## Rol En Opforja

`reglas-opm-estrictas-es` es el canon prescriptivo operativo OPD/OPL para
opforja: qué hechos son válidos, inválidos, condicionados o extensión de
herramienta. Está por debajo de las capas OPM-ES nucleares cuando se discute
semántica, visual o OPL base, y por encima de la implementación de producto.

## Contrato De Uso

- Para decisiones de **semántica OPM**, usar `urn:fxsl:kb:opm-es`.
- Para decisiones de **gramática visual OPD**, usar `urn:fxsl:kb:opd-es`.
- Para decisiones de **gramática textual OPL-ES**, usar `urn:fxsl:kb:opl-es`.
- Para decisiones de **canon prescriptivo operativo de opforja**, usar
  `urn:fxsl:kb:reglas-opm-estrictas-es`.
- Para decisiones de **texto OPL operativo**, usar `urn:fxsl:kb:spec-forja-opl-es`.
- Para decisiones de **método de modelamiento**, usar
  `urn:fxsl:kb:metodologia-forja-opm-es`.

No copiar contenido del canon en este archivo. Si el canon cambia, editar la
SSOT KORA, validar con la toolchain KORA, reindexar KORA y mantener este puente
estable.

## Acceso Rápido

```bash
cd /home/felix/kora
python3 toolchain/kora resolve urn:fxsl:kb:reglas-opm-estrictas-es
```
