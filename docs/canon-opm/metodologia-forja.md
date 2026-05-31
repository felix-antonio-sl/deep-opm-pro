---
_manifest:
  urn: "urn:opforja:kb:metodologia-forja-bridge"
  provenance:
    created_by: "hd-opm/codex"
    created_at: "2026-05-31"
    source: "urn:fxsl:kb:metodologia-forja-opm-es"
version: "1.0.0"
status: publicado
tags: [opm, opforja, metodologia, bridge, kora]
lang: "es"
extensions:
  opforja:
    family: bridge
relations:
  depends:
    - "urn:fxsl:kb:metodologia-forja-opm-es"
    - "urn:fxsl:kb:reglas-opm-estrictas-es"
    - "urn:fxsl:kb:spec-forja-opl-es"
    - "urn:fxsl:kb:opm-es"
    - "urn:fxsl:kb:opd-es"
    - "urn:fxsl:kb:opl-es"
---

# Metodología Forja — puente operativo

Este archivo no es la SSOT. La autoridad primaria vive en KORA:

- URN: `urn:fxsl:kb:metodologia-forja-opm-es`
- Path: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-forja-es.md`
- Estado: `publicado`

## Rol En Opforja

`metodologia-forja-opm-es` es la capa de método para modelar OPM con opforja:
cómo construir, refinar, validar y serializar modelos sin redefinir la semántica
OPM. Complementa a las otras dos piezas KORA enlazadas desde
`docs/canon-opm/`:

| Documento | Rol |
|---|---|
| `urn:fxsl:kb:reglas-opm-estrictas-es` | Canon prescriptivo OPD/OPL: qué hechos son válidos o inválidos. |
| `urn:fxsl:kb:spec-forja-opl-es` | SSOT operativa del lenguaje OPL de opforja. |
| `metodologia-forja.md` | Puente a la SSOT de método OPM-en-opforja. |

## Contrato De Uso

- Para decisiones de **validez** de un hecho OPM, usar
  `urn:fxsl:kb:reglas-opm-estrictas-es` y las capas `opm-es`, `opd-es`,
  `opl-es`.
- Para decisiones de **texto OPL**, usar `urn:fxsl:kb:spec-forja-opl-es`.
- Para decisiones de **cómo modelar bien** en opforja, usar
  `urn:fxsl:kb:metodologia-forja-opm-es`.

No copiar contenido de la metodología en este archivo. Si la metodología cambia,
editar la SSOT KORA, validar con `python3 toolchain/kora lint-md`, reindexar KORA
y mantener este puente estable.

## Acceso Rápido

```bash
cd /home/felix/kora
python3 toolchain/kora resolve urn:fxsl:kb:metodologia-forja-opm-es
```
