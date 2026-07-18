---
_manifest:
  urn: "urn:opforja:kb:reglas-opm-estrictas-bridge"
  provenance:
    created_by: "deep-opm-pro/codex"
    created_at: "2026-05-31"
    source: "urn:fxsl:kb:reglas-opm-estrictas-es"
version: "1.1.0"
status: publicado
tags: [opm, opforja, canon, bridge, kora]
lang: "es"
extensions:
  opforja:
    family: bridge
relations:
  depends:
    - "urn:fxsl:kb:reglas-opm-estrictas-es"
    - "urn:fxsl:kb:spec-forja-opd-es"
    - "urn:fxsl:kb:spec-forja-opl-es"
    - "urn:fxsl:kb:opm-es"
    - "urn:fxsl:kb:opd-es"
    - "urn:fxsl:kb:opl-es"
---

# Reglas OPM estrictas — puente operativo

Este archivo no es la SSOT. La autoridad primaria vive en KORA:

- URN: `urn:fxsl:kb:reglas-opm-estrictas-es`
- Resolución de path: por URN vía `docs/canon-opm/resolutor-urn.json` (re-ancla a la SSOT viva en PNEUMA bajo `KORA_RAIZ`, default `/home/felix/kora-pneuma`; la bestia congelada `/home/felix/kora` queda como último origen histórico). Lector: `app/src/canon/resolutorUrn.ts`.
- Estado: `publicado`

## Rol En Opforja

`reglas-opm-estrictas-es` es el canon prescriptivo operativo OPD/OPL para
opforja: qué hechos son válidos, inválidos, condicionados o extensión de
herramienta. Es SSOT primaria y referencialmente autónoma: un agente conforme
no necesita abrir las capas base ni este puente para decidir una regla
operativa ordinaria. La cadena de precedencia vive una sola vez en la SSOT
(§Precedencia); este puente solo resuelve URN→path. Las capas OPM-ES nucleares
siguen siendo autoridad semántica general que la SSOT operacionaliza: se
consultan como procedencia, y una contradicción no declarada se arbitra vía
corrección documental en KORA, no saltándose la SSOT.

## Contrato De Uso

- Para decisiones de **validez de un hecho OPM** (canon prescriptivo operativo
  de opforja), usar `urn:fxsl:kb:reglas-opm-estrictas-es`.
- Para decisiones de **realización visual/OPD operativa**, usar
  `urn:fxsl:kb:spec-forja-opd-es`.
- Para decisiones de **superficie OPL operativa**, usar
  `urn:fxsl:kb:spec-forja-opl-es`.
- Para decisiones de **método de modelado**, usar
  `urn:fxsl:kb:metodologia-forja-opm-es`.
- Las capas base `urn:fxsl:kb:opm-es`, `urn:fxsl:kb:opd-es` y
  `urn:fxsl:kb:opl-es` se consultan como **procedencia** (autoridad semántica
  general) cuando la familia Forja las delega; no son destino de decisión
  operativa ordinaria.

No copiar contenido del canon en este archivo. Si el canon cambia, editar la
SSOT KORA, validar con la toolchain KORA, reindexar KORA y mantener este puente
estable.

## Nota De Reconciliación 2026-06-12

Auditoría de coherencia del corpus 2026-06-12: el Rol y el Contrato De Uso se
realinearon con `reglas-opm-estrictas-es` (autonomía referencial y
§Precedencia). Las decisiones visuales operativas enrutan a
`urn:fxsl:kb:spec-forja-opd-es` y las textuales a
`urn:fxsl:kb:spec-forja-opl-es`; las capas base quedan como procedencia, no
como destino de decisión ordinaria.

El paquete deliberado de la auditoría se materializó el 2026-06-14 en
`reglas-opm-estrictas-es` **v1.4.0** (sexta familia de enlace — excepción
procedimental — y resoluciones del panel arbitrado por el operador). Este puente
no copia el canon; consultar la SSOT por la URN.

Versión vigente observada: `1.4.2` (2026-07-18). Acota R-CAT-EQ a equivalencia
observacional relativa por firma y declara que la composición implementada es
una unión por interfaz: un pushout sigue siendo una formalización candidata
hasta probar su propiedad universal. El dato vivo lo resuelve
`docs/canon-opm/resolutor-urn.json`, no este número.

## Acceso Rápido

```bash
KORA_RAIZ="${KORA_RAIZ:-/home/felix/kora-pneuma}"
cat "$KORA_RAIZ/artefactos/conocimiento/fxsl/reglas-opm-estrictas-es.md"   # path resuelto por docs/canon-opm/resolutor-urn.json (SSOT viva en pneuma)
```
