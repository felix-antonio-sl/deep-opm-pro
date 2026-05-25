# L1 — Canon OPL

## Misión
Cerrar las dos desviaciones de **canon OPL** de la auditoría rev2, ambas selladas por tests dorados. Cambio coordinado **generador ↔ parser inverso ↔ fixtures de roundtrip** en la misma línea.

Cierra: **C1** (verbo de estado) y **G2** (split de clasificación).

## Anclaje a evidencia
- SSOT suprema: `docs/canon-opm/reglas-opm-estrictas.md` — línea 411 (tabla de verbos: *Enumeración de estados → `puede estar`*), D5 línea 455; especialización XOR usa `puede ser` (`R-OPL-RF-5`, RX1/RX2 líneas 554-555) — **NO tocar ese caso**. D1–D4 (líneas 451-455) para clasificación escindida.
- Spec Codex: `ui-forja/04-opl-rendering.md` §2 (puede estar) y §3.1 (split).
- Estado actual:
  - `app/src/opl/generadores/duracionMetadata.ts:65` (y :28) emite `puede ser` para enumeración de estados.
  - `app/src/opl/generadores/estructural.ts:28` emite la clasificación colapsada «X es un objeto informacional y sistémico».
  - Parser inverso: `app/src/opl/parser/planificar.ts:119` reza «X puede ser …»; `app/src/opl/parser/parsear.ts`.
  - Fixtures: `app/src/opl/fixtures-roundtrip.ts`, `app/src/opl/generar.test.ts`, `app/src/opl/generadores/designaciones.test.ts`.

## Archivos permitidos
```
app/src/opl/generadores/duracionMetadata.ts      EDIT
app/src/opl/generadores/estructural.ts           EDIT
app/src/opl/parser/planificar.ts                 EDIT
app/src/opl/parser/parsear.ts                     EDIT (si el reconocimiento lo exige)
app/src/opl/fixtures-roundtrip.ts                 EDIT
app/src/opl/generar.test.ts                       EDIT
app/src/opl/generadores/designaciones.test.ts     EDIT
app/src/opl/**/*.test.ts                          EDIT (los que rompan por el cambio)
docs/canon-opm/reglas-opm-estrictas.md            LECTURA
ui-forja/04-opl-rendering.md                      LECTURA
```

## Restricciones de no-colisión
- Solo `opl/`. No tocar `ui/`, `render/`, `store/`, `modelo/`. Dominio totalmente disjunto del resto de líneas.

## Slice mínimo shippeable
1. **C1** — En `duracionMetadata.ts` (`oracionEstados`), cambiar la plantilla de enumeración de estados de `… puede ser …` a `… puede estar …`. Verificar que el generador de especialización (XOR) **no** se vea afectado (sigue `puede ser`).
2. **C1 reverse** — En `planificar.ts`/`parsear.ts`, aceptar `puede estar` para estados (y mantener `puede ser` para especialización). Roundtrip debe cerrar.
3. **G2** — En `estructural.ts:28`, escindir «X es un objeto informacional y sistémico.» → «X es informacional.» + «X es sistémico.» (o las dos plantillas D1–D4 según esencia/afiliación). Reverse: el parser debe re-colapsar al modelo equivalente. Roundtrip debe cerrar.
4. Actualizar fixtures dorados y tests que esperaban la forma vieja.

## Tests obligatorios
- Actualizar `generar.test.ts`, `designaciones.test.ts`, `fixtures-roundtrip.ts` a la nueva forma canónica.
- Roundtrip (`opl/**/roundtrip*.test.ts`) verde: generar → parsear → generar es idempotente.
- Estimado: ~10–20 expectaciones tocadas; sin regresión neta.

## Verificación
```bash
cd app && bun run check && bun run lint
bun test src/opl
```

## Decisiones bloqueadas (no reabrir)
- `puede estar` SOLO para enumeración de estados de objeto; `puede ser` SOLO para especialización XOR. La SSOT (línea 411) es autoritativa.
- El cambio es de canon, no estético: no inventar verbos nuevos.

## Decisiones que tomas vos (documentar en commit)
- Forma exacta del split D1–D4 (dos oraciones simples vs plantilla compuesta) según lo que el parser pueda re-colapsar sin pérdida.

## Forma del entregable
- Commits `fix(opl): C1 puede estar en enumeración de estados (SSOT L411)` y `fix(opl): G2 split de clasificación esencia/afiliación (D1-D4)`.
- Co-author footer estándar. No tocar nada fuera de `opl/`.
