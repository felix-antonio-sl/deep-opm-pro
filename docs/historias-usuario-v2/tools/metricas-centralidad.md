# Métricas de centralidad por épica

Generado por `tools/grafo-dependencias.ts`. Mide la posición estructural de cada épica.

- **In-degree**: cantidad de HU canónicas de otras épicas que dependen de esta épica (cuántas épicas la requieren).
- **Out-degree**: cantidad de dependencias hacia HU de otras épicas (cuántas épicas requiere).
- **Centralidad** = in + out: importancia estructural total. Top centralidad = candidatas a *God Épica*.

| # | Épica | HU vivas | In | Out | Centralidad |
|---|---|---:|---:|---:|---:|
| 1 | EPICA-17 | 28 | 14 | 8 | 22 |
| 2 | EPICA-10 | 17 | 22 | 0 | 22 |
| 3 | EPICA-B0 | 30 | 17 | 3 | 20 |
| 4 | EPICA-30 | 34 | 18 | 0 | 18 |
| 5 | EPICA-B4 | 26 | 1 | 16 | 17 |
| 6 | EPICA-11 | 22 | 15 | 0 | 15 |
| 7 | EPICA-B1 | 27 | 10 | 5 | 15 |
| 8 | EPICA-15 | 23 | 3 | 11 | 14 |
| 9 | EPICA-12 | 31 | 11 | 0 | 11 |
| 10 | EPICA-20 | 21 | 5 | 6 | 11 |
| 11 | EPICA-13 | 18 | 7 | 2 | 9 |
| 12 | EPICA-90 | 21 | 0 | 8 | 8 |
| 13 | EPICA-B2 | 26 | 4 | 4 | 8 |
| 14 | EPICA-C1 | 26 | 0 | 7 | 7 |
| 15 | EPICA-C2 | 28 | 0 | 7 | 7 |
| 16 | EPICA-35 | 20 | 1 | 5 | 6 |
| 17 | EPICA-18 | 15 | 1 | 5 | 6 |
| 18 | EPICA-B5 | 23 | 0 | 5 | 5 |
| 19 | EPICA-16 | 17 | 0 | 5 | 5 |
| 20 | EPICA-A0 | 40 | 2 | 3 | 5 |
| 21 | EPICA-1C | 17 | 0 | 5 | 5 |
| 22 | EPICA-31 | 26 | 2 | 2 | 4 |
| 23 | EPICA-14 | 15 | 1 | 3 | 4 |
| 24 | EPICA-A1 | 34 | 0 | 3 | 3 |
| 25 | EPICA-19 | 16 | 0 | 3 | 3 |
| 26 | EPICA-1A | 18 | 0 | 3 | 3 |
| 27 | EPICA-42 | 22 | 0 | 3 | 3 |
| 28 | EPICA-C0 | 22 | 0 | 3 | 3 |
| 29 | EPICA-1B | 16 | 1 | 2 | 3 |
| 30 | EPICA-40 | 25 | 0 | 2 | 2 |
| 31 | EPICA-41 | 17 | 1 | 0 | 1 |
| 32 | EPICA-21 | 18 | 0 | 1 | 1 |
| 33 | EPICA-33 | 22 | 0 | 1 | 1 |
| 34 | EPICA-60 | 35 | 0 | 1 | 1 |
| 35 | EPICA-B3 | 18 | 0 | 1 | 1 |
| 36 | EPICA-32 | 31 | 0 | 1 | 1 |
| 37 | EPICA-80 | 26 | 0 | 1 | 1 |
| 38 | EPICA-50 | 21 | 0 | 1 | 1 |
| 39 | EPICA-34 | 28 | 1 | 0 | 1 |
| 40 | EPICA-82 | 20 | 0 | 1 | 1 |
| 41 | EPICA-71 | 26 | 0 | 0 | 0 |
| 42 | EPICA-91 | 16 | 0 | 0 | 0 |
| 43 | EPICA-D1 | 16 | 0 | 0 | 0 |
| 44 | EPICA-D0 | 22 | 0 | 0 | 0 |
| 45 | EPICA-70 | 25 | 0 | 0 | 0 |
| 46 | EPICA-81 | 22 | 0 | 0 | 0 |
| 47 | EPICA-61 | 26 | 0 | 0 | 0 |
| 48 | EPICA-A2 | 24 | 0 | 0 | 0 |

## Top 5 — análisis cualitativo

- **EPICA-17** (centralidad 22): in=14, out=8.
- **EPICA-10** (centralidad 22): in=22, out=0.
  - Alta in-degree: muchas épicas dependen de ella → bloqueador crítico del roadmap.
- **EPICA-B0** (centralidad 20): in=17, out=3.
- **EPICA-30** (centralidad 18): in=18, out=0.
- **EPICA-B4** (centralidad 17): in=1, out=16.

## Lectura categorial

- Centralidad alta con in >> out = **objeto cercano a inicial** del poset (todas dependen de él).
- Centralidad alta con out >> in = **objeto cercano a terminal** (depende de todo lo demás).
- in = out alto = **épica densamente conectada**: candidata a structured cospan con interfaces compartidas (`urn:fxsl:kb:icas-escala`).