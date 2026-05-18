# Plan operativo Beta1/Beta2 — catalogo sandbox

**Decision vigente**: 2026-05-18.

## Baseline de ejemplos

El catalogo de ejemplos de la app queda reseteado a una lista cerrada de
fixtures observados en [OPCloud sandbox](https://opcloud-sandbox.web.app/):

- `System Diagram`
- `SD Sync`
- `SD Async`
- `OnStar System`
- `OPM Structure Meta Model`
- `Modelo Vacio`

Se retiran del catalogo y de `fixtures/demo-models/` las demos sinteticas
locales: Cafetera, Diagnostico Clinico, Logistica de Envios, Control de
Calidad, Ejemplo organizacional, Prestamo Bibliotecario, Comprar Pan,
SD Generico y App modeladora OPM deseada.

## Decision sobre libro curado

Se reviso `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/opm-libro-curado`.
El unico ejemplo suficientemente replicable y formativo para este reset es
OnStar/ACR del capitulo 8, porque:

- el libro desarrolla OnStar/ACR como caso de refinamiento, abstraccion e
  in-zooming;
- el mismo dominio ya aparece observado en OPCloud sandbox bajo
  `fixtures/onstar-system/`;
- agregar otro modelo desde prosa del libro obligaria a inferir estructura no
  capturada en fixtures, lo que violaria el principio de no modelar sobre
  ambiguedad.

Por lo tanto no se agrega un modelo nuevo de libro. `OnStar System` queda como
ejemplo sandbox con respaldo formativo del libro.

## Gates

El reset se valida con:

```bash
cd app
bun run scripts/generar-demos.ts
bun test src/modelo/fixtures.test.ts src/modelo/checkers.test.ts
bun run check
```
