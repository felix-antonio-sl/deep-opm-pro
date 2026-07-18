---
_manifest:
  urn: "urn:opforja:kb:metodologia-forja-bridge"
  provenance:
    created_by: "hd-opm/codex"
    created_at: "2026-05-31"
    source: "urn:fxsl:kb:metodologia-forja-opm-es"
version: "1.1.0"
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
    - "urn:fxsl:kb:spec-forja-opd-es"
    - "urn:fxsl:kb:spec-forja-opl-es"
    - "urn:fxsl:kb:opm-es"
    - "urn:fxsl:kb:opd-es"
    - "urn:fxsl:kb:opl-es"
---

# Metodología Forja — puente operativo

Este archivo no es la SSOT. La autoridad primaria vive en KORA:

- URN: `urn:fxsl:kb:metodologia-forja-opm-es`
- Resolución de path: por URN vía `docs/canon-opm/resolutor-urn.json` (re-ancla a la SSOT viva en PNEUMA bajo `KORA_RAIZ`, default `/home/felix/kora-pneuma`; la bestia congelada `/home/felix/kora` queda como último origen histórico). Lector: `app/src/canon/resolutorUrn.ts`.
- Estado: `publicado`
- Versión observada: resolver siempre desde `docs/canon-opm/resolutor-urn.json`; no duplicar aquí el dato vigente.

## Rol En Opforja

`metodologia-forja-opm-es` es la capa de método para modelar OPM con opforja:
cómo construir, refinar, validar y serializar modelos sin redefinir la semántica
OPM. Complementa a las otras tres piezas KORA enlazadas desde
`docs/canon-opm/`:

| Documento | Rol |
|---|---|
| `urn:fxsl:kb:reglas-opm-estrictas-es` | Canon prescriptivo OPD/OPL: qué hechos son válidos o inválidos. |
| `urn:fxsl:kb:spec-forja-opd-es` | SSOT de realización visual/OPD de opforja. |
| `urn:fxsl:kb:spec-forja-opl-es` | SSOT operativa del lenguaje OPL de opforja. |
| `metodologia-forja.md` | Puente a la SSOT de método OPM-en-opforja. |

## Contrato De Uso

- Para decisiones de **validez** de un hecho OPM, usar
  `urn:fxsl:kb:reglas-opm-estrictas-es` y las capas `opm-es`, `opd-es`,
  `opl-es`.
- Para decisiones de **realización visual/OPD**, usar
  `urn:fxsl:kb:spec-forja-opd-es`.
- Para decisiones de **texto OPL**, usar `urn:fxsl:kb:spec-forja-opl-es`.
- Para decisiones de **cómo modelar bien** en opforja, usar
  `urn:fxsl:kb:metodologia-forja-opm-es`.

No copiar contenido de la metodología en este archivo. Si la metodología cambia,
editar la SSOT KORA, validar con `python3 toolchain/kora lint-md`, reindexar KORA
y mantener este puente estable.

## Cambios de método relevantes

La versión `1.5.0` añadió `LF-19` sobre integridad de estados y reforzó `A8`
con dos advertencias operativas: los barridos de integridad deben ejecutarse
sobre el JSON canónico, y toda métrica de auditoría debe validarse contra la
SSOT semántica antes de fundar conclusiones. En `deep-opm-pro`, cualquier
checker futuro de estados debe distinguir al menos flujo, caracterización y
ambiental-observado; no basta contar estados "sin escritor" desde OPL.

La versión `1.5.1` (2026-06-12, auditoría de coherencia del corpus) no altera
estas disciplinas: comprime la advertencia narrativa de `A8` a una referencia a
`LF-19.3`, abstrae `LF-19.4` (la declaración auditable de caracterización deja de
fijar un literal de glosa de herramienta) y corrige anclas SSOT misatribuidas
(`LF-05.9`, `LF-06.9`).

La versión `1.6.0` (2026-07-07) incorporó el arranque bottom-up de primera clase:
los fragmentos pueden nacer como OPDs sueltos en Taller y reconciliarse por
adopción, mientras la integridad permanece exigible y el rigor de cierre se
cobra al graduar o exportar canónico.

La versión `1.6.1` (2026-07-18) acotó la igualdad de firma de frontera a
equivalencia observacional relativa. Es una condición necesaria de sustitución,
no identidad, bisimulación ni equivalencia categorial; una lectura de fibración
permanece hipotética hasta construir y probar sus datos formales.

## Acceso Rápido

```bash
KORA_RAIZ="${KORA_RAIZ:-/home/felix/kora-pneuma}"
cat "$KORA_RAIZ/artefactos/conocimiento/fxsl/metodologia-forja-opm-es.md"   # path resuelto por docs/canon-opm/resolutor-urn.json (SSOT viva en pneuma)
```
