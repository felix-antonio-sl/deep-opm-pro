# Procedencia — `fixture-anclaje-v0.json`

**Origen:** `gist-opm/bundles/fixture-anclaje-v0.json` @ commit `be59117`
(`gist-opm@be591176cc9ed1a9db3b322191dd7fe4950c6dad` —
*"feat(fixture): generador reproducible del fixture de validación del Anclaje (§4-C)"*).

**Copiado a opforja:** 2026-06-26, corte UI «Centinela de Drift» (Anclaje α), Fase 1.

## Por qué vive aquí (y no se lee cross-repo)

El test del eval-de-mecanismo (`src/leyes/anclaje-composabilidad.test.ts`) es **hermético**:
no lee desde `gist-opm/` en runtime de test (acta de arranque, refuerzo #1). Esta copia
es la fuente de verdad del fixture **dentro** de opforja; si gist-opm regenera el fixture,
esta copia se re-sincroniza a mano y se actualiza el hash de procedencia de arriba.

## Contrato del fixture (relevante para el test)

- `biblioteca`: la greda gist (un `Modelo` persistido aparte) con tres raíces:
  `ent-Category`, `ent-Component`, `ent-Composite`.
- `frozenAtHashReferencia`: `fnv1a-c6073070` — **REFERENCIA, no se hardcodea**. El test
  re-computa `firmaBiblioteca(biblioteca)` en runtime (importando de
  `src/modelo/submodelos/estado.ts` vía el kernel) y verifica que coincide.
- `ejeCategory` / `ejeComponent`: cada uno con `sd0A`/`sd0B` (anclados a la Pieza común)
  y `sd0A_calco`/`sd0B_calco` (mismo `estereotipoId`, **sin** `anclaje`: Calcados).

El Calco-adversarial es la aserción central: una cosa Calcada **nunca** entra al `driftMap`
ni produce composabilidad-por-anclaje. Si lo hiciera, el gate está roto.
