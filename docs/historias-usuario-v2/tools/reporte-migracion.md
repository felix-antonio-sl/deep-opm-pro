# Auditoría de migración v1 → v2

Generada por `tools/audit-migracion.ts`. Lee `docs/archive/historias-usuario-v1/` y compara con `historias-usuario-v2/`.

## 1. Resumen cuantitativo

| Métrica | Valor |
|---|---:|
| HU en v1 | 1164 |
| HU canónicas vivas en v2 | 1117 |
| Stubs en v2 (absorbidas/fusionadas) | 48 |
| v1 con canónica viva en v2 | 1117 |
| v1 con stub en v2 | 47 |
| v1 sin contraparte detectable (huérfanas) | 0 |
| Nuevas en v2 (no en v1, ex. shared) | 0 |

## 2. Cobertura por épica

| Épica | v1 | viva | stub | huérfana | cobertura% |
|---|---:|---:|---:|---:|---:|
| EPICA-10 | 22 | 17 | 5 | 0 | 100% |
| EPICA-11 | 27 | 22 | 5 | 0 | 100% |
| EPICA-12 | 34 | 31 | 3 | 0 | 100% |
| EPICA-13 | 20 | 18 | 2 | 0 | 100% |
| EPICA-14 | 17 | 15 | 2 | 0 | 100% |
| EPICA-15 | 25 | 23 | 2 | 0 | 100% |
| EPICA-16 | 22 | 17 | 5 | 0 | 100% |
| EPICA-17 | 34 | 28 | 6 | 0 | 100% |
| EPICA-18 | 15 | 15 | 0 | 0 | 100% |
| EPICA-19 | 16 | 16 | 0 | 0 | 100% |
| EPICA-1A | 18 | 18 | 0 | 0 | 100% |
| EPICA-1B | 16 | 16 | 0 | 0 | 100% |
| EPICA-1C | 22 | 17 | 5 | 0 | 100% |
| EPICA-20 | 22 | 21 | 1 | 0 | 100% |
| EPICA-21 | 18 | 18 | 0 | 0 | 100% |
| EPICA-30 | 37 | 34 | 3 | 0 | 100% |
| EPICA-31 | 26 | 26 | 0 | 0 | 100% |
| EPICA-32 | 32 | 31 | 1 | 0 | 100% |
| EPICA-33 | 22 | 22 | 0 | 0 | 100% |
| EPICA-34 | 28 | 28 | 0 | 0 | 100% |
| EPICA-35 | 20 | 20 | 0 | 0 | 100% |
| EPICA-40 | 25 | 25 | 0 | 0 | 100% |
| EPICA-41 | 17 | 17 | 0 | 0 | 100% |
| EPICA-42 | 22 | 22 | 0 | 0 | 100% |
| EPICA-50 | 28 | 21 | 7 | 0 | 100% |
| EPICA-60 | 35 | 35 | 0 | 0 | 100% |
| EPICA-61 | 26 | 26 | 0 | 0 | 100% |
| EPICA-70 | 25 | 25 | 0 | 0 | 100% |
| EPICA-71 | 26 | 26 | 0 | 0 | 100% |
| EPICA-80 | 26 | 26 | 0 | 0 | 100% |
| EPICA-81 | 22 | 22 | 0 | 0 | 100% |
| EPICA-82 | 20 | 20 | 0 | 0 | 100% |
| EPICA-90 | 21 | 21 | 0 | 0 | 100% |
| EPICA-91 | 16 | 16 | 0 | 0 | 100% |
| EPICA-A0 | 40 | 40 | 0 | 0 | 100% |
| EPICA-A1 | 34 | 34 | 0 | 0 | 100% |
| EPICA-A2 | 24 | 24 | 0 | 0 | 100% |
| EPICA-B0 | 30 | 30 | 0 | 0 | 100% |
| EPICA-B1 | 27 | 27 | 0 | 0 | 100% |
| EPICA-B2 | 26 | 26 | 0 | 0 | 100% |
| EPICA-B3 | 18 | 18 | 0 | 0 | 100% |
| EPICA-B4 | 26 | 26 | 0 | 0 | 100% |
| EPICA-B5 | 23 | 23 | 0 | 0 | 100% |
| EPICA-C0 | 22 | 22 | 0 | 0 | 100% |
| EPICA-C1 | 26 | 26 | 0 | 0 | 100% |
| EPICA-C2 | 28 | 28 | 0 | 0 | 100% |
| EPICA-D0 | 22 | 22 | 0 | 0 | 100% |
| EPICA-D1 | 16 | 16 | 0 | 0 | 100% |

## 3. HU huérfanas

**No hay HU huérfanas detectadas.** Toda HU del v1 tiene contraparte canónica o stub en v2.

## 5. Lectura categorial

La migración v1 → v2 es un funtor `Migrate: SpecV1 → SpecV2` (`urn:fxsl:kb:icas-lifecycle`).
Una HU huérfana indica falla de naturalidad: el funtor no preservó el morfismo correspondiente.
Cobertura del 100% (vivas + stubs) por épica = funtor faithful sobre esa épica.